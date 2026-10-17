import type { MetadataRoute } from "next";
import { getPublishedProjects, getSiteSettings } from "@/lib/data/public";
import { navLinks } from "@/lib/navigation";

/** Lists public pages and published projects. Needs the canonical site URL from Site Settings. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, projects] = await Promise.all([getSiteSettings(), getPublishedProjects()]);
  if (!settings.canonicalUrl) return [];
  const base = settings.canonicalUrl.replace(/\/+$/, "");

  return [
    ...navLinks.map(({ href }) => ({ url: `${base}${href === "/" ? "" : href}` })),
    ...projects.map((project) => ({ url: `${base}/projects/${project.slug}` })),
  ];
}
