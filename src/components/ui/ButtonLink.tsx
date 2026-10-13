import Link from "next/link";
import type { ReactNode } from "react";

const variants = {
  primary:
    "bg-accent text-navy-950 hover:bg-accent-soft shadow-[0_0_24px_-6px] shadow-accent/50",
  secondary: "text-ink ring-1 ring-white/15 hover:ring-accent/60 hover:text-accent",
  ghost: "text-accent hover:text-accent-soft px-0",
} as const;

const sizes = {
  md: "px-5 py-3 text-sm",
  sm: "px-3.5 py-2 text-xs",
} as const;

export default function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  external = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  external?: boolean;
  className?: string;
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${sizes[size]} ${variants[variant]} ${className}`;

  if (external || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
