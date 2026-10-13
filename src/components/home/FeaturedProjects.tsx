import { LuArrowRight } from "react-icons/lu";
import ProjectCard from "@/components/projects/ProjectCard";
import ButtonLink from "@/components/ui/ButtonLink";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { featuredProjects, projects } from "@/data/projects";

export default function FeaturedProjects() {
  return (
    <section aria-labelledby="featured-projects" className="py-16 sm:py-24">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            id="featured-projects"
            eyebrow="Selected work"
            title="Full-stack projects"
            description="Systems that combine frontend interfaces, backend functionality, and data management."
          />
          <ButtonLink href="/projects" variant="secondary" className="reveal self-start md:self-auto">
            All {projects.length} projects
            <LuArrowRight
              aria-hidden="true"
              className="size-4 transition group-hover/button:translate-x-0.5"
            />
          </ButtonLink>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Container>
    </section>
  );
}
