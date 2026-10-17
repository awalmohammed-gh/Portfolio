"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { LuCheck, LuImageOff, LuSearch, LuX } from "react-icons/lu";
import type { MediaAssetRecord } from "@/types/media";
import { buttonClass, inputClass } from "../form/styles";
import MediaPagination from "./MediaPagination";
import { useMediaPage } from "./useMediaPage";

/** Modal for choosing existing uploads from the media library. */
export default function MediaPicker({
  open,
  multiple = false,
  onClose,
  onSelect,
}: {
  open: boolean;
  multiple?: boolean;
  onClose: () => void;
  onSelect: (assets: MediaAssetRecord[]) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<MediaAssetRecord[]>([]);
  const { items, page, setPage, total, pages, loading, error, reload } = useMediaPage({ query, enabled: open });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const visible = items;
  function toggle(item: MediaAssetRecord) {
    if (!multiple) {
      setSelected([item]);
      return;
    }
    setSelected((list) => (list.some((asset) => asset.id === item.id) ? list.filter((asset) => asset.id !== item.id) : [...list, item]));
  }

  function confirm() {
    onSelect(selected);
    setSelected([]);
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={() => {
        setSelected([]);
        setQuery("");
        setPage(1);
        onClose();
      }}
      aria-labelledby="media-picker-title"
      className="admin-dialog m-auto h-[min(42rem,calc(100dvh-2rem))] w-[min(56rem,calc(100vw-2rem))] border border-line bg-surface p-0 text-fg shadow-card backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <h2 id="media-picker-title" className="text-lg font-semibold tracking-tight">
            Media library
          </h2>
          <button type="button" onClick={() => dialogRef.current?.close()} className={buttonClass.icon} aria-label="Close">
            <LuX aria-hidden="true" className="size-4" />
          </button>
        </div>

        <div className="border-b border-line px-5 py-3">
          <label className="relative block">
            <span className="sr-only">Search images</span>
            <LuSearch aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-subtle" />
            <input
              type="search"
              value={query}
              onChange={(event) => { setQuery(event.target.value); setPage(1); }}
              placeholder="Search by file name or alt text"
              className={`${inputClass} pl-10`}
            />
          </label>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {error ? (
            <div role="alert" className="text-sm text-danger">{error}<button type="button" onClick={reload} className={`${buttonClass.secondary} ml-3`}>Try again</button></div>
          ) : loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-xl bg-surface-2" />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="grid h-full place-items-center text-center text-sm text-muted">
              <div>
                <LuImageOff aria-hidden="true" className="mx-auto size-8 text-subtle" />
                <p className="mt-3">{items.length === 0 ? "No uploads yet. Use “Upload” on the field instead." : "No images match your search."}</p>
              </div>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {visible.map((item) => {
                const isSelected = selected.some((asset) => asset.id === item.id);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => toggle(item)}
                      onDoubleClick={() => {
                        if (!multiple) {
                          onSelect([item]);
                          setSelected([]);
                        }
                      }}
                      aria-pressed={isSelected}
                      className={`group relative block aspect-square w-full overflow-hidden rounded-xl border-2 bg-surface-2 transition ${
                        isSelected ? "border-accent ring-4 ring-accent/20" : "border-transparent hover:border-line-strong"
                      }`}
                    >
                      <Image src={item.url} alt={item.alt || item.originalFilename || "Uploaded image"} fill sizes="200px" className="object-cover" />
                      {isSelected && (
                        <span className="absolute top-2 right-2 grid size-6 place-items-center rounded-full bg-accent text-accent-fg">
                          <LuCheck aria-hidden="true" className="size-3.5" />
                        </span>
                      )}
                    </button>
                    <p className="mt-1.5 truncate text-xs text-muted">{item.originalFilename || item.alt || item.publicId}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="px-5 pb-3"><MediaPagination page={page} pages={pages} total={total} loading={loading} onPage={setPage} /></div>

        <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-4">
          <p className="text-sm text-muted">{selected.length > 0 ? `${selected.length} selected` : multiple ? "Select one or more images" : "Select an image"}</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => dialogRef.current?.close()} className={buttonClass.secondary}>
              Cancel
            </button>
            <button type="button" onClick={confirm} disabled={selected.length === 0 || loading} className={buttonClass.primary}>
              Use {multiple && selected.length > 1 ? "images" : "image"}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
