import FeaturedProjectCard from "@/components/projects/FeaturedProjectCard";
import CallToAction from "@/components/ui/CallToAction";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import PageHeader from "@/components/ui/PageHeader";
import { getContent, getPublishedProjects } from "@/lib/data/public";
import { fill } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const copy = await getContent("projects");
  return pageMetadata("/projects", copy.seo);
}

export default async function ProjectsPage() {
  const [projects, copy] = await Promise.all([getPublishedProjects(), getContent("projects")]);
  const orderedProjects = [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)];

  return (
    <>
      <PageHeader
        eyebrow={copy.header.eyebrow}
        title={
          <>
            {copy.header.title.lead} <span className="text-gradient">{copy.header.title.highlight}</span>
          </>
        }
        description={fill(copy.header.description, { count: projects.length })}
      >
        {orderedProjects.length > 0 && (
          <nav aria-label="Jump to a project">
            <ul className="flex flex-wrap gap-2">
              {orderedProjects.map(({ slug, title, icon }) => (
                <li key={slug}>
                  <a
                    href={`#${slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 text-sm text-fg shadow-card transition hover:border-line-strong"
                  >
                    <Icon name={icon} aria-hidden="true" className="size-3.5 text-accent" />
                    {title.replace(/ (System|Platform)$/, "")}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </PageHeader>

      <section aria-label="All projects" className="pb-8">
        <Container className="space-y-6">
          {orderedProjects.map((project, index) => (
            <FeaturedProjectCard
              key={project.id}
              project={project}
              index={index}
              reverse={index % 2 === 1}
            />
          ))}
        </Container>
      </section>

      <CallToAction title={copy.cta.title || undefined} description={copy.cta.description || undefined} />
    </>
  );
}
