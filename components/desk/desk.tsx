"use client";

import dynamic from "next/dynamic";

import { HandNote } from "@/components/site/hand-note";

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

export function Desk({ className }: { className?: string }) {
  return (
    <div className={className}>
      <DeskScene />
    </div>
  );
}
