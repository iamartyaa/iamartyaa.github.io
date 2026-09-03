"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";

import { ArrowRight, Monitor, Mug, Notebook, Plant } from "@/components/art/cast";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { SPRING_PANEL } from "@/lib/ease";

/**
 * WHAT'S ON IT — the desk's four destinations, as a sheet of die-cut stickers.
 *
 * These were cards, which made the row read like a blog index; the desk is a
 * sticker world, so they are stickers: paper ring, a die-cut tile holding the
 * object, a tilt of a degree or two, and a corner that lifts when you reach
 * for one. The copy says what you actually get, not what the object is.
 */

type DeskObject = {
  kicker: string;
  title: string;
  body: string;
  art: ReactNode;
  tile: string;
  shape: string;
  href: string;
  tilt: number;
};

const OBJECTS: DeskObject[] = [
  {
    kicker: "the monitor",
    title: "Things I made",
    body: "Agents that file their own paperwork, a rewrite against a labour-law deadline, and eleven services that stay up.",
    art: <Monitor size={118} />,
    tile: "bg-peach",
    shape: "rounded-[2rem]",
    href: "/things",
    tilt: -1.6,
  },
  {
    kicker: "the notebook",
    title: "Things I wrote",
    body: "Long, illustrated notes on how something works — each one built as its own website, in its own design system.",
    art: <Notebook size={112} />,
    tile: "bg-sky",
    shape: "rounded-full",
    href: "/writings",
    tilt: 1.4,
  },
  {
    kicker: "the plant",
    title: "Still growing",
    body: "CUDA and kernels at night, and what actually makes inference fast. Updated more often than my job title.",
    art: <Plant size={108} />,
    tile: "bg-mint",
    shape: "rounded-[2rem]",
    href: "/about",
    tilt: -1.2,
  },
  {
    kicker: "the mug",
    title: "Say hi",
    body: "Chai, and whatever you're building. I read everything that lands in the inbox.",
    art: <Mug size={104} />,
    tile: "bg-butter",
    shape: "rounded-full",
    href: "/about#say-hi",
    tilt: 1.8,
  },
];

export function DeskObjects() {
  const reduce = useReducedMotion();
  const [hot, setHot] = useState<string | null>(null);

  return (
    <div className="grid gap-5 sm:grid-cols-2 sm:gap-7 xl:grid-cols-4">
      {OBJECTS.map((o, i) => {
        const on = hot === o.title;
        return (
          <ScrollReveal key={o.title} delay={i * 0.07} y={22}>
            <Link href={o.href} className="group block h-full no-underline">
              <motion.div
                onHoverStart={() => setHot(o.title)}
                onHoverEnd={() => setHot(null)}
                animate={{
                  y: on && !reduce ? -10 : 0,
                  rotate: on && !reduce ? o.tilt * 0.25 : o.tilt,
                }}
                transition={SPRING_PANEL}
                className="relative flex h-full flex-col overflow-hidden rounded-[1.6rem] bg-card p-6 shadow-[0_0_0_5px_var(--paper),0_0_0_6.5px_var(--hairline),0_20px_34px_-26px_rgba(40,30,20,0.55)] sm:min-h-[19.5rem] sm:rounded-[2rem] sm:p-7"
              >
                <p className="label">{o.kicker}</p>
                <h3 className="mt-2 font-display text-[26px] font-extrabold leading-tight tracking-[-0.035em]">
                  {o.title}
                </h3>
                <p className="mt-2.5 text-[14.5px] leading-[1.55] text-ink-soft">{o.body}</p>

                <div className="mt-auto flex items-end justify-between pt-5 sm:pt-6">
                  <span className="inline-flex items-center gap-1.5 font-hand text-[16px] text-ink-faint transition-transform duration-200 group-hover:translate-x-0.5">
                    open
                    <ArrowRight size={16} />
                  </span>
                  <motion.div
                    className={`grid size-[6rem] place-items-center sm:size-[7.5rem] ${o.shape} ${o.tile} shadow-[0_0_0_4px_var(--card),0_0_0_5.5px_var(--hairline)] [&_svg]:h-auto [&_svg]:w-[4.5rem] sm:[&_svg]:w-auto`}
                    animate={{ rotate: on && !reduce ? -o.tilt * 2.4 : o.tilt * 1.6, scale: on && !reduce ? 1.06 : 1 }}
                    transition={SPRING_PANEL}
                  >
                    {o.art}
                  </motion.div>
                </div>

                {/* the corner of the sticker lifting off the sheet */}
                <motion.span
                  aria-hidden
                  className="absolute bottom-0 right-0"
                  animate={{ width: on && !reduce ? 56 : 0, height: on && !reduce ? 56 : 0 }}
                  transition={SPRING_PANEL}
                  style={{
                    clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                    background: "linear-gradient(225deg, var(--paper-2) 0%, var(--paper-3) 60%, var(--hairline) 100%)",
                    filter: "drop-shadow(-5px -5px 9px rgba(40,30,20,0.22))",
                  }}
                />
              </motion.div>
            </Link>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
