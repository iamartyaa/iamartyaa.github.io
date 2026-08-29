"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useState } from "react";

import { ArrowRight } from "@/components/art/cast";
import { Stamp } from "@/components/site/hand-note";
import { SPECIMENS } from "@/components/site/specimens";
import { Sticker } from "@/components/site/sticker";
import { EASE_OUT, SPRING_PANEL } from "@/lib/ease";
import { href, readableDate, type Writing } from "@/lib/writings";
import { cn } from "@/lib/utils";

/**
 * THE ARTICLE STICKER — one big die-cut sticker per piece of writing, and the
 * only way into it.
 *
 * It does three things at once, which is why it isn't a card:
 *   1. it wears a live specimen of the article's OWN design system, so the
 *      shelf shows you four different worlds rather than four summaries;
 *   2. it behaves like the stickers everywhere else on this site — it tilts
 *      under the cursor, lifts off the paper, and has a corner that curls;
 *   3. a foil sheen sweeps across it on approach, which is the one piece of
 *      pure showing-off on the page, and the reason it reads as a collectable
 *      rather than a link.
 *
 * The whole thing is a plain anchor: the article is a static HTML file served
 * verbatim, not a route, so it must be a real navigation.
 */
export function ArticleSticker({ writing, index = 0 }: { writing: Writing; index?: number }) {
  const reduce = useReducedMotion();
  const [hot, setHot] = useState(false);
  const Specimen = SPECIMENS[writing.specimen];

  // Pointer parallax on the specimen rather than a 3D tilt on the card: the
  // specimen paints a grid, a rounded clip and a blend layer, and browsers
  // will drop that background on the compositor when it sits inside a
  // rotateX/rotateY subtree. Moving it in 2D reads as the same depth and
  // always paints.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const shiftX = useSpring(useTransform(px, [0, 1], [10, -10]), SPRING_PANEL);
  const shiftY = useSpring(useTransform(py, [0, 1], [8, -8]), SPRING_PANEL);

  const tilt = index % 2 === 0 ? -1.4 : 1.4;

  return (
    <motion.a
      href={href(writing)}
      className={cn(
        "group relative block rounded-[2.25rem] bg-card p-4 no-underline",
        "shadow-[0_0_0_6px_var(--paper),0_0_0_7.5px_var(--hairline),0_28px_46px_-30px_rgba(40,30,20,0.6)]",
      )}
      style={{ rotate: tilt }}
      onPointerMove={(e) => {
        if (reduce) return;
        const b = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - b.left) / b.width);
        py.set((e.clientY - b.top) / b.height);
      }}
      onPointerEnter={() => setHot(true)}
      onPointerLeave={() => {
        setHot(false);
        px.set(0.5);
        py.set(0.5);
      }}
      animate={{ y: hot && !reduce ? -12 : 0, rotate: hot && !reduce ? tilt * 0.2 : tilt }}
      transition={SPRING_PANEL}
    >
      <div>
        {/* the specimen: a window into the article's own world */}
        <div className="relative h-[19rem] overflow-hidden rounded-[1.25rem] ring-[2px] ring-hairline sm:h-[21rem]">
          <motion.div
            className="absolute -inset-10"
            style={reduce ? undefined : { x: shiftX, y: shiftY }}
            animate={{ scale: hot && !reduce ? 1.03 : 1 }}
            transition={SPRING_PANEL}
          >
            <Specimen active={hot || Boolean(reduce)} />
          </motion.div>

          {/* Foil: one narrow band sweeping across on approach. It blends
              rather than paints — a wide white wash would flatten the specimen
              underneath, which is the thing worth looking at. */}
          {!reduce ? (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(102deg, transparent 42%, rgba(255,255,255,0.85) 50%, transparent 58%)",
                backgroundSize: "260% 100%",
                mixBlendMode: "overlay",
              }}
              initial={{ backgroundPositionX: "-30%", opacity: 0 }}
              animate={hot ? { backgroundPositionX: "130%", opacity: 1 } : { backgroundPositionX: "-30%", opacity: 0 }}
              transition={{ duration: hot ? 0.9 : 0.2, ease: EASE_OUT }}
            />
          ) : null}

          {/* the corner of the specimen lifting off the sticker */}
          <motion.div
            aria-hidden
            className="absolute bottom-0 right-0"
            animate={{ width: hot ? 74 : 44, height: hot ? 74 : 44 }}
            transition={SPRING_PANEL}
            style={{
              clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
              background: "linear-gradient(225deg, var(--paper-2) 0%, var(--paper-3) 60%, var(--hairline) 100%)",
              filter: "drop-shadow(-5px -5px 9px rgba(40,30,20,0.22))",
            }}
          />

          <div className="absolute right-4 top-4">
            <Stamp tone="green">new</Stamp>
          </div>
        </div>

        {/* the label on the sticker */}
        <div className="px-4 pb-2 pt-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="label">{readableDate(writing.date)}</span>
            <span className="label text-ink-ghost">·</span>
            <span className="label">{writing.readTime}</span>
          </div>

          <h2 className="mt-2.5 font-display text-[clamp(1.9rem,3vw,2.6rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">
            {writing.title}
          </h2>
          <p className="mt-3 max-w-[34rem] text-[16px] leading-[1.6] text-ink-soft">{writing.dek}</p>

          <p className="mt-4 font-hand text-[16px] text-ink-faint">its own design system — {writing.system}</p>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            {writing.tags.map((t) => (
              <Sticker key={t} tone="white" size="sm" className="shadow-[0_0_0_3px_var(--card)]">
                {t}
              </Sticker>
            ))}
            <span className="ml-auto inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-display text-[15px] font-semibold tracking-[-0.02em] text-paper shadow-[var(--shadow-sticker-sm)] transition-transform duration-200 group-hover:-translate-y-0.5">
              read it
              <ArrowRight size={18} />
            </span>
          </div>
        </div>
      </div>
    </motion.a>
  );
}
