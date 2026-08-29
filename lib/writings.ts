/**
 * THE WRITING SHELF.
 *
 * Every piece here is a whole page of its own, built in its own design system
 * — its own type, palette, motion and physics — and served verbatim from
 * `public/writings/<slug>/`. Nothing in the site's own design system leaks
 * into an article, and nothing in an article leaks out.
 *
 * The card on /writings is therefore not a generic list item: each one wears a
 * specimen of that article's world, so the index reads as a shelf of different
 * objects rather than a blog roll. Adding a piece = drop the standalone HTML
 * into public/writings/<slug>/index.html, add a row here, and draw its
 * specimen in components/site/specimens.tsx.
 */

export type Writing = {
  slug: string;
  title: string;
  /** The one-line pitch on the card. */
  dek: string;
  /** ISO date, published. */
  date: string;
  readTime: string;
  tags: string[];
  /** Which specimen to draw on the sticker. */
  specimen: "gemm";
  /** How the article describes its own look — shown as the card's footnote. */
  system: string;
};

export const WRITINGS: Writing[] = [
  {
    slug: "the-gemm-scrapbook",
    title: "The GEMM Scrapbook",
    dek: "One matrix multiply, seven CUDA kernels, and a 70× speedup — documented like a road trip, with the wrong turns left in.",
    date: "2026-08-29",
    readTime: "~35 min",
    tags: ["CUDA", "GPU", "performance"],
    specimen: "gemm",
    system: "engineering notebook · grid paper, red pen, highlighter",
  },
];

/** Kept in one place — the feed and the sitemap need absolute URLs. */
export const SITE_URL = "https://iamartyaa.github.io";

export const href = (w: Writing) => `/writings/${w.slug}/`;

export const articleUrl = (w: Writing) => `${SITE_URL}${href(w)}`;

export const readableDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
