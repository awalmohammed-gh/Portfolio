import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/data/public";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();
  const base = settings.canonicalUrl.replace(/\/+$/, "");
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    ...(base ? { sitemap: `${base}/sitemap.xml` } : {}),
  };
}
