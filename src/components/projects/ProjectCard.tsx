import Link from "next/link";
import { LuArrowUpRight } from "react-icons/lu";
import type { Project } from "@/types/project";
import { StatusTag } from "./ProjectMeta";
import ProjectLinks from "./ProjectLinks";
import ProjectVisual from "./ProjectVisual";

/** Compact, equal-height card for project grids. */
export default function ProjectCard({ project }: { project: Project }) {
  const detailsHref = `/projects#${project.slug}`;

  return (
    <article className="group reveal flex h-full flex-col rounded-3xl border border-line bg-surface p-3 shadow-card transition hover:border-line-strong">
      <Link href={detailsHref} tabIndex={-1} aria-hidden="true">
        <ProjectVisual
          project={project}
          sizes="(min-width: 1320px) 620px, (min-width: 768px) 46vw, 92vw"
        />
      </Link>

      <div className="flex flex-1 flex-col px-3 pt-5 pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-xs font-medium tracking-[0.12em] text-accent uppercase">
            {project.category}
          </p>
          <StatusTag status={project.status} />
        </div>

        <h3 className="mt-3 text-xl font-semibold tracking-tight text-fg sm:text-2xl">
          <Link href={detailsHref} className="rounded-md hover:text-accent">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2.5 text-[0.95rem] leading-7 text-muted">{project.summary}</p>

        {project.roles && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="User roles">
            {project.roles.map(({ name, icon: Icon }) => (
              <li
                key={name}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3 py-1 text-sm text-fg"
              >
                <Icon aria-hidden="true" className="size-3.5 text-accent" />
                {name}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
          <ProjectLinks project={project} />
          <Link
            href={detailsHref}
            className="group/details inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-fg"
          >
            Details
            <LuArrowUpRight
              aria-hidden="true"
              className="size-4 transition group-hover/details:translate-x-0.5 group-hover/details:-translate-y-0.5"
            />
            <span className="sr-only">: {project.title}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
