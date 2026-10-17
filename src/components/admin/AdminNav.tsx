"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  LuChevronDown, LuChevronRight, LuExternalLink, LuLogOut, LuMenu,
  LuPanelLeftClose, LuPanelLeftOpen, LuPanelsTopLeft, LuPlus, LuArrowUpRight, LuX,
} from "react-icons/lu";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { api } from "./api-client";
import { useToast } from "./Feedback";
import { useNavigationGuard } from "./NavigationGuard";
import AdminProfileMenu, { adminInitials } from "./AdminProfileMenu";
import AdminTooltip from "./AdminTooltip";
import type { WorkspaceAdmin } from "./AdminWorkspace";
import { adminNavGroups, getAdminPageContext, matchesAdminRoute, type AdminNavItem } from "./navigation";
import { buttonClass } from "./form/styles";

type NavProps = { admin: WorkspaceAdmin; collapsed: boolean; onToggleSidebar: () => void };

function Brand({ collapsed = false }: { collapsed?: boolean }) {
  return <Link href="/admin" className="admin-brand" aria-label="Portfolio admin overview">
    <span className="admin-brand-mark"><LuPanelsTopLeft aria-hidden="true" className="size-5" /></span>
    {!collapsed && <span className="admin-brand-copy"><span>Portfolio<span className="text-accent">.</span></span><span>Admin workspace</span></span>}
  </Link>;
}

function NavLink({ item, activeHref, collapsed, close, nested = false }: {
  item: AdminNavItem; activeHref: string; collapsed: boolean; close?: () => void; nested?: boolean;
}) {
  const Icon = item.icon;
  return <AdminTooltip enabled={collapsed} label={nested ? `Skills: ${item.label}` : item.label}>{(descriptionId) =>
    <Link href={item.href} onClick={close} aria-current={activeHref === item.href ? "page" : undefined}
      aria-label={collapsed ? item.label : undefined} aria-describedby={descriptionId}
      className={`admin-nav-link ${nested ? "admin-nav-child" : ""}`}>
      <Icon aria-hidden="true" className="admin-nav-icon" />
      <span className={collapsed ? "sr-only" : "admin-nav-text"}>{item.label}</span>
    </Link>
  }</AdminTooltip>;
}

function NavBranch({ item, pathname, activeHref, collapsed, close }: {
  item: AdminNavItem; pathname: string; activeHref: string; collapsed: boolean; close?: () => void;
}) {
  const [choice, setChoice] = useState<{ path: string; open: boolean } | null>(null);
  const active = matchesAdminRoute(pathname, item.href);
  const open = choice?.path === pathname ? choice.open : active;
  const childrenId = `admin-${collapsed ? "rail" : close ? "drawer" : "sidebar"}-${item.href.split("/").pop()}`;
  return <li>
    <div className="admin-nav-branch" data-active={active || undefined}>
      <NavLink item={item} activeHref={activeHref} collapsed={collapsed} close={close} />
      {item.children && !collapsed && <button type="button" aria-expanded={open} aria-controls={childrenId} aria-label={`${open ? "Hide" : "Show"} ${item.label.toLowerCase()} navigation`} className="admin-nav-disclosure" onClick={() => setChoice({ path: pathname, open: !open })}><LuChevronDown aria-hidden="true" className={`size-3.5 transition ${open ? "rotate-180" : ""}`} /></button>}
    </div>
    {item.children && <ul id={childrenId} className={`admin-nav-children ${collapsed ? "admin-nav-children-flat" : ""}`} hidden={!collapsed && !open}>
      {item.children.map((child) => <li key={child.href}><NavLink item={child} activeHref={activeHref} collapsed={collapsed} close={close} nested /></li>)}
    </ul>}
  </li>;
}

function NavLinks({ pathname, collapsed = false, close }: { pathname: string; collapsed?: boolean; close?: () => void }) {
  const { activeHref } = getAdminPageContext(pathname);
  return <nav aria-label={close ? "Mobile admin navigation" : "Admin navigation"} className="admin-nav">
    {adminNavGroups.map((group) => <div key={group.label} className="admin-nav-group">
      <p className="admin-nav-label" aria-hidden={collapsed || undefined}>{collapsed ? <span className="admin-nav-group-rule" /> : group.label}</p>
      <ul className="admin-nav-items">{group.items.map((item) => <NavBranch key={item.href} item={item} pathname={pathname} activeHref={activeHref} collapsed={collapsed} close={close} />)}</ul>
    </div>)}
  </nav>;
}

function CreateShortcut({ collapsed = false, close }: { collapsed?: boolean; close?: () => void }) {
  return <div className="admin-sidebar-shortcut"><AdminTooltip enabled={collapsed} label="New project">{(descriptionId) => <Link href="/admin/projects/new" onClick={close} aria-label={collapsed ? "New project" : undefined} aria-describedby={descriptionId} className="admin-create-link"><LuPlus aria-hidden="true" className="size-4 shrink-0" />{!collapsed && <><span>New project</span><LuArrowUpRight aria-hidden="true" className="ml-auto size-3.5" /></>}</Link>}</AdminTooltip></div>;
}

function SidebarAccount({ admin, collapsed, loggingOut, onLogout, close }: {
  admin: WorkspaceAdmin; collapsed: boolean; loggingOut: boolean; onLogout: () => Promise<void>; close?: () => void;
}) {
  return <div className="admin-sidebar-account">
    <AdminTooltip label="My account" enabled={collapsed}>{(descriptionId) =>
      <Link href="/admin/profile" onClick={close} aria-label={collapsed ? "My account" : undefined} aria-describedby={descriptionId} className="admin-sidebar-profile">
        <span className="admin-avatar" aria-hidden="true">{adminInitials(admin.name)}</span>
        {!collapsed && <span className="min-w-0"><span className="block truncate text-xs font-semibold text-fg">{admin.name}</span><span className="mt-1 block text-[0.65rem] text-muted">Administrator</span></span>}
      </Link>
    }</AdminTooltip>
    <AdminTooltip label={loggingOut ? "Signing out…" : "Sign out"} enabled>{(descriptionId) =>
      <button type="button" onClick={onLogout} disabled={loggingOut} aria-label="Sign out" aria-describedby={descriptionId} className={`${buttonClass.icon} hover:bg-danger-soft hover:text-danger`}><LuLogOut aria-hidden="true" className="size-4" /></button>
    }</AdminTooltip>
  </div>;
}

export default function AdminNav(props: NavProps) {
  return <Suspense fallback={<NavigationSkeleton collapsed={props.collapsed} />}><NavWithPath {...props} /></Suspense>;
}
function NavWithPath(props: NavProps) { return <Nav {...props} pathname={usePathname()} />; }

function NavigationSkeleton({ collapsed }: { collapsed: boolean }) {
  return <>
    <div className="admin-sidebar" data-collapsed={collapsed} aria-hidden="true"><div className="admin-brand"><span className="admin-brand-mark"><LuPanelsTopLeft className="size-5" /></span></div><div className="space-y-4 p-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-10 animate-pulse rounded-lg bg-surface-2" />)}</div></div>
    <div className="admin-topbar" role="status"><span className="text-xs text-muted">Loading navigation…</span></div>
  </>;
}

function Nav({ pathname, admin, collapsed, onToggleSidebar }: NavProps & { pathname: string }) {
  const router = useRouter();
  const toast = useToast();
  const { canLeave } = useNavigationGuard();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const context = getAdminPageContext(pathname);
  const close = () => dialog.current?.close();
  useEffect(() => { dialog.current?.close(); }, [pathname]);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onResize = () => { if (desktop.matches) dialog.current?.close(); };
    desktop.addEventListener("change", onResize);
    return () => desktop.removeEventListener("change", onResize);
  }, []);

  async function logout() {
    if (loggingOut || !await canLeave()) return;
    setLoggingOut(true);
    try {
      await api("/api/auth/logout", { method: "POST" });
      close();
      router.replace("/admin/login");
      router.refresh();
    } catch {
      toast.error("Couldn't sign out. Check your connection and try again.");
      setLoggingOut(false);
    }
  }

  return <>
    <aside id="admin-desktop-sidebar" className="admin-sidebar" data-collapsed={collapsed} aria-label="Workspace sidebar">
      <Brand collapsed={collapsed} />
      <NavLinks pathname={pathname} collapsed={collapsed} />
      <CreateShortcut collapsed={collapsed} />
      <SidebarAccount admin={admin} collapsed={collapsed} loggingOut={loggingOut} onLogout={logout} />
    </aside>
    <header className="admin-topbar">
      <div className="admin-topbar-context">
        <button ref={trigger} type="button" onClick={() => { dialog.current?.showModal(); setDrawerOpen(true); }} aria-haspopup="dialog" aria-expanded={drawerOpen} aria-controls="admin-drawer" className={`${buttonClass.icon} admin-mobile-only`} aria-label="Open navigation"><LuMenu aria-hidden="true" className="size-5" /></button>
        <button type="button" onClick={onToggleSidebar} aria-expanded={!collapsed} aria-controls="admin-desktop-sidebar" className={`${buttonClass.icon} admin-desktop-only`} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>{collapsed ? <LuPanelLeftOpen aria-hidden="true" className="size-4.5" /> : <LuPanelLeftClose aria-hidden="true" className="size-4.5" />}</button>
        <div className="min-w-0">
          <nav aria-label="Workspace breadcrumb" className="admin-topbar-breadcrumb"><ol>{context.crumbs.map((crumb, index) => <li key={`${crumb.label}-${index}`}>
            {index > 0 && <LuChevronRight aria-hidden="true" className="size-3 shrink-0 text-subtle" />}
            {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : <span aria-current="page">{crumb.label}</span>}
          </li>)}</ol></nav>
          <p className="admin-topbar-description">{context.description}</p>
        </div>
      </div>
      <div className="admin-topbar-actions">
        <Link href="/" target="_blank" className="admin-portfolio-action"><LuExternalLink aria-hidden="true" className="size-3.5" /><span>View Portfolio</span><span className="sr-only"> (opens in a new tab)</span></Link>
        <span className="admin-header-divider" aria-hidden="true" /><ThemeToggle />
        <AdminProfileMenu admin={admin} pathname={pathname} loggingOut={loggingOut} onLogout={logout} />
      </div>
    </header>
    <dialog ref={dialog} id="admin-drawer" aria-label="Admin navigation" className="admin-drawer" onClose={() => { setDrawerOpen(false); if (trigger.current?.getClientRects().length) trigger.current.focus(); }} onClick={(event) => {
      if (event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
    }}>
      <div className="admin-drawer-inner">
        <div className="admin-drawer-heading"><Brand /><button autoFocus type="button" onClick={close} className={buttonClass.icon} aria-label="Close navigation"><LuX aria-hidden="true" className="size-5" /></button></div>
        <NavLinks pathname={pathname} close={close} />
        <CreateShortcut close={close} />
        <SidebarAccount admin={admin} collapsed={false} loggingOut={loggingOut} onLogout={logout} close={close} />
      </div>
    </dialog>
  </>;
}
