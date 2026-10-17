"use client";

import { LuRefreshCw } from "react-icons/lu";
import Container from "@/components/ui/Container";

/** Friendly fallback if a public page fails to render. No internal details are shown. */
export default function PortfolioError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="relative overflow-hidden">
      <div data-local-page-backdrop className="bg-glow pointer-events-none absolute inset-0" aria-hidden="true" />
      <Container className="relative flex min-h-[65vh] flex-col items-center justify-center py-24 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">Something went wrong</h1>
        <p className="mt-4 max-w-md text-base leading-7 text-muted">
          This page couldn’t load right now. Please try again in a moment.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-[0.95rem] font-medium text-accent-fg transition hover:bg-accent-hover"
        >
          <LuRefreshCw aria-hidden="true" className="size-4" />
          Try again
        </button>
      </Container>
    </section>
  );
}
