import type { ReactNode } from "react";

const tones = {
  default: "bg-white/5 text-ink-muted ring-white/10",
  accent: "bg-accent/10 text-accent ring-accent/30",
  success: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/30",
  warning: "bg-amber-400/10 text-amber-300 ring-amber-400/30",
} as const;

export default function Tag({
  children,
  tone = "default",
  className = "",
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
