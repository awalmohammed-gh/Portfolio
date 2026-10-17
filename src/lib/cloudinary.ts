import "server-only";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

/*
 * Server-side Cloudinary access. The API secret never leaves the server:
 * the browser sends files to our authenticated /api/media/upload route, which
 * validates them and uploads with signed credentials.
 */

let configured = false;

function ensureConfigured() {
  if (configured) return;
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.");
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
}

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // stays under Vercel's 4.5 MB request limit

export type ImageKind = "jpg" | "png" | "gif" | "webp" | "avif";

/** Identifies the image type from its leading bytes; the file name and MIME type are not trusted. */
export function sniffImageType(bytes: Uint8Array): ImageKind | null {
  const startsWith = (signature: number[], offset = 0) =>
    signature.every((byte, index) => bytes[offset + index] === byte);
  const ascii = (offset: number, length: number) =>
    String.fromCharCode(...bytes.subarray(offset, offset + length));

  if (startsWith([0xff, 0xd8, 0xff])) return "jpg";
  if (startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "png";
  if (ascii(0, 6) === "GIF87a" || ascii(0, 6) === "GIF89a") return "gif";
  if (ascii(0, 4) === "RIFF" && ascii(8, 4) === "WEBP") return "webp";
  if (ascii(4, 4) === "ftyp" && ["avif", "avis"].includes(ascii(8, 4))) return "avif";
  return null;
}

export function uploadImage(bytes: Uint8Array, filename: string): Promise<UploadApiResponse> {
  ensureConfigured();
  const folder = process.env.CLOUDINARY_FOLDER || "portfolio";

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        use_filename: true,
        filename_override: filename.replace(/\.[^.]+$/, "").slice(0, 80) || "image",
        unique_filename: true,
        overwrite: false,
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "avif"],
      },
      (error, result) => {
        if (error || !result) reject(error ?? new Error("Upload failed"));
        else resolve(result);
      },
    );
    stream.end(Buffer.from(bytes));
  });
}

/** Deletes an image from Cloudinary and purges CDN caches. "not found" counts as deleted. */
export async function destroyImage(publicId: string): Promise<void> {
  ensureConfigured();
  const result = await cloudinary.uploader.destroy(publicId, { resource_type: "image", invalidate: true });
  if (result?.result !== "ok" && result?.result !== "not found") {
    throw new Error(`Cloudinary could not delete ${publicId}: ${result?.result ?? "unknown error"}`);
  }
}

export async function pingCloudinary(): Promise<boolean> {
  ensureConfigured();
  const result = await cloudinary.api.ping();
  return result?.status === "ok";
}
