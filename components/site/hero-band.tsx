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
 *
 * On touch there is no peeling and no throwing (both need a pointer that
 * hovers), but the portrait and the stickers are still here: smaller, in a
 * row, and honest about being stickers rather than toys.
 */
export function HeroBand() {
  const area = useRef<HTMLDivElement>(null);

  return (
    <div ref={area} className="relative mt-8 flex flex-col items-start gap-7 sm:mt-10 lg:mt-6 lg:flex-row lg:gap-16">
      {/* Parallax sets a transform, which makes a stacking context — the
          portrait has to be raised here, or a sticker it is dragged over
          paints on top of it. */}
      <div className="relative z-30 w-[12rem] sm:w-[15rem] lg:w-auto">
        <Parallax speed={0.1}>
          <PeelSticker className="w-full lg:w-[19rem]" constraints={area} hint="peel me off and stick me anywhere">
            {(mood) => (
              <div className="px-4 pt-3 lg:px-6 lg:pt-4">
                <AvatarWaving size={248} mood={mood} className="h-auto w-full" />
              </div>
            )}
          </PeelSticker>
        </Parallax>
      </div>

      <div className="flex flex-row flex-wrap items-start gap-3 sm:gap-4 lg:flex-col lg:gap-7 lg:pt-10">
        <ThrowableSticker tone="sky" rotate={-7} size="md">
          <Sparkle size={20} />
          learns in public
        </ThrowableSticker>
        <ThrowableSticker tone="white" rotate={5} size="md" className="lg:ml-12">
          <SmileyDot size={20} />
          ships small things often
        </ThrowableSticker>
        <ThrowableSticker tone="ink" rotate={-10} size="md" className="lg:ml-4">
          Bengaluru, IN
        </ThrowableSticker>
        <HandNote tone="orange" tilt={2} className="hidden lg:block lg:ml-2 lg:mt-1">
          pick these up and throw them →
        </HandNote>
      </div>
    </div>
  );
}
