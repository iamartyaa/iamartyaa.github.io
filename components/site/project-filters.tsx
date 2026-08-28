"use client";

import { useState } from "react";

import { SharedLayoutBg } from "@/components/motion/shared-layout-bg";
import { Sticker } from "@/components/site/sticker";

const FILTERS = ["everything", "ai agents", "product", "systems", "just for fun"];

/**
 * Filters are stickers, not a segmented control — same hover glide as the nav
 * (beUI SharedLayoutBg) so the two rows feel like the same object family.
 */
export function ProjectFilters() {
  const [active, setActive] = useState(FILTERS[0]);

  return (
    <SharedLayoutBg
      as="div"
      className="w-auto flex-row flex-wrap items-center gap-3"
      inset={6}
      pillClassName="rounded-full bg-ink/[0.05]"
    >
      {FILTERS.map((f, i) => (
        <div key={f}>
          <Sticker
            tone={active === f ? "ink" : "white"}
            size="sm"
            tilt={active === f ? 0 : i % 2 ? 1 : -1}
            onClick={() => setActive(f)}
          >
            {f}
          </Sticker>
        </div>
      ))}
    </SharedLayoutBg>
  );
}
