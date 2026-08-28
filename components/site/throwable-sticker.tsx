"use client";

import { motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Sticker, type StickerProps } from "@/components/site/sticker";

/**
 * Stickers you can pick up and throw.
 *
 * Real rigid-body physics for six DOM pills would mean a second canvas and a
 * WASM payload for a joke; drag with momentum gets the same feeling — pick it
 * up, fling it, watch it coast and tilt into the direction of travel, then
 * spring back to where it belongs on the sheet.
 */
export function ThrowableSticker({
  rotate = 0,
  className,
  children,
  ...sticker
}: Omit<StickerProps, "children"> & { rotate?: number; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Tilt into the throw — the cue that the thing has weight.
  const tilt = useTransform(x, [-260, 0, 260], [-16, 0, 16]);

  if (reduce) {
    return (
      <div className={className} style={{ transform: `rotate(${rotate}deg)` }}>
        <Sticker {...sticker}>{children}</Sticker>
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      drag
      dragMomentum
      dragElastic={0.5}
      dragTransition={{ power: 0.35, timeConstant: 380, bounceStiffness: 260, bounceDamping: 22 }}
      dragConstraints={{ left: -220, right: 220, top: -140, bottom: 140 }}
      whileDrag={{ scale: 1.06, cursor: "grabbing", zIndex: 30 }}
      style={{ x, y, rotate: tilt }}
      className={cn("inline-block cursor-grab touch-none active:cursor-grabbing", className)}
    >
      <div style={{ transform: `rotate(${rotate}deg)` }}>
        <Sticker {...sticker}>{children}</Sticker>
      </div>
    </motion.div>
  );
}
