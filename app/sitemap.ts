import type { MetadataRoute } from "next";

import { PUBLISHED, SITE_URL, articleUrl } from "@/lib/articles";

/**
 * Static sitemap — generated at build time into out/sitemap.xml, which is what
 * `output: "export"` needs. Articles carry the highest priority because they
 * are the pages worth finding.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/things/", "/writing/", "/about/"].map((path) => ({
    url: `${SITE_URL}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const articles = PUBLISHED.map((a) => ({
    url: articleUrl(a),
    lastModified: new Date(a.updated ?? a.date),
    changeFrequency: "yearly" as const,
    priority: 0.9,
  }));

  return [...pages, ...articles];
}
