"use client";

import { useScroll, useSpring, useTransform, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * THE ROUTE — the blue dashed line the whole site is strung along, and the
 * paper plane that flies it as you scroll.
 *
 * The line is one SVG path in a 1440-wide viewBox stretched to the section
 * (preserveAspectRatio="none"), so a waypoint always lands on the card it
 * belongs to no matter the viewport. The plane is sampled off that same path
 * with getPointAtLength and placed in percentages of the box, which keeps it
 * glued to the line under the same stretch — and its heading comes from the
 * tangent, so it banks into every turn for free.
 */

export type RouteProps = {
  /** Path in a 0 0 1440 <height> viewBox. */
  d: string;
  height: number;
  /** Waypoints, in the same coordinates — one per landing. */
  stops?: { x: number; y: number }[];
  className?: string;
};

export function Route({ d, height, stops = [], className }: RouteProps) {
  return (
    <svg
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      viewBox={`0 0 1440 ${height}`}
      preserveAspectRatio="none"
    >
      <path
        d={d}
        fill="none"
        stroke="var(--blue)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray="9 11"
        className="animate-dashrun"
      />
      {stops.map((s) => (
        <circle key={`${s.x}-${s.y}`} cx={s.x} cy={s.y} r={9} fill="var(--card)" stroke="var(--blue)" strokeWidth={3} />
      ))}
    </svg>
  );
}

/** The plane itself, flying the given path as the section scrolls past. */
export function RoutePlane({ d, height, size = 92 }: { d: string; height: number; size?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const reduce = useReducedMotion();
  const samplesRef = useRef<{ x: number; y: number; a: number }[]>([]);
  const [ready, setReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // The plane trails the scroll instead of snapping to it — the single most
  // important detail for making it feel like a thing being carried along.
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.7 });

  // Pre-sample the path once; per-frame getPointAtLength on a long path is the
  // kind of thing that quietly costs you 60fps.
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    const n = 220;
    const out: { x: number; y: number; a: number }[] = [];
    for (let i = 0; i <= n; i++) {
      const p = path.getPointAtLength((i / n) * total);
      const q = path.getPointAtLength(Math.min(total, (i / n) * total + 6));
      out.push({ x: p.x, y: p.y, a: (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI });
    }
    samplesRef.current = out;
    setReady(true);
  }, [d]);

  // Reading the ref inside the transform keeps these three values live no
  // matter when the sampling finishes.
  const pick = (t: number) => {
    const s = samplesRef.current;
    if (!s.length) return null;
    return s[Math.min(s.length - 1, Math.max(0, Math.round(t * (s.length - 1))))];
  };

  const left = useTransform(progress, (t) => `${((pick(t)?.x ?? -200) / 1440) * 100}%`);
  const top = useTransform(progress, (t) => `${((pick(t)?.y ?? 0) / height) * 100}%`);
  const rotate = useTransform(progress, (t) => pick(t)?.a ?? 0);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 hidden md:block">
      <svg aria-hidden className="absolute h-0 w-0" viewBox={`0 0 1440 ${height}`}>
        <path ref={pathRef} d={d} />
      </svg>
      {ready && !reduce ? (
        <motion.div className="absolute" style={{ left, top, rotate, x: "-50%", y: "-50%" }}>
          <svg width={size} height={size * 0.74} viewBox="0 0 190 140" style={{ overflow: "visible" }}>
            <path d="M6 68 L 184 12 L 122 132 L 100 86 Z" fill="var(--card)" stroke="#241f1c" strokeWidth="6" strokeLinejoin="round" />
            <path d="M6 68 L 100 86 L 184 12 Z" fill="#e9eef9" stroke="#241f1c" strokeWidth="6" strokeLinejoin="round" />
            <path d="M100 86 L 112 112 L 122 132" stroke="#241f1c" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      ) : null}
    </div>
  );
}
