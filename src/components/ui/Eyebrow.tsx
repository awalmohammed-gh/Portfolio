import type { ReactNode } from "react";

/** Small uppercase label that introduces a section. */
export default function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`inline-flex items-center gap-2 font-mono text-xs font-medium tracking-[0.16em] text-accent uppercase ${className}`}
    >
      <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
      {children}
    </p>
  );
}
