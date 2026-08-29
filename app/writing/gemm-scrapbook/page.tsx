import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";

import { SITE_URL, articleBySlug, articleUrl, formatDate } from "@/lib/articles";

import { Code, Ladder, Rail, Reveal, ReadingProgress, SurfaceLock, TileMath, type Rung, type SectionMeta } from "./parts";
import "./theme.css";

/**
 * THE GEMM SCRAPBOOK.
 *
 * Ported from the interactive scrapbook and re-drawn in a design system of its
 * own: instrument panel, not paper. Everything visual lives in theme.css and
 * parts.tsx; this file is the argument.
 *
 * On numbers: the ladder is Simon Boehm's measured kernel walk on an RTX
 * A6000, and it is labelled as his everywhere it appears. The arithmetic — 137
 * GFLOP of work, 201 MB of inputs, 550 GB of naive traffic, the ridge point —
 * is derived here and can be checked with a calculator.
 */

const jetbrains = localFont({
  src: "../../fonts/jetbrains-mono.woff2",
  variable: "--font-jetbrains",
  weight: "100 800",
  display: "swap",
});

const space = localFont({
  src: "../../fonts/space-grotesk.woff2",
  variable: "--font-space",
  weight: "300 700",
  display: "swap",
});

const article = articleBySlug("gemm-scrapbook")!;

export const metadata: Metadata = {
  title: "The GEMM Scrapbook — one matmul, seven kernels, 70×",
  description:
    "Why a naive CUDA matrix multiply reaches 1.3% of the machine, and what each of the seven steps up to 93.7% actually buys. Memory hierarchy, coalescing, tiling, vectorised loads and warptiling — with the arithmetic behind every one.",
  keywords: ["CUDA", "GEMM", "SGEMM", "GPU kernels", "tiling", "memory coalescing", "warptiling", "inference"],
  alternates: { canonical: articleUrl(article) },
  openGraph: {
    type: "article",
    title: "The GEMM Scrapbook — one matmul, seven kernels, 70×",
    description:
      "From 309 to 21,779 GFLOP/s: what each rung of the classic CUDA matmul ladder actually buys, and the arithmetic that explains it.",
    url: articleUrl(article),
    publishedTime: article.date,
    authors: ["Amartya Yadav"],
    tags: article.tags,
    images: [{ url: `${SITE_URL}${article.ogImage}`, width: 1200, height: 630, alt: article.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The GEMM Scrapbook — one matmul, seven kernels, 70×",
    description: "What each rung of the CUDA matmul ladder actually buys, and the arithmetic behind it.",
    images: [`${SITE_URL}${article.ogImage}`],
  },
};

const SECTIONS: SectionMeta[] = [
  { id: "problem", num: "00", label: "The problem" },
  { id: "hardware", num: "01", label: "The hardware" },
  { id: "equation", num: "02", label: "One equation" },
  { id: "rules", num: "03", label: "Keeping score" },
  { id: "k1", num: "04", label: "K1 · naive" },
  { id: "k2", num: "05", label: "K2 · coalescing" },
  { id: "k3", num: "06", label: "K3 · shared mem" },
  { id: "k4", num: "07", label: "K4 · 1D tiling" },
  { id: "k5", num: "08", label: "K5 · 2D tiling" },
  { id: "k6", num: "09", label: "K6 · float4" },
  { id: "k7", num: "10", label: "K7 · warptiling" },
  { id: "ladder", num: "11", label: "The ladder" },
  { id: "onward", num: "12", label: "What's above" },
];

const RUNGS: Rung[] = [
  { n: "1", name: "naive", idea: "1 thread = 1 cell", gflops: 309, ms: 444.8, pct: 1.3 },
  { n: "2", name: "coalesced", idea: "warps read neighbours", gflops: 1987, ms: 69.2, pct: 8.5 },
  { n: "3", name: "smem tiling", idea: "the block shares tiles", gflops: 2980, ms: 46.1, pct: 12.8 },
  { n: "4", name: "1D tiling", idea: "8 cells per thread", gflops: 8475, ms: 16.2, pct: 36.5 },
  { n: "5", name: "2D tiling", idea: "outer products, 64 cells", gflops: 15972, ms: 8.6, pct: 68.7 },
  { n: "6", name: "float4", idea: "128-bit loads", gflops: 18237, ms: 7.5, pct: 78.4 },
  { n: "7", name: "warptiling", idea: "a tile per hardware tier", gflops: 21779, ms: 6.3, pct: 93.7 },
  { n: "—", name: "cuBLAS", idea: "several careers of tuning", gflops: 23250, ms: 5.9, pct: 100, target: true },
];

function Section({ id, num, label, title, children }: { id: string; num: string; label: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="g-section">
      <Reveal>
        <p className="g-num">
          §{num} — <span style={{ color: "var(--g-faint)" }}>{label}</span>
        </p>
        <h2 style={{ marginTop: "0.7rem", marginBottom: "1.4rem" }}>{title}</h2>
      </Reveal>
      {children}
    </section>
  );
}

export default function GemmScrapbook() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: article.title,
    description: article.dek,
    datePublished: article.date,
    author: { "@type": "Person", name: "Amartya Yadav", url: SITE_URL },
    publisher: { "@type": "Person", name: "Amartya Yadav" },
    mainEntityOfPage: articleUrl(article),
    image: `${SITE_URL}${article.ogImage}`,
    keywords: article.tags.join(", "),
    proficiencyLevel: "Beginner",
  };

  return (
    <div data-article="gemm" className={`${jetbrains.variable} ${space.variable}`}>
      <SurfaceLock />
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ─────────────────────────── MASTHEAD ─────────────────────────── */}
      <header className="g-shell" style={{ paddingTop: "3.2rem", paddingBottom: "1rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <Link href="/writing" className="g-mono" style={{ fontSize: 12.5, color: "var(--g-dim)", textDecoration: "none" }}>
            ← amartya / writing
          </Link>
          <p className="g-label" style={{ margin: 0 }}>
            {formatDate(article.date)} · {article.minutes} min · fp32 · sm_86
          </p>
        </div>

        <h1 style={{ marginTop: "3.4rem" }}>
          One matmul,
          <br />
          seven kernels,
          <br />
          <span style={{ color: "var(--g-amber)" }}>70× faster.</span>
        </h1>
        <p style={{ marginTop: "1.6rem", fontSize: "1.16rem", maxWidth: "58ch" }}>
          A naive CUDA matrix multiply reaches <strong>1.3%</strong> of what the GPU can do. Not 30%.
          Not 13%. One point three. This is the walk from there to <strong>93.7%</strong>, one kernel at
          a time — and the arithmetic that explains why every step was inevitable.
        </p>
      </header>

      <div className="g-shell g-body" style={{ paddingBottom: "6rem" }}>
        <Rail sections={SECTIONS} />

        <main>
          {/* ── 00 ─────────────────────────────────────────────────────── */}
          <Section id="problem" num="00" label="The problem" title="137 billion multiply-adds, and nowhere to put them">
            <Reveal>
              <p>
                One problem for the whole article: <code className="g-code">C = A·B</code>, all three matrices
                4096×4096, fp32. That is <strong>2·4096³ ≈ 137 billion</strong> floating-point operations, and
                16.7 million output cells, each of which can be computed without asking any other cell for
                permission. Embarrassingly parallel. The shape of workload GPUs were built for.
              </p>
              <p>
                Here is the catch that the next seven kernels exist to answer. The inputs are only{" "}
                <strong>≈201 MB</strong> — but the arithmetic touches those same numbers over and over. Every
                element of A is needed by 4096 different output cells. GEMM is not a maths problem, it is a{" "}
                <em>data-reuse problem</em>. Win the reuse game and you win everything.
              </p>
              <p>
                The naive kernel loses the reuse game so badly that it re-requests about{" "}
                <strong>550 GB</strong> from memory to do 201 MB of work.
              </p>
            </Reveal>
          </Section>

          {/* ── 01 ─────────────────────────────────────────────────────── */}
          <Section id="hardware" num="01" label="The hardware" title="Four shelves, and how far away they are">
            <Reveal>
              <p>
                A GPU like the RTX A6000 is a factory with 84 identical workshops (SMs). You do not hire
                individual workers; you submit a grid of thread blocks, and each block is assigned to a
                workshop. Inside a block, up to 1024 threads.
              </p>
              <p>
                But threads do not move freely. The hardware bundles them into groups of 32 called{" "}
                <strong>warps</strong>, and a warp moves in lockstep: 32 threads, one instruction, together.
                That single fact ruins kernel 1 and saves kernel 2.
              </p>
              <p>
                Data lives at very different distances, and this table is the entire plot of the article —
                every optimisation below is just <em>moving work from a far shelf to a near one</em>:
              </p>
            </Reveal>

            <Reveal>
              <div className="g-panel" style={{ marginTop: "1.4rem", overflowX: "auto" }}>
                <table className="g-mono" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ color: "var(--g-faint)", textAlign: "left" }}>
                      <th style={{ padding: "0.4rem 0.6rem" }}>where</th>
                      <th style={{ padding: "0.4rem 0.6rem" }}>latency</th>
                      <th style={{ padding: "0.4rem 0.6rem" }}>size</th>
                      <th style={{ padding: "0.4rem 0.6rem" }}>if a register were 1 second</th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "var(--g-dim)" }}>
                    {[
                      ["registers", "~1 cycle", "255 / thread", "in your hand"],
                      ["shared memory", "~20–30 cycles", "up to 100 KB / SM", "the shelf behind you · ~25 s"],
                      ["L2 cache", "~200 cycles", "6 MB", "down the hall · ~3 min"],
                      ["DRAM", "~400–600 cycles", "48 GB @ 768 GB/s", "an 8-minute drive across town"],
                    ].map(([a, b, c, d]) => (
                      <tr key={a} style={{ borderTop: "1px solid var(--g-line)" }}>
                        <td style={{ padding: "0.5rem 0.6rem", color: "var(--g-ink)" }}>{a}</td>
                        <td style={{ padding: "0.5rem 0.6rem", color: "var(--g-cyan)" }}>{b}</td>
                        <td style={{ padding: "0.5rem 0.6rem" }}>{c}</td>
                        <td style={{ padding: "0.5rem 0.6rem" }}>{d}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ marginTop: "1rem" }}>
                Kernel 1 is a recipe where every single ingredient is a separate eight-minute drive. We wrote
                it on purpose, for science.
              </p>
            </Reveal>
          </Section>

          {/* ── 02 ─────────────────────────────────────────────────────── */}
          <Section id="equation" num="02" label="One equation" title="The number to tape inside your locker">
            <Reveal>
              <p>
                The A6000 does about <strong>38.7 TFLOP/s</strong> of fp32 maths and pulls about{" "}
                <strong>768 GB/s</strong> from DRAM. Divide one by the other and you get the machine&apos;s{" "}
                <em>ridge point</em>:
              </p>
              <div className="g-callout" style={{ margin: "1.3rem 0" }}>
                <p className="g-mono" style={{ color: "var(--g-amber)", fontSize: 15 }}>
                  38,700 GFLOP/s ÷ 768 GB/s ≈ 50 FLOPs per byte
                </p>
                <p style={{ marginTop: "0.6rem" }}>
                  Every byte you fetch from DRAM has to be repaid with about fifty floating-point operations,
                  or the maths units sit idle waiting for deliveries. FLOPs done per byte moved is called{" "}
                  <strong>arithmetic intensity</strong>, and it is the score for the next seven kernels.
                </p>
              </div>
              <p>
                A whole GEMM has an intensity of roughly 137 GFLOP / 201 MB ≈ <strong>680 FLOPs per byte</strong>{" "}
                — thirteen times what the machine demands. GEMM <em>deserves</em> to be compute-bound. Whether
                your kernel achieves that depends entirely on how much reuse you capture on-chip.
              </p>
            </Reveal>
            <Reveal>
              <div style={{ marginTop: "1.6rem" }}>
                <TileMath />
              </div>
            </Reveal>
          </Section>

          {/* ── 03 ─────────────────────────────────────────────────────── */}
          <Section id="rules" num="03" label="Keeping score" title="The ladder, and who measured it">
            <Reveal>
              <p>
                From here every section is one kernel. Same problem every time, so the only thing changing is{" "}
                <em>how well we use the machine</em>. The reference bar is NVIDIA&apos;s own cuBLAS at{" "}
                <strong>23,250 GFLOP/s</strong> — 5.9 ms per matmul.
              </p>
              <div className="g-callout">
                <p>
                  <strong>Where the numbers come from.</strong> The GFLOP/s on this page are from{" "}
                  <a className="g-link" href="https://siboehm.com/articles/22/CUDA-MMM" target="_blank" rel="noopener noreferrer">
                    Simon Boehm&apos;s kernel walkthrough
                  </a>
                  , measured on an RTX A6000 — the canonical modern walk up this mountain, and the route these
                  kernels follow. I have re-derived the arithmetic in every section, and the <em>ratios</em>{" "}
                  between rungs are the durable lesson: they look similar on every recent NVIDIA card. When I
                  publish my own harness numbers, they will be labelled as mine.
                </p>
              </div>
              <p style={{ marginTop: "1.2rem" }}>
                Benchmark rules, learned the embarrassing way: warm up first, time with CUDA events, average
                many repetitions, and <strong>always verify the output against cuBLAS</strong>. A wrong matmul
                is infinitely fast and infinitely useless.
              </p>
            </Reveal>
          </Section>

          {/* ── 04 ─────────────────────────────────────────────────────── */}
          <Section id="k1" num="04" label="Kernel one" title="Naive: one thread, one number, zero shame">
            <Reveal>
              <p className="g-mono" style={{ color: "var(--g-magenta)", fontSize: 13 }}>
                309 GFLOP/s · 444.8 ms · 1.3% of cuBLAS
              </p>
              <p style={{ marginTop: "1rem" }}>
                The obvious plan, and honestly a beautiful one: C has 16.7 million cells and GPUs have millions
                of threads, so give every thread one cell. Each thread walks its row of A and its column of B,
                multiply-accumulates K = 4096 times, writes one float.
              </p>
            </Reveal>
            <Reveal>
              <Code file="sgemm_naive.cu" note="14 lines of crime">{`
__global__ void sgemm_naive(int M, int N, int K,
                            const float *A, const float *B, float *C) {
  // one thread ↔ one output cell of C
  const uint x = blockIdx.x * blockDim.x + threadIdx.x;
  const uint y = blockIdx.y * blockDim.y + threadIdx.y;

  if (x < M && y < N) {
    float acc = 0.0f;
    for (int k = 0; k < K; ++k)
      acc += A[x * K + k] * B[k * N + y];   // dot product
    C[x * N + y] = acc;
  }
}
`}</Code>
              <p>
                <strong>The autopsy.</strong> Each thread does 2K = 8,192 FLOPs and requests 2K·4 = 32 KB from
                global memory. That is an arithmetic intensity of 0.25 FLOPs per byte, against a machine that
                wants 50 — off by more than two hundred times. Summed over 16.7 million threads, the kernel
                asks DRAM for about <strong>550 GB</strong> to solve a 201 MB problem.
              </p>
            </Reveal>
          </Section>

          {/* ── 05 ─────────────────────────────────────────────────────── */}
          <Section id="k2" num="05" label="Kernel two" title="Coalescing: the 6.4× that costs two swapped letters">
            <Reveal>
              <p className="g-mono" style={{ color: "var(--g-amber)", fontSize: 13 }}>
                1,987 GFLOP/s · 69.2 ms · 8.5% of cuBLAS
              </p>
              <p style={{ marginTop: "1rem" }}>
                Memory requests happen <strong>per warp, not per thread</strong>. When 32 threads each load a
                float, the hardware looks at the 32 addresses and groups them into as few 32-byte transactions
                as it can. Consecutive addresses: all 32 floats arrive in a handful of wide loads. Scattered
                addresses: up to 32 separate trips, each carrying mostly air.
              </p>
              <p>
                In kernel 1, neighbouring threads in a warp owned neighbouring <em>rows</em> — addresses 16 KB
                apart. Swap which index gets <code className="g-code">threadIdx.x</code> so neighbours own
                neighbouring <em>columns</em>, and the same 32 floats become one wide load.
              </p>
              <p>
                Nothing about the maths changed. Nothing about how much data we touch changed. We changed the{" "}
                <em>shape</em> of each warp&apos;s request, and throughput went from 309 to 1,987 GFLOP/s. This
                is the recurring theme of GPU work: <strong>the hardware rewards you for asking politely</strong>.
              </p>
            </Reveal>
          </Section>

          {/* ── 06 ─────────────────────────────────────────────────────── */}
          <Section id="k3" num="06" label="Kernel three" title="Shared memory: stop commuting, stock the counter">
            <Reveal>
              <p className="g-mono" style={{ color: "var(--g-amber)", fontSize: 13 }}>
                2,980 GFLOP/s · 46.1 ms · 12.8% of cuBLAS
              </p>
              <p style={{ marginTop: "1rem" }}>
                The 1024 threads of one block all compute cells in the same 32×32 patch of C — and their dot
                products read the same 32 rows of A and 32 columns of B. A thousand workers making a thousand
                separate trips for overlapping shopping lists. The fix is to <strong>tile the K dimension</strong>:
                each round, the block cooperatively hauls one 32×32 tile of A and one of B into shared memory
                (coalesced, obviously), calls <code className="g-code">__syncthreads()</code>, and everyone
                computes their partial dot product from the counter at ~25-cycle latency instead of ~500.
              </p>
              <p>
                Every float hauled from DRAM is now used by 32 threads, so global traffic drops ~32×: 550 GB
                becomes about <strong>17 GB</strong>. Drag the slider in §02 to T = 32 and you are looking at
                exactly this kernel.
              </p>
              <p>
                And the payoff for all that engineering is… <strong>1.5×</strong>. One point five. We built
                beautiful tile choreography and barely moved, because the bottleneck moved with us: each
                thread still does two shared-memory loads for every two FLOPs. The counter is fast, but it is
                not <em>free</em>. The kernel is now latency-bound on shared memory.
              </p>
            </Reveal>
          </Section>

          {/* ── 07 ─────────────────────────────────────────────────────── */}
          <Section id="k4" num="07" label="Kernel four" title="1D tiling: give every thread a column to raise">
            <Reveal>
              <p className="g-mono" style={{ color: "var(--g-green)", fontSize: 13 }}>
                8,475 GFLOP/s · 16.2 ms · 36.5% of cuBLAS · the biggest jump on the ladder
              </p>
              <p style={{ marginTop: "1rem" }}>
                Too many loads per FLOP. The cure is the same trick as before, one level down: we tiled
                DRAM→shared, now we tile shared→<strong>registers</strong>, the only memory that is actually
                free. Instead of one output cell, each thread owns a column of <strong>TM = 8 cells</strong> of
                C, living in registers the whole time.
              </p>
            </Reveal>
            <Reveal>
              <Code file="sgemm_1d_tile.cu" note="the money loop">{`
float acc[8] = {0.0f};                   // 8 cells of C live in registers now

for (int k = 0; k < BK; ++k) {
  float bTmp = Bs[k * BN + col];         // ONE shared-mem load...
  for (int t = 0; t < 8; ++t)
    acc[t] += As[(row * 8 + t) * BK + k] * bTmp;   // ...amortised over 8 FMAs
}
`}</Code>
              <p>
                Per k-step, per thread: 8 loads of A + 1 load of B buy 8 FMAs = 16 FLOPs. Loads per FLOP goes
                from 2/2 to 9/16 — nearly twice the maths per shared-memory visit. Result: 2,980 → 8,475
                GFLOP/s. The largest single jump on the whole ladder, and it came from a register.
              </p>
            </Reveal>
          </Section>

          {/* ── 08 ─────────────────────────────────────────────────────── */}
          <Section id="k5" num="08" label="Kernel five" title="2D tiling: the outer product awakens">
            <Reveal>
              <p className="g-mono" style={{ color: "var(--g-green)", fontSize: 13 }}>
                15,972 GFLOP/s · 8.6 ms · 68.7% of cuBLAS
              </p>
              <p style={{ marginTop: "1rem" }}>
                An asymmetry should be bugging you about kernel 4: B values get reused 8× but A values are
                still loaded fresh for every FMA. If reusing along one axis is that good, reuse along{" "}
                <em>both</em>. Each thread now owns an <strong>8×8 patch of C</strong> — 64 accumulators in
                registers. Per k-step it loads a length-8 sliver of A and a length-8 sliver of B, then does the
                outer product: 16 loads buy 128 FLOPs.
              </p>
              <p>
                We went from 1 cell per thread to 64, and the lesson is not subtle: <strong>FLOPs are cheap,
                trips are expensive</strong>, and registers are the only free lunch on the menu.
              </p>
            </Reveal>
          </Section>

          {/* ── 09 ─────────────────────────────────────────────────────── */}
          <Section id="k6" num="09" label="Kernel six" title="float4: ship the pallet, not four envelopes">
            <Reveal>
              <p className="g-mono" style={{ color: "var(--g-green)", fontSize: 13 }}>
                18,237 GFLOP/s · 7.5 ms · 78.4% of cuBLAS
              </p>
              <p style={{ marginTop: "1rem" }}>
                Four scalar loads are four instructions, four queue slots, four receipts. One{" "}
                <code className="g-code">float4</code> is a single 128-bit instruction that fetches the same 16
                bytes. Same data, a quarter of the issue overhead.
              </p>
            </Reveal>
            <Reveal>
              <Code file="sgemm_vectorised.cu" note="two senior-engineer moves in five lines">{`
float4 tmp = reinterpret_cast<const float4 *>(&A[...])[0];   // one 128-bit load

// while loading, store A's tile TRANSPOSED into shared memory,
// so the inner loop can later read slivers of A with LDS.128 too:
As[(k + 0) * BM + row] = tmp.x;
As[(k + 1) * BM + row] = tmp.y;
As[(k + 2) * BM + row] = tmp.z;
As[(k + 3) * BM + row] = tmp.w;
`}</Code>
              <p>
                Two details hide in that snippet, both worth stealing. First the <strong>transpose</strong>:
                storing A&apos;s tile column-major in shared memory costs nothing extra during the load phase,
                but lets the hot inner loop read A-slivers as contiguous 128-bit chunks. Arrange your data{" "}
                <em>at write time</em> so it is cheap at read time — you will use this for the rest of your
                career. Second, <code className="g-code">float4</code> demands 16-byte alignment; feed it a
                misaligned pointer and it is an instant trip to <code className="g-code">cudaErrorMisalignedAddress</code>.
              </p>
            </Reveal>
          </Section>

          {/* ── 10 ─────────────────────────────────────────────────────── */}
          <Section id="k7" num="10" label="Kernel seven" title="Warptiling: a tile for every tier">
            <Reveal>
              <p className="g-mono" style={{ color: "var(--g-green)", fontSize: 13 }}>
                21,779 GFLOP/s · 6.3 ms · 93.7% of cuBLAS
              </p>
              <p style={{ marginTop: "1rem" }}>
                Count the tiling levels so far: the <strong>block</strong> owns a big patch of C (DRAM→shared),
                and each <strong>thread</strong> owns an 8×8 patch (shared→registers). But there is a tier of
                hardware we never gave its own tile: the warp. Kernel 7 fixes the org chart — each warp gets an
                explicit <em>warp tile</em>, subdivided among its 32 threads.
              </p>
              <p>Why does adding a middle manager make anything faster? Three unglamorous reasons.</p>
              <p>
                <strong>1 · Register-cache locality.</strong> The warp&apos;s fragments of A and B are reused
                across the warp tile in a tight, predictable pattern, so the compiler schedules loads and FMAs
                into a smooth pipeline instead of a traffic jam.
              </p>
              <p>
                <strong>2 · Bank-conflict dodging.</strong> Shared memory is 32 banks wide; if two threads of a
                warp hit the same bank they queue. Warp-aware layouts let all 32 lanes hit 32 different banks.
              </p>
              <p>
                <strong>3 · It is the shape of the future.</strong> A warp computing a small matrix patch
                together is <em>exactly</em> the contract of tensor-core instructions (
                <code className="g-code">mma</code>, <code className="g-code">wgmma</code>). Warptiling is the
                fp32 dress rehearsal for how every modern GEMM library is built.
              </p>
              <p>
                One more trick rides along: <strong>double buffering</strong>. While the maths units chew tile{" "}
                <em>t</em>, tile <em>t+1</em> is already in flight into a second buffer — compute and delivery
                overlap, and nobody waits.
              </p>
            </Reveal>
          </Section>

          {/* ── 11 ─────────────────────────────────────────────────────── */}
          <Section id="ladder" num="11" label="The finish line" title="445 ms → 6.3 ms: the whole trip on one page">
            <Reveal>
              <Ladder rungs={RUNGS} />
            </Reveal>
            <Reveal>
              <div className="g-panel" style={{ marginTop: "1.4rem", overflowX: "auto" }}>
                <table className="g-mono" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ color: "var(--g-faint)", textAlign: "left" }}>
                      <th style={{ padding: "0.4rem 0.6rem" }}>#</th>
                      <th style={{ padding: "0.4rem 0.6rem" }}>kernel</th>
                      <th style={{ padding: "0.4rem 0.6rem" }}>the one idea</th>
                      <th style={{ padding: "0.4rem 0.6rem", textAlign: "right" }}>GFLOP/s</th>
                      <th style={{ padding: "0.4rem 0.6rem", textAlign: "right" }}>ms</th>
                      <th style={{ padding: "0.4rem 0.6rem", textAlign: "right" }}>vs cuBLAS</th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "var(--g-dim)" }}>
                    {RUNGS.map((r) => (
                      <tr key={r.n} style={{ borderTop: "1px solid var(--g-line)" }}>
                        <td style={{ padding: "0.5rem 0.6rem" }}>{r.n}</td>
                        <td style={{ padding: "0.5rem 0.6rem", color: r.target ? "var(--g-green)" : "var(--g-ink)" }}>{r.name}</td>
                        <td style={{ padding: "0.5rem 0.6rem" }}>{r.idea}</td>
                        <td style={{ padding: "0.5rem 0.6rem", textAlign: "right", color: "var(--g-amber)" }}>
                          {r.gflops.toLocaleString()}
                        </td>
                        <td style={{ padding: "0.5rem 0.6rem", textAlign: "right" }}>{r.ms}</td>
                        <td style={{ padding: "0.5rem 0.6rem", textAlign: "right" }}>{r.pct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
            <Reveal>
              <h3 style={{ marginTop: "2.2rem" }}>The whole thing in three sentences</h3>
              <p style={{ marginTop: "0.8rem" }}>
                <strong>1.</strong> GEMM has enormous intrinsic data reuse (~680 FLOPs per byte available), and
                a kernel is fast exactly in proportion to how much of that reuse it captures in fast memory.{" "}
                <strong>2.</strong> So you tile at every level the hardware has — DRAM→shared for blocks,
                shared→registers for threads, and warps in between — and you make every remaining transfer
                wide, coalesced and overlapped with compute. <strong>3.</strong> Everything else is bookkeeping.
              </p>
            </Reveal>
          </Section>

          {/* ── 12 ─────────────────────────────────────────────────────── */}
          <Section id="onward" num="12" label="What's above" title="What's still on the mountain">
            <Reveal>
              <p>
                The honest fine print: this ladder hand-waves two rungs — resolving shared-memory{" "}
                <em>bank conflicts</em>, and <em>autotuning</em> tile sizes per GPU (which is how you squeeze
                out 84.8% before warptiling&apos;s 93.7%).
              </p>
              <p>
                And above all of it sits a different vehicle entirely: <strong>tensor cores</strong> — dedicated
                matmul hardware driven by <code className="g-code">mma</code> and{" "}
                <code className="g-code">wgmma</code>, where the A6000 does not do 39 but roughly 77 TFLOP/s of
                tf32, and where CUTLASS, Triton and DeepGEMM live. The beautiful part: it is still tiles. The
                same hierarchy you just read, with the thread-tile FMA swapped for a warp-wide matrix
                instruction. You now speak the language; the tensor-core chapter is a vocabulary lesson.
              </p>
              <p>
                Next stop for me: tensor cores and CUTLASS, on Hopper, in fp8 — same mountain, bigger engine.
              </p>
              <h3 style={{ marginTop: "2.2rem" }}>Take it with you</h3>
              <p style={{ marginTop: "0.8rem" }}>
                The reference numbers and the route follow{" "}
                <a className="g-link" href="https://siboehm.com/articles/22/CUDA-MMM" target="_blank" rel="noopener noreferrer">
                  Simon Boehm&apos;s worklog
                </a>
                ; for the visual-explanation genre this page lives in, see{" "}
                <a className="g-link" href="https://bbycroft.net/llm" target="_blank" rel="noopener noreferrer">
                  bbycroft&apos;s LLM visualisation
                </a>{" "}
                and{" "}
                <a className="g-link" href="https://wattenberger.com/thoughts" target="_blank" rel="noopener noreferrer">
                  Wattenberger&apos;s essays
                </a>
                ; for what lies above kernel 7, start with{" "}
                <a className="g-link" href="https://github.com/NVIDIA/cutlass" target="_blank" rel="noopener noreferrer">
                  CUTLASS
                </a>{" "}
                and the{" "}
                <a className="g-link" href="https://docs.nvidia.com/cuda/cuda-c-programming-guide/" target="_blank" rel="noopener noreferrer">
                  CUDA C++ Programming Guide
                </a>
                .
              </p>
            </Reveal>
          </Section>

          {/* ─────────────────────────── COLOPHON ─────────────────────── */}
          <footer className="g-section" style={{ paddingBottom: 0 }}>
            <Reveal>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <p className="g-label">written by</p>
                  <p style={{ marginTop: "0.4rem" }}>
                    Amartya Yadav — software engineer in Bengaluru, learning GPUs a layer at a time.
                  </p>
                  <div style={{ display: "flex", gap: "1.1rem", marginTop: "1rem" }}>
                    <Link className="g-link g-mono" href="/writing" style={{ fontSize: 13 }}>
                      more writing
                    </Link>
                    <a
                      className="g-link g-mono"
                      style={{ fontSize: 13 }}
                      href={`https://x.com/intent/tweet?text=${encodeURIComponent("One matmul, seven kernels, 70× — the GEMM ladder, explained")}&url=${encodeURIComponent(articleUrl(article))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      share on X
                    </a>
                    <Link className="g-link g-mono" href="/about#say-hi" style={{ fontSize: 13 }}>
                      say hi
                    </Link>
                  </div>
                </div>
                <p className="g-figcap" style={{ maxWidth: "26rem" }}>
                  benchmarks: RTX A6000 · 4096×4096×4096 fp32 · GFLOP/s from siboehm.com · arithmetic derived
                  in-page
                </p>
              </div>
            </Reveal>
          </footer>
        </main>
      </div>
    </div>
  );
}
