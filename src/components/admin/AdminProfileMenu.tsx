"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { LuChevronDown, LuExternalLink, LuLogOut, LuSettings, LuShieldCheck, LuUserRound } from "react-icons/lu";
import type { WorkspaceAdmin } from "./AdminWorkspace";

export function adminInitials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "A";
}

export default function AdminProfileMenu({ admin, pathname, loggingOut, onLogout }: {
  admin: WorkspaceAdmin; pathname: string; loggingOut: boolean; onLogout: () => Promise<void>;
}) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const preferredFocus = useRef<"first" | "last">("first");
  const [open, setOpen] = useState(false);
  useEffect(() => { menu.current?.hidePopover(); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const hide = () => menu.current?.hidePopover();
    window.addEventListener("resize", hide);
    return () => window.removeEventListener("resize", hide);
  }, [open]);

  function positionMenu() {
    const rect = trigger.current?.getBoundingClientRect();
    if (!rect || !menu.current) return;
    menu.current.style.top = `${rect.bottom + 10}px`;
    menu.current.style.right = `${Math.max(12, window.innerWidth - rect.right)}px`;
  }

  function menuKeys(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Tab") {
      requestAnimationFrame(() => menu.current?.hidePopover());
      return;
    }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]:not(:disabled)'));
    const current = items.indexOf(document.activeElement as HTMLElement);
    const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1
      : (current + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
    items[next]?.focus();
  }

  return <>
    <button ref={trigger} type="button" popoverTarget={id} aria-haspopup="menu" aria-expanded={open} aria-controls={id} aria-label={`Administrator menu for ${admin.name}`} className="admin-profile-trigger" onClick={() => { preferredFocus.current = "first"; positionMenu(); }} onKeyDown={(event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        preferredFocus.current = event.key === "ArrowUp" ? "last" : "first";
        positionMenu();
        menu.current?.showPopover();
        requestAnimationFrame(() => {
          const items = menu.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not(:disabled)');
          (preferredFocus.current === "last" ? items?.[items.length - 1] : items?.[0])?.focus();
        });
      }
    }}>
      <span className="admin-avatar" aria-hidden="true">{adminInitials(admin.name)}</span>
      <span className="admin-profile-trigger-copy"><span>{admin.name}</span><span>Administrator</span></span>
      <LuChevronDown aria-hidden="true" className={`size-3.5 shrink-0 text-subtle transition ${open ? "rotate-180" : ""}`} />
    </button>
    <div ref={menu} id={id} popover="auto" role="menu" aria-label="Administrator account" className="admin-profile-menu" onKeyDown={menuKeys} onToggle={(event) => {
      const visible = event.newState === "open";
      setOpen(visible);
      if (visible) requestAnimationFrame(() => {
        const items = menu.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not(:disabled)');
        (preferredFocus.current === "last" ? items?.[items.length - 1] : items?.[0])?.focus();
      });
    }} onBlur={(event) => {
      if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node) && event.relatedTarget !== trigger.current) menu.current?.hidePopover();
    }}>
      <div className="admin-profile-menu-heading"><span className="admin-avatar" aria-hidden="true">{adminInitials(admin.name)}</span><div className="min-w-0"><p className="truncate text-sm font-semibold text-fg">{admin.name}</p>{admin.email && <p className="mt-1 truncate text-xs text-muted">{admin.email}</p>}<p className="mt-2 inline-flex items-center gap-1 text-[0.65rem] font-medium text-accent"><LuShieldCheck aria-hidden="true" className="size-3" />Administrator</p></div></div>
      <div className="p-1.5">
        <Link href="/admin/profile" role="menuitem" tabIndex={-1} onClick={() => menu.current?.hidePopover()} className="admin-profile-menu-item"><LuUserRound aria-hidden="true" />My account</Link>
        <Link href="/admin/settings" role="menuitem" tabIndex={-1} onClick={() => menu.current?.hidePopover()} className="admin-profile-menu-item"><LuSettings aria-hidden="true" />Site settings</Link>
        <Link href="/" target="_blank" role="menuitem" tabIndex={-1} onClick={() => menu.current?.hidePopover()} className="admin-profile-menu-item"><LuExternalLink aria-hidden="true" />View portfolio<span className="sr-only"> (opens in a new tab)</span></Link>
      </div>
      <div className="border-t border-line p-1.5"><button type="button" role="menuitem" tabIndex={-1} disabled={loggingOut} onClick={async () => { menu.current?.hidePopover(); await onLogout(); }} className="admin-profile-menu-item text-danger"><LuLogOut aria-hidden="true" />{loggingOut ? "Signing out…" : "Sign out"}</button></div>
    </div>
  </>;
}
