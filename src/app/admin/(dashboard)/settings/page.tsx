import type { Metadata } from "next";
import { Suspense } from "react";
import { SettingsForm } from "@/components/admin/ContentForms";
import { AdminPageHeader, FormSkeleton } from "@/components/admin/ui";
import { getSettingsForAdmin } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Site Settings" };

export default function SettingsPage() {
  return (
    <>
      <AdminPageHeader
        title="Site Settings"
        description="Your name, logo, contact details, social links and search engine defaults. Used across every page."
        crumbs={[{ label: "Site Settings" }]}
      />
      <Suspense fallback={<FormSkeleton />}>
        <Settings />
      </Suspense>
    </>
  );
}

async function Settings() {
  const { updatedAt, ...settings } = await getSettingsForAdmin();
  return <SettingsForm key={updatedAt} data={settings} />;
}
