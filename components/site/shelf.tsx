"use client";

import { motion, useReducedMotion } from "motion/react";
import { type ReactNode } from "react";

import { Monitor, Notebook, PaperPlane, Rocket } from "@/components/art/cast";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { SPRING_PANEL } from "@/lib/ease";

/**
 * THE SHELF — what's in progress right now.
 *
 * The one section on the site that is supposed to go out of date: four things
 * standing on a plank, each one lifting off the shelf when you reach for it.
 * Everything else on /about describes habits that outlive a job title; this is
 * the part that gets rewritten, and it looks like a shelf so that reads as a
 * feature rather than an omission.
 */

type Item = {
  label: string;
  title: string;
  body: string;
  art: ReactNode;
  bg: string;
  tilt: number;
};

const ITEMS: Item[] = [
  {
    label: "Learning",
    title: "CUDA, at night",
    body: "Kernels, memory, and what actually makes inference fast. Slowly, properly, from the bottom.",
    art: <Rocket size={104} />,
    bg: "bg-butter",
    tilt: -3,
  },
  {
    label: "Building",
    title: "Agents that file the paperwork",
    body: "The multi-agent system that writes and scores change requests, still growing new hands.",
    art: <Monitor size={112} />,
    bg: "bg-peach",
    tilt: 2.5,
  },
  {
    label: "Writing",
    title: "Notes as I go",
    body: "Whatever I just worked out, written down badly first so it can be written down properly.",
    art: <Notebook size={108} />,
    bg: "bg-sky",
    tilt: -2,
  },
  {
    label: "Next",
    title: "A layer down",
    body: "Closer to the metal than last year, and closer again next year. The direction has never changed.",
    art: <PaperPlane size={112} />,
    bg: "bg-mint",
    tilt: 3,
  },
];

export function Shelf() {
  const reduce = useReducedMotion();

  return (
    <div className="relative">
      {/* the objects, standing on one plank */}
      <div className="grid grid-cols-2 items-end gap-x-8 gap-y-10 sm:grid-cols-4">
        {ITEMS.map((item, i) => (
          <ScrollReveal key={item.title} delay={i * 0.09} y={26} className="flex justify-center">
            <motion.div
              className={`flex size-[9.5rem] items-center justify-center rounded-[2rem] ${item.bg} shadow-[0_0_0_5px_var(--paper),0_0_0_6.5px_var(--hairline),0_18px_26px_-18px_rgba(40,30,20,0.5)]`}
              style={{ rotate: item.tilt }}
              whileHover={reduce ? undefined : { rotate: item.tilt * -1.4, y: -18, scale: 1.05 }}
              transition={SPRING_PANEL}
            >
              {item.art}
            </motion.div>
          </ScrollReveal>
        ))}
      </div>

      {/* the shelf itself: one plank, two brackets */}
      <div aria-hidden className="relative mt-4">
        <div className="h-[16px] rounded-[7px] bg-[#d8a86a] shadow-[inset_0_-5px_0_rgba(0,0,0,0.15),0_16px_24px_-16px_rgba(40,30,20,0.75)] ring-[2.5px] ring-ink/85" />
        <div className="absolute left-[7%] top-[15px] h-[16px] w-[74px] origin-top-left -skew-x-[38deg] rounded-b-[6px] bg-[#b98548] ring-[2.5px] ring-ink/85" />
        <div className="absolute right-[7%] top-[15px] h-[16px] w-[74px] origin-top-right skew-x-[38deg] rounded-b-[6px] bg-[#b98548] ring-[2.5px] ring-ink/85" />
      </div>

      {/* what each one is, hanging under the shelf like a label */}
      <div className="mt-9 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
        {ITEMS.map((item, i) => (
          <ScrollReveal key={item.label} delay={0.1 + i * 0.09} y={18}>
            <div className="text-center">
              <p className="label">{item.label}</p>
              <h3 className="mt-1.5 font-display text-[21px] font-extrabold leading-tight tracking-[-0.03em]">
                {item.title}
              </h3>
              <p className="mx-auto mt-2 max-w-[15rem] text-[14.5px] leading-[1.55] text-ink-soft">{item.body}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
