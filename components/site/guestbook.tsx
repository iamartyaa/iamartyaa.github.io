"use client";

import { animate, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { HandNote } from "@/components/site/hand-note";
import { fetchVisitorCount, type VisitorCount } from "@/lib/analytics";
import { EASE_OUT, SPRING_PRESS } from "@/lib/ease";

/**
 * THE GUESTBOOK — the visitor counter, as an object rather than a metric.
 *
 * A number in a box is a dashboard. A number you put there yourself is a
 * souvenir: the page is a register, you press the stamp, the ink lands askew,
 * and the number inside it is how many people have been at this desk.
 *
 * Honest by construction:
 *   • the count is GoatCounter's real total, fetched at read time;
 *   • if it can't be fetched (blocked, offline, not live yet) the stamp still
 *     works and simply doesn't claim a number — no zero, no fake;
 *   • the stamp is remembered for the session, so it doesn't ask twice.
 *
 * The animation is a stamp: fast down (110ms), a shake at the bottom, then the
 * ink spreading out from under it. Nothing eases in gently — a rubber stamp
 * has no easing.
 */

const KEY = "amartya:guestbook-signed";

export function Guestbook() {
  const reduce = useReducedMotion();
  const [count, setCount] = useState<VisitorCount | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [stamped, setStamped] = useState(false);
  const [shown, setShown] = useState(0);
  const stampedAt = useRef<Date | null>(null);

  useEffect(() => {
    const c = new AbortController();
    fetchVisitorCount(c.signal).then((v) => {
      setCount(v);
      setLoaded(true);
    });
    try {
      if (sessionStorage.getItem(KEY)) {
        stampedAt.current = new Date();
        setStamped(true);
      }
    } catch {
      /* private mode — the stamp just asks again */
    }
    return () => c.abort();
  }, []);

  // the number rolls up under the ink rather than appearing finished
  useEffect(() => {
    if (!stamped || !count) return;
    if (reduce) {
      setShown(count.visitors);
      return;
    }
    const controls = animate(0, count.visitors, {
      duration: 1.1,
      ease: EASE_OUT,
      delay: 0.22,
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [stamped, count, reduce]);

  const sign = () => {
    stampedAt.current = new Date();
    setStamped(true);
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* fine */
    }
  };

  const date = (stampedAt.current ?? new Date()).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-card px-8 py-10 shadow-[var(--shadow-card)] sm:px-12">
      {/* the register's ruled lines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 top-24 opacity-[0.55]"
        style={{
          backgroundImage: "repeating-linear-gradient(var(--card) 0 39px, var(--hairline) 39px 40px)",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-12 w-px bg-orange/25 sm:left-16" />

      <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="label">The guestbook</p>
          <h3 className="mt-2.5 font-display text-[clamp(1.9rem,3.2vw,2.6rem)] font-extrabold leading-[1.02] tracking-[-0.04em]">
            {stamped ? "You signed the page." : "Sign the page?"}
          </h3>

          <p className="mt-3.5 max-w-[30rem] text-[16.5px] leading-[1.6] text-ink-soft">
            {stamped
              ? "That's your mark, next to everyone else who has wandered through this desk."
              : "Every visit is counted — nothing about you is. Press the stamp and I'll tell you how many people have been here."}
          </p>

          {/* the tally, and the honest fallback when it can't be read */}
          <div className="mt-6 min-h-[3.25rem]" aria-live="polite">
            {stamped ? (
              count ? (
                <motion.p
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.4, ease: EASE_OUT }}
                  className="text-[17px] leading-[1.6] text-ink-soft"
                >
                  You&apos;re one of{" "}
                  <span className="font-display text-[26px] font-extrabold tracking-[-0.03em] text-ink tabular-nums">
                    {shown.toLocaleString("en-GB")}
                  </span>{" "}
                  people who have been at this desk.
                  {count.pageviews > count.visitors ? (
                    <>
                      {" "}
                      Between you, you&apos;ve turned{" "}
                      <span className="font-semibold text-ink tabular-nums">
                        {count.pageviews.toLocaleString("en-GB")}
                      </span>{" "}
                      pages.
                    </>
                  ) : null}
                </motion.p>
              ) : loaded ? (
                <p className="text-[17px] leading-[1.6] text-ink-soft">
                  The counter isn&apos;t answering right now — but you were here, and the page says so.
                </p>
              ) : (
                <p className="font-hand text-[17px] text-ink-faint">counting…</p>
              )
            ) : (
              <HandNote tilt={-2}>the ink is real, the tracking is anonymous →</HandNote>
            )}
          </div>
        </div>

        {/* the stamp itself */}
        <div className="relative flex h-[13.5rem] w-full items-center justify-center lg:w-[17rem]">
          {!stamped ? (
            <motion.button
              type="button"
              onClick={sign}
              aria-label="Stamp the guestbook and show the visitor count"
              className="group relative grid size-[10.5rem] cursor-pointer place-items-center rounded-full bg-paper-2 text-center shadow-[0_0_0_5px_var(--card),0_0_0_6.5px_var(--hairline),0_16px_26px_-18px_rgba(40,30,20,0.55)]"
              whileHover={reduce ? undefined : { y: -8, rotate: -3 }}
              whileTap={reduce ? undefined : { scale: 0.94, y: 4 }}
              transition={SPRING_PRESS}
            >
              <span className="pointer-events-none absolute inset-3 rounded-full border-[2.5px] border-dashed border-hairline" />
              <span className="font-hand text-[21px] font-semibold leading-tight text-ink">
                press
                <br />
                here
              </span>
            </motion.button>
          ) : (
            <motion.div
              initial={reduce ? false : { scale: 1.55, rotate: -14, opacity: 0 }}
              animate={
                reduce
                  ? { scale: 1, rotate: -4, opacity: 1 }
                  : { scale: [1.55, 0.97, 1.02, 1], rotate: [-14, -4, -4.6, -4.2], opacity: [0, 1, 1, 1] }
              }
              transition={reduce ? { duration: 0.2 } : { duration: 0.42, times: [0, 0.42, 0.62, 1], ease: EASE_OUT }}
              className="relative"
            >
              {/* ink spreading out from under the rubber */}
              {!reduce ? (
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-[1.1rem] bg-orange/20 blur-[6px]"
                  initial={{ scale: 0.7, opacity: 0.9 }}
                  animate={{ scale: 1.18, opacity: 0 }}
                  transition={{ duration: 0.75, delay: 0.36, ease: EASE_OUT }}
                />
              ) : null}

              <div className="relative rounded-[1.1rem] border-[3.5px] border-orange-ink px-7 py-5 text-center text-orange-ink shadow-[0_0_0_1.5px_rgba(232,86,47,0.25)_inset]">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em]">visitor</p>
                <p className="mt-1 font-display text-[clamp(2.4rem,4vw,3.1rem)] font-extrabold leading-none tracking-[-0.045em] tabular-nums">
                  {count ? `№${shown.toLocaleString("en-GB")}` : "№—"}
                </p>
                <p className="mt-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em]">{date}</p>
                <p className="mt-2 font-hand text-[15px] leading-none">at amartya&apos;s desk</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
