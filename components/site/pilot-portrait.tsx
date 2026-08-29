"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { AvatarWaving, Cat, Mug } from "@/components/art/cast";
import { HandNote } from "@/components/site/hand-note";
import { EASE_OUT, SPRING_PRESS } from "@/lib/ease";

/**
 * THE PILOT — the portrait cluster on /about, and the interactive corner of
 * the page.
 *
 * The cat's pupils point at the cursor (the note beside it says so, so it had
 * better be true): every frame we take the vector from the cat's own screen
 * box to the pointer and hand the drawing a normalised look direction, which
 * keeps the eyes honest while the page scrolls under them.
 *
 * The mug and the cat are both clickable and both react in character — the mug
 * tips for a sip and keeps count, the cat startles, hops, then looks pleased
 * with itself.
 */
export function PilotPortrait() {
  const reduce = useReducedMotion();
  const catRef = useRef<HTMLButtonElement>(null);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [catMood, setCatMood] = useState<"rest" | "happy" | "startled">("rest");
  const [hop, setHop] = useState(0);
  const [sips, setSips] = useState(0);
  const [sipping, setSipping] = useState(false);
  const [act, setAct] = useState<"idle" | "wave" | "sip" | "stretch">("idle");
  const [says, setSays] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  /**
   * He is not a portrait, he is someone sitting at a desk while you read: on
   * his own clock he waves, stretches, or reaches for the chai, and his eyes
   * track your cursor the whole time. Poke him and he does one on demand.
   */
  const SCENES: { act: "wave" | "sip" | "stretch"; line: string }[] = [
    { act: "wave", line: "hello" },
    { act: "sip", line: "one more cup" },
    { act: "stretch", line: "been here a while" },
    { act: "wave", line: "still here" },
  ];

  const play = (i?: number) => {
    const scene = SCENES[i ?? Math.floor(Math.random() * SCENES.length)];
    setAct(scene.act);
    setSays(scene.line);
    if (scene.act === "sip") {
      setSipping(true);
      setSips((n) => n + 1);
      timers.current.push(setTimeout(() => setSipping(false), 1500));
    }
    timers.current.push(setTimeout(() => setAct("idle"), 2200));
    timers.current.push(setTimeout(() => setSays(null), 2600));
  };

  useEffect(() => {
    if (reduce) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = catRef.current;
        if (!el) return;
        const b = el.getBoundingClientRect();
        const cx = b.left + b.width / 2;
        const cy = b.top + b.height * 0.45;
        const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / 320));
        const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / 260));
        setLook((prev) =>
          Math.abs(prev.x - nx) < 0.02 && Math.abs(prev.y - ny) < 0.02 ? prev : { x: nx, y: ny },
        );
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduce]);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);

  // the idle loop — long enough apart that it reads as a person, not a GIF
  useEffect(() => {
    if (reduce) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      play(i % 4);
    }, 9000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  const pokeCat = () => {
    setCatMood("startled");
    setHop((h) => h + 1);
    timers.current.push(setTimeout(() => setCatMood("happy"), 420));
    timers.current.push(setTimeout(() => setCatMood("rest"), 1700));
  };

  const drinkMug = () => {
    setSips((n) => n + 1);
    setSipping(true);
    timers.current.push(setTimeout(() => setSipping(false), 900));
  };

  return (
    <div className="relative hidden justify-self-center lg:block">
      <motion.button
        type="button"
        onClick={() => play()}
        aria-label="Say hello to Amartya's avatar"
        className="animate-bob block cursor-pointer"
        whileHover={reduce ? undefined : { y: -6 }}
        whileTap={reduce ? undefined : { scale: 0.98 }}
        transition={SPRING_PRESS}
      >
        <AvatarWaving size={360} act={act} look={look} />
      </motion.button>

      <AnimatePresence>
        {says ? (
          <motion.span
            key={says + act}
            initial={{ opacity: 0, y: 8, scale: 0.85, rotate: -6 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: -3 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={SPRING_PRESS}
            className="pointer-events-none absolute right-2 top-6 rounded-full bg-card px-4 py-2 font-hand text-[17px] font-semibold text-ink shadow-[var(--shadow-sticker-sm)]"
          >
            {says}
          </motion.span>
        ) : null}
      </AnimatePresence>

      {/* the mug: click it for a sip, and it keeps count */}
      <motion.button
        type="button"
        onClick={drinkMug}
        aria-label="Take a sip of chai"
        className="absolute -left-16 bottom-6 cursor-pointer"
        style={{ transformOrigin: "80% 90%" }}
        animate={sipping ? { rotate: -26, y: -54, x: 26 } : { rotate: 0, y: 0, x: 0 }}
        transition={sipping ? { duration: 0.32, ease: EASE_OUT } : SPRING_PRESS}
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.96 }}
      >
        <Mug size={132} mood={sipping ? "sip" : "rest"} />
      </motion.button>

      <AnimatePresence>
        {sips > 0 ? (
          <motion.span
            key={sips}
            initial={{ opacity: 0, y: 8, scale: 0.8 }}
            animate={{ opacity: 1, y: -6, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={SPRING_PRESS}
            className="pointer-events-none absolute -left-6 bottom-[10rem] -rotate-6 rounded-full bg-card px-3.5 py-1.5 font-hand text-[15px] font-semibold text-ink shadow-[var(--shadow-sticker-sm)]"
          >
            chai #{sips}
          </motion.span>
        ) : null}
      </AnimatePresence>

      {/* the cat: eyes on the cursor, hops when poked */}
      <motion.button
        ref={catRef}
        type="button"
        key={hop}
        onClick={pokeCat}
        aria-label="Poke the cat"
        className="absolute -right-10 bottom-0 cursor-pointer"
        animate={hop ? { y: [0, -34, 0, -10, 0] } : undefined}
        transition={{ duration: 0.72, ease: EASE_OUT, times: [0, 0.32, 0.6, 0.8, 1] }}
        whileHover={{ scale: 1.03 }}
      >
        <Cat size={190} look={look} mood={catMood} />
      </motion.button>

      <AnimatePresence>
        {catMood === "startled" ? (
          <motion.span
            initial={{ opacity: 0, scale: 0.7, rotate: -14 }}
            animate={{ opacity: 1, scale: 1, rotate: -8 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="pointer-events-none absolute -right-2 bottom-[10.5rem] rounded-full bg-ink px-3.5 py-1.5 font-hand text-[15px] font-semibold text-paper shadow-[var(--shadow-sticker-sm)]"
          >
            mrrp!
          </motion.span>
        ) : null}
      </AnimatePresence>

      <HandNote tilt={-3} className="absolute -bottom-16 left-0 w-[15.5rem] leading-tight">
        everyone here watches your cursor · poke any of them
      </HandNote>
    </div>
  );
}
