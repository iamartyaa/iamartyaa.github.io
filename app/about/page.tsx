import { Monitor, Notebook, PaperPlane, Rocket, Sparkle, SmileyDot, XMark } from "@/components/art/cast";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { HandNote, Stamp } from "@/components/site/hand-note";
import { HowIWork } from "@/components/site/how-i-work";
import { PilotPortrait } from "@/components/site/pilot-portrait";
import { Shelf } from "@/components/site/shelf";
import { Signature } from "@/components/site/signature";
import { Section, SectionHead } from "@/components/site/section";
import { FloatingSticker, Sticker } from "@/components/site/sticker";

/**
 * ABOUT — the pilot.
 *
 * The page that has to survive a career change: no job titles anywhere. The
 * history is waypoints ([year] → what changed) ending in a dashed "Now" card,
 * which is the only line that ever gets rewritten.
 */

const FLIGHTS = [
  {
    year: "2020",
    tone: "text-orange",
    title: "Started building things in Kanpur",
    body:
      "Four years of Information Technology at Harcourt Butler Technical University, and a lot of evenings spent making things that were not on the syllabus. Left with a 9.0 and the habit of finishing what I start.",
    tags: ["HBTU, Kanpur", "B.Tech IT"],
    art: <Notebook size={120} />,
  },
  {
    year: "2024",
    tone: "text-blue",
    title: "Six months teaching a phone to read",
    body:
      "A research internship on Samsung's Generative AI team in Noida: a capture-and-extraction pipeline that turns a photograph of a lab report into a health dashboard. It shipped pre-installed on Galaxy devices, which is still the largest number of people my code has ever reached.",
    tags: ["Samsung R&D, Noida", "Computer vision"],
    art: <Rocket size={110} />,
  },
  {
    year: "2024",
    tone: "text-green",
    title: "Moved to Bengaluru, met 4,600 stores",
    body:
      "Walmart Global Tech, on the team behind the workforce tools store associates open every morning. Eleven services, a labour-law deadline, and a Bravo award in the first two quarters. Then I started handing the boring parts to agents.",
    tags: ["Walmart Global Tech", "Bengaluru"],
    art: <Monitor size={120} />,
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <Section className="relative pt-[9.5rem]">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,36rem)_minmax(0,1fr)]">
          <div>
            <p className="label">Final stop · the pilot</p>
            <h1 className="mt-4 font-display text-[clamp(3rem,6.4vw,6rem)] font-extrabold leading-[0.94] tracking-[-0.04em]">
              <TextReveal text={["A person who", "likes making"]} split="char" stagger={0.02} blur={10} />
              <TextReveal text="things work." split="char" stagger={0.02} delay={0.55} blur={10} className="text-orange" />
            </h1>
            <ScrollReveal y={14} blur={6} delay={0.8} amount={0.2}>
              <p className="mt-8 max-w-[31rem] text-[17px] leading-[1.75] text-ink-soft sm:text-[19px]">
                I&apos;m Amartya — from Kanpur, living in Bengaluru. Right now I build the tools Walmart
                store teams run their day on, and lead the AI work on my team. Before that I taught a
                phone to read lab reports at Samsung. The title on the badge keeps changing — the habits
                underneath it don&apos;t.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Sticker tone="mint" size="sm" tilt={-1.5} wrap className="font-mono text-[12px] font-medium sm:text-[13px]">
                  <span className="size-2.5 rounded-full bg-green shadow-[0_0_0_3px_rgba(111,174,123,0.3)]" />
                  currently: learning CUDA, and how inference actually gets fast
                </Sticker>
                <Stamp>arrived</Stamp>
              </div>
            </ScrollReveal>
          </div>

          <PilotPortrait />
        </div>

        <div className="mt-14 flex flex-wrap gap-7">
          <FloatingSticker tone="sky" rotate={-6} size="md">
            <Sparkle size={20} />
            learns in public
          </FloatingSticker>
          <FloatingSticker tone="butter" rotate={4} delay={-2} size="md">
            <SmileyDot size={20} />
            finishes things
          </FloatingSticker>
        </div>
      </Section>

      {/* ─────────────────────── ON THE SHELF ─────────────────────── */}
      <Section className="pt-[9rem]">
        <SectionHead
          label="Right now"
          title="On the shelf"
          aside={
            <HandNote tilt={-1} className="text-right">
              the one part of this page that&apos;s meant to go out of date
            </HandNote>
          }
        />
        <Shelf />
      </Section>

      {/* ───────────────────── WHERE I'VE FLOWN ───────────────────── */}
      <Section className="pt-[11rem]">
        <SectionHead
          label="The route so far"
          title="Where I've flown"
          aside={<HandNote tilt={-2} className="text-right">the plane flies down this line as you scroll</HandNote>}
        />

        <div className="relative pl-6 sm:pl-16">
          {/* the vertical leg of the route */}
          <div
            aria-hidden
            className="absolute bottom-8 left-1.5 top-4 w-px border-l-[3px] border-dashed border-blue/60 sm:left-9"
          />
          <div className="space-y-14">
            {FLIGHTS.map((f, i) => (
              <ScrollReveal key={`${f.year}-${i}`} y={22} amount={0.3}>
                <div className="relative grid gap-8 sm:grid-cols-[6rem_1fr]">
                  <span
                    aria-hidden
                    className="absolute -left-[1.35rem] top-4 size-[18px] rounded-full border-[3px] border-blue bg-card sm:-left-[2.35rem]"
                  />
                  <p className={`font-display text-[clamp(1.6rem,2.4vw,2.15rem)] font-extrabold leading-none tracking-[-0.04em] ${f.tone}`}>
                    {f.year}
                  </p>
                  <TiltCard max={5} glare={false} className="bg-card shadow-[var(--shadow-card)]">
                    <div className="grid items-center gap-6 p-9 sm:grid-cols-[1fr_8rem]">
                      <div>
                        <h3 className="font-display text-[clamp(1.4rem,2vw,1.75rem)] font-extrabold leading-tight tracking-[-0.035em]">
                          {f.title}
                        </h3>
                        <p className="mt-2.5 max-w-[42rem] text-[16px] leading-[1.6] text-ink-soft">{f.body}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {f.tags.map((t) => (
                            <Sticker key={t} tone="white" size="sm" className="shadow-[0_0_0_3px_var(--card)]">
                              {t}
                            </Sticker>
                          ))}
                        </div>
                      </div>
                      <div className="hidden justify-self-end sm:block">{f.art}</div>
                    </div>
                  </TiltCard>
                </div>
              </ScrollReveal>
            ))}

            {/* the only card that ever gets rewritten */}
            <ScrollReveal y={22} amount={0.3}>
              <div className="relative grid gap-8 sm:grid-cols-[6rem_1fr]">
                <span
                  aria-hidden
                  className="absolute -left-[1.35rem] top-4 size-[18px] rounded-full border-[3px] border-dashed border-ink-ghost bg-paper sm:-left-[2.35rem]"
                />
                <p className="font-display text-[clamp(1.6rem,2.4vw,2.15rem)] font-extrabold leading-none tracking-[-0.04em] text-ink-ghost">
                  Now
                </p>
                <div className="grid items-center gap-6 rounded-[1.5rem] border-[3px] border-dashed border-hairline p-9 sm:grid-cols-[1fr_8rem]">
                  <div>
                    <h3 className="font-display text-[clamp(1.4rem,2vw,1.75rem)] font-extrabold leading-tight tracking-[-0.035em]">
                      Going a layer down
                    </h3>
                    <p className="mt-2.5 max-w-[42rem] text-[16px] leading-[1.6] text-ink-soft">
                      Learning GPU work properly — CUDA, kernels, and what actually makes model
                      inference fast — and writing down what I find as I go.
                    </p>
                  </div>
                  <div className="hidden justify-self-end sm:block">
                    <PaperPlane size={120} />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </Section>

      {/* ───────────────────────── HOW I WORK ───────────────────────── */}
      <Section className="pt-[11rem]">
        <SectionHead
          label="Regardless of the job"
          title="How I work"
          aside={
            <HandNote tilt={-2} className="text-right">
              four promises, in the order they happen
            </HandNote>
          }
        />
        <HowIWork />
      </Section>

      {/* ─────────────────────────── SAY HI ─────────────────────────── */}
      <Section id="say-hi" className="scroll-mt-32 py-[11rem]">
        <ScrollReveal y={26}>
          <div className="relative overflow-hidden rounded-[2rem] bg-ink px-[3.75rem] py-[3.6rem] text-paper">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_21rem]">
              <div>
                <p className="label text-ink-ghost">Say hi</p>
                <h2 className="mt-3 font-display text-[clamp(2.4rem,4.4vw,3.6rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">
                  Tell me what
                  <br />
                  you&apos;re making.
                </h2>
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
              {/* signed, rather than stamped with another plane */}
              <div className="hidden justify-self-end lg:block">
                <Signature className="w-[21rem]" />
              </div>
            </div>
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
            <p className="label">© 2026 Amartya · drawn, then built</p>
            <p className="label">Bricolage Grotesque · Instrument Sans · Shantell Sans</p>
          </div>
        </ScrollReveal>
      </Section>
    </>
  );
}
