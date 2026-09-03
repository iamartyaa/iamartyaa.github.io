/**
 * Shared, mutable, per-frame state for the scene. One object, written by the
 * lamp's physics and read by everything that is lit by it — the lights, the
 * pool on the desk, the monitor's spill onto the keyboard. Nothing here is
 * React state: it changes 60 times a second and must never re-render.
 */
export const lamp = {
  /** 0 = off, 1 = fully lit. Follows the warm-up / decay curves in lamp.tsx. */
  power: 0,
  /** Room darkness, 0 = day, 1 = night. Eased, so the sun does not switch off in one frame. */
  room: 0,
  /** Shade swing after a pull, in radians. */
  swing: 0,
  swingVel: 0,
  /** Seconds since the last toggle. */
  phase: 99,
  night: false,
  /** Set when the scene first mounts so the very first frame does not warm up from nothing. */
  primed: false,
};

/** Interaction plumbing between props that must not own each other. */
export const desk = {
  /** Bumped by the keyboard; watched by the monitor. */
  typeSeq: 0,
};
