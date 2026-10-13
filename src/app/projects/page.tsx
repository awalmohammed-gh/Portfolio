import type { Metadata } from "next";
import FeaturedProjectCard from "@/components/projects/FeaturedProjectCard";
import ProjectCard from "@/components/projects/ProjectCard";
import CallToAction from "@/components/ui/CallToAction";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import { featuredProjects, otherProjects, projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Full-stack projects by Mohammed Awal: e-commerce, real estate, employee management, car rental, and learning management systems.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Full-stack software projects"
        description={`${projects.length} complete systems that bring together frontend interfaces, backend functionality, data management, and real business workflows.`}
      />

      <section aria-labelledby="featured" className="py-20">
        <Container>
          <SectionHeading
            id="featured"
            eyebrow="Featured"
            title="Key projects"
            description="My most substantial systems, each with multiple user types and administrative workflows."
          />
          <div className="mt-12 space-y-8">
            {featuredProjects.map((project, index) => (
              <FeaturedProjectCard key={project.slug} project={project} reverse={index % 2 === 1} />
            ))}
          </div>
        </Container>
      </section>

      {otherProjects.length > 0 && (
        <section aria-labelledby="more-projects" className="border-t border-white/5 bg-navy-900/40 py-20">
          <Container>
            <SectionHeading id="more-projects" eyebrow="More work" title="Other full-stack projects" />
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {otherProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <CallToAction
        title="Want something similar built?"
        description="I can build systems like these for your business, from the interface to the backend and database."
      />
    </>
  );
}
