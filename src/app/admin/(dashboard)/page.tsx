import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type CSSProperties } from "react";
import { LuArrowRight, LuArrowUpRight, LuBriefcase, LuClock, LuCode, LuFileText, LuFolderKanban, LuGraduationCap, LuImage, LuPlus, LuSettings, LuUserRound, LuWrench } from "react-icons/lu";
import { buttonClass } from "@/components/admin/form/styles";
import { AdminEmptyState, AdminPageHeader, AdminPanel, CardsSkeleton, PanelLink, StatusBadge, formatDate } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth/guard";
import { getDashboardStats } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Overview" };

export default function OverviewPage() {
  return <>
    <Suspense fallback={<AdminPageHeader title="Your portfolio, at a glance" />}><Greeting /></Suspense>
    <Suspense fallback={<div className="space-y-5"><CardsSkeleton count={4} /><div className="h-80 animate-pulse rounded-xl border border-line bg-surface" /></div>}><Dashboard /></Suspense>
  </>;
}

async function Greeting() {
  const admin = await requireAdmin();
  return <AdminPageHeader title={`Welcome back, ${admin.name.split(" ")[0]}`} description="Your work, your story. A clear view of everything you are creating." actions={<Link href="/admin/projects/new" className={buttonClass.primary}><LuPlus aria-hidden="true" className="size-4" />New project</Link>} />;
}

async function Dashboard() {
  const stats = await getDashboardStats();
  const publishedPercent = stats.totalProjects ? Math.round(stats.publishedProjects / stats.totalProjects * 100) : 0;
  const inventory = [
    { label: "Skills", value: stats.totalSkills, detail: `${stats.totalCategories} categories`, href: "/admin/skills", icon: LuCode },
    { label: "Services", value: stats.totalServices, detail: `${stats.visibleServices} visible`, href: "/admin/services", icon: LuWrench },
    { label: "Education", value: stats.totalEducation, detail: "Qualifications", href: "/admin/education", icon: LuGraduationCap },
    { label: "Experience", value: stats.totalExperience, detail: "Work history", href: "/admin/experience", icon: LuBriefcase },
    { label: "Media library", value: stats.totalMedia, detail: "Images & uploads", href: "/admin/media", icon: LuImage },
    { label: "Page content", value: null, detail: "Headings, text & links", href: "/admin/content", icon: LuFileText },
  ];
  return <div className="admin-overview-grid">
    <section aria-label="Portfolio summary" className="admin-overview-feature">
      <div className="admin-feature-top"><span className="admin-feature-label"><LuFolderKanban aria-hidden="true" className="size-4" />Portfolio collection</span><Link href="/" target="_blank" className="admin-feature-preview">View site<LuArrowUpRight aria-hidden="true" className="size-3.5" /><span className="sr-only"> (opens in a new tab)</span></Link></div>
      <div className="admin-feature-value"><span>{stats.totalProjects}</span><div><h2>Projects in your portfolio</h2><p>{stats.featuredProjects} featured on your homepage</p></div></div>
      <Link href="/admin/projects" className="admin-feature-action">Manage your projects<LuArrowRight aria-hidden="true" className="size-4" /></Link>
      <div className="admin-feature-footer"><LuClock aria-hidden="true" className="size-3.5" /><span>{stats.lastUpdate ? <>Last updated <time dateTime={stats.lastUpdate}>{formatDate(stats.lastUpdate)}</time></> : "Your next chapter starts here"}</span></div>
    </section>

    <AdminPanel title="Publishing status" description="Published and draft projects in your collection." className="admin-overview-publishing" actions={<PanelLink href="/admin/projects">View all</PanelLink>}>
      {stats.totalProjects > 0 ? <div className="admin-publishing-body"><div className="admin-publication-ring" aria-hidden="true" style={{ "--published-turn": `${stats.publishedProjects / stats.totalProjects}turn` } as CSSProperties}><div><strong>{publishedPercent}%</strong><span>Published</span></div></div><dl className="admin-publication-legend"><div><dt><span className="admin-legend-dot" />Published</dt><dd><Link href="/admin/projects?publishStatus=published">{stats.publishedProjects}<LuArrowUpRight aria-hidden="true" className="size-3" /></Link></dd></div><div><dt><span className="admin-legend-dot admin-legend-draft" />Drafts</dt><dd><Link href="/admin/projects?publishStatus=draft">{stats.draftProjects}<LuArrowUpRight aria-hidden="true" className="size-3" /></Link></dd></div></dl></div> : <AdminEmptyState icon={<LuFolderKanban className="size-5" />} title="Your first project awaits" description="Save a draft or publish a project to see its status here." action={<Link href="/admin/projects/new" className={buttonClass.secondary}>Create a project</Link>} />}
    </AdminPanel>

    <AdminPanel title="Recent activity" description="Your most recently saved content." id="activity" className="admin-overview-activity scroll-mt-28" actions={<span className="admin-count-label">{stats.activity.length} recent</span>}>
      {stats.activity.length === 0 ? <AdminEmptyState icon={<LuClock className="size-5" />} title="A fresh start" description="Your saved changes will appear here." /> : <ul className="admin-activity-list">{stats.activity.map((item) => {
        const Icon = item.kind === "Project" ? LuFolderKanban : item.kind === "Skill" ? LuCode : item.kind === "Service" ? LuWrench : item.kind === "Education" ? LuGraduationCap : item.kind === "Experience" ? LuBriefcase : item.kind === "Settings" ? LuSettings : LuFileText;
        return <li key={`${item.kind}-${item.href}`}><Link href={item.href} className="admin-activity-link"><span className="admin-activity-icon"><Icon aria-hidden="true" className="size-4" /></span><div className="min-w-0"><p className="truncate text-xs font-semibold text-fg">{item.title}</p><p className="mt-1 text-[0.65rem] text-muted">{item.kind}</p></div><time dateTime={item.updatedAt} className="admin-activity-date">{formatDate(item.updatedAt)}</time><LuArrowUpRight aria-hidden="true" className="size-3.5 text-subtle" /></Link></li>;
      })}</ul>}
    </AdminPanel>

    <AdminPanel title="Make it yours" description="A few useful places to start." className="admin-overview-shortcuts">
      <ul className="admin-shortcuts">{[
        { href: "/admin/content/hero", label: "Refresh your homepage", detail: "Heading, intro & hero image", icon: LuFileText },
        { href: "/admin/content/about", label: "Tell your story", detail: "Biography & profile photo", icon: LuUserRound },
        { href: "/admin/media", label: "Manage your images", detail: "Upload, find & reuse", icon: LuImage },
        { href: "/admin/settings", label: "Fine-tune your site", detail: "Identity, contact & search", icon: LuSettings },
      ].map(({ href, label, detail, icon: Icon }) => <li key={href}><Link href={href}><span className="admin-shortcut-icon"><Icon aria-hidden="true" className="size-4" /></span><span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-fg">{label}</span><span className="mt-1 block text-[0.65rem] leading-5 text-muted">{detail}</span></span><LuArrowUpRight aria-hidden="true" className="size-3.5 text-subtle" /></Link></li>)}</ul>
      <div className="admin-shortcuts-note"><StatusBadge tone="accent">Your workspace</StatusBadge><p>Changes are saved through your existing content editors. Preview projects before publishing.</p></div>
    </AdminPanel>

    <AdminPanel title="Your content" description="Everything that makes your portfolio yours." className="admin-overview-inventory" actions={<PanelLink href="/admin/content">Edit pages</PanelLink>}>
      <div className="admin-inventory">{inventory.map(({ label, value, detail, href, icon: Icon }) => <Link key={href} href={href}><span className="admin-inventory-icon"><Icon aria-hidden="true" className="size-4" /></span><span className="min-w-0 flex-1"><span className="block text-xs font-medium text-fg">{label}</span><span className="mt-1 block truncate text-[0.65rem] text-muted">{detail}</span></span><span className="text-xl font-semibold tracking-tight text-fg">{value ?? <LuArrowUpRight aria-hidden="true" className="size-4 text-subtle" />}</span></Link>)}</div>
    </AdminPanel>
  </div>;
}
