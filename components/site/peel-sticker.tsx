"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useRef, useState, type ReactNode, type RefObject } from "react";

import type { Mood } from "@/components/art/cast";
import { SPRING_PANEL, SPRING_PRESS } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";

/**
 * A die-cut sticker you can actually peel off the page and stick somewhere
 * else.
 *
 * Three states, and the drawing inside reacts to all of them:
 *   rest     — a corner lifts when you hover, the sheet tilts a degree
 *   peeling  — you have it by the corner: it curls right back, scales up,
 *              swings under the cursor and casts a real shadow
 *   placed   — you let go: it slaps down where you dropped it, overshoots
 *              once, and the face looks pleased with itself
 *
 * The slot it came from keeps its shape as a dashed ghost, so the page never
 * reflows and it's obvious the sticker belongs somewhere.
 */
export function PeelSticker({
  children,
  className,
  corner = 62,
  constraints,
  hint = "drag me off the page",
}: {
  /** Render prop so the artwork can react to the peel. */
  children: (mood: Mood) => ReactNode;
  className?: string;
  /** Size of the peeled corner at rest, in px. */
  corner?: number;
  /** Area the sticker can be dragged around in. */
  constraints?: RefObject<HTMLElement | null>;
  hint?: string;
}) {
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [moved, setMoved] = useState(false);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // How far it has travelled decides how hard the corner curls: the peel is
  // driven by the gesture, not by a fixed keyframe.
  const travel = useTransform([x, y], ([dx, dy]: number[]) => Math.min(1, Math.hypot(dx, dy) / 260));
  const curl = useTransform(travel, (t) => corner * (1 + t * 1.35));

  const interactive = canHover && !reduce;
  const mood: Mood = dragging ? "peeling" : placed ? "placed" : "rest";
  const lifted = interactive && (hovered || dragging);

  const settle = () => {
    setDragging(false);
    setPlaced(true);
    setMoved(Math.hypot(x.get(), y.get()) > 12);
    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => setPlaced(false), 1600);
  };

  const putBack = () => {
    animate(x, 0, SPRING_PANEL);
    animate(y, 0, SPRING_PANEL);
    setMoved(false);
  };

  return (
    <div className={cn("relative", className)}>
      {/* the slot it was peeled out of */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[10rem_10rem_9rem_9rem] border-[3px] border-dashed border-hairline transition-opacity duration-500",
          moved ? "opacity-100" : "opacity-0",
        )}
      />

      <motion.div
        className={cn("relative [perspective:1200px]", interactive && "cursor-grab active:cursor-grabbing")}
        // While it is off the page it has to be above everything it is being
        // carried over, and it stays above once placed, because it is now
        // physically on top of whatever it landed on.
        style={{ x, y, zIndex: dragging ? 40 : moved ? 30 : 1 }}
        drag={interactive}
        dragConstraints={constraints}
        dragElastic={0.14}
        dragMomentum={false}
        onDragStart={() => setDragging(true)}
        onDragEnd={settle}
        onDoubleClick={putBack}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        // motion makes a draggable focusable; without these it lands in the
        // tab order as an unnamed div
        role={interactive ? "button" : undefined}
        aria-label={interactive ? "Peel the portrait off the page and drag it somewhere else" : undefined}
        onKeyDown={(e) => {
          if (e.key === "Escape") putBack();
        }}
        // NB: never animate `y` here — `style.y` is the drag's own motion
        // value, and animating it would drag the sticker back out from under
        // the cursor. The hover lift lives on the card inside instead.
        animate={{
          rotate: dragging ? -4.5 : lifted ? -1.6 : 0,
          scale: dragging ? 1.06 : 1,
        }}
        transition={dragging ? SPRING_PRESS : SPRING_PANEL}
        whileTap={{ scale: 1.04 }}
      >
        <motion.div
          className="relative overflow-hidden rounded-[10rem_10rem_9rem_9rem] bg-card shadow-[var(--shadow-card)]"
          animate={{
            y: dragging ? 0 : lifted ? -10 : 0,
            rotateX: dragging ? 9 : lifted ? 4 : 0,
            rotateY: dragging ? -11 : lifted ? -5 : 0,
            boxShadow: dragging
              ? "0 70px 90px -34px rgba(40,30,20,0.68)"
              : lifted
                ? "0 44px 66px -30px rgba(40,30,20,0.62)"
                : "0 22px 38px -26px rgba(40,30,20,0.5)",
          }}
          transition={SPRING_PANEL}
          style={{ transformStyle: "preserve-3d" }}
        >
          {children(mood)}

          {/* The curl: the sticker's own underside lifting off the page, sized
              by how far you've dragged it. */}
          <motion.div
            aria-hidden
            className="absolute bottom-0 right-0"
            style={{
              width: curl,
              height: curl,
              clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
              background: "linear-gradient(225deg, var(--paper-2) 0%, var(--paper-3) 62%, var(--hairline) 100%)",
              filter: "drop-shadow(-6px -6px 10px rgba(40,30,20,0.22))",
            }}
          />
        </motion.div>

        {/* what to do with it, and how to undo it */}
        <motion.p
          aria-hidden
          className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap font-hand text-[16px] text-ink-faint"
          animate={{ opacity: interactive && !dragging ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        >
          {moved ? "double-click to put me back" : hint}
        </motion.p>
      </motion.div>
    </div>
  );
}
