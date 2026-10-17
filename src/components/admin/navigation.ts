import type { IconType } from "react-icons";
import {
  LuBriefcase, LuCode, LuFileText, LuFolderKanban, LuFolderTree,
  LuGraduationCap, LuImage, LuLayoutDashboard, LuSettings, LuUserRound, LuWrench,
} from "react-icons/lu";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: IconType;
  singular?: string;
  description: string;
  children?: AdminNavItem[];
};

export const adminNavGroups: { label: string; items: AdminNavItem[] }[] = [
  { label: "Workspace", items: [
    { href: "/admin", label: "Overview", icon: LuLayoutDashboard, description: "Your portfolio at a glance" },
  ] },
  { label: "Manage content", items: [
    { href: "/admin/projects", label: "Projects", icon: LuFolderKanban, singular: "project", description: "Case studies, drafts and publishing" },
    { href: "/admin/skills", label: "Skills", icon: LuCode, singular: "skill", description: "Your technology stack", children: [
      { href: "/admin/skills/categories", label: "Categories", icon: LuFolderTree, singular: "category", description: "Organize your skills" },
    ] },
    { href: "/admin/services", label: "Services", icon: LuWrench, singular: "service", description: "What you offer" },
    { href: "/admin/education", label: "Education", icon: LuGraduationCap, singular: "education entry", description: "Qualifications and academic history" },
    { href: "/admin/experience", label: "Experience", icon: LuBriefcase, singular: "experience entry", description: "Roles and work history" },
    { href: "/admin/content", label: "Page content", icon: LuFileText, description: "Words, images and sections" },
    { href: "/admin/media", label: "Media library", icon: LuImage, description: "Your portfolio’s image collection" },
  ] },
  { label: "Preferences", items: [
    { href: "/admin/settings", label: "Site settings", icon: LuSettings, description: "Identity, contact and search settings" },
    { href: "/admin/profile", label: "My account", icon: LuUserRound, description: "Profile, password and active sessions" },
  ] },
];

export const matchesAdminRoute = (pathname: string, href: string) =>
  href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

const allItems = adminNavGroups.flatMap((group) => group.items.flatMap((item) => [item, ...(item.children ?? [])]));
const contentLabels: Record<string, string> = {
  hero: "Homepage hero", home: "Homepage sections", about: "About page", skills: "Skills section",
  fullStack: "What I build", education: "Education section", experience: "Experience section",
  projects: "Projects page", services: "Services page", contact: "Contact page", cta: "Call to action", footer: "Footer",
};

export function getAdminPageContext(pathname: string) {
  const active = allItems.filter((item) => matchesAdminRoute(pathname, item.href))
    .sort((a, b) => b.href.length - a.href.length)[0];
  const crumbs: { label: string; href?: string }[] = [{ label: "Overview", href: "/admin" }];
  if (!active || active.href === "/admin") {
    return { activeHref: "/admin", title: "Overview", description: "Your portfolio at a glance", crumbs: [{ label: "Overview" }] };
  }
  if (active.href === "/admin/skills/categories") crumbs.push({ label: "Skills", href: "/admin/skills" });
  const tail = pathname.slice(active.href.length).split("/").filter(Boolean);
  crumbs.push({ label: active.label, ...(tail.length ? { href: active.href } : {}) });
  let title = active.label;
  if (tail.length) {
    if (active.href === "/admin/content") title = contentLabels[tail[0]] ?? "Edit section";
    else title = `${tail[0] === "new" ? "New" : "Edit"} ${active.singular ?? "record"}`;
    crumbs.push({ label: title });
  }
  return { activeHref: active.href, title, description: active.description, crumbs };
}
