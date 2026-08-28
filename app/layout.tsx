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

export const metadata: Metadata = {
  metadataBase: new URL("https://iamartyaa.github.io"),
  title: "Amartya Yadav — I make things",
  description:
    "Software engineer in Bengaluru. Workforce tools that fifteen thousand people open every morning, AI agents that do the boring half, and long notes about how things work.",
  openGraph: {
    title: "Amartya Yadav — I make things",
    description:
      "Software engineer in Bengaluru. Workforce tools, AI agents, and long notes about how things work.",
    type: "website",
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
