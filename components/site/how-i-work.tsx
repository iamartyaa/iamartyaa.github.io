"use client";

import { motion, useReducedMotion } from "motion/react";

import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { HandNote } from "@/components/site/hand-note";
import { EASE_OUT } from "@/lib/ease";

/**
 * HOW I WORK — four promises, in the order they happen.
 *
 * Every icon is drawn on screen rather than faded in: each path animates its
 * own `pathLength` from 0 to 1 when the card arrives, and plays again on
 * hover, so the section is a hand sketching four marks rather than a row of
 * static boxes. The connector between the cards draws itself the same way, one
 * long dashed line through all four.
 */

const draw = (delay: number) => ({
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 0.85, delay, ease: EASE_OUT }, opacity: { duration: 0.12, delay } },
  },
});

type Step = {
  n: string;
  when: string;
  title: string;
  body: string;
  tone: string;
  icon: React.ReactNode;
};

const STEPS: Step[] = [
  {
    n: "01",
    when: "Day one",
    title: "It gets drawn",
    tone: "text-orange-ink",
    body: "Before any code, a sketch of how the thing works. If I can't draw it, I don't understand it yet — and it's much cheaper to argue with a drawing than with a pull request.",
    icon: (
      <motion.svg width="92" height="92" viewBox="0 0 100 100" fill="none" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }}>
        <motion.path
          d="M20 78 L 26 58 L 66 18 L 84 36 L 44 76 Z"
          stroke="#241f1c"
          strokeWidth="3.4"
          strokeLinejoin="round"
          variants={draw(0)}
        />
        <motion.path d="M26 58 L 44 76" stroke="#241f1c" strokeWidth="3.4" variants={draw(0.5)} />
        <motion.path d="M14 88 C 26 84, 34 86, 42 90" stroke="var(--orange)" strokeWidth="3.4" strokeLinecap="round" variants={draw(0.7)} />
      </motion.svg>
    ),
  },
  {
    n: "02",
    when: "Day two",
    title: "Something already runs",
    tone: "text-blue-ink",
    body: "A small working thing beats a beautiful plan. You get something you can click while the spec is still warm, even if it's ugly — especially if it's ugly.",
    icon: (
      <motion.svg width="92" height="92" viewBox="0 0 100 100" fill="none" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }}>
        <motion.rect x="20" y="26" width="60" height="46" rx="9" stroke="#241f1c" strokeWidth="3.4" variants={draw(0)} />
        <motion.path d="M20 40 H80" stroke="#241f1c" strokeWidth="3.4" variants={draw(0.4)} />
        <motion.path d="M32 56 L 42 64 L 66 48" stroke="var(--blue)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" variants={draw(0.6)} />
        <motion.path d="M40 72 V 84 M60 72 V 84 M32 84 H 68" stroke="#241f1c" strokeWidth="3.4" strokeLinecap="round" variants={draw(0.85)} />
      </motion.svg>
    ),
  },
  {
    n: "03",
    when: "Then",
    title: "Correct, kind, fast — in that order",
    tone: "text-green-ink",
    body: "Right first, pleasant to use second, quick third. Every other order I've tried spends someone else's week.",
    icon: (
      <motion.svg width="92" height="92" viewBox="0 0 100 100" fill="none" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }}>
        <motion.circle cx="50" cy="50" r="27" stroke="#241f1c" strokeWidth="3.4" variants={draw(0)} />
        <motion.path d="M50 32 V 50 L 63 58" stroke="var(--green)" strokeWidth="4" strokeLinecap="round" variants={draw(0.5)} />
        <motion.path d="M84 30 C 90 40, 90 60, 84 70" stroke="#241f1c" strokeWidth="3.2" strokeLinecap="round" variants={draw(0.75)} />
        <motion.path d="M16 30 C 10 40, 10 60, 16 70" stroke="#241f1c" strokeWidth="3.2" strokeLinecap="round" variants={draw(0.85)} />
      </motion.svg>
    ),
  },
  {
    n: "04",
    when: "Always",
    title: "The notes are public",
    tone: "text-yellow-ink",
    body: "Whatever I worked out gets written down, so the next person doesn't have to come and ask me. Half of what I know came back to me that way.",
    icon: (
      <motion.svg width="92" height="92" viewBox="0 0 100 100" fill="none" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }}>
        <motion.path d="M28 18 H 72 A6 6 0 0 1 78 24 V 82 H 28 A6 6 0 0 1 22 76 V 24 A6 6 0 0 1 28 18 Z" stroke="#241f1c" strokeWidth="3.4" strokeLinejoin="round" variants={draw(0)} />
        <motion.path d="M34 38 H 66" stroke="var(--yellow)" strokeWidth="4" strokeLinecap="round" variants={draw(0.45)} />
        <motion.path d="M34 50 H 60" stroke="#241f1c" strokeWidth="3.2" strokeLinecap="round" variants={draw(0.6)} />
        <motion.path d="M34 62 H 66" stroke="#241f1c" strokeWidth="3.2" strokeLinecap="round" variants={draw(0.72)} />
        <motion.path d="M56 76 C 66 70, 74 74, 80 84" stroke="var(--orange)" strokeWidth="3.4" strokeLinecap="round" variants={draw(0.9)} />
      </motion.svg>
    ),
  },
];

export function HowIWork() {
  const reduce = useReducedMotion();

  return (
    <div className="relative">
      {/* The line that runs through all four. Deliberately NOT drawn with
          motion's pathLength: pathLength drives stroke-dasharray itself and
          would eat the dashes. It fades up instead, and the dashes are
          already marching along it (animate-dashrun). */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-6 -top-[3.4rem] hidden h-14 lg:block"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: EASE_OUT }}
      >
        <svg className="h-full w-full" viewBox="0 0 1200 60" preserveAspectRatio="none" fill="none">
          <path
            d="M20 44 C 200 6, 330 52, 470 26 C 610 2, 700 50, 840 26 C 980 2, 1090 44, 1180 20"
            stroke="var(--blue)"
            strokeWidth="3"
            strokeDasharray="9 11"
            strokeLinecap="round"
            className="animate-dashrun"
          />
        </svg>
      </motion.div>

      <div className="relative grid gap-5 sm:grid-cols-2 sm:gap-7 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <ScrollReveal key={s.n} delay={i * 0.09} y={26}>
            <motion.div
              whileHover={reduce ? undefined : { y: -10, rotate: i % 2 ? 0.8 : -0.8 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              className="relative flex h-full flex-col rounded-[1.5rem] bg-card p-6 shadow-[var(--shadow-card)] sm:rounded-[1.75rem] sm:p-8 lg:min-h-[22rem]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className={`font-display text-[15px] ${s.tone}`}>{s.n}</span>
                  <p className="label mt-1">{s.when}</p>
                </div>
                <div className="-mr-1 -mt-2">{s.icon}</div>
              </div>
              <h3 className="mt-5 font-display text-[24px] font-extrabold leading-tight tracking-[-0.035em]">
                {s.title}
              </h3>
              <p className="mt-3 text-[15.5px] leading-[1.6] text-ink-soft">{s.body}</p>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>

      {/* the short version, in his own hand */}
      <ScrollReveal y={20} delay={0.15}>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-5 rounded-[1.5rem] bg-panel px-6 py-6 text-on-panel ring-1 ring-[var(--panel-edge)] sm:mt-9 sm:gap-6 sm:px-9 sm:py-7">
          <p className="max-w-[46rem] font-display text-[clamp(1.3rem,2.1vw,1.75rem)] font-extrabold leading-tight tracking-[-0.035em]">
            The short version: you&apos;ll see something working before you see a status update.
          </p>
          <HandNote tilt={-2} className="text-yellow">
            that&apos;s the whole method
          </HandNote>
        </div>
      </ScrollReveal>
    </div>
  );
}
