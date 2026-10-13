import type { Project } from "@/types/project";
import { FullStackTag, StatusTag, TechList } from "./ProjectMeta";
import ProjectLinks from "./ProjectLinks";
import ProjectVisual from "./ProjectVisual";

/** Compact, equal-height card used in grids. */
export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group reveal flex h-full flex-col rounded-2xl bg-navy-900/70 p-4 ring-1 ring-white/5 transition hover:-translate-y-1 hover:ring-accent/30">
      <ProjectVisual project={project} sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw" />

      <div className="flex flex-1 flex-col px-1 pt-5 pb-1">
        <div className="flex flex-wrap items-center gap-2">
          <FullStackTag />
          <StatusTag status={project.status} />
        </div>

        <p className="mt-4 font-mono text-xs text-accent">{project.category}</p>
        <h3 className="mt-1 text-lg font-semibold text-ink">{project.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">{project.summary}</p>

        {project.roles && (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="User roles">
            {project.roles.map(({ name, icon: Icon }) => (
              <li
                key={name}
                className="inline-flex items-center gap-1.5 rounded-md bg-navy-800 px-2 py-1 text-[11px] text-ink-muted"
              >
                <Icon aria-hidden className="size-3 text-accent" />
                {name}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4">
          <TechList technologies={project.technologies} />
        </div>

        <div className="mt-auto pt-5">
          <ProjectLinks project={project} />
        </div>
      </div>
    </article>
  );
}
