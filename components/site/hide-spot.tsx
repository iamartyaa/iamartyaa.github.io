"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { chase } from "@/lib/chase";

/**
 * Registers whatever it wraps as the place the mouse disappears into at the
 * end of the route — here, the drawer of smaller things. Kept as its own
 * component so the page stays a server component and the two characters never
 * have to be passed each other's refs.
 */
export function HideSpot({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chase.set({ den: ref.current });
    return () => chase.set({ den: null });
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
