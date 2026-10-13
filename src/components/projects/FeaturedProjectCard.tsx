import { FaCheck } from "react-icons/fa6";
import type { Project } from "@/types/project";
import { FullStackTag, StatusTag, TechList } from "./ProjectMeta";
import ProjectLinks from "./ProjectLinks";
import ProjectRoles from "./ProjectRoles";
import ProjectVisual from "./ProjectVisual";

/** Wide, detailed card for the most important projects. */
export default function FeaturedProjectCard({
  project,
  reverse = false,
}: {
  project: Project;
  reverse?: boolean;
}) {
  return (
    <article className="group reveal grid gap-6 rounded-3xl bg-navy-900/70 p-4 ring-1 ring-white/5 transition hover:ring-accent/30 sm:p-6 lg:grid-cols-12 lg:gap-10 lg:p-8">
      <div className={`lg:col-span-5 lg:self-center ${reverse ? "lg:order-last" : ""}`}>
        <ProjectVisual project={project} sizes="(min-width: 1024px) 440px, 100vw" />
      </div>

      <div className="flex flex-col lg:col-span-7">
        <div className="flex flex-wrap items-center gap-2">
          <FullStackTag />
          <StatusTag status={project.status} />
        </div>

        <p className="mt-5 font-mono text-xs text-accent">{project.category}</p>
        <h3 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {project.title}
        </h3>
        <p className="mt-3 leading-relaxed text-ink-muted">{project.description}</p>

        {project.keyAreas.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-semibold tracking-wider text-ink-subtle uppercase">
              Key areas
            </p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {project.keyAreas.map((area) => (
                <li key={area} className="flex items-start gap-2 text-sm text-ink-muted">
                  <FaCheck aria-hidden className="mt-1 size-3 shrink-0 text-accent" />
                  {area}
                </li>
              ))}
            </ul>
          </div>
        )}

        {project.roles && (
          <div className="mt-6">
            <ProjectRoles roles={project.roles} />
          </div>
        )}

        {project.technologies.length > 0 && (
          <div className="mt-6">
            <TechList technologies={project.technologies} />
          </div>
        )}

        <div className="mt-auto pt-6">
          <ProjectLinks project={project} size="md" />
        </div>
      </div>
    </article>
  );
}
