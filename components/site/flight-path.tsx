"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { Sticker } from "@/components/site/sticker";
import { EASE_OUT } from "@/lib/ease";

/**
 * WHERE I'VE FLOWN — the history, walked rather than listed.
 *
 * The cards are deliberately small: this is a route, and a route is read by
 * its shape, not by four paragraphs. What carries it is the figure in the left
 * rail — he sticks to the middle of the screen, slides down the dashed line as
 * you scroll, and changes costume at each stop: a mortarboard at university, a
 * lab coat at the research job, a shop-floor tee and a trolley at the retail
 * one, headphones and a board for what he's doing now.
 *
 * Nothing here is a logo. The costume says where he was; the card says what
 * happened.
 */

const INK = "#241f1c";

/** Head and shoulders, shared by every costume so only the outfit changes. */
function Head({ glasses = false }: { glasses?: boolean }) {
  return (
    <>
      <circle cx="60" cy="40" r="23" fill="var(--peach)" stroke={INK} strokeWidth="3" />
      <path d="M37 33 C 40 12, 82 9, 84 30 C 76 21, 48 21, 37 33 Z" fill={INK} />
      {glasses ? (
        <>
          <circle cx="51" cy="42" r="8" fill="#fff" stroke={INK} strokeWidth="2.6" />
          <circle cx="69" cy="42" r="8" fill="#fff" stroke={INK} strokeWidth="2.6" />
          <path d="M59 42 H61" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
          <circle cx="51" cy="43" r="2.4" fill={INK} />
          <circle cx="69" cy="43" r="2.4" fill={INK} />
        </>
      ) : (
        <>
          <circle cx="51" cy="43" r="2.6" fill={INK} />
          <circle cx="69" cy="43" r="2.6" fill={INK} />
        </>
      )}
      <path d="M53 51 Q 60 57, 67 51" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
    </>
  );
}

type Costume = { key: string; label: string; art: ReactNode };

const COSTUMES: Costume[] = [
  {
    key: "graduate",
    label: "student",
    art: (
      <>
        <path d="M34 92 C 34 74, 46 66, 60 66 C 74 66, 86 74, 86 92 Z" fill="#2f2a4d" stroke={INK} strokeWidth="3" />
        <path d="M52 68 L 60 82 L 68 68" fill="var(--paper-2)" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
        <Head />
        {/* mortarboard */}
        <path d="M26 24 L 60 12 L 94 24 L 60 36 Z" fill={INK} />
        <path d="M60 36 L 60 44" stroke={INK} strokeWidth="2.6" />
        <path d="M92 25 L 92 40" stroke="var(--yellow)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="92" cy="42" r="3.4" fill="var(--yellow)" stroke={INK} strokeWidth="2" />
      </>
    ),
  },
  {
    key: "research",
    label: "research",
    art: (
      <>
        <path d="M34 92 C 34 74, 46 66, 60 66 C 74 66, 86 74, 86 92 Z" fill="#fdfdfb" stroke={INK} strokeWidth="3" />
        <path d="M52 68 L 60 80 L 68 68" fill="none" stroke={INK} strokeWidth="2.6" />
        <path d="M72 74 v 9" stroke="var(--orange-ink)" strokeWidth="3.4" strokeLinecap="round" />
        <Head glasses />
        {/* a slide under a lens */}
        <circle cx="96" cy="70" r="9" fill="none" stroke={INK} strokeWidth="3" />
        <path d="M102 77 L 110 86" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      </>
    ),
  },
  {
    key: "store",
    label: "the shop floor",
    art: (
      <>
        <path d="M34 92 C 34 74, 46 66, 60 66 C 74 66, 86 74, 86 92 Z" fill="var(--blue)" stroke={INK} strokeWidth="3" />
        <path d="M52 68 L 60 78 L 68 68" fill="none" stroke={INK} strokeWidth="2.6" />
        {/* a spark, not anyone's logo */}
        <path d="M70 76 v6 M67 79 h6 M68.2 76.8 l3.6 4.4 M71.8 76.8 l-3.6 4.4" stroke="var(--yellow)" strokeWidth="2.4" strokeLinecap="round" />
        <Head />
        {/* trolley */}
        <path d="M92 70 h6 l4 14 h14" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M102 76 h16 l-2 8 h-12 Z" fill="var(--paper-2)" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
        <circle cx="106" cy="90" r="2.6" fill={INK} />
        <circle cx="115" cy="90" r="2.6" fill={INK} />
      </>
    ),
  },
  {
    key: "kernels",
    label: "now",
    art: (
      <>
        <path d="M34 92 C 34 74, 46 66, 60 66 C 74 66, 86 74, 86 92 Z" fill="#2c2c34" stroke={INK} strokeWidth="3" />
        <path d="M52 68 L 60 80 L 68 68" fill="none" stroke={INK} strokeWidth="2.6" />
        <Head />
        {/* headphones */}
        <path d="M35 40 C 35 20, 85 20, 85 40" fill="none" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
        <rect x="29" y="36" width="10" height="16" rx="4" fill={INK} />
        <rect x="81" y="36" width="10" height="16" rx="4" fill={INK} />
        {/* a board with two hot cores */}
        <rect x="92" y="70" width="24" height="16" rx="3" fill="#1c2731" stroke={INK} strokeWidth="2.6" />
        <rect x="96" y="74" width="6" height="8" fill="var(--green)" />
        <rect x="106" y="74" width="6" height="8" fill="var(--orange)" />
      </>
    ),
  },
];

export type Flight = {
  year: string;
  title: string;
  body: string;
  tags: string[];
  /** Index into the costume list — which version of him was there. */
  costume: number;
  now?: boolean;
};

export function FlightPath({ flights }: { flights: Flight[] }) {
  const reduce = useReducedMotion();
  const rail = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);

  const { scrollYProgress } = useScroll({ target: rail, offset: ["start 62%", "end 62%"] });
  const glide = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.5 });
  const top = useTransform(glide, [0, 1], ["0%", "100%"]);

  // whichever stop the walker is level with owns the costume
  useEffect(() => {
    return glide.on("change", (p) => {
      const i = Math.max(0, Math.min(flights.length - 1, Math.floor(p * flights.length + 0.15)));
      setStage((prev) => (prev === i ? prev : i));
    });
  }, [glide, flights.length]);

  const costume = COSTUMES[flights[stage]?.costume ?? 0];

  return (
    <div className="relative grid gap-8 sm:grid-cols-[7.5rem_minmax(0,1fr)]">
      {/* the rail: the dashed line, and the walker who never leaves the screen */}
      <div ref={rail} className="relative hidden sm:block">
        <div aria-hidden className="absolute bottom-6 left-[3.4rem] top-4 w-px border-l-[3px] border-dashed border-blue/55" />
        {!reduce ? (
          <motion.div className="sticky top-[38vh] z-10 h-0" style={{ paddingTop: top }}>
            <div className="relative -ml-2 w-[7rem]">
              <AnimatePresence mode="wait">
                <motion.svg
                  key={costume.key}
                  width="112"
                  height="112"
                  viewBox="0 0 120 120"
                  initial={{ opacity: 0, scale: 0.82, rotate: -8 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.82, rotate: 8 }}
                  transition={{ duration: 0.32, ease: EASE_OUT }}
                  style={{ overflow: "visible" }}
                  aria-hidden
                >
                  {costume.art}
                </motion.svg>
              </AnimatePresence>
              <motion.p
                key={costume.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-center font-hand text-[15px] leading-none text-ink-faint"
              >
                {costume.label}
              </motion.p>
            </div>
          </motion.div>
        ) : null}
      </div>

      {/* the stops themselves, kept small on purpose */}
      <div className="space-y-6">
        {flights.map((f, i) => (
          <ScrollReveal key={`${f.year}-${i}`} y={18} amount={0.35} delay={i * 0.04}>
            <div className="relative">
              <span
                aria-hidden
                className={`absolute -left-[calc(4.6rem+1px)] top-7 hidden size-[15px] rounded-full border-[3px] bg-card sm:block ${
                  f.now ? "border-dashed border-ink-ghost" : "border-blue"
                }`}
              />
              <div
                className={`grid gap-x-6 gap-y-3 rounded-[1.35rem] px-7 py-6 sm:grid-cols-[4.5rem_minmax(0,1fr)] ${
                  f.now
                    ? "border-[3px] border-dashed border-hairline"
                    : "bg-card shadow-[var(--shadow-card)]"
                }`}
              >
                <p
                  className={`font-display text-[1.35rem] font-extrabold leading-none tracking-[-0.03em] ${
                    f.now ? "text-ink-faint" : "text-blue-ink"
                  }`}
                >
                  {f.year}
                </p>
                <div>
                  <h3 className="font-display text-[1.2rem] font-extrabold leading-snug tracking-[-0.03em]">
                    {f.title}
                  </h3>
                  <p className="mt-1.5 max-w-[38rem] text-[15px] leading-[1.55] text-ink-soft">{f.body}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {f.tags.map((t) => (
                      <Sticker key={t} tone="white" size="sm" className="shadow-[0_0_0_3px_var(--card)]">
                        {t}
                      </Sticker>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
