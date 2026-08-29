import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * A margin note in Shantell Sans — the site's aside voice.
 * House rule from the design canvas: one per area, never two competing.
 */
export function HandNote({
  children,
  tone = "faint",
  tilt = 0,
  className,
}: {
  children: ReactNode;
  tone?: "faint" | "orange" | "blue" | "ink";
  tilt?: number;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-hand text-[19px] font-semibold leading-tight",
        tone === "faint" && "text-ink-faint",
        tone === "orange" && "text-orange-ink",
        tone === "blue" && "text-blue-ink",
        tone === "ink" && "text-ink",
        className,
      )}
      style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
    >
      {children}
    </p>
  );
}

/** Rubber stamp — marks arrival at a waypoint on the route. */
export function Stamp({
  children,
  tone = "orange",
  className,
}: {
  children: ReactNode;
  tone?: "orange" | "green";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block rotate-[-8deg] rounded-[10px] border-[3px] px-3 py-[7px]",
        "font-mono text-[13px] font-bold uppercase tracking-[0.12em] opacity-90",
        tone === "orange" ? "border-orange-ink text-orange-ink" : "border-green-ink text-green-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}
