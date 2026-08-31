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
  /** Alt text for the preview image on the shelf. */
  previewAlt: string;
  /** How the article describes its own look — shown as the card's footnote. */
  system: string;
};

export const WRITINGS: Writing[] = [
  {
    slug: "the-serving-network",
    title: "The Serving Network",
    dek: "A production LLM server, drawn as a transit map — four endpoints, eleven Python files, and a scheduler you can rewire and re-run in the page.",
    date: "2026-08-31",
    readTime: "~45 min",
    tags: ["LLM serving", "batching", "vLLM"],
    previewAlt:
      "The Serving Network: signage type on off-white paper, four coloured routes threading through the stations of an inference server",
    system: "transit map · signage type, roundels, coloured lines",
  },
  {
    slug: "the-gemm-scrapbook",
    title: "The GEMM Scrapbook",
    dek: "One matrix multiply, seven CUDA kernels, and a 70× speedup — documented like a road trip, with the wrong turns left in.",
    date: "2026-08-29",
    readTime: "~35 min",
    tags: ["CUDA", "GPU", "performance"],
    previewAlt:
      "The GEMM Scrapbook: grid paper, the title in red pen, and a bar chart of seven CUDA kernels climbing from 1.3% to 93.7% of cuBLAS",
    system: "engineering notebook · grid paper, red pen, highlighter",
  },
];

/** Kept in one place — the feed and the sitemap need absolute URLs. */
export const SITE_URL = "https://iamartyaa.github.io";

/** Empty on a user site, "/<repo>" on a project site — set by the workflow. */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const href = (w: Writing) => `${BASE_PATH}/writings/${w.slug}/`;

/** The article's own share card, which doubles as its preview on the shelf. */
export const preview = (w: Writing) => `${BASE_PATH}/writings/${w.slug}/og.png`;

export const articleUrl = (w: Writing) => `${SITE_URL}/writings/${w.slug}/`;

export const readableDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
