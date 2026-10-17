import type { NextRequest } from "next/server";
import { ApiError, handle, ok } from "@/lib/api";
import { requireAdminRequest } from "@/lib/auth/guard";
import { MAX_UPLOAD_BYTES, sniffImageType, uploadImage } from "@/lib/cloudinary";
import { toMediaAsset, type Lean } from "@/lib/data/dto";
import { connectToDatabase } from "@/lib/db";
import { MediaAssetModel, type MediaAssetDoc } from "@/models/MediaAsset";

/**
 * Accepts one image as multipart/form-data ("file", optional "alt"), checks
 * its size and real content type, uploads it to Cloudinary and records it.
 */
export const POST = handle(async (request: NextRequest) => {
  await requireAdminRequest(request);

  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_UPLOAD_BYTES + 64 * 1024) {
    throw new ApiError(413, "Images must be 4 MB or smaller.");
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    throw new ApiError(400, "Send the image as multipart/form-data.");
  }

  const file = form.get("file");
  if (!(file instanceof File)) throw new ApiError(422, "Choose an image to upload.", { file: "Required" });
  if (file.size === 0) throw new ApiError(422, "The file is empty.", { file: "Empty file" });
  if (file.size > MAX_UPLOAD_BYTES) throw new ApiError(413, "Images must be 4 MB or smaller.");

  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = sniffImageType(bytes);
  if (!kind) {
    throw new ApiError(415, "Only JPEG, PNG, WebP, GIF and AVIF images are supported.", { file: "Unsupported file" });
  }

  const alt = String(form.get("alt") ?? "").trim().slice(0, 300);

  let uploaded;
  try {
    uploaded = await uploadImage(bytes, file.name || `image.${kind}`);
  } catch (error) {
    console.error("[media] Cloudinary upload failed", error);
    throw new ApiError(502, "The image service didn't accept the upload. Please try again.");
  }

  await connectToDatabase();
  const asset = await MediaAssetModel.create({
    publicId: uploaded.public_id,
    url: uploaded.secure_url,
    width: uploaded.width,
    height: uploaded.height,
    format: uploaded.format,
    bytes: uploaded.bytes,
    alt,
    originalFilename: file.name.slice(0, 200),
  });

  const doc = await MediaAssetModel.findById(asset._id).lean<Lean<MediaAssetDoc>>();
  return ok({ ...toMediaAsset(doc!), usageCount: 0 }, { status: 201 });
});
