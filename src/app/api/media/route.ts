import type { NextRequest } from "next/server";
import { handle, ok, paginationParams } from "@/lib/api";
import { requireAdminRequest } from "@/lib/auth/guard";
import { toMediaAsset, type Lean } from "@/lib/data/dto";
import { connectToDatabase } from "@/lib/db";
import { collectMediaReferences } from "@/lib/media-usage";
import { MediaAssetModel, type MediaAssetDoc } from "@/models/MediaAsset";

/** Media library listing (admin only), newest first, with usage counts. */
export const GET = handle(async (request: NextRequest) => {
  await requireAdminRequest(request);
  await connectToDatabase();
  const { page, limit, skip } = paginationParams(request, { limit: 60 });
  const q = request.nextUrl.searchParams.get("q")?.trim().slice(0, 100);
  const pattern = q ? new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") : null;
  const refs = await collectMediaReferences();
  const usage = request.nextUrl.searchParams.get("usage");
  const filter = {
    ...(pattern ? { $or: [{ alt: pattern }, { originalFilename: pattern }] } : {}),
    ...(usage === "used" ? { publicId: { $in: [...refs.keys()] } } : usage === "unused" ? { publicId: { $nin: [...refs.keys()] } } : {}),
  };

  const [docs, total] = await Promise.all([
    MediaAssetModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean<Lean<MediaAssetDoc>[]>(),
    MediaAssetModel.countDocuments(filter),
  ]);

  return ok(
    docs.map((doc) => ({ ...toMediaAsset(doc), usageCount: refs.get(doc.publicId)?.length ?? 0 })),
    { meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) } },
  );
});
