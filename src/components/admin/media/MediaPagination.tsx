"use client";

import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { buttonClass } from "../form/styles";

export default function MediaPagination({ page, pages, total, loading, onPage }: { page: number; pages: number; total: number; loading: boolean; onPage: (page: number) => void }) {
  return <nav aria-label="Image pages" className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
    <p className="text-xs text-muted" role="status">{loading ? "Loading images…" : `${total} image${total === 1 ? "" : "s"} · Page ${page} of ${pages}`}</p>
    <div className="flex gap-2"><button type="button" onClick={() => onPage(page - 1)} disabled={loading || page <= 1} className={buttonClass.secondary} aria-label="Previous image page"><LuChevronLeft aria-hidden="true" className="size-4" /><span className="hidden sm:inline">Previous</span></button><button type="button" onClick={() => onPage(page + 1)} disabled={loading || page >= pages} className={buttonClass.secondary} aria-label="Next image page"><span className="hidden sm:inline">Next</span><LuChevronRight aria-hidden="true" className="size-4" /></button></div>
  </nav>;
}
