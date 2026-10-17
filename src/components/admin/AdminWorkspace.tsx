"use client";

import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import AdminNav from "./AdminNav";

export type WorkspaceAdmin = { name: string; email: string };

/** Next page changes should start at the top of the pane, while editor anchors
 * and same-page filter changes retain their native scrolling behavior. */
function ScrollOnNavigate({ viewport }: { viewport: RefObject<HTMLDivElement | null> }) {
  const pathname = usePathname();
  useEffect(() => {
    if (!window.location.hash) viewport.current?.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, viewport]);
  return null;
}

export default function AdminWorkspace({ children, admin = { name: "Administrator", email: "" }, initialCollapsed = false }: {
  children: ReactNode;
  admin?: WorkspaceAdmin;
  initialCollapsed?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const viewport = useRef<HTMLDivElement>(null);
  function toggleSidebar() {
    const next = !collapsed;
    setCollapsed(next);
    document.cookie = `admin_sidebar=${next ? "collapsed" : "expanded"}; path=/admin; max-age=31536000; samesite=lax`;
  }
  return <div className="admin-workspace" data-sidebar={collapsed ? "collapsed" : "expanded"}>
    <a href="#main" className="admin-skip-link">Skip to content</a>
    <AdminNav admin={admin} collapsed={collapsed} onToggleSidebar={toggleSidebar} />
    <div ref={viewport} className="admin-main">
      <Suspense fallback={null}><ScrollOnNavigate viewport={viewport} /></Suspense>
      <main id="main" tabIndex={-1} className="admin-outlet">{children}</main>
      <footer className="admin-footer"><span>Portfolio workspace</span><span>Your content, your story.</span></footer>
    </div>
  </div>;
}
