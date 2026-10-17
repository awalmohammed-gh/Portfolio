import Link from "next/link";
import type { ReactNode } from "react";
import { LuArrowRight, LuFolderTree } from "react-icons/lu";
import type { ResourceKey } from "./resources";

export type AdminResourceItem = Record<string, unknown> & { id: string; order?: number };

/** Collection-specific compositions share the existing row actions and data. */
export default function ResourceCollection({ resource, items, lookups, grid, renderItem }: {
  resource: ResourceKey;
  items: AdminResourceItem[];
  lookups: Record<string, Record<string, string>>;
  grid: boolean;
  renderItem: (item: AdminResourceItem, index: number) => ReactNode;
}) {
  if (resource === "skills") {
    const groups = new Map<string, AdminResourceItem[]>();
    const positions = new Map(items.map((item, index) => [item.id, index]));
    for (const item of items) {
      const category = String(item.categoryId ?? "");
      const group = groups.get(category);
      if (group) group.push(item);
      else groups.set(category, [item]);
    }
    return <div className="admin-skills-groups">{[...groups].map(([category, skills]) => <section key={category} className="admin-panel overflow-hidden" aria-label={lookups.categoryId?.[category] ?? "Skills"}>
      <div className="admin-skill-group-heading"><div className="flex min-w-0 items-center gap-2.5"><LuFolderTree aria-hidden="true" className="size-4 text-accent" /><h2 className="truncate text-sm font-semibold text-fg">{lookups.categoryId?.[category] ?? "Uncategorized"}</h2><span className="text-xs text-subtle">{skills.length}</span></div><Link href={`/admin/skills?categoryId=${encodeURIComponent(category)}`} className="inline-flex items-center gap-1.5 text-xs font-medium text-accent">Manage<LuArrowRight aria-hidden="true" className="size-3" /></Link></div>
      <ul className="admin-skills-list">{skills.map((item) => renderItem(item, positions.get(item.id)!))}</ul>
    </section>)}</div>;
  }
  if (resource === "services") return <ul className="admin-services-list">{items.map(renderItem)}</ul>;
  if (resource === "education" || resource === "experience") return <ol className="admin-history-list">{items.map(renderItem)}</ol>;
  if (resource === "projects" && grid) return <ul className="admin-projects-grid">{items.map(renderItem)}</ul>;
  return <div className="admin-panel overflow-hidden"><div className="admin-resource-heading" aria-hidden="true"><span>{resource === "projects" ? "Project" : "Category"}</span><span>Details & status</span><span className="text-right">Actions</span></div><ul className="divide-y divide-line">{items.map(renderItem)}</ul></div>;
}
