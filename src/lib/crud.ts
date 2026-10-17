import "server-only";
import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import type { Model, QueryFilter } from "mongoose";
import type { z } from "zod";
import { ApiError, handle, ok, paginationParams, parseJson, readJsonObject } from "@/lib/api";
import { getAdminFromRequest, requireAdminRequest } from "@/lib/auth/guard";
import type { CacheTag } from "@/lib/cache-tags";
import type { Lean } from "@/lib/data/dto";
import { connectToDatabase } from "@/lib/db";
import { cleanupOrphanedMedia, publicIdsIn } from "@/lib/media-usage";
import { objectId, reorderSchema } from "@/lib/validations/common";

/*
 * REST handlers shared by the content collections. Reads are public but only
 * return published/visible records unless the caller is a signed-in admin.
 * Every write requires an admin session and a same-origin request.
 */

type IdContext = { params: Promise<{ id: string }> };

export type CrudConfig<Doc, Input extends Record<string, unknown>> = {
  label: string;
  model: Model<Doc>;
  schema: z.ZodType<Input>;
  tag: CacheTag;
  toAdmin: (doc: Lean<Doc>) => object;
  toPublic: (doc: Lean<Doc>) => object;
  /** Filter applied for visitors (e.g. only published). */
  publicFilter: QueryFilter<Doc>;
  searchFields: string[];
  /** Allowed ?key=value filters, mapped to a Mongo filter value. */
  filters?: Record<string, (value: string) => unknown>;
  sortFields: string[];
  defaultSort: Record<string, 1 | -1>;
  /** Derives stored fields from validated input (slugs, timestamps, …). */
  prepare?: (input: Input, existing: Lean<Doc> | null) => Promise<Record<string, unknown>> | Record<string, unknown>;
  /** Throw an ApiError to block deletion (e.g. category still in use). */
  beforeDelete?: (doc: Lean<Doc>) => Promise<void>;
};

function invalidate(tag: CacheTag) {
  // expire: 0 makes the next visitor get fresh data immediately.
  revalidateTag(tag, { expire: 0 });
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseId(id: string): string {
  const parsed = objectId.safeParse(id);
  if (!parsed.success) throw new ApiError(404, "Not found.");
  return parsed.data;
}

export function collectionHandlers<Doc, Input extends Record<string, unknown>>(config: CrudConfig<Doc, Input>) {
  const GET = handle(async (request: NextRequest) => {
    await connectToDatabase();
    const admin = await getAdminFromRequest(request);
    const params = request.nextUrl.searchParams;
    const { page, limit, skip } = paginationParams(request);

    const filter: Record<string, unknown> = admin ? {} : { ...config.publicFilter };

    const q = params.get("q")?.trim();
    if (q) {
      const pattern = new RegExp(escapeRegex(q.slice(0, 100)), "i");
      filter.$or = config.searchFields.map((field) => ({ [field]: pattern }));
    }
    for (const [key, toValue] of Object.entries(config.filters ?? {})) {
      const value = params.get(key);
      if (value !== null && value !== "") filter[key] = toValue(value);
    }

    let sort: Record<string, 1 | -1> = config.defaultSort;
    const sortParam = params.get("sort");
    if (sortParam) {
      const field = sortParam.replace(/^-/, "");
      if (!config.sortFields.includes(field)) throw new ApiError(400, `Sort by one of: ${config.sortFields.join(", ")}`);
      sort = { [field]: sortParam.startsWith("-") ? -1 : 1 };
    }

    const [docs, total] = await Promise.all([
      config.model.find(filter as QueryFilter<Doc>).sort(sort).skip(skip).limit(limit).lean<Lean<Doc>[]>(),
      config.model.countDocuments(filter as QueryFilter<Doc>),
    ]);

    return ok(docs.map(admin ? config.toAdmin : config.toPublic), {
      meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    });
  });

  const POST = handle(async (request: NextRequest) => {
    await requireAdminRequest(request);
    const input = await parseJson(request, config.schema);
    await connectToDatabase();

    const last = await config.model.findOne().sort({ order: -1 }).select({ order: 1 }).lean<{ order?: number }>();
    const fields = { ...input, ...(await config.prepare?.(input, null)), order: (last?.order ?? -1) + 1 };
    const created = await new config.model(fields).save();

    invalidate(config.tag);
    const doc = await config.model.findById(created._id).lean<Lean<Doc>>();
    return ok(config.toAdmin(doc!), { status: 201 });
  });

  return { GET, POST };
}

export function itemHandlers<Doc, Input extends Record<string, unknown>>(config: CrudConfig<Doc, Input>) {
  const GET = handle(async (request: NextRequest, { params }: IdContext) => {
    const id = parseId((await params).id);
    await connectToDatabase();
    const admin = await getAdminFromRequest(request);
    const filter = admin ? { _id: id } : { ...config.publicFilter, _id: id };
    const doc = await config.model.findOne(filter as QueryFilter<Doc>).lean<Lean<Doc>>();
    if (!doc) throw new ApiError(404, `${config.label} not found.`);
    return ok(admin ? config.toAdmin(doc) : config.toPublic(doc));
  });

  const PATCH = handle(async (request: NextRequest, { params }: IdContext) => {
    await requireAdminRequest(request);
    const id = parseId((await params).id);
    const patch = await readJsonObject(request);
    await connectToDatabase();

    const existing = await config.model.findById(id).lean<Lean<Doc>>();
    if (!existing) throw new ApiError(404, `${config.label} not found.`);

    // Validate the merged record so partial updates still satisfy every rule.
    const input = config.schema.parse({ ...config.toAdmin(existing), ...patch });
    const fields = { ...input, ...(await config.prepare?.(input, existing)) };
    await config.model.updateOne({ _id: id }, { $set: fields }, { runValidators: true });

    invalidate(config.tag);
    const updated = await config.model.findById(id).lean<Lean<Doc>>();

    const remaining = new Set(publicIdsIn(updated));
    await cleanupOrphanedMedia(publicIdsIn(existing).filter((publicId) => !remaining.has(publicId)));

    return ok(config.toAdmin(updated!));
  });

  const DELETE = handle(async (request: NextRequest, { params }: IdContext) => {
    await requireAdminRequest(request);
    const id = parseId((await params).id);
    await connectToDatabase();

    const existing = await config.model.findById(id).lean<Lean<Doc>>();
    if (!existing) throw new ApiError(404, `${config.label} not found.`);
    await config.beforeDelete?.(existing);

    await config.model.deleteOne({ _id: id });
    invalidate(config.tag);
    await cleanupOrphanedMedia(publicIdsIn(existing));

    return ok({ id });
  });

  return { GET, PATCH, DELETE };
}

/** POST { ids: [...] } saves a new display order. */
export function reorderHandler<Doc>(config: { model: Model<Doc>; tag: CacheTag }) {
  return handle(async (request: NextRequest) => {
    await requireAdminRequest(request);
    const { ids } = await parseJson(request, reorderSchema);
    await connectToDatabase();

    await config.model.bulkWrite(
      ids.map((id, index) => ({
        updateOne: { filter: { _id: id } as QueryFilter<Doc>, update: { $set: { order: index } } },
      })),
    );
    invalidate(config.tag);
    return ok({ ids });
  });
}
