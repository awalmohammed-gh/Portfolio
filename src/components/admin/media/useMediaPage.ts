"use client";

import { useEffect, useState } from "react";
import type { MediaAssetRecord } from "@/types/media";
import { api, ApiClientError } from "../api-client";

/** Both media views search the entire collection, rather than a loaded subset. */
export function useMediaPage({ query, usage = "all", enabled = true, initialItems = [] }: {
  query: string; usage?: string; enabled?: boolean; initialItems?: MediaAssetRecord[];
}) {
  const [items, setItems] = useState<MediaAssetRecord[]>(initialItems.slice(0, 24));
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(initialItems.length);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setLoading(true);
      const params = new URLSearchParams({ q: query.trim(), usage, page: String(page), limit: "24" });
      api<MediaAssetRecord[]>(`/api/media?${params}`, { signal: controller.signal })
        .then(({ data, meta }) => {
          setItems(data);
          setTotal(Number(meta?.total ?? data.length));
          const lastPage = Number(meta?.totalPages ?? 1);
          setPages(lastPage);
          if (page > lastPage) setPage(lastPage);
          setError("");
        })
        .catch((err) => {
          if (controller.signal.aborted) return;
          setError(err instanceof ApiClientError ? err.message : "Couldn't load images. Please try again.");
        })
        .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    }, 200);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [enabled, page, query, revision, usage]);
  return { items, setItems, page, setPage, total, pages, loading, error, reload: () => setRevision((value) => value + 1) };
}
