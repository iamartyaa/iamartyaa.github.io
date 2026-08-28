"use client";

import type { ReactNode } from "react";

import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { cn } from "@/lib/utils";

/**
 * Page shell. Gutters and section rhythm come straight from the locked
 * spacing pass — 76px gutters, ~200px between sections — so no page can
 * drift from the canvas by hand-tuning a margin.
 */
export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("px-gutter", className)}>
      <div className="mx-auto max-w-[1440px]">{children}</div>
    </section>
  );
}

/**
 * Every section opens the same way: a mono label, a display heading that
 * springs in word by word, and an optional aside on the right.
 */
export function SectionHead({
  label,
  title,
  aside,
  className,
}: {
  label: string;
  title: string;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-9 flex flex-wrap items-end justify-between gap-6", className)}>
      <div>
        <ScrollReveal y={10} blur={4} amount={0.6}>
          <p className="label">{label}</p>
        </ScrollReveal>
        <TextReveal
          text={title}
          as="h2"
          whileInView
          stagger={0.06}
          className="mt-2.5 font-display text-[clamp(2.25rem,4vw,3.5rem)] font-extrabold leading-none tracking-[-0.035em]"
        />
      </div>
      {aside ? <div className="max-w-[22rem]">{aside}</div> : null}
    </div>
  );
}
