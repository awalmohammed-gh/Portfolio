import { notFound } from "next/navigation";
import ProjectDetail from "@/components/projects/ProjectDetail";
import CallToAction from "@/components/ui/CallToAction";
import { getContent, getPublishedProjectBySlug, getPublishedProjects } from "@/lib/data/public";
import { pageMetadata } from "@/lib/metadata";

/*
 * Projects published after a deploy are rendered on their first request.
 * 'navigation' makes that request wait for the complete static page instead
 * of serving a shared App Shell, so new slugs show the right project and
 * unknown or draft slugs return a real 404. All data here is cached.
 */
export const ensureStatic = "navigation";

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  // Cache Components needs at least one param to validate the route at build time.
  return projects.length > 0 ? projects.map(({ slug }) => ({ slug })) : [{ slug: "__placeholder__" }];
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) return {};
  const metadata = await pageMetadata(`/projects/${project.slug}`, {
    title: project.title,
    description: project.summary,
  });
  return project.coverImage
    ? { ...metadata, openGraph: { title: project.title, description: project.summary, images: [project.coverImage.url] } }
    : metadata;
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const [project, copy] = await Promise.all([getPublishedProjectBySlug(slug), getContent("projects")]);
  if (!project) notFound();

  return (
    <>
      <ProjectDetail project={project} />
      <CallToAction title={copy.cta.title || undefined} description={copy.cta.description || undefined} />
    </>
  );
}
