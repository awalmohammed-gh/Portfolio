import { LuArrowRight } from "react-icons/lu";
import ProjectCard from "@/components/projects/ProjectCard";
import ButtonLink from "@/components/ui/ButtonLink";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { getContent, getPublishedProjects } from "@/lib/data/public";
import { fill } from "@/lib/format";

export default async function FeaturedProjects() {
  const [projects, home] = await Promise.all([getPublishedProjects(), getContent("home")]);
  const featuredProjects = projects.filter((p) => p.featured);
  const copy = home.featuredProjects;

  if (featuredProjects.length === 0) return null;

  return (
    <section aria-labelledby="featured-projects" className="py-16 sm:py-24">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            id="featured-projects"
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={copy.description}
          />
          <ButtonLink href="/projects" variant="secondary" className="reveal self-start md:self-auto">
            {fill(copy.buttonLabel || "All {count} projects", { count: projects.length })}
            <LuArrowRight
              aria-hidden="true"
              className="size-4 transition group-hover/button:translate-x-0.5"
            />
          </ButtonLink>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </Container>
    </section>
  );
}
