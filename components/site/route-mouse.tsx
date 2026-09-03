"use client";

import { motion, useAnimationFrame, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";

import { Mouse } from "@/components/art/cast";
import { chase } from "@/lib/chase";

/**
 * THE MOUSE — it runs the dashed line while you read, and it is pinned to the
 * middle of the screen the whole way.
 *
 * Not driven by a scroll-progress spring: that puts the runner wherever the
 * easing happens to leave it. Instead, every frame we ask "which point on this
 * path is currently level with the middle of the viewport?" and put the mouse
 * there. The result is that scrolling *is* the mouse's motion — it can't drift,
 * it reverses exactly when you scroll back, and it always sits where your eye
 * already is.
 *
 * At the end of the route it makes for the drawer and disappears behind a
 * sticker; the cat, which has been chasing it through lib/chase, loses it.
 */
export function RouteMouse({
  d,
  height,
  section,
  size = 58,
}: {
  d: string;
  height: number;
  /** The element the viewBox is stretched over. */
  section: RefObject<HTMLElement | null>;
  size?: number;
}) {
  const reduce = useReducedMotion();
  const pathRef = useRef<SVGPathElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const samples = useRef<{ x: number; y: number; a: number }[]>([]);
  const [ready, setReady] = useState(false);
  const [hiding, setHiding] = useState(false);
  const facing = useRef(1);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    if (!total) return;
    const n = 260;
    const out: { x: number; y: number; a: number }[] = [];
    for (let i = 0; i <= n; i++) {
      const at = (i / n) * total;
      const p = path.getPointAtLength(at);
      const q = path.getPointAtLength(Math.min(total, at + 6));
      out.push({ x: p.x, y: p.y, a: (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI });
    }
    samples.current = out;
    setReady(true);
  }, [d]);

  useAnimationFrame(() => {
    const el = box.current;
    const host = section.current;
    if (!el || !host || !samples.current.length || reduce) return;

    const rect = host.getBoundingClientRect();
    const mid = window.innerHeight / 2;

    // how far down the section is the middle of the screen right now?
    const t = (mid - rect.top) / rect.height;

    if (t <= 0.015 || t >= 0.995) {
      el.style.opacity = "0";
      chase.set({ hunting: false, lost: t >= 0.995 });
      if (t < 0.995 && hiding) setHiding(false);
      return;
    }

    // Pick the point on the path that is level with the middle of the screen —
    // NOT the point at that fraction of the path's length. Sampling is by arc
    // length, so the two are different wherever the line is steep, and only
    // this one keeps the mouse pinned to the middle of the viewport.
    const targetY = t * height;
    const arr = samples.current;
    let lo = 0;
    let hi = arr.length - 1;
    while (hi - lo > 1) {
      const midI = (lo + hi) >> 1;
      if (arr[midI].y < targetY) lo = midI;
      else hi = midI;
    }
    const a = arr[lo];
    const bnd = arr[hi];
    const span = bnd.y - a.y || 1;
    const k = Math.max(0, Math.min(1, (targetY - a.y) / span));
    const s = { x: a.x + (bnd.x - a.x) * k, y: targetY, a: a.a + (bnd.a - a.a) * k };

    // the path's own coordinates, stretched onto the section's real box
    let x = rect.left + (s.x / 1440) * rect.width;
    let y = rect.top + (s.y / height) * rect.height;
    let opacity = 1;
    let scale = 1;

    // the last stretch: break for the drawer and vanish behind a sticker
    const den = chase.read().den;
    if (t > 0.9 && den) {
      const b = den.getBoundingClientRect();
      const k = Math.min(1, (t - 0.9) / 0.08);
      x += (b.left + b.width * 0.22 - x) * k;
      y += (b.top + b.height * 0.42 - y) * k;
      opacity = 1 - k * 0.98;
      scale = 1 - k * 0.25;
      if (k > 0.6 && !hiding) setHiding(true);
    } else if (hiding) {
      setHiding(false);
    }

    // face the way it is travelling
    const dir = Math.cos((s.a * Math.PI) / 180) >= 0 ? 1 : -1;
    facing.current += (dir - facing.current) * 0.2;
    // a scurry: small vertical bob, faster than the scroll
    const bob = Math.sin(performance.now() / 90) * 1.6;

    el.style.opacity = String(opacity);
    el.style.transform = `translate(${x}px, ${y + bob}px) translate(-50%, -50%) scaleX(${facing.current.toFixed(2)}) scale(${scale.toFixed(2)}) rotate(${(s.a * 0.12).toFixed(1)}deg)`;

    const rad = (s.a * Math.PI) / 180;
    chase.set({
      hunting: opacity > 0.5,
      x,
      y,
      dx: Math.cos(rad),
      dy: Math.sin(rad),
      lost: opacity <= 0.5,
    });
  });

  useEffect(() => () => chase.set({ hunting: false, lost: false }), []);

  if (reduce) return null;

  return (
    <>
      {/* the path lives here only to be measured */}
      <svg aria-hidden className="absolute h-0 w-0" viewBox={`0 0 1440 ${height}`}>
        <path ref={pathRef} d={d} />
      </svg>
      {/* Same reason as the cat: portalled to <body>, because the route
          transition's own transform would otherwise become this element's
          containing block and the mouse would scroll away with the page.
          On a phone the line runs behind the full-width cards, so the mouse
          does too: a negative z-index puts it under the cards and it pops out
          in the gaps between them, which is where the line is visible anyway. */}
      {ready && typeof document !== "undefined"
        ? createPortal(
            <div ref={box} className="pointer-events-none fixed left-0 top-0 opacity-0 max-sm:-z-[1] sm:z-30" aria-hidden>
              <Mouse size={size} scared={hiding} className="max-sm:h-auto max-sm:w-[2.6rem]" />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
