"use client";

import {
  motion,
  type MotionStyle,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { type ReactNode, type RefObject, useRef } from "react";

import { cn } from "@/lib/utils";

const PARALLAX_SPRING = { stiffness: 120, damping: 30, mass: 0.6 };

export interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  axis?: "x" | "y";
  container?: RefObject<HTMLElement | null>;
  spring?: boolean;
  className?: string;
}

export function Parallax({
  children,
  speed = 0.3,
  axis = "y",
  container,
  spring = true,
  className,
}: ParallaxProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    container,
    offset: ["start end", "end start"],
  });

  const travel = speed * 100;
  const drift = useTransform(scrollYProgress, [0, 1], [travel, -travel]);
  const smoothed = useSpring(drift, PARALLAX_SPRING);
  const value = spring && !reduce ? smoothed : drift;

  const style: MotionStyle = reduce ? {} : axis === "x" ? { x: value } : { y: value };

  return (
    <motion.div ref={ref} style={style} className={cn(className)}>
      {children}
    </motion.div>
  );
}
