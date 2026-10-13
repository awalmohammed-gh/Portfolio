import { FaArrowRight } from "react-icons/fa6";
import ProjectCard from "@/components/projects/ProjectCard";
import ButtonLink from "@/components/ui/ButtonLink";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { featuredProjects, projects } from "@/data/projects";

export default function FeaturedProjects() {
  return (
    <section aria-labelledby="featured-projects" className="py-20">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            id="featured-projects"
            eyebrow="Featured work"
            title="Full-stack projects"
            description="Systems that combine frontend interfaces, backend functionality, and data management."
          />
          <ButtonLink href="/projects" variant="secondary" className="reveal shrink-0">
            All {projects.length} projects <FaArrowRight aria-hidden className="size-3" />
          </ButtonLink>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Container>
    </section>
  );
}
