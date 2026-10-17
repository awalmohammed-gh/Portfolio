import type { Metadata } from "next";
import { Suspense } from "react";
import { PasswordForm, ProfileForm, SessionList } from "@/components/admin/ProfileForms";
import { AdminPageHeader, CardsSkeleton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth/guard";
import { listSessions } from "@/lib/data/admin";
import { LuShieldCheck } from "react-icons/lu";
import { StatusBadge } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <>
      <AdminPageHeader
        title="Profile"
        description="Your sign-in details, password and active sessions."
        crumbs={[{ label: "Profile" }]}
      />
      <Suspense fallback={<CardsSkeleton count={2} />}>
        <Account />
      </Suspense>
    </>
  );
}

async function Account() {
  const [admin, sessions] = await Promise.all([requireAdmin(), listSessions()]);
  return (
    <div className="space-y-6">
      <section className="admin-account-identity admin-panel" aria-label="Account identity"><span className="admin-account-avatar" aria-hidden="true">{admin.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}</span><div className="min-w-0 flex-1"><p className="admin-page-kicker">Your account</p><h2 className="truncate text-base font-semibold text-fg">{admin.name}</h2><p className="mt-1 truncate text-xs text-muted">{admin.email}</p></div><StatusBadge tone="accent"><LuShieldCheck aria-hidden="true" className="size-3" />Administrator</StatusBadge></section>
      <div className="admin-content-grid">
        <ProfileForm key={`${admin.name}-${admin.email}`} name={admin.name} email={admin.email} />
        <PasswordForm />
      </div>
      <SessionList sessions={sessions} />
    </div>
  );
}
