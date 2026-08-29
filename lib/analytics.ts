/**
 * VISITOR COUNT — GoatCounter.
 *
 * The site is a static export on GitHub Pages, so the tally has to live
 * somewhere else. GoatCounter is cookieless and stores no personal data, which
 * is why there is no consent banner anywhere on this site: nothing is stored
 * on the visitor's machine to consent to.
 *
 * Two halves:
 *   1. a 0.8 KB script on every page, which records the pageview;
 *   2. this fetch, which reads the public total back out for the guestbook.
 *
 * The public endpoint only answers once "Allow adding visitor counts to your
 * website" is ticked in GoatCounter → Settings.
 */

/** The GoatCounter site code — i.e. https://<CODE>.goatcounter.com. */
export const GOATCOUNTER = "iamartyaa";

export const GOATCOUNTER_SCRIPT = `https://gc.zgo.at/count.js`;
export const GOATCOUNTER_ENDPOINT = `https://${GOATCOUNTER}.goatcounter.com/count`;

export type VisitorCount = { visitors: number; pageviews: number };

const parse = (v: unknown) => {
  const n = Number(String(v ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

/**
 * Total unique visitors and pageviews, ever. Returns null on any failure —
 * a blocked request, an ad blocker, a site code that isn't live yet — and the
 * guestbook is written to work without a number rather than to show a broken
 * one.
 */
export async function fetchVisitorCount(signal?: AbortSignal): Promise<VisitorCount | null> {
  try {
    const res = await fetch(`https://${GOATCOUNTER}.goatcounter.com/counter/TOTAL.json`, {
      signal,
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { count?: string; count_unique?: string };
    const pageviews = parse(data.count);
    const visitors = parse(data.count_unique) || pageviews;
    if (!pageviews && !visitors) return null;
    return { visitors, pageviews };
  } catch {
    return null;
  }
}
