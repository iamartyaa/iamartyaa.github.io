"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useState } from "react";

import { useThemeToggle } from "@/components/motion/theme-toggle";
import { SPRING_SWAP } from "@/lib/ease";
import { cn } from "@/lib/utils";

const PULL = 74; // how far it can be pulled down
const TRIP = 30; // pull past this and the lights change

/**
 * The same gesture as the lamp on the desk, for the pages that don't have the
 * lamp: a cord hanging off the top edge. Drag it down and let go — or click
 * it, which pulls it for you.
 *
 * The cord is drawn, not decorative: its length is the drag value, so the
 * string really does stretch under your finger.
 *
 * Two placements. `hang` is the desktop one, fixed to the top-right of the
 * page. `dock` sits inside the phone's bottom dock: a short string and the
 * bead, in flow, so it never hangs over a card again.
 */
export function PullCord({ className, variant = "hang" }: { className?: string; variant?: "hang" | "dock" }) {
  const { isDark, mounted, toggle } = useThemeToggle({ variant: "circle-blur", start: variant === "dock" ? "bottom-right" : "top-right" });
  const reduce = useReducedMotion();
  const [tugging, setTugging] = useState(false);
  const y = useMotionValue(0);
  const rest = variant === "dock" ? 18 : 96; // how far the cord hangs before you touch it
  const pull = variant === "dock" ? 34 : PULL;
  const trip = variant === "dock" ? 14 : TRIP;
  const length = useTransform(y, (v) => rest + v);

  const release = () => {
    setTugging(false);
    if (y.get() > trip) toggle();
    animate(y, 0, SPRING_SWAP);
  };

  const click = () => {
    if (reduce) {
      toggle();
      return;
    }
    animate(y, pull * 0.7, { duration: 0.12 }).then(() => {
      toggle();
      animate(y, 0, SPRING_SWAP);
    });
  };

  const label = mounted && isDark ? "Turn the lights on" : "Turn the lights off";

  return (
    <div
      className={cn(
        "pointer-events-none flex flex-col items-center",
        variant === "hang" && "fixed right-7 top-0 z-30",
        variant === "dock" && "relative -mt-3",
        className,
      )}
    >
      {/* the string */}
      <motion.div aria-hidden className="w-[2.5px] rounded-full bg-ink/55" style={{ height: length }} />
      {/* the bead — its hit area is a good deal bigger than it looks */}
      <motion.button
        type="button"
        drag="y"
        dragConstraints={{ top: 0, bottom: pull }}
        dragElastic={0.08}
        dragMomentum={false}
        style={{ y }}
        onDragStart={() => setTugging(true)}
        onDragEnd={release}
        onClick={click}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.94 }}
        aria-label={label}
        title={label}
        className="pointer-events-auto relative -mt-px grid size-[26px] cursor-grab place-items-center rounded-full bg-card shadow-[0_0_0_3px_var(--paper),0_0_0_4.5px_var(--hairline),0_6px_14px_rgba(40,30,20,0.18)] before:absolute before:-inset-3 before:content-[''] active:cursor-grabbing"
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
        className={cn(
          "pointer-events-none mt-2 whitespace-nowrap font-hand text-ink-faint",
          variant === "dock" ? "text-[12px] leading-none" : "text-[15px]",
        )}
        animate={{ opacity: tugging ? 0 : 1 }}
        style={{ y }}
      >
        pull
      </motion.span>
    </div>
  );
}
