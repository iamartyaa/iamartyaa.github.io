"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { HandNote } from "@/components/site/hand-note";
import { cn } from "@/lib/utils";

import type { DeskLayout } from "./config";

/**
 * three.js never runs on the server: the scene is a client-only island so the
 * rest of the page still streams and the first paint is paper, not a spinner.
 */
const DeskScene = dynamic(() => import("@/components/desk/desk-scene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <HandNote tone="faint" tilt={-2}>
        setting up the desk…
      </HandNote>
    </div>
  ),
});

/**
 * The island's two economies:
 *   • it only renders while it is on (or near) the screen — a desk three
 *     screens up should not be spending frames while you read the footer;
 *   • on a touch device it drops the shadow maps, the contact-shadow pass and
 *     the 2× pixel ratio, which is the difference between 60fps and a warm phone.
 */
export function Desk({ className, layout }: { className?: string; layout?: DeskLayout }) {
  const host = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const [lean, setLean] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: "25% 0px 25% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setLean(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  return (
    <div ref={host} className={cn("relative", className)}>
      <DeskScene layout={layout} active={active} lean={lean} />
    </div>
  );
}
