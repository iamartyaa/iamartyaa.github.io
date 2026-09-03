"use client";

import { Html, Outlines } from "@react-three/drei";
import { useCursor } from "@react-three/drei/web/useCursor";
import { useState, type ReactNode } from "react";

import { INK } from "./config";

/**
 * Ink line on every solid, so 3D reads as one hand with the 2D drawings.
 * drei measures `thickness` in PIXELS while `screenspace` is false, which is
 * what we want: the line keeps its weight as the desk spins, exactly like the
 * 2.4px stroke on the SVG cast.
 */
export function Ink({ thickness = 4 }: { thickness?: number }) {
  return <Outlines thickness={thickness} color={INK} angle={Math.PI} />;
}

/** The hover label: one sticker above the object, never five copies of it. */
export function Label({
  children,
  y = 1.15,
  tone = "card",
  hand = false,
}: {
  children: ReactNode;
  y?: number;
  tone?: "card" | "ink";
  hand?: boolean;
}) {
  return (
    <Html center distanceFactor={8} position={[0, y, 0]} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
      <span
        className={
          tone === "ink"
            ? `whitespace-nowrap rounded-full bg-ink px-3.5 py-1.5 text-[15px] font-semibold text-paper shadow-[var(--shadow-sticker-sm)] ${hand ? "font-hand" : "font-sans"}`
            : `whitespace-nowrap rounded-full bg-card px-4 py-2 text-[15px] font-semibold text-ink shadow-[var(--shadow-sticker)] ${hand ? "font-hand" : "font-sans"}`
        }
      >
        {children}
      </span>
    </Html>
  );
}

/**
 * Hover state plus the pointer cursor, for any group that reacts to the
 * pointer. Returns the handlers to spread onto the group.
 */
export function useHover() {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  return {
    hovered,
    handlers: {
      onPointerOver: (e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        setHovered(true);
      },
      onPointerOut: () => setHovered(false),
    },
  };
}
