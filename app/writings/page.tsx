import type { Metadata } from "next";

import { ArrowRight, Notebook, PaperPlane, Sparkle } from "@/components/art/cast";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { ArticleSticker } from "@/components/site/article-sticker";
import { HandNote, Stamp } from "@/components/site/hand-note";
import { Section, SectionHead } from "@/components/site/section";
import { Sticker } from "@/components/site/sticker";
import { WRITINGS } from "@/lib/writings";

/**
 * WRITINGS — the shelf.
 *
 * Every piece is a whole page in its own design system, served verbatim from
 * public/writings/<slug>/. This index is the only part in the site's own
 * system: one big die-cut sticker per article, each wearing a live specimen of
 * the world it opens into.
 */

export const metadata: Metadata = {
  title: "Writings — Amartya Yadav",
  description:
    "Long, illustrated notes on how things work. Every piece is built as its own page, in its own design system — starting with The GEMM Scrapbook: seven CUDA kernels and a 70× speedup.",
  alternates: { canonical: "/writings/" },
  openGraph: {
    title: "Writings — Amartya Yadav",
    description:
      "Long, illustrated notes on how things work. Every piece is its own page, in its own design system.",
    url: "/writings/",
    type: "website",
  },
};

const RULES = [
  {
    title: "One piece, one world",
    body: "Every article gets its own type, palette, motion and physics. Nothing from this site leaks in, and nothing from the article leaks out.",
    art: <Sparkle size={26} />,
  },
  {
    title: "Built, not templated",
    body: "Each one is hand-built HTML, CSS and JS — the diagrams are drawn on canvas, the charts run on real numbers, and it all ships as one file.",
    art: <Notebook size={26} />,
  },
  {
    title: "The wrong turns stay in",
    body: "Notes are written the way the work actually went: the dead ends, the thing that was slow, and why. That's the useful half.",
    art: <PaperPlane size={26} />,
  },
];

export default function WritingsPage() {
  return (
    <>
      {/* ─────────────────────────── HEADER ─────────────────────────── */}
      <Section className="relative pt-[9.5rem]">
        <div className="relative z-10 max-w-[46rem]">
          <p className="label">The shelf · stop 03</p>
          <h1 className="mt-4 font-display text-[clamp(3.6rem,8.4vw,7rem)] font-extrabold leading-[0.9] tracking-[-0.045em]">
            <TextReveal text={["Things I", "wrote down"]} split="char" stagger={0.024} blur={10} />
          </h1>
          <ScrollReveal y={14} blur={6} delay={0.5} amount={0.2}>
            <p className="mt-7 max-w-[33rem] text-[17px] leading-[1.7] text-ink-soft sm:text-[19px]">
              Long, illustrated notes about how something actually works — written while I was working
              it out. Each one is built as its own page, in its own design system, because a piece
              about GPU kernels should not look like a piece about anything else.
            </p>
          </ScrollReveal>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Stamp>peel one open</Stamp>
            <HandNote tilt={-2}>every sticker below opens a different-looking page ↓</HandNote>
          </div>
        </div>
      </Section>

      {/* ────────────────────────── THE STICKERS ────────────────────────── */}
      <Section className="relative mt-[4.5rem]">
        <div className="grid gap-x-10 gap-y-[6.5rem] xl:grid-cols-2">
          {WRITINGS.map((w, i) => (
            <ScrollReveal key={w.slug} delay={i * 0.08} y={30}>
              <ArticleSticker writing={w} index={i} />
            </ScrollReveal>
          ))}

          {/* the empty slot, same as the drawer on /things */}
          <ScrollReveal delay={0.14} y={30}>
            <div className="flex h-full min-h-[26rem] flex-col items-center justify-center rounded-[2.25rem] border-[3px] border-dashed border-hairline p-10 text-center">
              <PaperPlane size={128} />
              <p className="mt-6 font-display text-[26px] font-extrabold tracking-[-0.03em] text-ink-ghost">
                The next one
              </p>
              <p className="mt-2 max-w-[22rem] font-hand text-[17px] leading-snug text-ink-faint">
                it&apos;ll look nothing like the one beside it — that&apos;s the rule
              </p>
            </div>
          </ScrollReveal>
        </div>
      </Section>

      {/* ─────────────────────── HOW THESE ARE MADE ─────────────────────── */}
      <Section className="pt-[11rem]">
        <SectionHead
          label="The rules"
          title="Why they all look different"
          aside={
            <HandNote tilt={-1} className="text-right">
              a portfolio of one design system is a portfolio of one idea
            </HandNote>
          }
        />
        <div className="grid gap-7 lg:grid-cols-3">
          {RULES.map((r, i) => (
            <ScrollReveal key={r.title} delay={i * 0.08} y={22}>
              <div className="h-full rounded-[1.75rem] bg-card p-9 shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-3">
                  {r.art}
                  <span className="label">0{i + 1}</span>
                </div>
                <h3 className="mt-4 font-display text-[24px] font-extrabold leading-tight tracking-[-0.035em]">
                  {r.title}
                </h3>
                <p className="mt-3 text-[15.5px] leading-[1.6] text-ink-soft">{r.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* ─────────────────────────── FOOTER ─────────────────────────── */}
      <Section className="relative pb-[7rem] pt-[6rem]">
        <ScrollReveal y={18}>
          <div className="flex flex-wrap items-center justify-between gap-6 border-t-[2.5px] border-dashed border-hairline pt-8">
            <p className="label">© 2026 Amartya · written at the desk</p>
            <div className="flex items-center gap-3">
              <HandNote tilt={-2}>tell me what to write next</HandNote>
              <Sticker tone="ink" size="md" tilt={-1.5} display magnetic href="/about#say-hi">
                say hi
                <ArrowRight size={18} />
              </Sticker>
            </div>
          </div>
        </ScrollReveal>
      </Section>
    </>
  );
}
