import { revalidateTag } from "next/cache";
import { connection, type NextRequest } from "next/server";
import { handle, ok, readJsonObject } from "@/lib/api";
import { requireAdminRequest } from "@/lib/auth/guard";
import { tags } from "@/lib/cache-tags";
import { toSettings, type Lean } from "@/lib/data/dto";
import { connectToDatabase } from "@/lib/db";
import { cleanupOrphanedMedia, publicIdsIn } from "@/lib/media-usage";
import { settingsSchema } from "@/lib/validations/settings";
import { SiteSettingsModel, type SiteSettingsDoc } from "@/models/SiteSettings";

export const GET = handle(async (request: NextRequest) => {
  void request;
  await connection();
  await connectToDatabase();
  const doc = await SiteSettingsModel.findOne({ key: "site" }).lean<Lean<SiteSettingsDoc>>();
  return ok(toSettings(doc));
});

/** Partial update: the patch is merged with current settings, then validated as a whole. */
export const PATCH = handle(async (request: NextRequest) => {
  await requireAdminRequest(request);
  const patch = await readJsonObject(request);
  await connectToDatabase();

  const previous = await SiteSettingsModel.findOne({ key: "site" }).lean<Lean<SiteSettingsDoc>>();
  const { updatedAt: _ignored, ...current } = toSettings(previous);
  void _ignored;
  const input = settingsSchema.parse({ ...current, ...patch });

  const doc = await SiteSettingsModel.findOneAndUpdate(
    { key: "site" },
    { $set: { ...input, logo: input.logo ?? null, favicon: input.favicon ?? null, ogImage: input.ogImage ?? null } },
    { upsert: true, returnDocument: "after", runValidators: true },
  ).lean<Lean<SiteSettingsDoc>>();

  revalidateTag(tags.settings, { expire: 0 });
  const remaining = new Set(publicIdsIn(input));
  await cleanupOrphanedMedia(publicIdsIn(current).filter((id) => !remaining.has(id)));

  return ok(toSettings(doc));
});
