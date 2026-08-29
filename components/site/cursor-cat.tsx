"use client";

import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Cat } from "@/components/art/cast";
import { chase } from "@/lib/chase";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";

/**
 * THE MASCOT — the cat off the desk, and the reason the route on /things has
 * something running along it.
 *
 * Two jobs, one animal:
 *   • by default he follows your cursor, a couple of springs behind, leaning
 *     into the turns — the lag is the whole character;
 *   • while the mouse is running the landings he forgets you completely,
 *     chases it, and hops. He aims at a point about a hundred pixels BEHIND
 *     the mouse, so he is always closing and never arrives. When it slips
 *     behind a sticker he stops, asks the obvious question, and after a
 *     moment goes back to following you.
 *
 * He is pointer-events-none everywhere. A mascot that eats clicks is a bug.
 */
export function CursorCat({ size = 92 }: { size?: number }) {
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const [awake, setAwake] = useState(false);
  const [mode, setMode] = useState<"cursor" | "hunt" | "lost">("cursor");

  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const x = useSpring(mx, { stiffness: 110, damping: 17, mass: 0.65 });
  const y = useSpring(my, { stiffness: 110, damping: 17, mass: 0.65 });
  const hop = useMotionValue(0);
  const lunge = useMotionValue(1);

  const lagX = useTransform([mx, x], ([a, b]: number[]) => a - b);
  const lagY = useTransform([my, y], ([a, b]: number[]) => a - b);
  const facing = useTransform(lagX, (v) => (v < -6 ? -1 : 1));
  const lean = useTransform(lagX, [-260, 260], [-13, 13], { clamp: true });
  const [look, setLook] = useState({ x: 0, y: 0 });

  const pointer = useRef({ x: -400, y: -400 });
  const lostSince = useRef(0);

  useEffect(() => {
    if (reduce || !canHover) return;
    const onMove = (e: PointerEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY };
      if (!awake) setAwake(true);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [awake, canHover, reduce]);

  useAnimationFrame((time) => {
    if (reduce || !canHover) return;
    const t = time / 1000;
    const c = chase.read();

    if (c.hunting) {
      if (mode !== "hunt") setMode("hunt");
      if (!awake) setAwake(true);
      // Aim behind the mouse along the LINE's own direction, not the mouse's
      // frame-to-frame velocity: when the reader stops scrolling the velocity
      // is zero and the cat would land on top of its dinner.
      const trail = 124;
      mx.set(c.x - c.dx * trail);
      my.set(c.y - c.dy * trail + 22);
      // a run of hops, with a bigger lunge every couple of seconds
      hop.set(-(Math.abs(Math.sin(t * 3.1)) ** 1.5) * 30);
      lunge.set(Math.sin(t * 2.4) > 0.94 ? 1.1 : 1);
    } else {
      if (c.lost) {
        if (mode !== "lost") {
          setMode("lost");
          lostSince.current = t;
        }
        // stop where the mouse vanished and look around
        hop.set(0);
        lunge.set(1);
        if (t - lostSince.current > 2.2) {
          chase.set({ lost: false });
          setMode("cursor");
        }
      } else if (mode !== "cursor") {
        setMode("cursor");
      }
      if (!c.lost) {
        mx.set(pointer.current.x);
        my.set(pointer.current.y);
        hop.set(0);
        lunge.set(1);
      }
    }

    const nx = Math.max(-1, Math.min(1, lagX.get() / 90));
    const ny = Math.max(-1, Math.min(1, lagY.get() / 80));
    setLook((p) => (Math.abs(p.x - nx) < 0.04 && Math.abs(p.y - ny) < 0.04 ? p : { x: nx, y: ny }));
  });

  if (reduce || !canHover || typeof document === "undefined") return null;

  return createPortal(
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-50"
      style={{ x, y, opacity: awake ? 1 : 0 }}
      transition={{ opacity: { duration: 0.4 } }}
    >
      <motion.div style={{ y: hop, scale: lunge }}>
        <motion.div style={{ scaleX: facing, rotate: lean, translateX: "-58%", translateY: "6%" }}>
          <Cat size={size} look={look} mood={mode === "hunt" ? "startled" : "rest"} />
        </motion.div>
      </motion.div>

      {mode === "lost" ? (
        <motion.span
          initial={{ opacity: 0, scale: 0.6, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-card px-3 py-1 font-hand text-[15px] font-semibold text-ink shadow-[var(--shadow-sticker-sm)]"
        >
          ?
        </motion.span>
      ) : null}
    </motion.div>,
    document.body,
  );
}
