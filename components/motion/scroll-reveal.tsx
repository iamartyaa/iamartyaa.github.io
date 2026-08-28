"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { type ReactNode, type RefObject, useRef } from "react";

import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface ScrollRevealProps {
  children: ReactNode;
  y?: number;
  blur?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
  amount?: "some" | "all" | number;
  root?: RefObject<Element | null>;
  className?: string;
}

export function ScrollReveal({
  children,
  y = 16,
  blur = 8,
  duration = 0.6,
  delay = 0,
  once = true,
  amount = 0.3,
  root,
  className,
}: ScrollRevealProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { root, once, amount });

  const hidden = reduce ? { opacity: 0 } : { opacity: 0, y, filter: `blur(${blur}px)` };
  const shown = reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" };

  return (
    <motion.div
      ref={ref}
      initial={hidden}
      animate={inView ? shown : hidden}
      transition={{ duration, ease: EASE_OUT, delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
