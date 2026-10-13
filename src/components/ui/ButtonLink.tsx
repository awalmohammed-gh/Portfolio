import Link from "next/link";
import type { ReactNode } from "react";

const variants = {
  primary:
    "bg-accent text-accent-fg shadow-[0_8px_24px_-10px] shadow-accent/60 hover:bg-accent-hover",
  secondary:
    "border border-line bg-surface text-fg shadow-card hover:border-line-strong",
  ghost: "text-accent hover:text-accent-hover",
} as const;

const sizes = {
  md: "h-12 px-6 text-[0.95rem]",
  sm: "h-10 px-4 text-sm",
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
  const classes = `group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium transition ${
    variant === "ghost" ? "h-auto px-0 text-[0.95rem]" : sizes[size]
  } ${variants[variant]} ${className}`;

  if (external || /^(mailto:|tel:|#)/.test(href)) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
        {external && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
