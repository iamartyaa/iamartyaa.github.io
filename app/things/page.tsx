import { ArrowRight, Monitor, Notebook, PaperPlane, Plant, Rocket } from "@/components/art/cast";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { HandNote, Stamp } from "@/components/site/hand-note";
import { ProjectFilters } from "@/components/site/project-filters";
import { Route, RoutePlane } from "@/components/site/route";
import { Section } from "@/components/site/section";
import { Sticker } from "@/components/site/sticker";

/**
 * THINGS — the route.
 *
 * One dashed line runs the length of the page and the plane flies it as you
 * scroll; every project is a landing on that line, stamped where it touches
 * down. Cards alternate sides so the line has a reason to bend.
 */

const ROUTE_H = 3200;
const ROUTE_D =
  "M-60 30 C 340 90, 940 150, 1180 400 C 1330 560, 1300 780, 1120 900 " +
  "C 900 1050, 620 1140, 540 1320 C 460 1500, 1160 1520, 1240 1720 " +
  "C 1310 1900, 520 1930, 430 2120 C 360 2290, 1180 2300, 1236 2500 " +
  "C 1276 2660, 620 2700, 566 2860 C 536 2990, 900 3030, 1120 3090";

const STOPS = [
  { x: 1180, y: 400 },
  { x: 1120, y: 900 },
  { x: 540, y: 1320 },
  { x: 1240, y: 1720 },
  { x: 430, y: 2120 },
  { x: 1236, y: 2500 },
  { x: 566, y: 2860 },
];

const PROJECTS = [
  {
    n: "01",
    tone: "text-orange",
    title: "Dev-Assistant",
    meta: "AI agents · 2024 — now · Architect",
    body:
      "Every change request at work came with the same twenty minutes of paperwork, so I gave it to a machine. Dev-Assistant is a multi-agent system — LangChain tool-calling agents on Claude Opus — that drafts, reviews and scores a CRQ end to end, then explains itself to the manager who has to approve it. The scoring engine reads risk, impact, tier and code coverage and returns a number out of 100; the MCP server puts the whole thing inside the editor, so nobody has to leave their work to file it. It cut CRQ prep by 70% across three product teams.",
    tags: ["LangChain", "Claude Opus", "MCP / SSE", "WebSocket", "Node.js"],
    art: <Monitor size={190} />,
    featured: true,
    side: "left" as const,
  },
  {
    n: "02",
    tone: "text-blue",
    title: "LA Fair Work Week",
    meta: "Product · 2025 · Lead",
    body:
      "A scheduling tool that had grown into one long step had to satisfy Los Angeles labour law by June. I rewrote it as a five-step configurable flow, pulled the business rules out of the components, and built an RBAC layer for five roles that has not dropped an auth flow since launch. It shipped on the deadline and took Top Win of the Quarter.",
    tags: ["React", "TypeScript", "RBAC", "13 stores"],
    art: <Rocket size={150} />,
    side: "right" as const,
  },
  {
    n: "03",
    tone: "text-green",
    title: "Lab reports, read by phone",
    meta: "Computer vision · 2024 · Samsung R&D",
    body:
      "Point a phone at a lab report and get a health dashboard. I built the capture pipeline — alignment, contrast, contour detection — to 99% OCR accuracy across bad lighting and worse layouts, then trained the extraction that reads each test against its reference range. It ships pre-installed on Galaxy devices.",
    tags: ["Python", "OCR", "Samsung Health"],
    art: <Notebook size={150} />,
    side: "left" as const,
  },
  {
    n: "04",
    tone: "text-yellow",
    title: "Eleven services, quietly up",
    meta: "Systems · ongoing",
    body:
      "The unglamorous one. Eleven microservices behind the tools 15,000 store associates and 1,000 managers use daily across 4,600 stores — 99.9% uptime, and a detection-to-fix cycle under thirty minutes because the dashboards tell me before the pager does.",
    tags: ["Grafana", "Prometheus", "OpenObserve"],
    art: <Plant size={150} />,
    side: "right" as const,
  },
];

/**
 * The drawer is deliberately short. Only things that actually exist go on the
 * sheet — the dashed circle at the end is the honest placeholder, not a
 * filled-in one.
 */
const SMALL = [
  {
    title: "This desk",
    year: "2026",
    note: "the site you're on",
    art: <Monitor size={96} />,
    bg: "bg-peach",
    shape: "rounded-full",
  },
  {
    title: "CUDA, at night",
    year: "2026",
    note: "kernels, slowly",
    art: <Rocket size={92} />,
    bg: "bg-butter",
    shape: "rounded-[1.6rem]",
  },
  {
    title: "Agents in the editor",
    year: "2025",
    note: "the MCP half of Dev-Assistant",
    art: <PaperPlane size={96} />,
    bg: "bg-sky",
    shape: "rounded-[1.6rem]",
  },
];

export default function ThingsPage() {
  return (
    <div className="relative">
      {/* the line and its plane sit behind everything, spanning the whole page */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full">
        <div className="relative mx-auto h-full max-w-[1440px]">
          <Route d={ROUTE_D} height={ROUTE_H} stops={STOPS} />
          <RoutePlane d={ROUTE_D} height={ROUTE_H} />
        </div>
      </div>

      {/* ─────────────────────────── HEADER ─────────────────────────── */}
      <Section className="relative pt-[9.5rem]">
        <div className="relative z-10 max-w-[44rem]">
          <p className="label">The route · stop 02</p>
          <h1 className="mt-4 font-display text-[clamp(4rem,9vw,7.4rem)] font-extrabold leading-[0.9] tracking-[-0.045em]">
            <TextReveal text={["Things", "I made"]} split="char" stagger={0.024} blur={10} />
          </h1>
          <ScrollReveal y={14} blur={6} delay={0.5} amount={0.2}>
            <p className="mt-7 max-w-[30rem] text-[17px] leading-[1.7] text-ink-soft sm:text-[19px]">
              Four that mattered: an agent that files my paperwork, a rewrite against a labour-law
              deadline, a scanner that reads lab reports, and eleven services that stay up. The plane
              flies the route — each landing is a thing.
            </p>
          </ScrollReveal>
          <div className="mt-8">
            <Stamp>arrived from the desk</Stamp>
          </div>
        </div>

        <div className="relative z-10 mt-14">
          <ProjectFilters />
          <HandNote tilt={-2} className="mt-5">
            filtering re-routes the plane ↴
          </HandNote>
        </div>
      </Section>

      {/* ─────────────────────────── LANDINGS ─────────────────────────── */}
      <Section className="relative mt-[7rem] space-y-[9rem] pb-[7rem]">
        {PROJECTS.map((p) => (
          <ScrollReveal key={p.n} y={26} amount={0.25}>
            <div
              className={
                p.featured
                  ? "relative"
                  : p.side === "right"
                    ? "relative flex justify-end"
                    : "relative flex justify-start"
              }
            >
              <TiltCard
                max={p.featured ? 6 : 8}
                glare={false}
                className={`relative bg-card shadow-[var(--shadow-card)] ${
                  p.featured ? "w-full rounded-[2rem]" : "w-full max-w-[46rem] rounded-[1.75rem]"
                }`}
              >
                <div className={`relative grid gap-8 p-9 ${p.featured ? "lg:grid-cols-[1.15fr_1fr] lg:p-12" : "sm:grid-cols-[1fr_auto]"}`}>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className={`font-display text-[15px] ${p.tone}`}>{p.n}</span>
                      <span className="label">{p.meta}</span>
                    </div>
                    <h2
                      className={`mt-3 font-display font-extrabold leading-[0.95] tracking-[-0.04em] ${
                        p.featured ? "text-[clamp(2.5rem,4.4vw,3.9rem)]" : "text-[clamp(1.9rem,3vw,2.6rem)]"
                      }`}
                    >
                      {p.title}
                    </h2>
                    <p className="mt-4 max-w-[34rem] text-[16px] leading-[1.65] text-ink-soft">{p.body}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {p.tags.map((t, i) => (
                        <Sticker key={`${p.n}-${i}`} tone="white" size="sm" className="shadow-[0_0_0_3px_var(--card)]">
                          {t}
                        </Sticker>
                      ))}
                    </div>
                    {p.featured ? (
                      <div className="mt-7 flex flex-wrap gap-3">
                        <Sticker tone="ink" size="md" tilt={-1.5} display magnetic>
                          read the story
                          <ArrowRight size={18} />
                        </Sticker>
                        <Sticker tone="white" size="md" tilt={1}>
                          live
                        </Sticker>
                        <Sticker tone="white" size="md">
                          code
                        </Sticker>
                      </div>
                    ) : null}
                  </div>
                  <div className="flex items-end justify-center sm:items-center">{p.art}</div>
                </div>
                <div className="absolute right-6 top-6">
                  <Stamp tone="green">landed</Stamp>
                </div>
              </TiltCard>
            </div>
          </ScrollReveal>
        ))}
      </Section>

      {/* ──────────────────────── THE DRAWER ──────────────────────── */}
      <Section className="relative pt-[4rem]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label">The drawer</p>
            <TextReveal
              text="Smaller things"
              as="h2"
              whileInView
              stagger={0.05}
              className="mt-2.5 font-display text-[clamp(2.25rem,4vw,3.4rem)] font-extrabold leading-none tracking-[-0.04em]"
            />
          </div>
          <HandNote tilt={-2}>weekend experiments · the ones that stayed small</HandNote>
        </div>

        <ScrollReveal y={24}>
          <div className="relative rounded-[1.75rem] bg-card p-12 shadow-[var(--shadow-card)]">
            <div className="pointer-events-none absolute inset-3.5 rounded-[1.35rem] border-[2.5px] border-dashed border-hairline" />
            <div className="relative grid grid-cols-2 gap-9 sm:grid-cols-4">
              {SMALL.map((s, i) => (
                <div key={i} className="text-center">
                  <div
                    className={`mx-auto flex size-40 items-center justify-center ${s.shape} ${s.bg} shadow-[0_0_0_5px_var(--card),0_0_0_6.5px_var(--hairline)]`}
                    style={{ transform: `rotate(${[-4, 3, -2, 4][i % 4]}deg)` }}
                  >
                    {s.art}
                  </div>
                  <p className="mt-4 font-display text-[19px] font-extrabold tracking-[-0.03em]">{s.title}</p>
                  <p className="label mt-1">{s.year}</p>
                  <p className="mt-1.5 font-hand text-[15px] leading-snug text-ink-faint">{s.note}</p>
                </div>
              ))}
              <div className="text-center">
                <div className="mx-auto flex size-40 rotate-[-3deg] items-center justify-center rounded-full border-[3px] border-dashed border-hairline">
                  <span className="font-hand text-[21px] font-semibold leading-tight text-ink-ghost">
                    next one
                    <br />
                    goes here
                  </span>
                </div>
                <p className="mt-4 font-display text-[19px] font-extrabold tracking-[-0.03em] text-ink-ghost">Soon</p>
                <p className="label mt-1">the sheet grows</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Section>

      {/* ──────────────────────── NEXT STOP ──────────────────────── */}
      <Section className="relative py-[9rem]">
        <ScrollReveal y={24}>
          <div className="relative grid items-center gap-10 overflow-hidden rounded-[2rem] bg-card px-14 py-13 shadow-[var(--shadow-card)] lg:grid-cols-[1fr_19rem]">
            <div>
              <p className="label">Next stop</p>
              <h2 className="mt-2.5 font-display text-[clamp(2.25rem,4vw,3.4rem)] font-extrabold leading-none tracking-[-0.04em]">
                Who made all this?
              </h2>
              <p className="mt-4 max-w-[32rem] text-[17px] leading-[1.6] text-ink-soft">
                The route ends back at the desk, with the person sitting at it.
              </p>
              <div className="mt-7">
                <Sticker tone="ink" size="lg" tilt={-1.5} display magnetic href="/about">
                  about me
                  <ArrowRight size={19} />
                </Sticker>
              </div>
            </div>
            <div className="hidden justify-self-end lg:block">
              <PaperPlane size={200} />
            </div>
          </div>
        </ScrollReveal>
      </Section>
    </div>
  );
}
