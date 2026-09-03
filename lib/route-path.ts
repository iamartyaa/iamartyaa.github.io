/**
 * The dashed line is generated, not drawn by hand — because the filters on
 * /things really do re-route it. Given the waypoints (one per visible
 * landing, alternating sides), this returns a smooth path through all of
 * them: Catmull-Rom converted to cubic Béziers, which is the cheapest way to
 * get a curve that actually passes through its control points instead of
 * being pulled near them.
 */

export type Point = { x: number; y: number };

export function buildRoute(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M${points[0].x} ${points[0].y}`;

  // duplicate the ends so the first and last segments curve like the rest
  const p = [points[0], ...points, points[points.length - 1]];
  let d = `M${p[1].x} ${p[1].y}`;

  for (let i = 1; i < p.length - 2; i++) {
    const p0 = p[i - 1];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2];
    // tension 1/6 is the standard Catmull-Rom → Bézier conversion
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${c1.x.toFixed(1)} ${c1.y.toFixed(1)}, ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

/**
 * Waypoints for the visible landings. Each one sits in the open margin on the
 * OPPOSITE side to its card, so the dot is always on paper rather than hidden
 * under a card; a full-width landing gets its waypoint in the gap below it.
 * The entry point is off-canvas, so the line arrives from somewhere.
 *
 * `narrow` is the phone: every card is full width, so the line snakes down
 * behind them and each waypoint sits in the gap under its card, where it can
 * be seen.
 */
export function waypoints(
  sides: ("left" | "right" | "full")[],
  height: number,
  narrow = false,
): { path: Point[]; stops: Point[] } {
  const n = Math.max(1, sides.length);

  if (narrow) {
    const path: Point[] = [{ x: -80, y: 40 }];
    const stops: Point[] = [];
    sides.forEach((_, i) => {
      const top = height * (i / n);
      const bottom = height * ((i + 1) / n);
      // behind the card, on alternating sides…
      path.push({ x: i % 2 === 0 ? 1330 : 110, y: top + (bottom - top) * 0.45 });
      // …then out into the gap below it
      const stop = { x: 720, y: bottom - height * 0.055 };
      path.push(stop);
      stops.push(stop);
    });
    path.push({ x: 720, y: height - 16 });
    return { path, stops };
  }

  const stops: Point[] = sides.map((side, i) => {
    if (side === "full") return { x: 980, y: height * ((i + 0.93) / n) };
    return { x: side === "left" ? 1120 : 330, y: height * ((i + 0.5) / n) };
  });
  const last = stops[stops.length - 1] ?? { x: 720, y: height };
  return { path: [{ x: -80, y: 40 }, ...stops, { x: last.x, y: height - 16 }], stops };
}
