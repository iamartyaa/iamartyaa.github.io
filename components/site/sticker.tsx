"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { Magnetic } from "@/components/motion/magnetic";
import { cn } from "@/lib/utils";

/**
 * The atom of this design system.
 *
 * A sticker is a die-cut object sitting ON the paper: a white bleed ring
 * (box-shadow spread, not a border, so the ring follows the pill radius) and a
 * soft contact shadow under it. Everything interactive on this site is a
 * sticker — nav items, buttons, tags, filters, contact links — so the page
 * reads as one physical sheet instead of a set of unrelated controls.
 */

export type StickerTone =
  | "white"
  | "ink"
  | "orange"
  | "yellow"
  | "mint"
  | "sky"
  | "peach"
  | "butter";

export type StickerSize = "sm" | "md" | "lg";

/**
 * Tones are token pairs, never raw colours: the same sticker has to stay
 * readable when the room goes dark, so "white" means "the card surface" —
 * paper-white by day, warm charcoal at night.
 */
const TONE: Record<StickerTone, string> = {
  white: "bg-card text-ink",
  ink: "bg-ink text-paper",
  orange: "bg-orange text-white",
  yellow: "bg-yellow text-ink",
  mint: "bg-mint text-ink",
  sky: "bg-sky text-ink",
  peach: "bg-peach text-ink",
  butter: "bg-butter text-ink",
};

const SIZE: Record<StickerSize, string> = {
  sm: "px-3.5 py-[7px] text-[13px] gap-1.5",
  md: "px-5 py-2.5 text-[15px] gap-2.5",
  lg: "px-6 py-3.5 text-[17px] gap-2.5",
};

/**
 * The die-cut bleed ring. It matches the surface the sticker is stuck to —
 * the card colour on the page, the ink colour on a dark panel — which is what
 * sells "cut out and stuck on" rather than "floating rounded rectangle".
 */
const RING: Record<"paper" | "ink", string> = {
  paper: "shadow-[var(--shadow-sticker)]",
  ink: "shadow-[0_0_0_5px_var(--ink),0_12px_22px_-14px_rgba(0,0,0,0.7)]",
};

export interface StickerProps {
  children: ReactNode;
  tone?: StickerTone;
  size?: StickerSize;
  /** Degrees of peel-off-the-sheet rotation. Keep within ±3 — more reads sloppy. */
  tilt?: number;
  /** Cursor pull. Reserve for primary actions; everything magnetic is noise. */
  magnetic?: boolean;
  /** Ring colour — use "ink" when the sticker sits on a dark surface. */
  on?: "paper" | "ink";
  href?: string;
  onClick?: () => void;
  className?: string;
  display?: boolean;
  /** Let a long sticker wrap instead of forcing the page wider than the phone. */
  wrap?: boolean;
  "aria-label"?: string;
}

export function Sticker({
  children,
  tone = "white",
  size = "md",
  tilt = 0,
  magnetic = false,
  on = "paper",
  href,
  onClick,
  className,
  display = false,
  wrap = false,
  "aria-label": ariaLabel,
}: StickerProps) {
  const classes = cn(
    "inline-flex max-w-full select-none items-center rounded-full font-semibold",
    wrap ? "whitespace-normal text-pretty" : "whitespace-nowrap",
    "transition-[transform,box-shadow] duration-200 ease-[var(--ease-out)]",
    TONE[tone],
    SIZE[size],
    RING[on],
    display && "font-display tracking-[-0.02em]",
    (href || onClick) && "cursor-pointer hover:-translate-y-0.5 active:translate-y-0",
    className,
  );

  const style = tilt ? { transform: `rotate(${tilt}deg)` } : undefined;

  const inner = href ? (
    <Link href={href} className={classes} style={style}>
      {children}
    </Link>
  ) : onClick ? (
    <button type="button" onClick={onClick} aria-label={ariaLabel} className={classes} style={style}>
      {children}
    </button>
  ) : (
    <span className={classes} style={style}>
      {children}
    </span>
  );

  return magnetic ? <Magnetic strength={0.25}>{inner}</Magnetic> : inner;
}

/** A sticker that floats and wobbles on the page — decoration, never a control. */
export function FloatingSticker({
  rotate = 0,
  delay = 0,
  className,
  ...props
}: StickerProps & { rotate?: number; delay?: number }) {
  return (
    <div
      className={cn("animate-wobble", className)}
      style={
        {
          "--r": `${rotate}deg`,
          animationDelay: `${delay}s`,
        } as ComponentProps<"div">["style"]
      }
    >
      <Sticker {...props} />
    </div>
  );
}
