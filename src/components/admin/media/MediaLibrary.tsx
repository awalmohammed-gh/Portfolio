"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { LuCheck, LuCopy, LuImageOff, LuSearch, LuTrash2, LuUpload } from "react-icons/lu";
import type { MediaAssetRecord } from "@/types/media";
import { ACCEPTED_IMAGE_TYPES, api, ApiClientError, checkImageFile, uploadImage } from "../api-client";
import { useConfirm, useToast } from "../Feedback";
import { buttonClass, inputClass } from "../form/styles";
import { AdminEmptyState, CollectionSummary, StatusBadge, formatDate } from "../ui";
import MediaPagination from "./MediaPagination";
import { useMediaPage } from "./useMediaPage";

function formatBytes(bytes?: number) {
  if (!bytes) return "";
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

export default function MediaLibrary({ initialItems }: { initialItems: MediaAssetRecord[] }) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [usage, setUsage] = useState<"all" | "used" | "unused">("all");
  const [upload, setUpload] = useState<{ name: string; progress: number } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [altState, setAltState] = useState<Record<string, string>>({});
  const { items, setItems, page, setPage, total, pages, loading, error, reload } = useMediaPage({ query, usage, initialItems });
  const visible = items;

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    let uploaded = 0;
    for (const file of Array.from(files)) {
      const problem = checkImageFile(file);
      if (problem) {
        toast.error(problem);
        continue;
      }
      setUpload({ name: file.name, progress: 0 });
      try {
        const asset = await uploadImage(file, { onProgress: (progress) => setUpload({ name: file.name, progress }) });
        setItems((list) => [asset, ...list]);
        uploaded++;
      } catch (error) {
        toast.error(`${file.name}: ${(error as Error).message}`);
      }
    }
    setUpload(null);
    if (inputRef.current) inputRef.current.value = "";
    if (uploaded) {
      toast.success(`${uploaded} image${uploaded === 1 ? "" : "s"} uploaded.`);
      setPage(1);
      reload();
      router.refresh();
    }
  }

  async function saveAlt(item: MediaAssetRecord, alt: string) {
    if (alt === item.alt) return;
    setAltState((state) => ({ ...state, [item.id]: "Saving…" }));
    try {
      await api(`/api/media/${item.id}`, { method: "PATCH", body: { alt } });
      setItems((list) => list.map((it) => (it.id === item.id ? { ...it, alt } : it)));
      toast.success("Alt text saved.");
      setAltState((state) => ({ ...state, [item.id]: "Saved" }));
    } catch (error) {
      setAltState((state) => ({ ...state, [item.id]: "Not saved. Leave the field to retry." }));
      toast.error(error instanceof ApiClientError ? error.message : "Couldn't save alt text.");
    }
  }

  async function remove(item: MediaAssetRecord) {
    const ok = await confirm({
      title: "Delete this image?",
      message: "It will be permanently removed from Cloudinary. Images still used on the site can't be deleted.",
      confirmLabel: "Delete image",
      tone: "danger",
    });
    if (!ok) return;
    try {
      await api(`/api/media/${item.id}`, { method: "DELETE" });
      setItems((list) => list.filter((it) => it.id !== item.id));
      toast.success("Image deleted.");
      reload();
      router.refresh();
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : "Couldn't delete the image.");
    }
  }

  async function copy(item: MediaAssetRecord) {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopied(item.id);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      toast.error("Couldn't copy to the clipboard.");
    }
  }

  return (
    <div className="space-y-4">
      <CollectionSummary title="Your visual library" description="Upload, organize and reuse images across your portfolio. Add descriptive alt text to make every image accessible." metrics={[{ label: query || usage !== "all" ? "Matching images" : "Library images", value: loading ? "…" : total }, { label: "On this page", value: visible.length }]} />
      <div className="admin-toolbar">
        <label className="admin-toolbar-search">
          <span className="admin-filter-label">Search your library</span>
          <span className="relative block"><LuSearch aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-subtle" />
          <input type="search" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="File name or alt text…" className={`${inputClass} pl-10`} /></span>
        </label>
        <label className="admin-toolbar-filter">
          <span className="admin-filter-label">Usage</span>
          <select value={usage} onChange={(e) => { setUsage(e.target.value as typeof usage); setPage(1); }} className={inputClass}>
            <option value="all">All images</option>
            <option value="used">In use</option>
            <option value="unused">Unused</option>
          </select>
        </label>
        <button type="button" onClick={() => inputRef.current?.click()} disabled={upload !== null} className={buttonClass.primary}>
          <LuUpload aria-hidden="true" className="size-4" />
          Upload images
        </button>
        <input ref={inputRef} type="file" multiple accept={ACCEPTED_IMAGE_TYPES} className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => handleFiles(e.target.files)} />
      </div>

      {upload && (
        <div className="rounded-2xl border border-line bg-surface p-4" aria-live="polite">
          <p className="text-sm text-fg">
            Uploading {upload.name}… {upload.progress}%
          </p>
          <div role="progressbar" aria-label="Upload progress" aria-valuenow={upload.progress} aria-valuemin={0} aria-valuemax={100} className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${upload.progress}%` }} />
          </div>
        </div>
      )}

      <p className="text-xs text-muted">
        JPEG, PNG, WebP, GIF or AVIF up to 4 MB. Images in use can&apos;t be deleted.
      </p>
      {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-danger/30 bg-danger-soft p-4 text-sm text-danger">{error}<button type="button" onClick={reload} className={buttonClass.secondary}>Try again</button></div>}

      {visible.length === 0 ? (
        <AdminEmptyState icon={<LuImageOff className="size-5" />} title={loading ? "Loading your images…" : query || usage !== "all" ? "No matching images" : "Your library starts here"} description={query || usage !== "all" ? "Try a different file name or adjust the usage filter." : "Images you upload in any editor also appear here."} action={!loading && !query && usage === "all" ? <button type="button" onClick={() => inputRef.current?.click()} disabled={upload !== null} className={buttonClass.secondary}><LuUpload aria-hidden="true" className="size-4" />Upload your first image</button> : undefined} />
      ) : (
        <ul className={`admin-media-grid ${loading ? "pointer-events-none opacity-50" : ""}`} aria-busy={loading}>
          {visible.map((item) => (
            <li key={item.id} className="admin-panel admin-media-card overflow-hidden">
              <div className="relative aspect-video bg-surface-2">
                <Image src={item.url} alt={item.alt || item.originalFilename || "Uploaded image"} fill sizes="(min-width: 1024px) 320px, 50vw" className="object-cover" />
                <span className="absolute top-2 left-2">
                  {item.usageCount ? <StatusBadge tone="success">In use · {item.usageCount}</StatusBadge> : <StatusBadge>Unused</StatusBadge>}
                </span>
              </div>
              <div className="space-y-2.5 p-3.5">
                <p className="truncate text-sm font-medium text-fg" title={item.originalFilename}>
                  {item.originalFilename || item.publicId}
                </p>
                <p className="text-xs text-muted">
                  {[item.width && item.height ? `${item.width}×${item.height}` : "", item.format?.toUpperCase(), formatBytes(item.bytes), formatDate(item.createdAt)]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <label className="block text-xs font-medium text-muted">Alt text<input
                  aria-label={`Alt text for ${item.originalFilename || "image"}`}
                  defaultValue={item.alt}
                  maxLength={300}
                  placeholder="Default alt text"
                  onBlur={(e) => saveAlt(item, e.target.value.trim())}
                  className={`${inputClass} mt-1.5 py-1.5 text-sm`}
                /></label>
                <p role="status" className={`text-[0.65rem] ${altState[item.id]?.startsWith("Not saved") ? "text-danger" : "text-subtle"}`}>{altState[item.id] ?? "Saves when you leave the field."}</p>
                <div className="flex items-center justify-between">
                  <button type="button" onClick={() => copy(item)} className={buttonClass.ghost}>
                    {copied === item.id ? <LuCheck aria-hidden="true" className="size-4" /> : <LuCopy aria-hidden="true" className="size-4" />}
                    {copied === item.id ? "Copied" : "Copy URL"}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item)}
                    disabled={Boolean(item.usageCount)}
                    title={item.usageCount ? "In use on the site" : "Delete"}
                    className={buttonClass.danger}
                  >
                    <LuTrash2 aria-hidden="true" className="size-4" />
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <MediaPagination page={page} pages={pages} total={total} loading={loading} onPage={setPage} />
    </div>
  );
}
