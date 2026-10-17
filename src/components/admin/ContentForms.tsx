"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LuExternalLink } from "react-icons/lu";
import { contentEditors, settingsFields } from "./content-config";
import SchemaForm from "./form/SchemaForm";
import { buttonClass } from "./form/styles";
import type { DynamicOptions, FormValues } from "./form/types";
import { formatDate } from "./ui";

export function SectionForm({
  section,
  data,
  updatedAt,
  options,
}: {
  section: string;
  data: FormValues;
  updatedAt: string;
  options: DynamicOptions;
}) {
  const router = useRouter();
  const editor = contentEditors[section];
  return (
    <SchemaForm
      fields={editor.fields}
      initialValues={data}
      options={options}
      action={{ url: `/api/content/${section}`, method: "PATCH" }}
      successMessage="Saved. The public site now shows this content."
      onSaved={() => router.refresh()}
      aside={
        <div className="admin-panel space-y-3 p-5 text-sm">
          <h2 className="text-xs font-semibold text-fg">On your portfolio</h2>
          {updatedAt && (
            <p className="text-xs text-muted">
              Last updated <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>
            </p>
          )}
          <Link href={editor.page} target="_blank" className={`${buttonClass.secondary} w-full`}>
            <LuExternalLink aria-hidden="true" className="size-4" />
            View page
          </Link>
          {["skills", "education", "experience", "projects", "services"].includes(section) && <Link href={`/admin/${section}`} className={`${buttonClass.ghost} w-full`}>Manage {section} records</Link>}
        </div>
      }
    />
  );
}

export function SettingsForm({ data }: { data: FormValues }) {
  const router = useRouter();
  return (
    <SchemaForm
      fields={settingsFields}
      initialValues={data}
      action={{ url: "/api/settings", method: "PATCH" }}
      successMessage="Settings saved."
      onSaved={() => router.refresh()}
    />
  );
}
