"use client";

import { LuRefreshCw, LuTriangleAlert } from "react-icons/lu";
import { buttonClass } from "@/components/admin/form/styles";

/** Shown when a dashboard page can't load its data (e.g. the database is unreachable). */
export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div role="alert" className="admin-panel admin-page-state grid place-items-center px-6 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-warning-soft text-warning">
        <LuTriangleAlert aria-hidden="true" className="size-5" />
      </span>
      <h1 className="mt-4 text-lg font-semibold tracking-tight text-fg">This page couldn&apos;t load</h1>
      <p className="mt-1 max-w-md text-sm text-muted">
        The database or image service may be temporarily unavailable. Your saved content is safe. Try again in a moment.
      </p>
      <button type="button" onClick={reset} className={`${buttonClass.primary} mt-6`}>
        <LuRefreshCw aria-hidden="true" className="size-4" />
        Try again
      </button>
    </div>
  );
}
