import { SITE_URL, WRITINGS, articleUrl } from "@/lib/writings";

/**
 * RSS 2.0, generated at build time (static export can serve a route handler as
 * long as it is fully static). Small enough to write by hand, and hand-writing
 * it means no feed library in the bundle.
 */
export const dynamic = "force-static";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const items = WRITINGS.map(
    (a) => `    <item>
      <title>${escape(a.title)}</title>
      <link>${articleUrl(a)}</link>
      <guid isPermaLink="true">${articleUrl(a)}</guid>
      <pubDate>${new Date(`${a.date}T09:00:00Z`).toUTCString()}</pubDate>
      <description>${escape(a.dek)}</description>
      ${a.tags.map((t) => `<category>${escape(t)}</category>`).join("")}
    </item>`,
  ).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Amartya Yadav — Writings</title>
    <link>${SITE_URL}/writings/</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Long, illustrated notes on how things actually work. Every piece is built as its own page, in its own design system.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
