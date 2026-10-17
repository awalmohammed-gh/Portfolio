"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { LuImagePlus, LuLibrary, LuTrash2, LuUpload } from "react-icons/lu";
import type { ImageAsset, MediaAssetRecord } from "@/types/media";
import { ACCEPTED_IMAGE_TYPES, checkImageFile, uploadImage } from "../api-client";
import { useToast } from "../Feedback";
import MediaPicker from "../media/MediaPicker";
import { buttonClass, inputClass } from "./styles";

export function assetToImage(asset: MediaAssetRecord): ImageAsset {
  return {
    url: asset.url,
    publicId: asset.publicId,
    ...(asset.width ? { width: asset.width } : {}),
    ...(asset.height ? { height: asset.height } : {}),
    alt: asset.alt ?? "",
  };
}

/** Single image: upload (with progress), pick from the library, replace, remove, edit alt text. */
export default function ImageField({
  id,
  value,
  onChange,
  invalid,
  describedBy,
}: {
  id?: string;
  value: ImageAsset | null | undefined;
  onChange: (value: ImageAsset | null) => void;
  invalid?: boolean;
  describedBy?: string;
}) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const altId = useId();
  const [progress, setProgress] = useState<number | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    const problem = checkImageFile(file);
    if (problem) {
      toast.error(problem);
      return;
    }
    setProgress(0);
    try {
      const asset = await uploadImage(file, { alt: value?.alt, onProgress: setProgress });
      onChange({ ...assetToImage(asset), alt: value?.alt || asset.alt });
      toast.success("Image uploaded. Save to apply it.");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div
      className={`rounded-2xl border bg-surface-2/50 p-3 ${invalid ? "border-danger" : "border-line"}`}
      aria-describedby={describedBy}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl border border-line bg-surface sm:w-48">
          {value?.url ? (
            <Image src={value.url} alt={value.alt || "Selected image"} fill sizes="200px" className="object-cover" />
          ) : (
            <div className="grid h-full place-items-center text-subtle">
              <LuImagePlus aria-hidden="true" className="size-7" />
            </div>
          )}
          {progress !== null && (
            <div className="absolute inset-0 grid place-items-center bg-surface/80 backdrop-blur-sm">
              <div className="w-3/4">
                <div
                  role="progressbar"
                  aria-label="Upload progress"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="h-1.5 overflow-hidden rounded-full bg-line"
                >
                  <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-2 text-center text-xs font-medium text-muted">
                  {progress < 100 ? `Uploading… ${progress}%` : "Processing…"}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap gap-2">
            <button
              id={id}
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={progress !== null}
              className={buttonClass.secondary}
            >
              <LuUpload aria-hidden="true" className="size-4" />
              {value?.url ? "Replace" : "Upload"}
            </button>
            <button type="button" onClick={() => setPickerOpen(true)} disabled={progress !== null} className={buttonClass.secondary}>
              <LuLibrary aria-hidden="true" className="size-4" />
              Library
            </button>
            {value?.url && (
              <button type="button" onClick={() => onChange(null)} disabled={progress !== null} className={buttonClass.danger}>
                <LuTrash2 aria-hidden="true" className="size-4" />
                Remove
              </button>
            )}
          </div>
          {value?.url && (
            <div>
              <label htmlFor={altId} className="text-xs font-medium text-muted">
                Alt text (describes the image for screen readers)
              </label>
              <input
                id={altId}
                value={value.alt ?? ""}
                maxLength={300}
                onChange={(event) => onChange({ ...value, alt: event.target.value })}
                className={`${inputClass} mt-1 py-2 text-sm`}
                placeholder="e.g. Dashboard showing recent orders"
              />
            </div>
          )}
          {!value?.url && <p className="text-xs text-muted">JPEG, PNG, WebP, GIF or AVIF, up to 4 MB.</p>}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={([asset]) => {
          if (asset) onChange({ ...assetToImage(asset), alt: asset.alt || value?.alt || "" });
          setPickerOpen(false);
        }}
      />
    </div>
  );
}
