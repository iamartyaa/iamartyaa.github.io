"use client";

import { motion, useInView, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

/**
 * The GEMM article's own component set. None of these are shared with the
 * site — different system, different parts bin.
 */

/* ── the page surface ─────────────────────────────────────────────────── */

/**
 * Claims <html> for the duration of the article, so overscroll, the browser
 * UI and the paper grain all agree that this page is black. Released on
 * unmount, which matters because the site is a client-side router.
 */
export function SurfaceLock() {
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.dataset.surface;
    root.dataset.surface = "gemm";
    return () => {
      if (previous) root.dataset.surface = previous;
      else delete root.dataset.surface;
    };
  }, []);
  return null;
}

/** The article's own reading progress — a hairline, not the site's blue bar. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  return <motion.div className="g-progress" style={{ scaleX }} aria-hidden />;
}

/* ── section plumbing ─────────────────────────────────────────────────── */

export type SectionMeta = { id: string; num: string; label: string };

export function Rail({ sections }: { sections: SectionMeta[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => Boolean(n));
    // Fires on the section nearest the top third of the viewport — the part
    // you are actually reading, rather than the part that happens to be
    // intersecting.
    const io = new IntersectionObserver(
      (entries) => {
        // The section you are reading is the LAST one whose top has crossed the
        // band — sorting the other way lights up the section you just left.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.boundingClientRect.top - a.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-12% 0px -70% 0px", threshold: 0 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [sections]);

  return (
    <nav className="g-rail" aria-label="Sections">
      <ol>
        {sections.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`} data-active={active === s.id}>
              {s.num} · {s.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ── the ladder ───────────────────────────────────────────────────────── */

export type Rung = {
  n: string;
  name: string;
  idea: string;
  gflops: number;
  ms: number;
  pct: number;
  target?: boolean;
};

/**
 * The whole argument in one figure: seven kernels and the library, bars
 * filling to their share of cuBLAS. Bars grow from the left on entry because
 * the reader should feel the climb, not read a table of it — the table is
 * right underneath for the people who want the numbers.
 */
export function Ladder({ rungs }: { rungs: Rung[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<string | null>(null);

  return (
    <div ref={ref} className="g-panel" style={{ padding: "1.6rem 1.5rem 1.3rem" }}>
      <p className="g-label" style={{ marginBottom: "1.1rem" }}>
        RTX A6000 · 4096³ · fp32 · GFLOP/s
      </p>
      <div style={{ display: "grid", gap: "0.55rem" }}>
        {rungs.map((r, i) => {
          const width = `${Math.max(1.5, r.pct)}%`;
          return (
            <div
              key={r.n}
              onMouseEnter={() => setHover(r.n)}
              onMouseLeave={() => setHover(null)}
              style={{
                display: "grid",
                gridTemplateColumns: "5.6rem minmax(0, 1fr) 6.2rem",
                alignItems: "center",
                gap: "0.75rem",
                cursor: "default",
              }}
            >
              <span
                className="g-mono"
                style={{
                  fontSize: 12,
                  color: r.target ? "var(--g-green)" : hover === r.n ? "var(--g-ink)" : "var(--g-dim)",
                  textAlign: "right",
                  transition: "color .2s ease",
                }}
              >
                {r.name}
              </span>
              <div style={{ position: "relative", height: 20, background: "var(--g-line-soft)", borderRadius: 3 }}>
                <motion.div
                  initial={reduce ? false : { width: 0 }}
                  animate={inView || reduce ? { width } : { width: 0 }}
                  transition={{ duration: 0.85, delay: 0.06 * i, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    height: "100%",
                    borderRadius: 3,
                    background: r.target
                      ? "repeating-linear-gradient(90deg, var(--g-green) 0 6px, transparent 6px 12px)"
                      : `linear-gradient(90deg, var(--g-cyan), var(--g-amber))`,
                    opacity: r.target ? 0.75 : hover && hover !== r.n ? 0.45 : 1,
                    transition: "opacity .2s ease",
                  }}
                />
              </div>
              <span
                className="g-mono"
                style={{ fontSize: 12.5, color: r.target ? "var(--g-green)" : "var(--g-amber)", textAlign: "right" }}
              >
                {hover === r.n ? `${r.ms} ms` : r.gflops.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
      <p className="g-figcap" style={{ marginTop: "1.1rem" }}>
        hover a rung for wall-clock · dashed = cuBLAS, the target
      </p>
    </div>
  );
}

/* ── the tiling calculator ────────────────────────────────────────────── */

const N = 4096;
const FLOPS = 2 * N ** 3; // 137.4 GFLOP
const RIDGE = 50; // FLOPs per byte the A6000 demands

/**
 * Not a benchmark — arithmetic. Tiling by T means every float pulled from
 * DRAM is used by T threads, so traffic falls by T and intensity rises by T.
 * The reader drags T and watches 550 GB collapse; the ridge line shows when
 * block tiling alone stops being the bottleneck.
 */
export function TileMath() {
  const [t, setT] = useState(32);
  const { traffic, ai } = useMemo(() => {
    const bytes = (2 * N ** 3 * 4) / t; // A and B, one float each, reused T times
    return { traffic: bytes / 1e9, ai: FLOPS / bytes };
  }, [t]);
  const pct = Math.min(100, (ai / RIDGE) * 100);

  return (
    <div className="g-panel">
      <p className="g-label">block tile T × T · DRAM traffic for one 4096³ matmul</p>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem", marginTop: "0.9rem" }}>
        <span className="g-mono" style={{ fontSize: 34, color: "var(--g-cyan)", lineHeight: 1 }}>
          {traffic < 10 ? traffic.toFixed(1) : Math.round(traffic)}
        </span>
        <span className="g-mono" style={{ fontSize: 14, color: "var(--g-dim)" }}>GB moved</span>
        <span className="g-mono" style={{ marginLeft: "auto", fontSize: 20, color: "var(--g-amber)" }}>
          {ai.toFixed(1)}
        </span>
        <span className="g-mono" style={{ fontSize: 13, color: "var(--g-dim)" }}>FLOPs / byte</span>
      </div>

      {/* how close this tile gets to the machine's ridge point */}
      <div style={{ position: "relative", height: 8, background: "var(--g-line-soft)", borderRadius: 4, marginTop: "1rem" }}>
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: 4,
            background: ai >= RIDGE ? "var(--g-green)" : "linear-gradient(90deg, var(--g-cyan), var(--g-amber))",
            transition: "width .18s ease",
          }}
        />
        <span
          className="g-mono"
          style={{ position: "absolute", right: 0, top: 12, fontSize: 11, color: "var(--g-faint)" }}
        >
          ridge point · {RIDGE} FLOPs/byte
        </span>
      </div>

      <label style={{ display: "block", marginTop: "2.1rem" }}>
        <span className="g-label">tile width T = {t}</span>
        <input
          type="range"
          min={1}
          max={128}
          step={1}
          value={t}
          onChange={(e) => setT(Number(e.target.value))}
          style={{ width: "100%", marginTop: "0.5rem", accentColor: "var(--g-amber)" }}
          aria-label="Block tile width"
        />
      </label>
      <p className="g-figcap" style={{ marginTop: "0.7rem" }}>
        T = 1 is kernel 1 · T = 32 is kernel 3 · the rest of the ladder buys reuse in registers, not shared memory
      </p>
    </div>
  );
}

/* ── code ─────────────────────────────────────────────────────────────── */

const KEYWORDS =
  /\b(__global__|__shared__|__syncthreads|const|float|float4|int|uint|for|if|else|return|void|reinterpret_cast|template|struct)\b/g;

/**
 * Tiny CUDA highlighter. A syntax-highlighting dependency would be several
 * hundred kilobytes to colour four snippets; this is a regex pass over five
 * token classes and it ships in the page.
 */
function highlight(src: string) {
  return src
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/(\/\/[^\n]*)/g, '<span class="c">$1</span>')
    .replace(KEYWORDS, '<span class="k">$1</span>')
    .replace(/\b(\d+\.?\d*f?)\b/g, '<span class="n">$1</span>');
}

export function Code({ file, note, children }: { file: string; note?: string; children: string }) {
  return (
    <figure style={{ margin: "1.6rem 0" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          border: "1px solid var(--g-line)",
          borderBottom: 0,
          borderRadius: "10px 10px 0 0",
          background: "var(--g-panel-2)",
          padding: "0.55rem 1rem",
        }}
      >
        <span className="g-mono" style={{ fontSize: 12, color: "var(--g-amber)" }}>
          {file}
        </span>
        {note ? (
          <span className="g-mono" style={{ fontSize: 12, color: "var(--g-faint)" }}>
            {note}
          </span>
        ) : null}
      </div>
      <pre className="g-pre" style={{ borderRadius: "0 0 10px 10px", margin: 0 }}>
        <code dangerouslySetInnerHTML={{ __html: highlight(children.trim()) }} />
      </pre>
    </figure>
  );
}

/** A number nobody has measured on this machine yet, dressed as exactly that. */
export function Slot({ children }: { children: ReactNode }) {
  return <span className="g-slot">{children}</span>;
}
