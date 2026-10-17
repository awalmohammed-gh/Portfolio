import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LuArrowUpRight, LuChevronRight, LuPanelsTopLeft } from "react-icons/lu";
import { contentEditors } from "@/components/admin/content-config";
import { AdminPageHeader, ListSkeleton, formatDate } from "@/components/admin/ui";
import { listContentSections } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Page Content" };
const pageGroups = [
  { label: "Homepage", page: "/", description: "Your first impression.", keys: ["hero", "home", "fullStack"] },
  { label: "About", page: "/about", description: "Your story, skills and experience.", keys: ["about", "skills", "education", "experience"] },
  { label: "Projects", page: "/projects", description: "Introduce the work you’re proud of.", keys: ["projects"] },
  { label: "Services", page: "/services", description: "Show what you can help with.", keys: ["services"] },
  { label: "Contact", page: "/contact", description: "Make it easy to start a conversation.", keys: ["contact"] },
  { label: "Shared sections", page: "/", description: "The details that connect your pages.", keys: ["cta", "footer"] },
];

export default function ContentIndexPage() {
  return <>
    <AdminPageHeader title="Page content" description="Find a page, choose a section, and make the words your own." crumbs={[{ label: "Page content" }]} />
    <Suspense fallback={<ListSkeleton rows={8} />}><Sections /></Suspense>
  </>;
}
async function Sections() {
  const sections = await listContentSections();
  const updated = new Map<string, string>(sections.map((section) => [section.section, section.updatedAt]));
  return <div className="admin-content-map"><nav className="admin-content-index" aria-label="Portfolio pages"><p className="admin-page-kicker">Your pages</p>{pageGroups.map((group, index) => <a key={group.label} href={`#page-${index}`}><span>{String(index + 1).padStart(2, "0")}</span>{group.label}<span className="admin-content-section-count">{group.keys.length}</span></a>)}</nav><div className="admin-content-grid">{pageGroups.map((group, index) => <section id={`page-${index}`} key={group.label} className="admin-panel admin-content-page overflow-hidden" aria-label={group.label}>
    <div className="admin-section-heading"><div className="flex items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent"><LuPanelsTopLeft aria-hidden="true" className="size-4" /></span><div><h2 className="text-sm font-semibold text-fg">{group.label}</h2><p className="mt-1 text-xs text-muted">{group.description}</p></div></div><Link href={group.page} target="_blank" aria-label={`View ${group.label.toLowerCase()}`} className="grid size-9 shrink-0 place-items-center rounded-lg text-subtle hover:bg-surface-2 hover:text-accent"><LuArrowUpRight aria-hidden="true" className="size-4" /></Link></div>
    <ul className="divide-y divide-line">{group.keys.filter((key) => updated.has(key)).map((key) => {
      const editor = contentEditors[key];
      const updatedAt = updated.get(key);
      return <li key={key}><Link href={`/admin/content/${key}`} className="flex items-center gap-3 px-5 py-4 transition hover:bg-surface-2"><div className="min-w-0 flex-1"><p className="text-sm font-medium text-fg">{editor.label}</p><p className="mt-1 text-xs leading-5 text-muted">{editor.description}</p><p className="mt-2 text-[0.65rem] text-subtle">{updatedAt ? `Updated ${formatDate(updatedAt)}` : "Ready to personalize"}</p></div><LuChevronRight aria-hidden="true" className="size-4 shrink-0 text-subtle" /></Link></li>;
    })}</ul>
  </section>)}</div></div>;
}
