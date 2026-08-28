"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { EASE_OUT } from "@/lib/ease";

/**
 * Route change = the plane carries you.
 *
 * `template.tsx` remounts on every navigation (unlike `layout.tsx`), so this
 * is the one place a page-enter animation can live in the App Router. The
 * plane crosses the viewport while the new page settles in behind it, which
 * makes the three routes feel like three stops on one flight rather than
 * three documents.
 */
export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <>
      <motion.div
        key={`plane-${pathname}`}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.25, delay: 1 }}
      >
        <motion.div
          className="absolute"
          initial={{ left: "-18%", top: "78%", rotate: -18, scale: 0.9 }}
          animate={{ left: "112%", top: "12%", rotate: -6, scale: 1.05 }}
          transition={{ duration: 1.15, ease: EASE_OUT }}
        >
          <svg width="120" height="89" viewBox="0 0 190 140" style={{ overflow: "visible" }}>
            <path d="M6 68 L 184 12 L 122 132 L 100 86 Z" fill="var(--card)" stroke="#241f1c" strokeWidth="6" strokeLinejoin="round" />
            <path d="M6 68 L 100 86 L 184 12 Z" fill="#e9eef9" stroke="#241f1c" strokeWidth="6" strokeLinejoin="round" />
            <path d="M100 86 L 112 112 L 122 132" stroke="#241f1c" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.div>

      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.12 }}
      >
        {children}
      </motion.div>
    </>
  );
}
