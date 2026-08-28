import Link from "next/link";

import { ArrowRight, AvatarWaving, Monitor, Notebook, PaperPlane, Plant, Rocket, XMark } from "@/components/art/cast";
import { Desk } from "@/components/desk/desk";
import { Marquee } from "@/components/motion/marquee";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { HandNote } from "@/components/site/hand-note";
import { HeroBand } from "@/components/site/hero-band";
import { Section, SectionHead } from "@/components/site/section";
import { Sticker } from "@/components/site/sticker";

const DESK_OBJECTS = [
  {
    label: "The monitor",
    tone: "text-orange",
    title: "Things I made",
    body: "Projects, side quests, and the odd thing that only worked once.",
    art: <Monitor size={120} />,
    href: "/things",
  },
  {
    label: "The notebook",
    tone: "text-yellow",
    title: "Notes & drawings",
    body: "How things work, drawn badly first and then properly.",
    art: <Notebook size={120} />,
    href: "/things",
  },
  {
    label: "The plant",
    tone: "text-green",
    title: "Still growing",
    body: "CUDA kernels and how inference actually gets fast. Updated more often than my job title.",
    art: <Plant size={110} />,
    href: "/about",
  },
  {
    label: "The paper plane",
    tone: "text-blue",
    title: "Where next",
    body: "Kanpur, Noida, Bengaluru — the route so far, and the bit that hasn't happened yet.",
    art: <PaperPlane size={120} />,
    href: "/about",
  },
];

const TEASERS = [
  {
    n: "01",
    tone: "text-orange",
    title: "Dev-Assistant",
    body: "A multi-agent system that writes, reviews and scores change requests end to end. It cut CRQ prep by 70% across three product teams — and taught me how much of my job was paperwork.",
    art: <Monitor size={150} />,
  },
  {
    n: "02",
    tone: "text-blue",
    title: "LA Fair Work Week",
    body: "A legacy scheduling tool, rewritten against a hard regulatory deadline.",
    art: <Rocket size={130} />,
  },
  {
    n: "03",
    tone: "text-green",
    title: "Lab reports, read by phone",
    body: "A scanner that turns a photo of a lab report into a health dashboard.",
    art: <Notebook size={130} />,
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
      <Section className="relative pt-[8.5rem] pb-24">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)]">
          <div className="relative z-10 pt-4">
            <ScrollReveal y={12} blur={5} amount={0.4}>
              <Sticker tone="mint" size="sm" tilt={-2} wrap className="font-mono text-[12px] font-medium sm:text-[13px]">
                <span className="size-2.5 rounded-full bg-green shadow-[0_0_0_3px_rgba(111,174,123,0.3)]" />
                currently: building workforce tools at Walmart · learning CUDA at night
              </Sticker>
            </ScrollReveal>

            <h1 className="mt-6 font-display text-[clamp(3.25rem,7vw,6.5rem)] font-extrabold leading-[0.92] tracking-[-0.04em]">
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
              <p className="mt-8 max-w-[28rem] text-[17px] leading-[1.7] text-ink-soft sm:text-[19px]">
                Software mostly — workforce tools that fifteen thousand people open every morning, and
                agents that do the boring half of my job. Sometimes drawings, sometimes long notes about
                how something works. It&apos;s all on this desk: poke around, then follow the plane.
              </p>
              <div className="mt-9 flex flex-wrap gap-3.5">
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

          {/* The desk owns the right half of the fold and bleeds past the gutter. */}
          <div className="relative -mt-10 lg:-mr-[6vw]">
            <Desk className="h-[min(74vh,42rem)] w-full" />
            <HandNote tilt={-3} className="pointer-events-none mt-1 text-center">
              drag to spin the whole desk ↻
            </HandNote>
          </div>
        </div>

        <HeroBand />

      </Section>

      {/* ───────────────────────── MARQUEE ───────────────────────── */}
      <div className="my-8 -rotate-[1.2deg] bg-ink py-5 shadow-[0_14px_30px_-18px_rgba(40,30,20,0.7)]">
        <Marquee speed={38} gap="2.25rem" fade={false} className="text-paper">
          {MARQUEE_WORDS.map(([word, color]) => (
            <span key={word} className="flex items-center gap-9 pr-9 font-display text-2xl tracking-[-0.02em]">
              {word}
              <span style={{ color }}>✦</span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* ──────────────────────── WHAT'S ON IT ──────────────────────── */}
      <Section className="pt-[9rem]">
        <SectionHead
          label="Stop 01 · the desk"
          title="What's on it"
          aside={
            <HandNote tilt={-1} className="text-right">
              click an object up there and this row scrolls to it
            </HandNote>
          }
        />
        <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-4">
          {DESK_OBJECTS.map((o, i) => (
            <ScrollReveal key={o.title} delay={i * 0.07} y={22}>
              <Link href={o.href} className="block">
                <TiltCard max={9} glare={false} className="h-[18rem] bg-card shadow-[var(--shadow-card)]">
                  <div className="relative h-full p-7">
                    <p className={`label ${o.tone}`}>{o.label}</p>
                    <h3 className="mt-2 font-display text-[27px] font-extrabold leading-tight tracking-[-0.03em]">
                      {o.title}
                    </h3>
                    <p className="mt-2 max-w-[15rem] text-[14.5px] leading-[1.55] text-ink-soft">{o.body}</p>
                    <div className="absolute bottom-3 right-3 opacity-95">{o.art}</div>
                  </div>
                </TiltCard>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* ───────────────────────── A FEW THINGS ───────────────────────── */}
      <Section className="pt-[11rem]">
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
        <div className="grid gap-7 lg:grid-cols-[1.4fr_1fr_1fr]">
          {TEASERS.map((t, i) => (
            <ScrollReveal key={t.n} delay={i * 0.08} y={24}>
              <TiltCard max={8} glare={false} className="h-[21rem] bg-card shadow-[var(--shadow-card)]">
                <div className="relative h-full p-8">
                  <div className="flex items-center gap-2">
                    <span className={`font-display text-[15px] ${t.tone}`}>{t.n}</span>
                    <span className="label">Read the story</span>
                  </div>
                  <h3 className="mt-2.5 font-display text-[clamp(1.75rem,2.4vw,2.5rem)] font-extrabold leading-none tracking-[-0.035em]">
                    {t.title}
                  </h3>
                  <p className="mt-3 max-w-[23rem] text-[16px] leading-[1.6] text-ink-soft">{t.body}</p>
                  <div className="absolute bottom-3 right-4 opacity-95">{t.art}</div>
                </div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* ─────────────────────────── CONTACT ─────────────────────────── */}
      <Section className="py-[11rem]">
        <ScrollReveal y={26}>
          <div className="relative overflow-hidden rounded-[2rem] bg-ink px-[3.75rem] py-[3.5rem] text-paper">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_21rem]">
              <div>
                <p className="label text-ink-ghost">Last stop</p>
                <h2 className="mt-3 font-display text-[clamp(2.5rem,4.4vw,3.9rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">
                  Want to make
                  <br />
                  something together?
                </h2>
                <p className="mt-5 max-w-[29rem] text-[17px] leading-[1.6] text-[#bdb2a4]">
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
                  <Sticker tone="white" size="md" tilt={1} on="ink" href="https://x.com/evilseyee">
                    <XMark size={17} />
                    x
                  </Sticker>
                  <Sticker tone="white" size="md" tilt={2} on="ink" href="/resume.pdf">
                    résumé
                  </Sticker>
                </div>
              </div>
              <div className="relative hidden justify-self-end lg:block">
                <AvatarWaving size={260} onDark />
                <HandNote tone="orange" tilt={-6} className="absolute left-0 top-2 text-yellow">
                  waves back
                </HandNote>
              </div>
            </div>
          </div>
          <div className="mt-7 flex items-center justify-between">
            <p className="label">© 2026 Amartya · made at the desk</p>
            <p className="label">three.js · react three fiber · motion · lenis</p>
          </div>
        </ScrollReveal>
      </Section>
    </>
  );
}
