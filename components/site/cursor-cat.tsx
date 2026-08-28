"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";

import { Cat } from "@/components/art/cast";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";

/**
 * THE MASCOT — the cat off the desk, following you around the page.
 *
 * Two springs (one per axis) chase the pointer, which is what makes him feel
 * like a thing being carried along rather than a cursor decoration: he
 * overshoots on a fast flick and settles late. He turns to face the direction
 * he's travelling, his eyes lead the turn, and he is `pointer-events-none`
 * everywhere — a mascot that eats clicks is a bug, not a joke.
 */
export function CursorCat({ size = 92 }: { size?: number }) {
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const [awake, setAwake] = useState(false);

  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const x = useSpring(mx, { stiffness: 110, damping: 17, mass: 0.65 });
  const y = useSpring(my, { stiffness: 110, damping: 17, mass: 0.65 });

  // how far behind he is right now — the lag is the character
  const lagX = useTransform([mx, x], ([a, b]: number[]) => a - b);
  const lagY = useTransform([my, y], ([a, b]: number[]) => a - b);
  const facing = useTransform(lagX, (v) => (v < -6 ? -1 : 1));
  const lean = useTransform(lagX, [-260, 260], [-13, 13], { clamp: true });
  const [look, setLook] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduce || !canHover) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      if (!awake) setAwake(true);
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setLook({
          x: Math.max(-1, Math.min(1, lagX.get() / 90)),
          y: Math.max(-1, Math.min(1, lagY.get() / 80)),
        });
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [awake, canHover, lagX, lagY, mx, my, reduce]);

  if (reduce || !canHover) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-50"
      style={{ x, y, opacity: awake ? 1 : 0 }}
      transition={{ opacity: { duration: 0.4 } }}
    >
      <motion.div style={{ scaleX: facing, rotate: lean, translateX: "-58%", translateY: "6%" }}>
        <Cat size={size} look={look} />
      </motion.div>
    </motion.div>
  );
}
