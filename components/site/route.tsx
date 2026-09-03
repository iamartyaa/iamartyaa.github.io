"use client";

import { cn } from "@/lib/utils";

/**
 * THE ROUTE — the blue dashed line the landings are strung along.
 *
 * The runner that follows it lives in route-mouse.tsx; this is only the line
 * and its waypoints.
 *
 * The line is one SVG path in a 1440-wide viewBox stretched to the section
 * (preserveAspectRatio="none"), so a waypoint always lands on the card it
 * belongs to no matter the viewport. The stroke is non-scaling so the dashes
 * keep their weight when the box is squeezed onto a phone, and the waypoints
 * are HTML dots positioned in percentages for the same reason — a circle in
 * a stretched viewBox is an ellipse.
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
    <>
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
          vectorEffect="non-scaling-stroke"
          className="animate-dashrun"
        />
      </svg>
      {stops.map((s) => (
        <span
          key={`${s.x}-${s.y}`}
          aria-hidden
          className="pointer-events-none absolute size-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-blue bg-card"
          style={{ left: `${(s.x / 1440) * 100}%`, top: `${(s.y / height) * 100}%` }}
        />
      ))}
    </>
  );
}
