"use client";

import type { MediaAssetRecord } from "@/types/media";

export class ApiClientError extends Error {
  constructor(
    public status: number,
    message: string,
    public fields: Record<string, string> = {},
  ) {
    super(message);
  }
}

type Envelope<T> = { data: T; meta?: Record<string, unknown> };

/** JSON request to our API. Session cookies are sent automatically (same origin). */
export async function api<T>(
  url: string,
  options: { method?: "GET" | "POST" | "PATCH" | "DELETE"; body?: unknown; signal?: AbortSignal } = {},
): Promise<Envelope<T>> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: options.method ?? "GET",
      headers: options.body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      credentials: "same-origin",
      signal: options.signal,
    });
  } catch (error) {
    if ((error as Error)?.name === "AbortError") throw error;
    throw new ApiClientError(0, "Can't reach the server. Check your connection and try again.");
  }

  const payload = (await response.json().catch(() => null)) as
    | (Envelope<T> & { error?: { message?: string; fields?: Record<string, string> } })
    | null;

  if (!response.ok) {
    if (response.status === 401 && !url.startsWith("/api/auth/login")) {
      // A full page load (not router.push) discards all client state once the session has ended.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/admin/login");
    }
    throw new ApiClientError(
      response.status,
      payload?.error?.message ?? "Something went wrong. Please try again.",
      payload?.error?.fields ?? {},
    );
  }
  return payload as Envelope<T>;
}

/** Uploads an image with progress reporting (fetch can't report upload progress). */
export function uploadImage(
  file: File,
  options: { alt?: string; onProgress?: (percent: number) => void } = {},
): Promise<MediaAssetRecord> {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("file", file);
    if (options.alt) form.append("alt", options.alt);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/media/upload");
    xhr.responseType = "json";
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) options.onProgress?.(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      const body = xhr.response as { data?: MediaAssetRecord; error?: { message?: string } } | null;
      if (xhr.status >= 200 && xhr.status < 300 && body?.data) resolve(body.data);
      else {
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        if (xhr.status === 401) window.location.assign("/admin/login");
        reject(new ApiClientError(xhr.status, body?.error?.message ?? "Upload failed. Please try again."));
      }
    };
    xhr.onerror = () => reject(new ApiClientError(0, "Upload failed. Check your connection and try again."));
    xhr.send(form);
  });
}

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = "image/jpeg,image/png,image/webp,image/gif,image/avif";

/** Quick client-side check before uploading; the server re-validates the real file content. */
export function checkImageFile(file: File): string | null {
  if (!/^image\/(jpeg|png|webp|gif|avif)$/.test(file.type)) return `${file.name}: use a JPEG, PNG, WebP, GIF or AVIF image.`;
  if (file.size > MAX_UPLOAD_BYTES) return `${file.name} is larger than 4 MB. Please compress it first.`;
  return null;
}
