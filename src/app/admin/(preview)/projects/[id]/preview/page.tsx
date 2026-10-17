import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LuArrowLeft } from "react-icons/lu";
import ProjectDetail from "@/components/projects/ProjectDetail";
import { getProject } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Preview" };

/** Admin-only preview of a project (including drafts) as it will look on the site. */
export default function ProjectPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="h-screen animate-pulse bg-surface-2" />}>
      <Preview params={params} />
    </Suspense>
  );
}

async function Preview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  return (
    <>
      <div className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 border-b border-warning/30 bg-warning-soft px-4 py-2.5 text-sm text-warning">
        <p>
          <strong className="font-semibold">Preview</strong> ·{" "}
          {project.publishStatus === "published"
            ? "This project is published."
            : "This draft is only visible to you."}
        </p>
        <Link href={`/admin/projects/${project.id}`} className="inline-flex items-center gap-1.5 font-medium hover:underline">
          <LuArrowLeft aria-hidden="true" className="size-4" />
          Back to editor
        </Link>
      </div>
      <ProjectDetail project={project} />
    </>
  );
}
