import { LuCheck } from "react-icons/lu";
import type { Project } from "@/types/project";
import { FullStackTag, StatusTag, TechList } from "./ProjectMeta";
import ProjectLinks from "./ProjectLinks";
import ProjectRoles from "./ProjectRoles";
import ProjectVisual from "./ProjectVisual";

/** Full-width project case with every detail visible (no hidden disclosures). */
export default function FeaturedProjectCard({
  project,
  index,
  reverse = false,
}: {
  project: Project;
  index: number;
  reverse?: boolean;
}) {
  return (
    <article
      id={project.slug}
      className="group reveal scroll-mt-28 rounded-4xl border border-line bg-surface p-3 shadow-card sm:p-4"
    >
      <div className="grid gap-6 lg:grid-cols-2 lg:items-center lg:gap-10">
        <div className={reverse ? "lg:order-last" : ""}>
          <ProjectVisual project={project} sizes="(min-width: 1320px) 620px, 92vw" />
        </div>

        <div className="px-3 pb-4 sm:px-4 lg:py-6 lg:pr-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm text-subtle">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="h-px w-6 bg-line" aria-hidden="true" />
            <FullStackTag />
            <StatusTag status={project.status} />
          </div>

          <p className="mt-5 font-mono text-xs font-medium tracking-[0.12em] text-accent uppercase">
            {project.category}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-balance text-fg sm:text-3xl">
            {project.title}
          </h2>
          <p className="mt-4 text-base leading-7 text-muted">{project.description}</p>

          {project.keyAreas.length > 0 && (
            <div className="mt-6">
              <p className="font-mono text-xs font-medium tracking-[0.14em] text-subtle uppercase">
                Key areas
              </p>
              <ul className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {project.keyAreas.map((area) => (
                  <li key={area} className="flex items-start gap-2.5 text-[0.95rem] text-fg">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                      <LuCheck aria-hidden="true" className="size-3" />
                    </span>
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.technologies.length > 0 && (
            <div className="mt-6">
              <TechList technologies={project.technologies} />
            </div>
          )}

          <div className="mt-7">
            <ProjectLinks project={project} size="md" />
          </div>
        </div>
      </div>

      {project.roles && (
        <div className="mt-2 px-3 pb-4 sm:px-4 lg:mt-6">
          <ProjectRoles roles={project.roles} />
        </div>
      )}
    </article>
  );
}
