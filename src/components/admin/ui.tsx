import Link from "next/link";
import type { ReactNode } from "react";
import { LuArrowUpRight } from "react-icons/lu";

/** Shared, server-safe admin building blocks. */

export type Crumb = { label: string; href?: string };

export function AdminPageHeader({
  title,
  description,
  crumbs = [],
  actions,
}: {
  title: string;
  description?: ReactNode;
  crumbs?: Crumb[];
  actions?: ReactNode;
}) {
  return (
    <header className="admin-page-header">
      <p className="admin-page-kicker">{crumbs.length > 1 ? crumbs[crumbs.length - 2].label : "Portfolio workspace"}</p>
      <div className="admin-page-header-row">
        <div className="min-w-0">
          <h1>{title}</h1>
          {description && <p className="admin-page-description">{description}</p>}
        </div>
        {actions && <div className="admin-page-actions">{actions}</div>}
      </div>
    </header>
  );
}

export function AdminPanel({ title, description, eyebrow, actions, children, className = "", id }: {
  title: string; description?: string; eyebrow?: string; actions?: ReactNode; children: ReactNode; className?: string; id?: string;
}) {
  return <section id={id} aria-label={title} className={`admin-panel ${className}`}>
    <div className="admin-section-heading"><div>{eyebrow && <p className="admin-page-kicker">{eyebrow}</p>}<h2 className="text-sm font-semibold text-fg">{title}</h2>{description && <p className="mt-1 text-xs leading-5 text-muted">{description}</p>}</div>{actions}</div>
    {children}
  </section>;
}

/** Compact collection context, rather than dashboard tiles on every page. */
export function CollectionSummary({ title, description, metrics }: {
  title: string; description: string; metrics: { label: string; value: number | string }[];
}) {
  return <section aria-label={`${title} summary`} className="admin-collection-summary"><div className="admin-collection-intro"><p className="admin-page-kicker">Content library</p><h2>{title}</h2><p>{description}</p></div><dl>{metrics.map((metric) => <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>)}</dl></section>;
}

export function AdminEmptyState({ icon, title, description, action }: { icon: ReactNode; title: string; description: string; action?: ReactNode }) {
  return <div className="admin-empty-state"><span className="admin-empty-icon" aria-hidden="true">{icon}</span><h2>{title}</h2><p>{description}</p>{action && <div className="mt-5">{action}</div>}</div>;
}

export function PanelLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link href={href} className="admin-panel-link">{children}<LuArrowUpRight aria-hidden="true" className="size-3.5" /></Link>;
}

const tones = {
  default: "border-line bg-surface-2 text-muted",
  accent: "border-transparent bg-accent-soft text-accent",
  success: "border-transparent bg-success-soft text-success",
  warning: "border-transparent bg-warning-soft text-warning",
} as const;

export function StatusBadge({ tone = "default", children }: { tone?: keyof typeof tones; children: ReactNode }) {
  return (
    <span className={`admin-status ${tones[tone]}`}>
      <span aria-hidden="true" className="admin-status-dot" />{children}
    </span>
  );
}

export function formatDate(value: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

/* ------------------------------- Skeletons -------------------------------- */

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div aria-busy="true" aria-label="Loading" className="space-y-4">
      <div className="h-11 animate-pulse rounded-xl bg-surface-2" />
      <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
        {Array.from({ length: rows }, (_, i) => (
          <li key={i} className="flex items-center gap-4 px-4 py-3.5">
            <span className="size-12 animate-pulse rounded-xl bg-surface-2" />
            <span className="flex-1 space-y-2">
              <span className="block h-3.5 w-1/3 animate-pulse rounded bg-surface-2" />
              <span className="block h-3 w-1/2 animate-pulse rounded bg-surface-2" />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading" className="admin-editor">
      <div className="space-y-6 rounded-2xl border border-line bg-surface p-7">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="space-y-2">
            <span className="block h-3 w-28 animate-pulse rounded bg-surface-2" />
            <span className="block h-11 animate-pulse rounded-xl bg-surface-2" />
          </div>
        ))}
      </div>
      <div className="h-40 animate-pulse rounded-2xl border border-line bg-surface" />
    </div>
  );
}

export function CardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div aria-busy="true" aria-label="Loading" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="h-32 animate-pulse rounded-2xl border border-line bg-surface" />
      ))}
    </div>
  );
}
