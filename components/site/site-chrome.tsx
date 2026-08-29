"use client";

import { usePathname } from "next/navigation";

import { ScrollProgress } from "@/components/motion/scroll-progress";
import { SiteNav } from "@/components/site/site-nav";

/**
 * The site's own furniture — the sticker nav and the blue progress bar.
 *
 * An article is allowed to be a different website. Every route under
 * /writing/<slug> therefore gets NO site chrome at all: it brings its own
 * header, its own progress indicator and its own background, and the only
 * thing it shares with the rest of the site is the way back. The index at
 * /writing keeps the chrome, because that page belongs to the desk.
 */
export function SiteChrome() {
  const pathname = usePathname() ?? "/";
  const insideArticle = /^\/writing\/[^/]+/.test(pathname);

  if (insideArticle) return null;

  return (
    <>
      <ScrollProgress className="bg-blue" height={3} />
      <SiteNav />
    </>
  );
}
