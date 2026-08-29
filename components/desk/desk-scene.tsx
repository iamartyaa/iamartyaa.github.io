"use client";

import { ContactShadows, Html, Outlines, PresentationControls, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTheme } from "next-themes";

import { useThemeToggle } from "@/components/motion/theme-toggle";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { AdditiveBlending, BufferAttribute, BufferGeometry, DoubleSide, type Group, type Mesh, type MeshStandardMaterial } from "three";

/**
 * THE DESK — the hero object.
 *
 * Built entirely from code geometry (no model pipeline) so it stays in the
 * sticker language: flat palette fills plus an ink outline on every mesh, the
 * same 2.4px stroke the SVG cast uses. Drag to spin, hover an object to see
 * what it opens, click to go there. At night the room dims and the lamp is the
 * only thing still burning.
 */

const INK = "#241f1c";

const DAY = {
  desk: "#e0ab6c",
  deskEdge: "#b07f47",
  leg: "#8a5f31",
  white: "#fffdf8",
  key: "#f3ece0",
  screen: "#fff3dd",
  pot: "#c98a5a",
  note: "#ffe66d",
  page: "#fffdf8",
};

const NIGHT = {
  desk: "#8c6440",
  deskEdge: "#6b4a2c",
  leg: "#55382a",
  white: "#e8e1d4",
  key: "#c9c0b0",
  screen: "#ffe6b8",
  pot: "#8f6440",
  note: "#e0c95c",
  page: "#e6dfd2",
};

const ACCENT = {
  ink: INK,
  orange: "#e8562f",
  yellow: "#ffc53a",
  blue: "#2f6fed",
  green: "#6fae7b",
  pink: "#f4a58a",
  lead: "#3a3a3a",
};

/**
 * Ink line on every solid, so 3D reads as one hand with the 2D drawings.
 * drei measures `thickness` in PIXELS while `screenspace` is false, which is
 * what we want: the line keeps its weight as the desk spins, exactly like the
 * 2.4px stroke on the SVG cast.
 */
function Ink({ thickness = 4 }: { thickness?: number }) {
  return <Outlines thickness={thickness} color={INK} angle={Math.PI} />;
}

type Skin = typeof DAY;

/* ────────────────────────────── the objects ────────────────────────────── */

function Keyboard({ skin }: { skin: Skin }) {
  // 5 × 14 keycaps, laid out once and memoised — the detail that makes the
  // whole desk read as a real object rather than a grey slab.
  const keys = useMemo(() => {
    const out: { x: number; z: number; w: number }[] = [];
    const rows = 4;
    const cols = 13;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        out.push({ x: -0.78 + c * 0.13, z: -0.16 + r * 0.115, w: 0.1 });
      }
    }
    for (let c = 0; c < 4; c++) out.push({ x: -0.22 + c * 0.13, z: 0.36, w: 0.1 });
    out.push({ x: 0.4, z: 0.36, w: 0.42 });
    return out;
  }, []);

  return (
    <group>
      <RoundedBox args={[1.86, 0.1, 0.78]} radius={0.035} smoothness={3} position={[0, 0.05, 0]} castShadow>
        <meshStandardMaterial color={skin.white} roughness={0.65} />
        <Ink thickness={3} />
      </RoundedBox>
      {keys.map((k) => (
        <mesh key={`${k.x}-${k.z}-${k.w}`} position={[k.x, 0.115, k.z]}>
          <boxGeometry args={[k.w * (k.w > 0.2 ? 1 : 1), 0.03, 0.09]} />
          <meshStandardMaterial color={skin.key} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function MonitorObject({ skin, night }: { skin: Skin; night: boolean }) {
  return (
    <group>
      <RoundedBox args={[2.5, 1.56, 0.16]} radius={0.12} smoothness={4} position={[0, 1.02, 0]} castShadow>
        <meshStandardMaterial color={ACCENT.ink} roughness={0.6} />
        <Ink />
      </RoundedBox>

      {/* screen */}
      <mesh position={[0, 1.05, 0.09]}>
        <planeGeometry args={[2.2, 1.24]} />
        <meshStandardMaterial
          color={skin.screen}
          emissive={skin.screen}
          emissiveIntensity={night ? 0.85 : 0.3}
        />
      </mesh>
      {/* window chrome + three project chips + a progress bar: the monitor is
          literally showing the /things page. */}
      <mesh position={[0, 1.55, 0.1]}>
        <planeGeometry args={[2.2, 0.16]} />
        <meshStandardMaterial color="#efe0c6" />
      </mesh>
      {[ACCENT.orange, ACCENT.green, ACCENT.blue].map((c, i) => (
        <mesh key={c} position={[-0.66 + i * 0.66, 1.18, 0.11]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshStandardMaterial color={c} />
        </mesh>
      ))}
      <mesh position={[-0.62, 0.72, 0.11]}>
        <planeGeometry args={[0.86, 0.07]} />
        <meshStandardMaterial color="#d9c9ae" />
      </mesh>
      <mesh position={[-0.83, 0.6, 0.11]}>
        <planeGeometry args={[0.44, 0.07]} />
        <meshStandardMaterial color={ACCENT.yellow} />
      </mesh>

      {/* neck + foot */}
      <mesh position={[0, 0.24, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.13, 0.44, 12]} />
        <meshStandardMaterial color={ACCENT.ink} />
        <Ink thickness={3} />
      </mesh>
      <RoundedBox args={[0.84, 0.07, 0.42]} radius={0.03} smoothness={3} position={[0, 0.04, 0.08]} castShadow>
        <meshStandardMaterial color={ACCENT.ink} />
        <Ink thickness={3} />
      </RoundedBox>
    </group>
  );
}

/** Steam: three little puffs that rise, fatten and fade, on staggered clocks. */
function Steam() {
  const puffs = useRef<Group>(null);
  useFrame((state) => {
    if (!puffs.current) return;
    puffs.current.children.forEach((child, i) => {
      const t = (state.clock.elapsedTime * 0.5 + i * 0.33) % 1;
      child.position.y = 0.28 + t * 0.62;
      const s = 0.05 + t * 0.1;
      child.scale.setScalar(s);
      const mat = (child as Mesh).material as MeshStandardMaterial;
      mat.opacity = Math.sin(t * Math.PI) * 0.32;
    });
  });
  return (
    <group ref={puffs}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[(i - 1) * 0.06, 0.3, 0]}>
          <sphereGeometry args={[1, 10, 8]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.4} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function MugObject({ skin }: { skin: Skin }) {
  // Every object's own origin is the desk surface: the group below lifts the
  // geometry by half its height so nothing is ever half-sunk in the wood.
  return (
    <group position={[0, 0.23, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.27, 0.23, 0.46, 24]} />
        <meshStandardMaterial color={skin.white} roughness={0.5} />
        <Ink thickness={3.2} />
      </mesh>
      {/* handle */}
      <mesh position={[0.31, 0.02, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <torusGeometry args={[0.15, 0.038, 10, 20, Math.PI]} />
        <meshStandardMaterial color={skin.white} roughness={0.5} />
        <Ink thickness={2.6} />
      </mesh>
      {/* the coffee, and the orange band that says whose mug this is */}
      <mesh position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.24, 24]} />
        <meshStandardMaterial color="#6b4326" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.272, 0.262, 0.1, 24, 1, true]} />
        <meshStandardMaterial color={ACCENT.orange} side={DoubleSide} />
      </mesh>
      <Steam />
    </group>
  );
}

function PlantObject({ skin }: { skin: Skin }) {
  const leaves = useRef<Group>(null);
  useFrame((state) => {
    if (leaves.current) leaves.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.7) * 0.055;
  });
  const blades = useMemo(
    () => [
      { r: -0.55, h: 0.5, s: 0.9 },
      { r: -0.22, h: 0.62, s: 1 },
      { r: 0.1, h: 0.58, s: 0.95 },
      { r: 0.45, h: 0.46, s: 0.85 },
    ],
    [],
  );
  return (
    <group position={[0, 0.22, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.3, 0.23, 0.44, 18]} />
        <meshStandardMaterial color={skin.pot} roughness={0.85} />
        <Ink thickness={3.2} />
      </mesh>
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.33, 0.33, 0.08, 18]} />
        <meshStandardMaterial color={skin.pot} roughness={0.85} />
        <Ink thickness={2.6} />
      </mesh>
      <group ref={leaves} position={[0, 0.26, 0]}>
        {blades.map((b) => (
          <mesh
            key={b.r}
            position={[Math.sin(b.r) * 0.2, b.h * 0.5, Math.cos(b.r) * 0.06]}
            rotation={[0, 0, -b.r]}
            scale={[0.2 * b.s, b.h, 0.09]}
            castShadow
          >
            <sphereGeometry args={[1, 12, 10]} />
            <meshStandardMaterial color={ACCENT.green} roughness={0.8} />
            <Ink thickness={3} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** An open notebook: two pages tented over a spine, lines drawn on the right. */
function NotebookObject({ skin }: { skin: Skin }) {
  return (
    <group rotation={[0, 0.3, 0]}>
      <mesh position={[-0.42, 0.03, 0]} rotation={[0, 0, 0.07]} castShadow>
        <boxGeometry args={[0.86, 0.045, 1.16]} />
        <meshStandardMaterial color={skin.page} roughness={0.85} />
        <Ink thickness={2.6} />
      </mesh>
      <mesh position={[0.42, 0.03, 0]} rotation={[0, 0, -0.07]} castShadow>
        <boxGeometry args={[0.86, 0.045, 1.16]} />
        <meshStandardMaterial color={skin.page} roughness={0.85} />
        <Ink thickness={2.6} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.08, 0.05, 1.16]} />
        <meshStandardMaterial color={ACCENT.yellow} />
      </mesh>
      {[-0.34, -0.12, 0.1, 0.32].map((z) => (
        <mesh key={z} position={[0.42, 0.062, z]}>
          <boxGeometry args={[0.6, 0.005, 0.022]} />
          <meshStandardMaterial color="#b9ab97" />
        </mesh>
      ))}
      {[-0.3, -0.05, 0.2].map((z) => (
        <mesh key={z} position={[-0.44, 0.062, z]} rotation={[0, 0.1, 0]}>
          <boxGeometry args={[0.42, 0.005, 0.022]} />
          <meshStandardMaterial color="#c3b6a2" />
        </mesh>
      ))}
    </group>
  );
}

function StickyNote({ skin }: { skin: Skin }) {
  return (
    <group rotation={[0, -0.24, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.8, 0.035, 0.8]} />
        <meshStandardMaterial color={skin.note} roughness={0.95} />
        <Ink thickness={2.6} />
      </mesh>
      {[-0.16, 0, 0.16].map((z, i) => (
        <mesh key={z} position={[-0.04 + i * 0.03, 0.021, z]}>
          <boxGeometry args={[0.46 - i * 0.1, 0.004, 0.03]} />
          <meshStandardMaterial color="#b39a2e" />
        </mesh>
      ))}
    </group>
  );
}

function Pencil() {
  return (
    <group rotation={[0, 0, Math.PI / 2]} position={[0, 0.05, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.9, 6]} />
        <meshStandardMaterial color={ACCENT.yellow} roughness={0.6} />
        <Ink thickness={2.6} />
      </mesh>
      <mesh position={[0, -0.52, 0]}>
        <coneGeometry args={[0.045, 0.14, 6]} />
        <meshStandardMaterial color="#e7cfa2" />
      </mesh>
      <mesh position={[0, -0.6, 0]}>
        <coneGeometry args={[0.018, 0.05, 6]} />
        <meshStandardMaterial color={ACCENT.lead} />
      </mesh>
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.047, 0.047, 0.08, 6]} />
        <meshStandardMaterial color="#c0c0c0" />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.07, 6]} />
        <meshStandardMaterial color={ACCENT.pink} />
      </mesh>
    </group>
  );
}

/**
 * The pull chain. Grab it and the room changes.
 *
 * The bead is the hit target (a 4mm cord is impossible to click), and the
 * whole chain slides down and springs back on release — the click reads as a
 * pull because the thing you pulled moves before the lights do.
 */
function PullChain({ onPull }: { onPull: () => void }) {
  const chain = useRef<Group>(null);
  const pulled = useRef(0);
  const target = useRef(0);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    const k = Math.min(1, delta * 14);
    pulled.current += (target.current - pulled.current) * k;
    if (target.current === 1 && pulled.current > 0.86) target.current = 0;
    if (chain.current) chain.current.position.y = -pulled.current * 0.26;
  });

  return (
    <group
      ref={chain}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        target.current = 1;
        onPull();
      }}
    >
      {/* generous invisible grab area around a very thin cord */}
      <mesh position={[0, -0.42, 0]} visible={false}>
        <cylinderGeometry args={[0.16, 0.16, 0.9, 6]} />
      </mesh>
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.6, 6]} />
        <meshStandardMaterial color={ACCENT.ink} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, -0.5 - i * 0.07, 0]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#c9b28a" metalness={0.4} roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[0, -0.74, 0]} castShadow>
        <sphereGeometry args={[0.075, 14, 14]} />
        <meshStandardMaterial color={hovered ? ACCENT.yellow : "#d9c08f"} roughness={0.45} />
        <Ink thickness={2.4} />
      </mesh>
      {hovered ? (
        <Html center distanceFactor={8} position={[0, -1.02, 0]} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
          <span className="whitespace-nowrap rounded-full bg-card px-4 py-2 font-sans text-[15px] font-semibold text-ink shadow-[var(--shadow-sticker)]">
            pull the string
          </span>
        </Html>
      ) : null}
    </group>
  );
}

/** The lamp. Its light is the reason night mode exists. */
function LampObject({ night, onPull }: { night: boolean; onPull: () => void }) {
  return (
    <group>
      <mesh position={[0, 0.07, 0]} castShadow>
        <cylinderGeometry args={[0.36, 0.38, 0.14, 20]} />
        <meshStandardMaterial color={ACCENT.ink} />
        <Ink thickness={3.2} />
      </mesh>
      <mesh position={[0.12, 0.95, 0]} rotation={[0, 0, 0.2]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 1.72, 10]} />
        <meshStandardMaterial color={ACCENT.ink} />
        <Ink thickness={2.6} />
      </mesh>
      <group position={[0.42, 1.78, 0]} rotation={[0, 0, -0.52]}>
        <mesh castShadow>
          <coneGeometry args={[0.46, 0.54, 22, 1, true]} />
          <meshStandardMaterial color={ACCENT.orange} side={DoubleSide} roughness={0.45} />
          <Ink thickness={4} />
        </mesh>
        {/* the bulb: visible glow inside the shade */}
        <mesh position={[0, -0.2, 0]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshBasicMaterial color="#fff0cf" />
        </mesh>
        <pointLight
          position={[0, -0.26, 0]}
          intensity={night ? 26 : 9}
          distance={night ? 11 : 7}
          decay={2}
          color="#ffcf8f"
          castShadow
        />
        {/* hangs from the rim of the shade, and hangs straight down whatever
            angle the shade is tilted at */}
        <group position={[0.3, -0.24, 0]} rotation={[0, 0, 0.52]}>
          <PullChain onPull={onPull} />
        </group>
      </group>
    </group>
  );
}

/** The pool of lamplight on the desk — only lit at night. */
function LightPool({ night }: { night: boolean }) {
  if (!night) return null;
  return (
    <mesh position={[-1.4, 0.135, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[2.5, 40]} />
      <meshBasicMaterial color="#ffc27a" transparent opacity={0.24} blending={AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

/** The cat: loaf shape, ears with pink insides, blinking, tail on its own clock. */
function CatObject({ skin }: { skin: Skin }) {
  const tail = useRef<Mesh>(null);
  const lids = useRef<Group>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (tail.current) tail.current.rotation.x = Math.sin(t * 1.5) * 0.4 - 0.5;
    if (lids.current) {
      const blink = Math.sin(t * 1.1) > 0.985 ? 0.05 : 1;
      lids.current.scale.y += (blink - lids.current.scale.y) * 0.4;
    }
  });

  return (
    <group>
      <mesh position={[0, 0.3, 0]} scale={[1, 0.86, 1.25]} castShadow>
        <sphereGeometry args={[0.38, 20, 16]} />
        <meshStandardMaterial color={skin.white} roughness={0.9} />
        <Ink thickness={3.2} />
      </mesh>
      <mesh position={[0, 0.52, 0.2]} castShadow>
        <sphereGeometry args={[0.27, 20, 16]} />
        <meshStandardMaterial color={skin.white} roughness={0.9} />
        <Ink thickness={3.2} />
      </mesh>
      {[-0.15, 0.15].map((x) => (
        <group key={x} position={[x, 0.74, 0.16]} rotation={[0.25, 0, x > 0 ? -0.25 : 0.25]}>
          <mesh castShadow>
            <coneGeometry args={[0.11, 0.24, 4]} />
            <meshStandardMaterial color={skin.white} />
            <Ink thickness={2.6} />
          </mesh>
          <mesh position={[0, -0.01, 0.05]} scale={0.6}>
            <coneGeometry args={[0.1, 0.22, 4]} />
            <meshStandardMaterial color={ACCENT.pink} />
          </mesh>
        </group>
      ))}
      <group ref={lids}>
        {[-0.11, 0.11].map((x) => (
          <mesh key={x} position={[x, 0.55, 0.44]}>
            <sphereGeometry args={[0.038, 10, 10]} />
            <meshBasicMaterial color={INK} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, 0.47, 0.46]}>
        <coneGeometry args={[0.035, 0.05, 6]} />
        <meshBasicMaterial color={ACCENT.pink} />
      </mesh>
      <mesh ref={tail} position={[0, 0.26, -0.42]} rotation={[-0.5, 0, 0]}>
        <capsuleGeometry args={[0.055, 0.52, 4, 8]} />
        <meshStandardMaterial color={skin.white} roughness={0.9} />
        <Ink thickness={2.6} />
      </mesh>
    </group>
  );
}

/** A folded paper plane, built from four triangles — the route's protagonist. */
function usePlaneGeometry() {
  return useMemo(() => {
    const g = new BufferGeometry();
    // nose forward (+z), tail at origin, a keel folded down the middle
    const v = new Float32Array([
      // left wing
      0, 0, 1.25, -0.78, 0.06, -0.62, 0, -0.04, -0.3,
      // right wing
      0, 0, 1.25, 0, -0.04, -0.3, 0.78, 0.06, -0.62,
      // left keel
      0, 0, 1.25, 0, -0.04, -0.3, 0, -0.26, -0.5,
      // right keel
      0, 0, 1.25, 0, -0.26, -0.5, 0, -0.04, -0.3,
    ]);
    g.setAttribute("position", new BufferAttribute(v, 3));
    g.computeVertexNormals();
    return g;
  }, []);
}

function PaperPlaneObject({ skin }: { skin: Skin }) {
  const geo = usePlaneGeometry();
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = 3.5 + Math.sin(t * 0.9) * 0.16;
    ref.current.rotation.z = Math.sin(t * 0.7) * 0.14;
    ref.current.rotation.y = -0.6 + Math.sin(t * 0.45) * 0.12;
  });
  return (
    <group ref={ref} position={[3.15, 3.5, 1.5]} rotation={[0.42, -0.28, 0.22]} scale={0.62}>
      <mesh geometry={geo}>
        <meshStandardMaterial color={skin.white} roughness={0.7} side={DoubleSide} flatShading />
        <Ink thickness={3} />
      </mesh>
    </group>
  );
}

/* ─────────────────────────── interaction ─────────────────────────── */

type HotspotProps = {
  children: ReactNode;
  label: string;
  href: string;
  position: [number, number, number];
};

/**
 * A liftable, clickable object. Hover raises it and shows its label; the whole
 * group is one hit target so small parts (a keycap, an ear) stay clickable.
 */
function Hotspot({ children, label, href, position }: HotspotProps) {
  const ref = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  useFrame((_, delta) => {
    if (!ref.current) return;
    const target = hovered ? 0.18 : 0;
    ref.current.position.y += (target - ref.current.position.y) * Math.min(1, delta * 9);
  });

  return (
    <group
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        router.push(href);
      }}
    >
      <group ref={ref}>{children}</group>
      {hovered ? (
        <Html center distanceFactor={8} position={[0, 1.15, 0]} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
          <span className="whitespace-nowrap rounded-full bg-card px-4 py-2 font-sans text-[15px] font-semibold text-ink shadow-[var(--shadow-sticker)]">
            {label}
          </span>
        </Html>
      ) : null}
    </group>
  );
}

/* ─────────────────────────── the assembly ─────────────────────────── */

function DeskBody({ skin }: { skin: Skin }) {
  return (
    <group>
      <RoundedBox args={[6.6, 0.24, 3.7]} radius={0.07} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color={skin.desk} roughness={0.72} />
        <Ink />
      </RoundedBox>
      <RoundedBox args={[6.6, 0.1, 0.12]} radius={0.04} smoothness={3} position={[0, -0.14, 1.83]}>
        <meshStandardMaterial color={skin.deskEdge} roughness={0.8} />
      </RoundedBox>
      {[
        [-3.05, 1.6],
        [3.05, 1.6],
        [-3.05, -1.6],
        [3.05, -1.6],
      ].map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, -0.76, z]} castShadow>
          <boxGeometry args={[0.2, 1.28, 0.2]} />
          <meshStandardMaterial color={skin.leg} roughness={0.8} />
          <Ink thickness={3} />
        </mesh>
      ))}
    </group>
  );
}

function DeskContents({ skin, night, onPull }: { skin: Skin; night: boolean; onPull: () => void }) {
  return (
    <group position={[0, 0.12, 0]}>
      <LightPool night={night} />

      <Hotspot label="things I made →" href="/things" position={[-0.35, 0, -1.15]}>
        <MonitorObject skin={skin} night={night} />
      </Hotspot>

      <group position={[-0.35, 0, 0.62]} rotation={[0, 0.03, 0]}>
        <Keyboard skin={skin} />
      </group>

      <Hotspot label="say hi →" href="/about#say-hi" position={[1.95, 0, 0.45]}>
        <MugObject skin={skin} />
      </Hotspot>

      <Hotspot label="still growing →" href="/about" position={[2.62, 0, -1.1]}>
        <PlantObject skin={skin} />
      </Hotspot>

      <Hotspot label="things I wrote →" href="/writing" position={[-2.3, 0, 0.3]}>
        <NotebookObject skin={skin} />
      </Hotspot>

      <Hotspot label="about me →" href="/about" position={[-1.5, 0, 1.24]}>
        <StickyNote skin={skin} />
      </Hotspot>

      <group position={[-1.35, 0.02, 0.62]} rotation={[0, 0.5, 0]}>
        <Pencil />
      </group>

      <group position={[-2.62, 0.06, -1.15]}>
        <LampObject night={night} onPull={onPull} />
      </group>

      <group position={[1.15, 0.04, -1.0]} rotation={[0, -0.12, 0]}>
        <CatObject skin={skin} />
      </group>
    </group>
  );
}

/**
 * Fits the desk to the canvas instead of trusting one camera distance: a phone
 * gets the same composition as a desktop, just smaller.
 */
function FitToViewport({ children }: { children: ReactNode }) {
  const { viewport } = useThree();
  const scale = Math.min(1, Math.max(0.52, viewport.width / 11));
  return <group scale={scale}>{children}</group>;
}

function DeskRig({ skin, night, onPull }: { skin: Skin; night: boolean; onPull: () => void }) {
  const group = useRef<Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    // The desk leans toward the cursor — the "it's alive" tell before anyone
    // discovers they can drag it.
    const { x, y } = state.pointer;
    group.current.rotation.y += (x * 0.11 - group.current.rotation.y) * 0.05;
    group.current.rotation.x += (-y * 0.045 - group.current.rotation.x) * 0.05;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.06;
  });

  return (
    <group ref={group}>
      <DeskBody skin={skin} />
      <DeskContents skin={skin} night={night} onPull={onPull} />
    </group>
  );
}

export default function DeskScene() {
  const { resolvedTheme } = useTheme();
  // The lamp's chain is the site's theme switch. Same beUI View Transition
  // wipe as everywhere else, but it starts at the top-left — where the lamp
  // stands — so the dark spreads out of the lamp you just pulled.
  const { toggle } = useThemeToggle({ variant: "circle-blur", start: "top-left" });
  const night = resolvedTheme === "dark";
  const skin = night ? NIGHT : DAY;

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 3.9, 11.4], fov: 30 }}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: "pan-y" }}
    >
      {/* Day: flat, bright, picture-book. Night: the lamp does the work. */}
      <ambientLight intensity={night ? 0.24 : 0.9} color={night ? "#5f6d8c" : "#ffffff"} />
      <directionalLight
        position={[4, 7, 5]}
        intensity={night ? 0.3 : 1.5}
        color={night ? "#8fa6d8" : "#ffffff"}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[-5, 3, -4]} intensity={night ? 0.1 : 0.35} color="#cfe0ff" />

      {/* No snap and no azimuth fence: the desk spins all the way round and
          stays where you left it. Polar stays bounded — nobody wants to look
          at the underside of a desk. */}
      <PresentationControls
        global
        cursor
        speed={1.4}
        zoom={1}
        rotation={[0.16, -0.5, 0]}
        polar={[-0.25, 0.5]}
        azimuth={[-Infinity, Infinity]}
      >
        <FitToViewport>
          <group scale={0.95} position={[0, -0.25, 0]}>
            <DeskRig skin={skin} night={night} onPull={toggle} />
            <PaperPlaneObject skin={skin} />
          </group>
        </FitToViewport>
      </PresentationControls>

      <ContactShadows
        position={[0, -1.62, 0]}
        opacity={night ? 0.5 : 0.28}
        scale={16}
        blur={2.8}
        far={4.5}
        color={night ? "#000000" : "#4a3520"}
      />
    </Canvas>
  );
}
