import type { Metadata } from "next";
import Link from "next/link";

import { ArrowRight, Notebook, Sparkle } from "@/components/art/cast";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { HandNote, Stamp } from "@/components/site/hand-note";
import { Section, SectionHead } from "@/components/site/section";
import { Sticker } from "@/components/site/sticker";
import { PUBLISHED, SITE_URL, formatDate } from "@/lib/articles";

/**
 * WRITING — the index.
 *
 * This page belongs to the desk, so it is drawn in the site's own system. The
 * cards do not: each one is painted in the palette of the article behind it,
 * which turns the index into an honest contact sheet — you can see there are
 * four different design systems here before you open any of them.
 */

export const metadata: Metadata = {
  title: "Writing — Amartya Yadav",
  description:
    "Long notes on how things actually work: GPU kernels, inference, and the software underneath. Every piece is built in its own design system.",
  alternates: { canonical: `${SITE_URL}/writing/` },
  openGraph: {
    title: "Writing — Amartya Yadav",
    description: "Long notes on how things actually work. Every piece built in its own design system.",
    url: `${SITE_URL}/writing/`,
    type: "website",
  },
};

export default function WritingPage() {
  return (
    <>
      {/* ─────────────────────────── HEADER ─────────────────────────── */}
      <Section className="relative pt-[9.5rem]">
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,42rem)_minmax(0,1fr)]">
          <div>
            <p className="label">The desk drawer · stop 03</p>
            <h1 className="mt-4 font-display text-[clamp(3.5rem,8vw,6.6rem)] font-extrabold leading-[0.9] tracking-[-0.045em]">
              <TextReveal text={["Things", "I wrote"]} split="char" stagger={0.024} blur={10} />
            </h1>
            <ScrollReveal y={14} blur={6} delay={0.45} amount={0.2}>
              <p className="mt-7 max-w-[34rem] text-[17px] leading-[1.7] text-ink-soft sm:text-[19px]">
                Long notes about how something works, written while I work it out. Each one gets its
                own design system — its own palette, type and components — because the way a piece
                looks is part of what it says, and because I like building them.
              </p>
              <div className="mt-8">
                <Stamp>{PUBLISHED.length === 1 ? "one, so far" : `${PUBLISHED.length} so far`}</Stamp>
              </div>
            </ScrollReveal>
          </div>
          <div className="hidden justify-self-end lg:block">
            <Notebook size={210} />
            <HandNote tilt={-3} className="mt-2 text-right">
              every card below is painted in its article&apos;s own colours
            </HandNote>
          </div>
        </div>
      </Section>

      {/* ─────────────────────────── THE PILE ─────────────────────────── */}
      <Section className="relative pt-[6rem]">
        <div className="space-y-9">
          {PUBLISHED.map((a, i) => (
            <ScrollReveal key={a.slug} delay={i * 0.08} y={26}>
              <Link href={`/writing/${a.slug}`} className="group block">
                <article
                  className="relative overflow-hidden rounded-[1.9rem] p-9 shadow-[var(--shadow-card)] transition-transform duration-300 ease-[var(--ease-out)] group-hover:-translate-y-1.5 sm:p-11"
                  style={{ background: a.accent.bg, color: a.accent.fg }}
                >
                  {/* the article's own grid, showing through the card */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.35]"
                    style={{
                      backgroundImage: `linear-gradient(${a.accent.line} 1px, transparent 1px), linear-gradient(90deg, ${a.accent.line} 1px, transparent 1px)`,
                      backgroundSize: "34px 34px",
                    }}
                  />
                  <div className="relative grid gap-8 lg:grid-cols-[1fr_15rem]">
                    <div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[12.5px] uppercase tracking-[0.14em]" style={{ color: a.accent.label }}>
                        <span>{String(i + 1).padStart(2, "0")}</span>
                        <span style={{ opacity: 0.6 }}>{formatDate(a.date)}</span>
                        <span style={{ opacity: 0.6 }}>{a.minutes} min</span>
                      </div>
                      <h2 className="mt-4 font-display text-[clamp(2rem,3.6vw,3.1rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">
                        {a.title}
                      </h2>
                      <p className="mt-4 max-w-[40rem] text-[16.5px] leading-[1.65]" style={{ opacity: 0.78 }}>
                        {a.dek}
                      </p>
                      <div className="mt-6 flex flex-wrap items-center gap-2.5">
                        {a.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full px-3.5 py-1.5 font-mono text-[12px] uppercase tracking-[0.1em]"
                            style={{ border: `1.5px solid ${a.accent.line}`, color: a.accent.fg, opacity: 0.85 }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col justify-between gap-6 lg:items-end lg:text-right">
                      <p className="max-w-[15rem] font-mono text-[12.5px] leading-[1.6]" style={{ color: a.accent.label, opacity: 0.9 }}>
                        <span className="block uppercase tracking-[0.14em]" style={{ opacity: 0.6 }}>
                          design system
                        </span>
                        {a.system}
                      </p>
                      <span
                        className="inline-flex items-center gap-2 self-start rounded-full px-5 py-2.5 font-display text-[15px] font-extrabold tracking-[-0.02em] transition-transform duration-300 group-hover:translate-x-1 lg:self-end"
                        style={{ background: a.accent.label, color: a.accent.bg }}
                      >
                        read it
                        <ArrowRight size={17} />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </ScrollReveal>
          ))}

          {/* the next one */}
          <ScrollReveal y={22} delay={0.1}>
            <div className="flex flex-wrap items-center justify-between gap-6 rounded-[1.9rem] border-[3px] border-dashed border-hairline px-9 py-10">
              <div>
                <p className="label">In the drawer</p>
                <p className="mt-2 max-w-[34rem] font-display text-[22px] font-extrabold leading-tight tracking-[-0.03em] text-ink-ghost">
                  The next one is half-written, in a design system that doesn&apos;t exist yet.
                </p>
              </div>
              <HandNote tilt={2}>
                <Sparkle size={16} /> subscribe by RSS: /feed.xml
              </HandNote>
            </div>
          </ScrollReveal>
        </div>
      </Section>

      {/* ─────────────────────────── FOOTER ─────────────────────────── */}
      <Section className="relative pb-[7rem] pt-[6rem]">
        <ScrollReveal y={18}>
          <div className="flex flex-wrap items-center justify-between gap-6 border-t-[2.5px] border-dashed border-hairline pt-8">
            <p className="label">© 2026 Amartya · written at the desk</p>
            <div className="flex items-center gap-3">
              <Sticker tone="white" size="md" tilt={-1} href="/feed.xml">
                rss
              </Sticker>
              <Sticker tone="ink" size="md" tilt={1.5} display magnetic href="/about#say-hi">
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
