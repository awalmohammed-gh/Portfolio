import Image from "next/image";
import Link from "next/link";
import { LuArrowLeft, LuCheck } from "react-icons/lu";
import Container from "@/components/ui/Container";
import { splitParagraphs } from "@/lib/format";
import type { Project } from "@/types/project";
import { FullStackTag, StatusTag, TechList } from "./ProjectMeta";
import ProjectLinks from "./ProjectLinks";
import ProjectRoles from "./ProjectRoles";
import ProjectVisual from "./ProjectVisual";

/** Full project write-up: used by /projects/[slug] and the admin preview. */
export default function ProjectDetail({ project }: { project: Project }) {
  const paragraphs = splitParagraphs(project.content);

  return (
    <article className="relative">
      <div data-local-page-backdrop className="bg-glow pointer-events-none absolute inset-x-0 top-0 h-[480px]" aria-hidden="true" />
      <Container className="relative pt-10 pb-16 sm:pt-14 sm:pb-24">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-fg"
        >
          <LuArrowLeft aria-hidden="true" className="size-4" />
          All projects
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <div className="flex flex-wrap items-center gap-2">
              <FullStackTag />
              <StatusTag status={project.status} />
            </div>
            <p className="mt-5 font-mono text-xs font-medium tracking-[0.12em] text-accent uppercase">
              {project.category}
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-balance text-fg sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted">{project.description}</p>

            {project.technologies.length > 0 && (
              <div className="mt-6">
                <TechList technologies={project.technologies} />
              </div>
            )}
            <div className="mt-7">
              <ProjectLinks project={project} size="md" />
            </div>
          </div>

          <div className="lg:col-span-7">
            <ProjectVisual project={project} sizes="(min-width: 1024px) 720px, 92vw" />
          </div>
        </div>

        {(paragraphs.length > 0 || project.keyAreas.length > 0) && (
          <div className="mt-14 grid gap-10 lg:grid-cols-12">
            {paragraphs.length > 0 && (
              <div className="space-y-5 text-base leading-8 text-muted sm:text-lg lg:col-span-7">
                {paragraphs.map((paragraph, index) => (
                  <p key={index} className="whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
            {project.keyAreas.length > 0 && (
              <div className={paragraphs.length > 0 ? "lg:col-span-5" : "lg:col-span-12"}>
                <div className="rounded-3xl border border-line bg-surface p-6 shadow-card sm:p-8">
                  <p className="font-mono text-xs font-medium tracking-[0.14em] text-subtle uppercase">
                    Key areas
                  </p>
                  <ul className="mt-4 grid gap-2.5">
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
              </div>
            )}
          </div>
        )}

        {project.roles.length > 0 && (
          <div className="mt-12">
            <ProjectRoles roles={project.roles} />
          </div>
        )}

        {project.screenshots.length > 0 && (
          <section aria-labelledby="screenshots-heading" className="mt-14">
            <h2 id="screenshots-heading" className="text-2xl font-semibold tracking-tight text-fg">
              Screenshots
            </h2>
            <ul className="mt-6 grid gap-5 md:grid-cols-2">
              {project.screenshots.map((shot, index) => (
                <li
                  key={`${shot.url}-${index}`}
                  className="reveal overflow-hidden rounded-2xl border border-line bg-surface shadow-card"
                >
                  <a href={shot.url} target="_blank" rel="noopener noreferrer" className="block">
                    <Image
                      src={shot.url}
                      alt={shot.alt || `${project.title} screenshot ${index + 1}`}
                      width={shot.width ?? 1600}
                      height={shot.height ?? 900}
                      sizes="(min-width: 768px) 46vw, 92vw"
                      className="h-auto w-full"
                    />
                    <span className="sr-only"> (opens full size in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </Container>
    </article>
  );
}
