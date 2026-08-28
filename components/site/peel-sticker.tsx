"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";

import { SPRING_PANEL } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";

/**
 * A big die-cut sticker that peels off the page when you touch it.
 *
 * The corner is two stacked triangles: the backing paper left behind (the
 * page colour) and the underside of the vinyl curling up (a lighter card
 * tone). Growing both together, while the sheet lifts and rotates a degree
 * off the page, is what sells the peel — no physics needed, just a spring on
 * three values that agree with each other.
 */
export function PeelSticker({
  children,
  className,
  corner = 62,
}: {
  children: ReactNode;
  className?: string;
  /** Size of the peeled corner at rest, in px. */
  corner?: number;
}) {
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const [peeled, setPeeled] = useState(false);
  const active = peeled && canHover && !reduce;

  return (
    <motion.div
      className={cn("relative [perspective:1200px]", className)}
      onHoverStart={() => setPeeled(true)}
      onHoverEnd={() => setPeeled(false)}
      animate={{ y: active ? -8 : 0, rotate: active ? -1.2 : 0 }}
      transition={SPRING_PANEL}
    >
      <motion.div
        className="relative overflow-hidden rounded-[10rem_10rem_9rem_9rem] bg-card shadow-[var(--shadow-card)]"
        animate={{
          rotateX: active ? 4 : 0,
          rotateY: active ? -5 : 0,
          boxShadow: active
            ? "0 44px 66px -30px rgba(40,30,20,0.62)"
            : "0 22px 38px -26px rgba(40,30,20,0.5)",
        }}
        transition={SPRING_PANEL}
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}

        {/* The curl: a triangle of the sticker's underside lifting away from the
            page, with the shadow it would cast on what it uncovers. Small at
            rest — a corner that has just started to lift, not a torn page. */}
        <motion.div
          aria-hidden
          className="absolute bottom-0 right-0"
          animate={{ width: active ? corner * 1.6 : corner, height: active ? corner * 1.6 : corner }}
          transition={SPRING_PANEL}
          style={{
            clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
            background: "linear-gradient(225deg, var(--paper-2) 0%, var(--paper-3) 62%, var(--hairline) 100%)",
            filter: "drop-shadow(-6px -6px 10px rgba(40,30,20,0.22))",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
