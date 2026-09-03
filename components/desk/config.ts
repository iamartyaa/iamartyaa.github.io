/**
 * THE DESK, AS DATA.
 *
 * Everything that decides what is on the desk and where lives here, not in the
 * geometry: which props exist, where they sit, which of them are doors to a
 * page, where the cat is allowed to land, and how the camera frames it all.
 * Adding a prop is one line in `props`; a second desk for another page is a
 * second layout. The renderer (rig.tsx) never knows about a specific object.
 */

export const INK = "#241f1c";

export const DAY = {
  desk: "#e0ab6c",
  deskEdge: "#b07f47",
  leg: "#8a5f31",
  white: "#fffdf8",
  key: "#f3ece0",
  screen: "#fff3dd",
  pot: "#c98a5a",
  note: "#ffe66d",
  page: "#fffdf8",
  drawer: "#d19c5c",
};

export const NIGHT: Skin = {
  desk: "#8c6440",
  deskEdge: "#6b4a2c",
  leg: "#55382a",
  white: "#e8e1d4",
  key: "#c9c0b0",
  screen: "#ffe6b8",
  pot: "#8f6440",
  note: "#e0c95c",
  page: "#e6dfd2",
  drawer: "#7d5936",
};

export type Skin = typeof DAY;

export const ACCENT = {
  ink: INK,
  orange: "#e8562f",
  yellow: "#ffc53a",
  blue: "#2f6fed",
  green: "#6fae7b",
  pink: "#f4a58a",
  lead: "#3a3a3a",
};

export type Vec3 = [number, number, number];

export type PropKind =
  | "monitor"
  | "keyboard"
  | "mug"
  | "plant"
  | "notebook"
  | "sticky"
  | "pencil"
  | "lamp"
  | "drawer"
  | "plane";

export type Hotspot = { label: string; href: string };

export type DeskProp = {
  id: string;
  kind: PropKind;
  /** Position on the desk surface: x across, z toward the viewer. y is the lift. */
  position: Vec3;
  rotation?: Vec3;
  scale?: number;
  /** Present when the object is a door: hover shows the label, click goes there. */
  hotspot?: Hotspot;
};

export type DeskLayout = {
  body: { width: number; depth: number; thickness: number };
  props: DeskProp[];
  /** Where the cat may land, in order. The first is where he starts. */
  catSpots: Vec3[];
};

/** Every object clears the surface by the same 0.05: flush-at-zero reads as sunk once
 *  the ink outline lands in the same plane as the desk top. */
const LIFT = 0.05;

export const HOME_LAYOUT: DeskLayout = {
  body: { width: 6.6, depth: 3.7, thickness: 0.24 },
  props: [
    { id: "monitor", kind: "monitor", position: [-0.35, 0, -1.15], hotspot: { label: "things I made →", href: "/things" } },
    { id: "keyboard", kind: "keyboard", position: [-0.35, LIFT, 0.62], rotation: [0, 0.03, 0] },
    { id: "mug", kind: "mug", position: [1.95, LIFT, 0.45], hotspot: { label: "say hi →", href: "/about#say-hi" } },
    { id: "plant", kind: "plant", position: [2.62, LIFT, -1.1], hotspot: { label: "still growing →", href: "/about" } },
    { id: "notebook", kind: "notebook", position: [-2.3, 0.03, 0.3], hotspot: { label: "things I wrote →", href: "/writings" } },
    { id: "sticky", kind: "sticky", position: [-1.5, 0.03, 1.24], hotspot: { label: "about me →", href: "/about" } },
    { id: "pencil", kind: "pencil", position: [-1.35, LIFT, 0.62], rotation: [0, 0.5, 0] },
    { id: "lamp", kind: "lamp", position: [-2.62, 0.06, -1.15] },
    { id: "drawer", kind: "drawer", position: [1.65, -0.43, 1.28], hotspot: { label: "smaller things →", href: "/things#drawer" } },
    { id: "plane", kind: "plane", position: [3.15, 3.5, 1.5], rotation: [0.42, -0.28, 0.22], scale: 0.62 },
  ],
  catSpots: [
    [1.15, 0.06, -1.0],
    [2.15, 0.06, 1.05],
    [-2.05, 0.06, -1.35],
  ],
};

/**
 * Camera and framing. `fit` is the size of the scene the canvas has to hold:
 * the rig scales the whole desk so those units fit the visible width AND
 * height, which is what keeps a phone's short landscape canvas and a desktop's
 * tall column showing the same composition.
 */
export const CAMERA = {
  position: [0, 3.9, 11.4] as Vec3,
  fov: 30,
  fit: { width: 9.4, height: 6.4, min: 0.42, max: 1 },
  /** Resting pose of the presentation controls: a little from above, turned a touch. */
  rest: [0.16, -0.5, 0] as Vec3,
  polar: [-0.25, 0.5] as [number, number],
  /** How far the desk tips toward top-down as the hero scrolls away (radians). */
  scrollTilt: 0.5,
};
