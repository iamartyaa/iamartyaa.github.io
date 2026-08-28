"use client";

import { useRef } from "react";

import { AvatarWaving, SmileyDot, Sparkle } from "@/components/art/cast";
import { Parallax } from "@/components/motion/parallax";
import { HandNote } from "@/components/site/hand-note";
import { PeelSticker } from "@/components/site/peel-sticker";
import { ThrowableSticker } from "@/components/site/throwable-sticker";

/**
 * The band under the hero: the portrait you can peel off the page and stick
 * somewhere else, and the traits you can throw.
 *
 * It owns the drag area — the sticker can be moved anywhere inside this band,
 * which is wide enough to feel free and bounded enough that nothing ever ends
 * up under the fixed nav or off the side of the page.
 */
export function HeroBand() {
  const area = useRef<HTMLDivElement>(null);

  return (
    <div ref={area} className="relative mt-6 hidden items-start gap-16 lg:flex">
      {/* Parallax sets a transform, which makes a stacking context — the
          portrait has to be raised here, or a sticker it is dragged over
          paints on top of it. */}
      <div className="relative z-30">
        <Parallax speed={0.1}>
        <PeelSticker className="w-[19rem]" constraints={area} hint="peel me off and stick me anywhere">
          {(mood) => (
            <div className="px-6 pt-4">
              <AvatarWaving size={248} mood={mood} />
            </div>
          )}
        </PeelSticker>
        </Parallax>
      </div>

      <div className="flex flex-col items-start gap-7 pt-10">
        <ThrowableSticker tone="sky" rotate={-7} size="md">
          <Sparkle size={20} />
          learns in public
        </ThrowableSticker>
        <ThrowableSticker tone="white" rotate={5} size="md" className="ml-12">
          <SmileyDot size={20} />
          ships small things often
        </ThrowableSticker>
        <ThrowableSticker tone="ink" rotate={-10} size="md" className="ml-4">
          Bengaluru, IN
        </ThrowableSticker>
        <HandNote tone="orange" tilt={2} className="ml-2 mt-1">
          pick these up and throw them →
        </HandNote>
      </div>
    </div>
  );
}
