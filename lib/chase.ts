/**
 * THE CHASE — one mutable object shared by the mouse and the cat.
 *
 * The mouse writes its viewport position every frame; the cat reads it in its
 * own frame loop. Deliberately NOT React state: sixty writes a second through
 * a store would re-render both characters into the ground. Only the three
 * flags change rarely enough to be worth reacting to, and the cat polls those
 * in the same loop it is already running.
 */

export type ChaseState = {
  /** A mouse is on the page and running the route. */
  hunting: boolean;
  /** Where it is, in viewport pixels. */
  x: number;
  y: number;
  /** Unit vector of the direction it is running — the cat aims behind this. */
  dx: number;
  dy: number;
  /** It just went behind a sticker and the cat has no idea where. */
  lost: boolean;
  /** The thing it hides behind when the route runs out — the drawer. */
  den: HTMLElement | null;
};

const state: ChaseState = { hunting: false, x: -400, y: -400, dx: 1, dy: 0, lost: false, den: null };

export const chase = {
  read: () => state,
  set(next: Partial<ChaseState>) {
    Object.assign(state, next);
  },
};
