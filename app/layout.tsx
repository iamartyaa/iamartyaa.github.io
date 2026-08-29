import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

import { ScrollProgress } from "@/components/motion/scroll-progress";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { SiteNav } from "@/components/site/site-nav";

import "./globals.css";

/**
 * Type is self-hosted (variable woff2, latin subset) rather than fetched from
 * Google at build time: one less network dependency, no FOUT, and the display
 * face is the loudest thing on the page — it must not arrive late.
 */
const bricolage = localFont({
  src: "./fonts/bricolage-grotesque.woff2",
  variable: "--font-bricolage",
  weight: "200 800",
  display: "swap",
});

const instrument = localFont({
  src: "./fonts/instrument-sans.woff2",
  variable: "--font-instrument",
  weight: "400 700",
  display: "swap",
});

const shantell = localFont({
  src: "./fonts/shantell-sans.woff2",
  variable: "--font-shantell",
  weight: "300 800",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/geist-mono.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

/** Empty on a user site, "/<repo>" on a project site — set by the deploy workflow. */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL("https://iamartyaa.github.io"),
  title: "Amartya Yadav — I make things",
  description:
    "Software engineer in Bengaluru. Workforce tools that fifteen thousand people open every morning, AI agents that do the boring half, and long notes about how things work.",
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": `${BASE_PATH}/feed.xml` },
  },
  openGraph: {
    title: "Amartya Yadav — I make things",
    description:
      "Software engineer in Bengaluru. Workforce tools, AI agents, and long notes about how things work.",
    type: "website",
    url: "/",
    siteName: "Amartya Yadav",
    images: [
      {
        // Drawn in the site's own design system (paper, route, stickers) and
        // rasterised at 1200x630 — the card is the first frame of the site.
        url: `${BASE_PATH}/og.png`,
        width: 1200,
        height: 630,
        alt: "Amartya Yadav — I make things, and keep the desk a little messy.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Amartya Yadav — I make things",
    description:
      "Software engineer in Bengaluru. Workforce tools, AI agents, and long notes about how things work.",
    images: [`${BASE_PATH}/og.png`],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${instrument.variable} ${shantell.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-paper text-ink antialiased">
        <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {/* Lenis drives every scroll-linked effect on the site; one instance, at the root. */}
          <SmoothScroll lerp={0.09} duration={1.25}>
            <ScrollProgress className="bg-blue" height={3} />
            <SiteNav />
            <main>{children}</main>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
