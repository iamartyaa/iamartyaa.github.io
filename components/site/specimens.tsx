"use client";

import { motion } from "motion/react";

import { EASE_OUT } from "@/lib/ease";

/**
 * SPECIMENS — a small window into each article's own design system.
 *
 * Deliberately painted with the ARTICLE's colours and type, never the site's
 * tokens: the whole point of the shelf is that every piece looks like itself.
 * Treat one of these the way you'd treat a photograph of the page — it stays
 * light in night mode, because the page it is a picture of is light.
 */

/** The GEMM Scrapbook: grid paper, red pen, a strip of highlighter, the ladder. */
export function GemmSpecimen({ active }: { active: boolean }) {
  const bars = [
    { k: "k1", pct: 1.3, c: "#86b6ef" },
    { k: "k2", pct: 8.5, c: "#6da7ec" },
    { k: "k3", pct: 12.8, c: "#5598e7" },
    { k: "k4", pct: 36.5, c: "#3987e5" },
    { k: "k5", pct: 68.7, c: "#2a78d6" },
    { k: "k6", pct: 78.4, c: "#256abf" },
    { k: "k7", pct: 93.7, c: "#104281" },
  ];

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-[1.25rem]"
      style={{
        color: "#1e2430",
        backgroundColor: "#f7f7f4",
        backgroundImage:
          "linear-gradient(rgba(90,130,190,.20) 1px, transparent 1px)," +
          "linear-gradient(90deg, rgba(90,130,190,.20) 1px, transparent 1px)," +
          "linear-gradient(rgba(90,130,190,.13) 1px, transparent 1px)," +
          "linear-gradient(90deg, rgba(90,130,190,.13) 1px, transparent 1px)",
        backgroundSize: "96px 96px, 96px 96px, 16px 16px, 16px 16px",
      }}
    >
      {/* the tape holding it to the sticker */}
      <div
        aria-hidden
        className="absolute -top-2 left-8 h-6 w-24 -rotate-3"
        style={{ background: "rgba(240,225,160,.62)", borderLeft: "1px solid rgba(190,170,90,.45)", borderRight: "1px solid rgba(190,170,90,.45)" }}
      />

      <div className="flex h-full flex-col justify-between p-6">
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.18em]" style={{ color: "#8a90a0" }}>
            field notes from the bottom of the stack
          </p>
          <p className="mt-2 font-hand text-[30px] font-extrabold leading-[1.05]">
            The <span style={{ color: "#d03b3b" }}>GEMM</span> Scrapbook
          </p>
          <svg className="mt-0.5 h-2.5 w-[172px]" viewBox="0 0 412 16" fill="none" aria-hidden>
            <motion.path
              d="M4 9 C 90 3, 190 14, 300 6 C 340 3, 380 8, 406 5"
              stroke="#d03b3b"
              strokeWidth="5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: active ? 1 : 0.28 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
            />
          </svg>
          <p className="mt-2.5 max-w-[19rem] text-[12.5px] leading-[1.5]" style={{ color: "#4d5566" }}>
            from{" "}
            <span style={{ background: "linear-gradient(transparent 55%, #ffe66b 55%, #ffe66b 92%, transparent 92%)", fontWeight: 700 }}>
              1.3% of peak
            </span>{" "}
            to 93.7%, one kernel at a time
          </p>
        </div>

        {/* the ladder, which climbs when you reach for the sticker */}
        <div className="w-[15.5rem] rounded-lg border p-3" style={{ background: "#fdfdfb", borderColor: "rgba(30,36,48,.16)" }}>
          <p className="font-mono text-[9.5px] uppercase tracking-[0.14em]" style={{ color: "#8a90a0" }}>
            % of cuBLAS · 4096² · fp32
          </p>
          <div className="mt-2 space-y-[3px]">
            {bars.map((b, i) => (
              <div key={b.k} className="flex items-center gap-1.5">
                <span className="font-mono text-[8.5px]" style={{ color: "#8a90a0", width: 13 }}>
                  {b.k}
                </span>
                <div className="h-[6px] flex-1 overflow-hidden rounded-full" style={{ background: "rgba(90,130,190,.10)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: b.c }}
                    initial={{ width: "0%" }}
                    animate={{ width: active ? `${b.pct}%` : "0%" }}
                    transition={{ duration: 0.7, delay: active ? i * 0.05 : 0, ease: EASE_OUT }}
                  />
                </div>
                <span className="font-mono text-[8.5px] tabular-nums" style={{ color: "#4d5566", width: 26 }}>
                  {b.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const SPECIMENS = { gemm: GemmSpecimen } as const;
