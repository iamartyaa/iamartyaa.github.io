"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useRef, useState, type ReactNode } from "react";

import { ArrowRight } from "@/components/art/cast";
import { TiltCard } from "@/components/motion/tilt-card";
import { Stamp } from "@/components/site/hand-note";
import { ProjectFilters } from "@/components/site/project-filters";
import { Route } from "@/components/site/route";
import { RouteMouse } from "@/components/site/route-mouse";
import { Sticker } from "@/components/site/sticker";
import { buildRoute, waypoints } from "@/lib/route-path";
import { EASE_OUT } from "@/lib/ease";

/**
 * THE LANDINGS — the four projects, the line through them, and the mouse.
 *
 * This owns the filter state because the filter is not decoration: picking a
 * category hides the landings that don't match AND regenerates the dashed
 * line through the ones that do (lib/route-path). The mouse runs whatever
 * line is currently there.
 */

export type Project = {
  n: string;
  tone: string;
  title: string;
  meta: string;
  body: string;
  tags: string[];
  category: string;
  art: ReactNode;
  featured?: boolean;
};

/** One landing is about this tall on a desktop; the viewBox matches, so the
 *  curve keeps the shape it was drawn with instead of being stretched. */
const LANDING_H = 600;

export function Landings({ projects }: { projects: Project[] }) {
  const reduce = useReducedMotion();
  const section = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState("everything");

  const options = useMemo(
    () => ["everything", ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects],
  );
  const visible = useMemo(
    () => (filter === "everything" ? projects : projects.filter((p) => p.category === filter)),
    [filter, projects],
  );

  const { d, stops, height } = useMemo(() => {
    const sides = visible.map((p, i) => (p.featured ? ("full" as const) : i % 2 === 0 ? ("left" as const) : ("right" as const)));
    const h = Math.max(1, visible.length) * LANDING_H;
    const { path, stops } = waypoints(sides, h);
    return { d: buildRoute(path), stops, height: h };
  }, [visible]);

  return (
    <>
      <div className="relative z-10 mt-14">
        <ProjectFilters options={options} value={filter} onChange={setFilter} />
        <p className="mt-5 font-hand text-[17px] text-ink-faint">
          {filter === "everything"
            ? "filtering re-draws the line and the mouse runs the new one ↴"
            : `${visible.length} landing${visible.length === 1 ? "" : "s"} — the line was re-drawn through ${
                visible.length === 1 ? "it" : "them"
              }`}
        </p>
      </div>

      <div ref={section} className="relative mt-[6rem] pb-[7rem]">
        {/* the line behind the cards, and the mouse running it over them */}
        <div className="pointer-events-none absolute inset-x-[-2vw] inset-y-0 z-0">
          <div className="relative mx-auto h-full max-w-[1440px]">
            <Route d={d} height={height} stops={stops} />
          </div>
        </div>
        <RouteMouse d={d} height={height} section={section} />

        <div className="relative z-10 space-y-[12rem]">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p, i) => (
              <motion.div
                key={p.n}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: 24, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, y: -16, scale: 0.98 }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
                className={
                  p.featured ? "relative" : i % 2 === 0 ? "relative flex justify-start" : "relative flex justify-end"
                }
              >
                <TiltCard
                  max={p.featured ? 6 : 8}
                  glare={false}
                  className={`relative bg-card shadow-[var(--shadow-card)] ${
                    p.featured ? "w-full rounded-[2rem]" : "w-full max-w-[43rem] rounded-[1.75rem]"
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
                        {p.tags.map((t, k) => (
                          <Sticker key={`${p.n}-${k}`} tone="white" size="sm" className="shadow-[0_0_0_3px_var(--card)]">
                            {t}
                          </Sticker>
                        ))}
                      </div>
                      {p.featured ? (
                        <div className="mt-7 flex flex-wrap gap-3">
                          <Sticker tone="ink" size="md" tilt={-1.5} display magnetic href="/writings">
                            read the story
                            <ArrowRight size={18} />
                          </Sticker>
                        </div>
                      ) : null}
                    </div>
                    <div className="flex items-end justify-end gap-4">
                      <div className="hidden sm:block">{p.art}</div>
                    </div>
                  </div>
                  <div className="absolute right-6 top-6">
                    <Stamp tone="green">landed</Stamp>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
