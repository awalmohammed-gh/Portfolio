import { revalidateTag } from "next/cache";
import { connection, type NextRequest } from "next/server";
import { ApiError, handle, ok, parseJson } from "@/lib/api";
import { requireAdminRequest } from "@/lib/auth/guard";
import { tags } from "@/lib/cache-tags";
import { connectToDatabase } from "@/lib/db";
import { cleanupOrphanedMedia, publicIdsIn } from "@/lib/media-usage";
import { contentSchemas, isContentSection, parseSection } from "@/lib/validations/content";
import { SiteContentModel } from "@/models/SiteContent";

type Context = { params: Promise<{ section: string }> };

async function sectionFrom(context: Context) {
  const { section } = await context.params;
  if (!isContentSection(section)) throw new ApiError(404, "Unknown content section.");
  return section;
}

export const GET = handle(async (request: NextRequest, context: Context) => {
  void request;
  await connection();
  const section = await sectionFrom(context);
  await connectToDatabase();
  const doc = await SiteContentModel.findOne({ section }).lean();
  return ok({
    section,
    data: parseSection(section, doc?.data),
    updatedAt: doc?.updatedAt ?? null,
  });
});

/** Replaces a section's content after validating it against the section schema. */
export const PATCH = handle(async (request: NextRequest, context: Context) => {
  await requireAdminRequest(request);
  const section = await sectionFrom(context);
  const data = await parseJson(request, contentSchemas[section]);
  await connectToDatabase();

  const previous = await SiteContentModel.findOne({ section }).lean();
  const doc = await SiteContentModel.findOneAndUpdate(
    { section },
    { $set: { data } },
    { upsert: true, returnDocument: "after" },
  ).lean();

  revalidateTag(tags.content, { expire: 0 });
  const remaining = new Set(publicIdsIn(data));
  await cleanupOrphanedMedia(publicIdsIn(previous?.data).filter((id) => !remaining.has(id)));

  return ok({ section, data, updatedAt: doc?.updatedAt ?? null });
});
