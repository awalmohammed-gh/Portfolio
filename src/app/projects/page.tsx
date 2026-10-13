import type { Metadata } from "next";
import FeaturedProjectCard from "@/components/projects/FeaturedProjectCard";
import CallToAction from "@/components/ui/CallToAction";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import { featuredProjects, otherProjects, projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Full-stack projects by Mohammed Awal: e-commerce, real estate, employee management, car rental, and learning management systems.",
};

const orderedProjects = [...featuredProjects, ...otherProjects];

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title={
          <>
            Full-stack software, <span className="text-gradient">built end to end.</span>
          </>
        }
        description={`${projects.length} complete systems that bring together frontend interfaces, backend functionality, data management, and real business workflows.`}
      >
        <nav aria-label="Jump to a project">
          <ul className="flex flex-wrap gap-2">
            {orderedProjects.map(({ slug, title, icon: Icon }) => (
              <li key={slug}>
                <a
                  href={`#${slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 text-sm text-fg shadow-card transition hover:border-line-strong"
                >
                  <Icon aria-hidden="true" className="size-3.5 text-accent" />
                  {title.replace(/ (System|Platform)$/, "")}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      <section aria-label="All projects" className="pb-8">
        <Container className="space-y-6">
          {orderedProjects.map((project, index) => (
            <FeaturedProjectCard
              key={project.slug}
              project={project}
              index={index}
              reverse={index % 2 === 1}
            />
          ))}
        </Container>
      </section>

      <CallToAction
        title="Want something similar built?"
        description="I can build systems like these for your business, from the interface to the backend and database."
      />
    </>
  );
}
