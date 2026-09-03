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
 *
 * Each item is one column — the object, its bit of plank, its label — so the
 * plank is under every object on every width. On a desktop the four segments
 * butt together into one shelf; on a phone they make two short shelves of two.
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
    <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-4 sm:gap-x-0 sm:gap-y-0">
      {ITEMS.map((item, i) => (
        <div key={item.title} className="group flex flex-col items-center">
          <ScrollReveal delay={i * 0.09} y={26} className="flex justify-center">
            <motion.div
              className={`flex size-[7.5rem] items-center justify-center rounded-[1.6rem] sm:size-[9.5rem] sm:rounded-[2rem] ${item.bg} shadow-[0_0_0_5px_var(--paper),0_0_0_6.5px_var(--hairline),0_18px_26px_-18px_rgba(40,30,20,0.5)] [&_svg]:h-auto [&_svg]:w-[5.25rem] sm:[&_svg]:w-auto`}
              style={{ rotate: item.tilt }}
              whileHover={reduce ? undefined : { rotate: item.tilt * -1.4, y: -18, scale: 1.05 }}
              transition={SPRING_PANEL}
            >
              {item.art}
            </motion.div>
          </ScrollReveal>

          {/* this item's stretch of the plank, and the bracket holding it up */}
          <div aria-hidden className="relative mt-4 w-full">
            <div className="h-[14px] rounded-[7px] bg-[#d8a86a] shadow-[inset_0_-5px_0_rgba(0,0,0,0.15),0_16px_24px_-16px_rgba(40,30,20,0.75)] ring-[2.5px] ring-ink/85 sm:h-[16px] sm:rounded-none sm:group-first:rounded-l-[7px] sm:group-last:rounded-r-[7px]" />
            <div className="absolute left-1/2 top-[13px] h-[14px] w-[58px] origin-top-left -translate-x-1/2 -skew-x-[38deg] rounded-b-[6px] bg-[#b98548] ring-[2.5px] ring-ink/85 sm:top-[15px] sm:h-[16px] sm:w-[70px]" />
          </div>

          {/* what it is, hanging under the shelf like a label */}
          <ScrollReveal delay={0.1 + i * 0.09} y={18} className="mt-8 px-1 sm:mt-9 sm:px-3">
            <div className="text-center">
              <p className="label">{item.label}</p>
              <h3 className="mt-1.5 font-display text-[19px] font-extrabold leading-tight tracking-[-0.03em] sm:text-[21px]">
                {item.title}
              </h3>
              <p className="mx-auto mt-2 max-w-[15rem] text-[14.5px] leading-[1.55] text-ink-soft">{item.body}</p>
            </div>
          </ScrollReveal>
        </div>
      ))}
    </div>
  );
}
