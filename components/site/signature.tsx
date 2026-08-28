"use client";

import { useAnimationFrame, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * THE SIGNATURE — the name, written rather than typeset.
 *
 * Ten strokes in the order a hand would make them (the A's diagonal before its
 * crossbar, the t crossed after its stem, the swash last), each drawn by
 * running its own dash offset down to zero. Stroke duration is proportional to
 * stroke length, so the pen keeps a constant speed instead of racing through
 * the long ones — that constant speed is the whole trick.
 *
 * The nib rides the stroke being drawn: every frame we ask the live path where
 * it is at the current length. Nothing re-renders; the loop writes attributes
 * straight to the DOM.
 */

const STROKES = [
  "M40 182 C 62 122, 92 62, 114 30 C 128 66, 150 132, 168 182", // A, up and down
  "M72 136 L 152 136", // A crossbar
  "M186 180 C 186 142, 188 122, 196 120 C 206 118, 210 142, 210 180 C 210 144, 216 120, 226 120 C 236 120, 240 144, 240 180", // m
  "M286 132 C 274 116, 252 122, 250 146 C 248 168, 270 178, 280 160 C 284 150, 284 136, 283 124 C 282 144, 282 164, 290 180", // a
  "M306 180 C 306 150, 308 128, 310 122 C 314 140, 322 126, 334 122", // r
  "M356 88 C 356 130, 354 158, 358 168 C 362 178, 374 176, 382 166", // t stem
  "M340 128 L 374 128", // t cross
  "M396 122 C 396 148, 402 168, 412 168 C 422 168, 428 146, 430 122 C 430 158, 428 202, 414 216 C 404 226, 392 220, 392 208", // y
  "M486 132 C 474 116, 452 122, 450 146 C 448 168, 470 178, 480 160 C 484 150, 484 136, 483 124 C 482 144, 482 162, 488 174", // a
  "M504 186 C 512 210, 462 224, 372 226 C 268 228, 158 220, 104 206", // the swash
];

const SPEED = 560; // path units per second — a comfortable writing hand
const GAP = 0.075; // seconds the pen is off the page between strokes

export function Signature({
  className,
  color = "var(--yellow)",
  width = 9,
}: {
  className?: string;
  color?: string;
  width?: number;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const nib = useRef<SVGGElement>(null);
  const lens = useRef<number[]>([]);
  const startedAt = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [running, setRunning] = useState(false);
  const reduce = useReducedMotion();
  const inView = useInView(svg, { amount: 0.5 });

  useEffect(() => {
    lens.current = paths.current.map((p) => p?.getTotalLength() ?? 0);
    paths.current.forEach((p, i) => {
      if (!p) return;
      const l = lens.current[i];
      p.style.strokeDasharray = `${l}`;
      p.style.strokeDashoffset = `${reduce ? 0 : l}`;
    });
    setReady(true);
  }, [reduce]);

  // Rewrites itself every time it comes back into view — worth seeing twice.
  useEffect(() => {
    if (!ready || reduce) return;
    if (inView) {
      startedAt.current = null;
      setRunning(true);
    }
  }, [inView, ready, reduce]);

  useAnimationFrame((time) => {
    if (!running || reduce) return;
    if (startedAt.current === null) startedAt.current = time;
    const elapsed = (time - startedAt.current) / 1000;

    let cursor = 0;
    let penAt: { x: number; y: number } | null = null;

    for (let i = 0; i < STROKES.length; i++) {
      const path = paths.current[i];
      const len = lens.current[i] ?? 0;
      if (!path || !len) continue;
      const dur = len / SPEED;
      const local = (elapsed - cursor) / dur;

      if (local <= 0) {
        path.style.strokeDashoffset = `${len}`;
      } else if (local >= 1) {
        path.style.strokeDashoffset = "0";
      } else {
        path.style.strokeDashoffset = `${len * (1 - local)}`;
        const p = path.getPointAtLength(len * local);
        penAt = { x: p.x, y: p.y };
      }
      cursor += dur + GAP;
    }

    if (nib.current) {
      if (penAt) {
        nib.current.style.opacity = "1";
        nib.current.style.transform = `translate(${penAt.x}px, ${penAt.y}px)`;
      } else {
        nib.current.style.opacity = "0";
      }
    }
    if (elapsed > cursor) setRunning(false);
  });

  return (
    <svg
      ref={svg}
      className={cn("w-full", className)}
      viewBox="0 0 600 260"
      role="img"
      aria-label="Amartya, handwritten"
      style={{ overflow: "visible" }}
    >
      <g fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round">
        {STROKES.map((d, i) => (
          <path
            key={d}
            d={d}
            ref={(el) => {
              paths.current[i] = el;
            }}
          />
        ))}
      </g>
      {/* the nib: a wet dot of ink where the pen is touching down */}
      <g ref={nib} style={{ opacity: 0 }}>
        <circle r={width * 0.72} fill={color} />
        <circle r={width * 1.9} fill={color} opacity={0.18} />
      </g>
    </svg>
  );
}
