import "server-only";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/public";

/** Per-page metadata from editable SEO fields; canonical links only when a site URL is set. */
export async function pageMetadata(
  path: string,
  seo: { title?: string; description?: string } = {},
): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    ...(seo.title ? { title: seo.title } : {}),
    ...(seo.description ? { description: seo.description } : {}),
    ...(settings.canonicalUrl ? { alternates: { canonical: path } } : {}),
  };
}
