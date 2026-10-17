import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SectionForm } from "@/components/admin/ContentForms";
import { contentEditors } from "@/components/admin/content-config";
import { AdminPageHeader, FormSkeleton } from "@/components/admin/ui";
import { getSectionContent, listSkillCategories, listSkills } from "@/lib/data/admin";
import { isContentSection } from "@/lib/validations/content";

export const metadata = { title: "Edit content" };

export default function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <Editor params={params} />
    </Suspense>
  );
}

async function Editor({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!isContentSection(section) || !contentEditors[section]) notFound();
  const editor = contentEditors[section];

  const [{ data, updatedAt }, skills, categories] = await Promise.all([
    getSectionContent(section),
    listSkills(),
    listSkillCategories(),
  ]);

  return (
    <>
      <AdminPageHeader
        title={editor.label}
        description={editor.description}
        crumbs={[{ label: "Page Content", href: "/admin/content" }, { label: editor.label }]}
      />
      <SectionForm
        key={updatedAt}
        section={section}
        data={data as Record<string, unknown>}
        updatedAt={updatedAt}
        options={{
          skillNames: skills.map((s) => ({ value: s.name, label: s.name })),
          categoryTitles: categories.map((c) => ({ value: c.title, label: c.title })),
        }}
      />
    </>
  );
}
