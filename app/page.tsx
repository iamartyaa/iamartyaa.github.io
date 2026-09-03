import Link from "next/link";

import { ArrowRight, AvatarWaving, Monitor, Notebook, Rocket, XMark } from "@/components/art/cast";
import { Desk } from "@/components/desk/desk";
import { Marquee } from "@/components/motion/marquee";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { DeskObjects } from "@/components/site/desk-objects";
import { HandNote } from "@/components/site/hand-note";
import { HeroBand } from "@/components/site/hero-band";
import { Section, SectionHead } from "@/components/site/section";
import { Sticker } from "@/components/site/sticker";

const TEASERS = [
  {
    n: "01",
    tone: "text-orange-ink",
    title: "Dev-Assistant",
    body: "A multi-agent system that writes, reviews and scores change requests end to end. It cut CRQ prep by 70% across three product teams — and taught me how much of my job was paperwork.",
    art: <Monitor size={150} className="max-sm:w-[7rem] max-sm:h-auto" />,
  },
  {
    n: "02",
    tone: "text-blue-ink",
    title: "LA Fair Work Week",
    body: "A legacy scheduling tool, rewritten against a hard regulatory deadline.",
    art: <Rocket size={130} className="max-sm:w-[6rem] max-sm:h-auto" />,
  },
  {
    n: "03",
    tone: "text-green-ink",
    title: "Lab reports, read by phone",
    body: "A scanner that turns a photo of a lab report into a health dashboard.",
    art: <Notebook size={130} className="max-sm:w-[6.5rem] max-sm:h-auto" />,
  },
];

const MARQUEE_WORDS = [
  ["Inference", "var(--yellow)"],
  ["CUDA", "var(--green)"],
  ["GPU Programming", "var(--orange)"],
  ["AI Agents", "var(--blue)"],
  ["Distributed Systems", "var(--yellow)"],
  ["Frontend Engineering", "var(--green)"],
  ["Computer Vision", "var(--orange)"],
] as const;

export default function HomePage() {
  return (
    <>
      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <Section className="relative pt-page pb-12 sm:pb-24">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)]">
          <div className="relative z-10 pt-4">
            <ScrollReveal y={12} blur={5} amount={0.4}>
              <Sticker tone="mint" size="sm" tilt={-2} wrap className="font-mono text-[12px] font-medium sm:text-[13px]">
                <span className="size-2.5 rounded-full bg-green shadow-[0_0_0_3px_rgba(111,174,123,0.3)]" />
                currently: building workforce tools at Walmart · learning CUDA at night
              </Sticker>
            </ScrollReveal>

            <h1 className="mt-6 font-display text-[clamp(3.1rem,7vw,6.5rem)] font-extrabold leading-[0.92] tracking-[-0.04em]">
              <TextReveal text={["Hi, I'm", "Amartya."]} split="char" stagger={0.022} blur={10} />
              <TextReveal
                text="I make things."
                split="char"
                stagger={0.022}
                delay={0.5}
                blur={10}
                className="text-orange"
              />
            </h1>

            <ScrollReveal y={14} blur={6} delay={0.75} amount={0.2}>
              <p className="mt-6 max-w-[28rem] text-[16.5px] leading-[1.65] text-ink-soft sm:mt-8 sm:text-[19px] sm:leading-[1.7]">
                Software mostly — workforce tools that fifteen thousand people open every morning, and
                agents that do the boring half of my job. Sometimes drawings, sometimes long notes about
                how something works. It&apos;s all on this desk: poke the cat, tap the keyboard, pull the
                lamp&apos;s chain.
              </p>
              <div className="mt-7 flex flex-wrap gap-3.5 sm:mt-9">
                <Sticker tone="ink" size="lg" tilt={-1.5} display magnetic href="/things">
                  see the things
                  <ArrowRight size={19} />
                </Sticker>
                <Sticker tone="white" size="lg" tilt={1.5} display href="/about">
                  about me
                </Sticker>
              </div>
            </ScrollReveal>
          </div>

          {/* The desk owns the right half of the fold and bleeds past the gutter.
              On a phone it sits straight under the headline, in a canvas shaped
              like the desk rather than like the screen. */}
          <div className="relative -mx-2 mt-2 sm:mx-0 lg:-mt-10 lg:-mr-[6vw]">
            <Desk className="h-[min(78vw,26rem)] w-full sm:h-[min(60vh,32rem)] lg:h-[min(74vh,42rem)]" />
            <HandNote tilt={-3} className="pointer-events-none mt-1 text-center text-[17px] sm:text-[19px]">
              drag to spin the whole desk ↻
            </HandNote>
          </div>
        </div>

        <HeroBand />

      </Section>

      {/* ───────────────────────── MARQUEE ───────────────────────── */}
      <div className="my-6 -mx-2 -rotate-[1.2deg] bg-panel py-4 shadow-[0_14px_30px_-18px_rgba(40,30,20,0.7)] sm:my-8 sm:mx-0 sm:py-5">
        <Marquee speed={38} gap="2.25rem" fade={false} className="text-on-panel">
          {MARQUEE_WORDS.map(([word, color]) => (
            <span key={word} className="flex items-center gap-7 pr-7 font-display text-xl tracking-[-0.02em] sm:gap-9 sm:pr-9 sm:text-2xl">
              {word}
              <span style={{ color }}>✦</span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* ──────────────────────── WHAT'S ON IT ──────────────────────── */}
      <Section className="pt-section">
        <SectionHead
          label="Stop 01 · the desk"
          title="What's on it"
          aside={
            <HandNote tilt={-1} className="text-right">
              four objects, four doors — peel one open
            </HandNote>
          }
        />
        <DeskObjects />
      </Section>

      {/* ───────────────────────── A FEW THINGS ───────────────────────── */}
      <Section className="pt-section">
        <SectionHead
          label="Stop 02 · next page"
          title="A few things"
          aside={
            <div className="flex justify-end">
              <Sticker tone="ink" size="md" tilt={-1.5} display magnetic href="/things">
                all of them
                <ArrowRight size={18} />
              </Sticker>
            </div>
          }
        />
        <div className="grid gap-5 sm:gap-7 lg:grid-cols-[1.4fr_1fr_1fr]">
          {TEASERS.map((t, i) => (
            <ScrollReveal key={t.n} delay={i * 0.08} y={24} className="h-full">
              {/* The card sizes itself: a fixed height put the drawing on top
                  of the copy on narrow widths. The art sits in flow, bottom right. */}
              <Link href="/things" className="group block h-full no-underline">
                <TiltCard max={8} glare={false} className="h-full min-h-[17rem] bg-card shadow-[var(--shadow-card)] lg:min-h-[21rem]">
                  <div className="flex h-full flex-col p-6 sm:p-8">
                    <div className="flex items-center gap-2">
                      <span className={`font-display text-[15px] ${t.tone}`}>{t.n}</span>
                      <span className="label">on the route</span>
                    </div>
                    <h3 className="mt-2.5 font-display text-[clamp(1.6rem,2.4vw,2.5rem)] font-extrabold leading-none tracking-[-0.035em]">
                      {t.title}
                    </h3>
                    <p className="mt-3 max-w-[23rem] text-[15.5px] leading-[1.6] text-ink-soft sm:text-[16px]">{t.body}</p>
                    <div className="mt-auto flex items-end justify-between gap-4 pt-5">
                      <span className="inline-flex items-center gap-1.5 font-hand text-[16px] text-ink-faint transition-transform duration-200 group-hover:translate-x-0.5">
                        open
                        <ArrowRight size={16} />
                      </span>
                      <div className="-mb-2 -mr-1 opacity-95">{t.art}</div>
                    </div>
                  </div>
                </TiltCard>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* ─────────────────────────── CONTACT ─────────────────────────── */}
      <Section className="py-section">
        <ScrollReveal y={26}>
          <div className="relative overflow-hidden rounded-[1.5rem] bg-panel px-6 py-9 text-on-panel ring-1 ring-[var(--panel-edge)] sm:rounded-[2rem] sm:px-10 sm:py-12 lg:px-[3.75rem] lg:py-[3.5rem]">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_21rem] lg:gap-10">
              {/* on a phone he waves from the top of the panel instead of vanishing */}
              <div className="relative flex items-end gap-3 lg:hidden">
                <AvatarWaving size={260} onDark waving className="w-[7.5rem] h-auto" />
                <HandNote tone="orange" tilt={-6} className="mb-6 text-yellow">
                  waves back
                </HandNote>
              </div>
              <div>
                <p className="label text-on-panel-soft">Last stop</p>
                <h2 className="mt-3 font-display text-[clamp(2.1rem,4.4vw,3.9rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">
                  Want to make
                  <br />
                  something together?
                </h2>
                <p className="mt-5 max-w-[29rem] text-[16.5px] leading-[1.6] text-on-panel-soft sm:text-[17px]">
                  I read everything. Say hi about a project, a question, or a thing you think I&apos;d like.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Sticker tone="yellow" size="lg" tilt={-2} display magnetic on="ink" href="mailto:iamartyayadav@gmail.com">
                    email me
                  </Sticker>
                  <Sticker tone="white" size="md" tilt={1.5} on="ink" href="https://github.com/iamartyaa">
                    github
                  </Sticker>
                  <Sticker tone="white" size="md" tilt={-1} on="ink" href="https://linkedin.com/in/iamartyaa">
                    linkedin
                  </Sticker>
                  <Sticker
                    tone="white"
                    size="md"
                    tilt={1}
                    on="ink"
                    href="https://x.com/evilseyee"
                    aria-label="Amartya on X"
                  >
                    <XMark size={17} />
                  </Sticker>
                  <Sticker tone="white" size="md" tilt={2} on="ink" href="/resume.pdf">
                    résumé
                  </Sticker>
                </div>
              </div>
              <div className="relative hidden justify-self-end lg:block">
                <AvatarWaving size={260} onDark waving />
                <HandNote tone="orange" tilt={-6} className="absolute left-0 top-2 text-yellow">
                  waves back
                </HandNote>
              </div>
            </div>
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
            <p className="label">© 2026 Amartya · made at the desk</p>
            <p className="label">three.js · react three fiber · motion · lenis</p>
          </div>
        </ScrollReveal>
      </Section>
    </>
  );
}
