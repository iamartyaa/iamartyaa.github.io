"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useState } from "react";

import { useThemeToggle } from "@/components/motion/theme-toggle";
import { SPRING_SWAP } from "@/lib/ease";
import { cn } from "@/lib/utils";

const REST = 96; // how far the cord hangs before you touch it (from its own top)
const PULL = 74; // how far it can be pulled down
const TRIP = 30; // pull past this and the lights change

/**
 * The same gesture as the lamp on the desk, for the pages that don't have the
 * lamp: a cord hanging off the top edge. Drag it down and let go — or click
 * it, which pulls it for you.
 *
 * The cord is drawn, not decorative: its length is the drag value, so the
 * string really does stretch under your finger.
 */
export function PullCord({ className }: { className?: string }) {
  const { isDark, mounted, toggle } = useThemeToggle({ variant: "circle-blur", start: "top-right" });
  const reduce = useReducedMotion();
  const [tugging, setTugging] = useState(false);
  const y = useMotionValue(0);
  const length = useTransform(y, (v) => REST + v);

  const release = () => {
    setTugging(false);
    if (y.get() > TRIP) toggle();
    animate(y, 0, SPRING_SWAP);
  };

  const click = () => {
    if (reduce) {
      toggle();
      return;
    }
    animate(y, PULL * 0.7, { duration: 0.12 }).then(() => {
      toggle();
      animate(y, 0, SPRING_SWAP);
    });
  };

  return (
    <div
      className={cn(
        // Below md the nav wraps to two rows and the cord used to hang
        // straight onto the active pill — two tap targets in one place. It
        // clears the whole header there instead.
        "pointer-events-none fixed right-5 top-[7.5rem] z-30 flex flex-col items-center sm:right-7 sm:top-0",
        className,
      )}
    >
      {/* the string */}
      <motion.div aria-hidden className="w-[2.5px] rounded-full bg-ink/55" style={{ height: length }} />
      {/* the bead */}
      <motion.button
        type="button"
        drag="y"
        dragConstraints={{ top: 0, bottom: PULL }}
        dragElastic={0.08}
        dragMomentum={false}
        style={{ y }}
        onDragStart={() => setTugging(true)}
        onDragEnd={release}
        onClick={click}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.94 }}
        aria-label={mounted && isDark ? "Turn the lights on" : "Turn the lights off"}
        className="pointer-events-auto -mt-px grid size-[26px] cursor-grab place-items-center rounded-full bg-card shadow-[0_0_0_3px_var(--paper),0_0_0_4.5px_var(--hairline),0_6px_14px_rgba(40,30,20,0.18)] active:cursor-grabbing"
      >
        <span
          className={cn(
            "size-[11px] rounded-full transition-colors duration-300",
            mounted && isDark ? "bg-yellow shadow-[0_0_10px_2px_rgba(255,197,58,0.7)]" : "bg-ink/35",
          )}
        />
      </motion.button>
      <motion.span
        aria-hidden
        className="pointer-events-none mt-2 whitespace-nowrap font-hand text-[15px] text-ink-faint"
        animate={{ opacity: tugging ? 0 : 1 }}
        style={{ y }}
      >
        pull
      </motion.span>
    </div>
  );
}
