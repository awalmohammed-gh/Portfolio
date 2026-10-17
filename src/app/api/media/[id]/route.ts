import type { NextRequest } from "next/server";
import { ApiError, handle, ok, parseJson } from "@/lib/api";
import { requireAdminRequest } from "@/lib/auth/guard";
import { destroyImage } from "@/lib/cloudinary";
import { toMediaAsset, type Lean } from "@/lib/data/dto";
import { connectToDatabase } from "@/lib/db";
import { collectMediaReferences } from "@/lib/media-usage";
import { objectId } from "@/lib/validations/common";
import { mediaUpdateSchema } from "@/lib/validations/resources";
import { MediaAssetModel, type MediaAssetDoc } from "@/models/MediaAsset";

type Context = { params: Promise<{ id: string }> };

async function findAsset(context: Context) {
  const parsed = objectId.safeParse((await context.params).id);
  if (!parsed.success) throw new ApiError(404, "Image not found.");
  await connectToDatabase();
  const asset = await MediaAssetModel.findById(parsed.data).lean<Lean<MediaAssetDoc>>();
  if (!asset) throw new ApiError(404, "Image not found.");
  return asset;
}

export const GET = handle(async (request: NextRequest, context: Context) => {
  await requireAdminRequest(request);
  const asset = await findAsset(context);
  const usedBy = (await collectMediaReferences()).get(asset.publicId) ?? [];
  return ok({ ...toMediaAsset(asset), usageCount: usedBy.length, usedBy });
});

/** Updates the default alt text used when the image is picked. */
export const PATCH = handle(async (request: NextRequest, context: Context) => {
  await requireAdminRequest(request);
  const { alt } = await parseJson(request, mediaUpdateSchema);
  const asset = await findAsset(context);
  await MediaAssetModel.updateOne({ _id: asset._id }, { $set: { alt } });
  return ok({ ...toMediaAsset(asset), alt });
});

/**
 * Deletes an image from Cloudinary, then from the library. Images still used
 * by content are refused (409). If Cloudinary fails, the record is kept so
 * the delete can be retried.
 */
export const DELETE = handle(async (request: NextRequest, context: Context) => {
  await requireAdminRequest(request);
  const asset = await findAsset(context);

  const usedBy = (await collectMediaReferences()).get(asset.publicId) ?? [];
  if (usedBy.length > 0) {
    throw new ApiError(409, `This image is still used by: ${usedBy.join(", ")}. Replace it there first.`);
  }

  try {
    await destroyImage(asset.publicId);
  } catch (error) {
    console.error("[media] Cloudinary delete failed", error);
    throw new ApiError(502, "The image service couldn't delete this image. Please try again.");
  }

  await MediaAssetModel.deleteOne({ _id: asset._id });
  return ok({ id: String(asset._id) });
});
