"use client";

import { useThemeToggle } from "@/components/motion/theme-toggle";
import { Sticker } from "@/components/site/sticker";

const INK = "currentColor";

/** The desk lamp, drawn the same way as the one on the desk. */
function Lamp({ on, size = 22 }: { on: boolean; size?: number }) {
  return (
    <svg width={size} height={size * 1.05} viewBox="0 0 24 25" aria-hidden>
      {/* base, arm, shade */}
      <path d="M6.5 22.5 H16" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M11.2 22.5 C 11.2 17, 9.5 13.5, 8.2 11.4" stroke={INK} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path
        d="M4 11.2 L 8.2 4.6 L 14.4 8.6 Z"
        fill={on ? "var(--yellow)" : "none"}
        stroke={INK}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {on ? (
        <path
          d="M6 15.5 L 4 18 M11 16.5 L 10.6 19.4 M15.8 14.6 L 18.2 16.6"
          stroke="var(--yellow)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : null}
    </svg>
  );
}

/**
 * Night mode is the desk lamp: click it and the room goes dark while the lamp
 * keeps burning — in the page AND in the 3D scene. The wipe is beUI's
 * View Transition toggle, expanding from the button itself so the darkness
 * spreads out of the lamp you just switched.
 */
export function NightToggle() {
  const { isDark, mounted, toggle } = useThemeToggle({ variant: "circle-blur", start: "top-right" });

  return (
    <Sticker
      tone="white"
      size="md"
      tilt={-2}
      onClick={toggle}
      className="px-4"
      aria-label={isDark ? "Turn the lamp off" : "Turn the lamp on"}
    >
      <Lamp on={Boolean(mounted && isDark)} />
    </Sticker>
  );
}
