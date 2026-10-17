import { Suspense } from "react";
import { cookies } from "next/headers";
import AdminWorkspace from "@/components/admin/AdminWorkspace";
import { FeedbackProvider } from "@/components/admin/Feedback";
import NavigationGuard from "@/components/admin/NavigationGuard";
import { requireAdmin } from "@/lib/auth/guard";

/* Stream the authenticated identity and saved sidebar preference into one
 * shared client workspace. Pages retain their own server-side data guards. */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <FeedbackProvider>
      <NavigationGuard>
        <Suspense fallback={<WorkspaceSkeleton />}>
          <AuthenticatedWorkspace>{children}</AuthenticatedWorkspace>
        </Suspense>
      </NavigationGuard>
    </FeedbackProvider>
  );
}

function WorkspaceSkeleton() {
  return <div className="admin-workspace" aria-busy="true" aria-label="Loading workspace">
    <div className="admin-sidebar" aria-hidden="true"><div className="h-20 border-b border-line" /><div className="space-y-5 p-5">{Array.from({ length: 7 }, (_, index) => <div key={index} className="h-8 animate-pulse rounded-lg bg-surface-2" />)}</div></div>
    <div className="admin-topbar" aria-hidden="true"><div className="h-4 w-36 animate-pulse rounded bg-surface-2" /><div className="size-8 animate-pulse rounded-full bg-surface-2" /></div><div className="admin-main"><div className="admin-outlet" aria-hidden="true"><div className="mb-8 h-20 animate-pulse rounded-xl bg-surface-2" /><div className="h-80 animate-pulse rounded-xl border border-line bg-surface" /></div></div>
  </div>;
}

async function AuthenticatedWorkspace({ children }: { children: React.ReactNode }) {
  const [admin, cookieStore] = await Promise.all([requireAdmin(), cookies()]);
  return <AdminWorkspace admin={{ name: admin.name, email: admin.email }} initialCollapsed={cookieStore.get("admin_sidebar")?.value === "collapsed"}>{children}</AdminWorkspace>;
}
