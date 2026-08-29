"use client";

import { SharedLayoutBg } from "@/components/motion/shared-layout-bg";
import { Sticker } from "@/components/site/sticker";

/**
 * Filters are stickers, not a segmented control — same hover glide as the nav
 * (beUI SharedLayoutBg) so the two rows feel like the same object family.
 *
 * They are controlled, and they really filter: the landings below are the
 * matching ones, and the dashed line is regenerated through whatever is left,
 * which is what the note beside them promises.
 */
export function ProjectFilters({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <SharedLayoutBg
      as="div"
      className="w-auto flex-row flex-wrap items-center gap-3"
      inset={6}
      pillClassName="rounded-full bg-ink/[0.05]"
    >
      {options.map((f, i) => {
        const active = value === f;
        return (
          <div key={f}>
            <Sticker
              tone={active ? "ink" : "white"}
              size="sm"
              tilt={active ? 0 : i % 2 ? 1 : -1}
              onClick={() => onChange(f)}
              aria-label={active ? `Showing ${f}` : `Show ${f}`}
            >
              {f}
            </Sticker>
          </div>
        );
      })}
    </SharedLayoutBg>
  );
}
