"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { LuArrowDown, LuArrowUp, LuLibrary, LuTrash2, LuUpload } from "react-icons/lu";
import type { ImageAsset } from "@/types/media";
import { ACCEPTED_IMAGE_TYPES, checkImageFile, uploadImage } from "../api-client";
import { useToast } from "../Feedback";
import MediaPicker from "../media/MediaPicker";
import { assetToImage } from "./ImageField";
import { buttonClass, inputClass } from "./styles";

/** Ordered list of images (e.g. project screenshots) with multi-upload. */
export default function GalleryField({
  value,
  onChange,
  max = 20,
}: {
  value: ImageAsset[];
  onChange: (value: ImageAsset[]) => void;
  max?: number;
}) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<{ name: string; progress: number } | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const images = value ?? [];

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const room = max - images.length;
    const chosen = Array.from(files).slice(0, room);
    if (files.length > room) toast.error(`You can add up to ${max} images.`);

    // Upload one at a time so progress is meaningful and order is preserved.
    let added: ImageAsset[] = [];
    for (const file of chosen) {
      const problem = checkImageFile(file);
      if (problem) {
        toast.error(problem);
        continue;
      }
      setUploading({ name: file.name, progress: 0 });
      try {
        const asset = await uploadImage(file, {
          onProgress: (progress) => setUploading({ name: file.name, progress }),
        });
        added = [...added, assetToImage(asset)];
        onChange([...images, ...added]);
      } catch (error) {
        toast.error(`${file.name}: ${(error as Error).message}`);
      }
    }
    setUploading(null);
    if (added.length > 0) toast.success(`${added.length} image${added.length === 1 ? "" : "s"} uploaded. Save to apply.`);
    if (inputRef.current) inputRef.current.value = "";
  }

  function move(index: number, delta: number) {
    const next = [...images];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <ul className="admin-gallery-grid">
          {images.map((image, index) => (
            <li key={`${image.url}-${index}`} className="flex gap-3 rounded-2xl border border-line bg-surface-2/50 p-3">
              <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg border border-line bg-surface">
                <Image src={image.url} alt={image.alt || `Image ${index + 1}`} fill sizes="120px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <input
                  aria-label={`Alt text for image ${index + 1}`}
                  value={image.alt ?? ""}
                  maxLength={300}
                  onChange={(event) => onChange(images.map((img, i) => (i === index ? { ...img, alt: event.target.value } : img)))}
                  placeholder="Alt text"
                  className={`${inputClass} py-1.5 text-sm`}
                />
                <div className="mt-2 flex items-center gap-1">
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className={buttonClass.icon} aria-label={`Move image ${index + 1} earlier`}>
                    <LuArrowUp aria-hidden="true" className="size-4" />
                  </button>
                  <button type="button" onClick={() => move(index, 1)} disabled={index === images.length - 1} className={buttonClass.icon} aria-label={`Move image ${index + 1} later`}>
                    <LuArrowDown aria-hidden="true" className="size-4" />
                  </button>
                  <button type="button" onClick={() => onChange(images.filter((_, i) => i !== index))} className={`${buttonClass.icon} ml-auto hover:text-danger`} aria-label={`Remove image ${index + 1}`}>
                    <LuTrash2 aria-hidden="true" className="size-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {uploading && (
        <p className="text-sm text-muted" aria-live="polite">
          Uploading {uploading.name}… {uploading.progress}%
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading !== null || images.length >= max} className={buttonClass.secondary}>
          <LuUpload aria-hidden="true" className="size-4" />
          Upload images
        </button>
        <button type="button" onClick={() => setPickerOpen(true)} disabled={images.length >= max} className={buttonClass.secondary}>
          <LuLibrary aria-hidden="true" className="size-4" />
          Add from library
        </button>
        <span className="self-center text-xs text-muted">
          {images.length}/{max}
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED_IMAGE_TYPES}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => handleFiles(event.target.files)}
      />
      <MediaPicker
        open={pickerOpen}
        multiple
        onClose={() => setPickerOpen(false)}
        onSelect={(assets) => {
          onChange([...images, ...assets.map(assetToImage)].slice(0, max));
          setPickerOpen(false);
        }}
      />
    </div>
  );
}
