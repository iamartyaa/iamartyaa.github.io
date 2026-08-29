/**
 * THE REGISTRY.
 *
 * One entry per article. Everything that is *about* an article lives here —
 * the index page, the sitemap, the RSS feed, the JSON-LD and the "next one"
 * links all read from this list, so publishing is a matter of adding a route
 * and an entry, and nothing gets forgotten.
 *
 * `accent` is that article's own signature colour: the index card is painted
 * in it, so the shelf of cards already shows the range of design systems
 * behind them.
 */

export type Article = {
  slug: string;
  title: string;
  /** The one-line promise, used on the card, in <meta>, and in the feed. */
  dek: string;
  /** ISO date — publication. */
  date: string;
  updated?: string;
  /** Minutes, honest: measured from the rendered word count, not guessed. */
  minutes: number;
  tags: string[];
  /** How the piece is built and what it demonstrates — shown on the card. */
  system: string;
  accent: { bg: string; fg: string; line: string; label: string };
  /** Absolute-ish path to the OG card drawn in that article's own system. */
  ogImage: string;
  draft?: boolean;
};

export const ARTICLES: Article[] = [
  {
    slug: "gemm-scrapbook",
    title: "The GEMM Scrapbook",
    dek: "How a matrix multiply gets from textbook-naive to something a GPU is not embarrassed by — memory hierarchy, tiling, tensor cores, and the arithmetic that explains every one of those steps.",
    date: "2026-08-29",
    minutes: 18,
    tags: ["CUDA", "GPU", "Inference", "Kernels"],
    system: "Instrument panel — near-black, monospace figures, hand-drawn SVG diagrams, a tile walk you can drive",
    accent: { bg: "#070a0e", fg: "#e6edf3", line: "#1c2731", label: "#ffb454" },
    ogImage: "/og/gemm-scrapbook.png",
  },
];

export const PUBLISHED = ARTICLES.filter((a) => !a.draft);

export function articleBySlug(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}

/** Site URL, kept in one place — the feed and the sitemap need it absolute. */
export const SITE_URL = "https://iamartyaa.github.io";

export function articleUrl(a: Article) {
  return `${SITE_URL}/writing/${a.slug}/`;
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
