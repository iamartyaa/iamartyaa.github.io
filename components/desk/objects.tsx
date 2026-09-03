"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  MeshStandardMaterial,
  type Group,
  type Mesh,
  type PointLight,
} from "three";

import { ACCENT, type Hotspot, type Skin } from "./config";
import { Ink, Label, useHover } from "./primitives";
import { desk, lamp } from "./state";

/**
 * THE PROPS. Each one is code geometry in the sticker language — flat fills
 * and an ink line — and each one knows only about itself. Whether it is a
 * door, and where it stands, is the layout's business (config.ts).
 */

export type PropProps = { skin: Skin; hovered?: boolean };

/* ────────────────────────────── keyboard + monitor ────────────────────────────── */

export function Keyboard({ skin }: PropProps) {
  // 4 × 13 keycaps plus a space row, laid out once — the detail that makes the
  // whole desk read as a real object rather than a grey slab.
  const keys = useMemo(() => {
    const out: { x: number; z: number; w: number }[] = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 13; c++) out.push({ x: -0.78 + c * 0.13, z: -0.16 + r * 0.115, w: 0.1 });
    for (let c = 0; c < 4; c++) out.push({ x: -0.22 + c * 0.13, z: 0.36, w: 0.1 });
    out.push({ x: 0.4, z: 0.36, w: 0.42 });
    return out;
  }, []);

  // A press runs a wave of depressed keycaps left to right, the way a burst of
  // typing actually looks from across a room. Positions are written straight
  // to the group's children — no state, no re-render, 60fps.
  const caps = useRef<Group>(null);
  // one material shared by every keycap, so the monitor's spill onto the keys
  // at night is one write per frame rather than fifty-seven
  const capMat = useMemo(
    () => new MeshStandardMaterial({ color: skin.key, roughness: 0.9, emissive: new Color("#ffe6b8"), emissiveIntensity: 0 }),
    [skin.key],
  );
  useEffect(() => () => capMat.dispose(), [capMat]);
  const seen = useRef(desk.typeSeq);
  const startedAt = useRef(-99);
  const { hovered, handlers } = useHover();

  useFrame((state) => {
    if (!caps.current) return;
    if (seen.current !== desk.typeSeq) {
      seen.current = desk.typeSeq;
      startedAt.current = state.clock.elapsedTime;
    }
    const since = state.clock.elapsedTime - startedAt.current;
    caps.current.children.forEach((cap, i) => {
      const k = keys[i];
      if (!k) return;
      const t = since - (k.x + 0.9) * 0.42 - Math.abs(k.z) * 0.12;
      const dip = since >= 0 && t > 0 && t < 0.16 ? Math.sin((t / 0.16) * Math.PI) * 0.028 : 0;
      cap.position.y += (0.115 - dip - cap.position.y) * 0.5;
    });
    capMat.emissiveIntensity = 0.22 * lamp.room;
  });

  return (
    <group
      {...handlers}
      onClick={(e) => {
        e.stopPropagation();
        desk.typeSeq += 1;
      }}
    >
      <RoundedBox args={[1.86, 0.1, 0.78]} radius={0.035} smoothness={3} position={[0, 0.05, 0]} castShadow>
        <meshStandardMaterial color={skin.white} roughness={0.65} />
        <Ink thickness={3} />
      </RoundedBox>
      <group ref={caps}>
        {keys.map((k) => (
          <mesh key={`${k.x}-${k.z}-${k.w}`} position={[k.x, 0.115, k.z]} material={capMat}>
            <boxGeometry args={[k.w, 0.03, 0.09]} />
          </mesh>
        ))}
      </group>
      {hovered ? <Label y={0.75}>type something</Label> : null}
    </group>
  );
}

export function Monitor({ skin }: PropProps) {
  // The line the keyboard is writing. It grows character by character with a
  // caret blinking at the end, then sits there until the next burst.
  const line = useRef<Mesh>(null);
  const caret = useRef<Mesh>(null);
  const screen = useRef<MeshStandardMaterial>(null);
  const glow = useRef<PointLight>(null);
  const seen = useRef(desk.typeSeq);
  const startedAt = useRef(-99);
  const FULL = 1.34;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (seen.current !== desk.typeSeq) {
      seen.current = desk.typeSeq;
      startedAt.current = t;
    }
    const since = t - startedAt.current;
    const grow = Math.max(0, Math.min(1, since / 1.1));
    const w = startedAt.current < 0 ? 0 : FULL * grow;
    if (line.current) {
      line.current.scale.x = Math.max(0.0001, w);
      line.current.position.x = -0.83 + w / 2;
      line.current.visible = w > 0.001;
    }
    if (caret.current) {
      caret.current.position.x = -0.8 + w;
      caret.current.visible = startedAt.current > 0 && since < 3.2 && Math.sin(t * 7) > 0;
    }
    // the screen is the second light source at night: it glows, and it spills
    // onto the keyboard in front of it
    const r = lamp.room;
    if (screen.current) screen.current.emissiveIntensity = 0.3 + 0.6 * r;
    if (glow.current) glow.current.intensity = 5 * r;
  });

  return (
    <group>
      <RoundedBox args={[2.5, 1.56, 0.16]} radius={0.12} smoothness={4} position={[0, 1.02, 0]} castShadow>
        <meshStandardMaterial color={ACCENT.ink} roughness={0.6} />
        <Ink />
      </RoundedBox>

      <mesh position={[0, 1.05, 0.09]}>
        <planeGeometry args={[2.2, 1.24]} />
        <meshStandardMaterial ref={screen} color={skin.screen} emissive={skin.screen} emissiveIntensity={0.3} />
      </mesh>
      <pointLight ref={glow} position={[0, 0.9, 1.1]} intensity={0} distance={3.2} decay={2} color="#ffe6b8" />

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
      <mesh ref={line} position={[-0.83, 0.48, 0.11]} visible={false}>
        <planeGeometry args={[1, 0.07]} />
        <meshStandardMaterial color={ACCENT.green} />
      </mesh>
      <mesh ref={caret} position={[-0.8, 0.48, 0.11]} visible={false}>
        <planeGeometry args={[0.035, 0.1]} />
        <meshStandardMaterial color={ACCENT.ink} />
      </mesh>

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

/* ────────────────────────────── mug ────────────────────────────── */

/** Steam: three little puffs that rise, fatten and fade, on staggered clocks. */
function Steam({ excited }: { excited: boolean }) {
  const puffs = useRef<Group>(null);
  useFrame((state) => {
    if (!puffs.current) return;
    const speed = excited ? 0.9 : 0.5;
    puffs.current.children.forEach((child, i) => {
      const t = (state.clock.elapsedTime * speed + i * 0.33) % 1;
      child.position.y = 0.28 + t * 0.62;
      const s = 0.05 + t * 0.1;
      child.scale.setScalar(s);
      (child as Mesh & { material: MeshStandardMaterial }).material.opacity = Math.sin(t * Math.PI) * (excited ? 0.45 : 0.32);
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

/** The mug. Reach for it and it tips toward you, as if you were about to pick it up. */
export function Mug({ skin, hovered = false }: PropProps) {
  const tip = useRef<Group>(null);
  useFrame((_, delta) => {
    if (!tip.current) return;
    const k = Math.min(1, delta * 10);
    tip.current.rotation.z += ((hovered ? -0.26 : 0) - tip.current.rotation.z) * k;
    tip.current.rotation.x += ((hovered ? 0.08 : 0) - tip.current.rotation.x) * k;
  });
  // Every object's own origin is the desk surface: the group below lifts the
  // geometry by half its height so nothing is ever half-sunk in the wood.
  return (
    <group ref={tip} position={[0, 0, 0]}>
      <group position={[0, 0.23, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.27, 0.23, 0.46, 24]} />
          <meshStandardMaterial color={skin.white} roughness={0.5} />
          <Ink thickness={3.2} />
        </mesh>
        <mesh position={[0.31, 0.02, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <torusGeometry args={[0.15, 0.038, 10, 20, Math.PI]} />
          <meshStandardMaterial color={skin.white} roughness={0.5} />
          <Ink thickness={2.6} />
        </mesh>
        <mesh position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.24, 24]} />
          <meshStandardMaterial color="#6b4326" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.272, 0.262, 0.1, 24, 1, true]} />
          <meshStandardMaterial color={ACCENT.orange} side={DoubleSide} />
        </mesh>
        <Steam excited={hovered} />
      </group>
    </group>
  );
}

/* ────────────────────────────── plant, notebook, sticky, pencil ────────────────────────────── */

export function Plant({ skin }: PropProps) {
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
export function Notebook({ skin }: PropProps) {
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

export function StickyNote({ skin }: PropProps) {
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

export function Pencil() {
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

/* ────────────────────────────── the drawer ────────────────────────────── */

/**
 * The drawer under the desk top. Click it and it slides out, showing the
 * sheet of small things inside; click it again and it takes you to them. It
 * is the one object with two states, which is why it is not a plain Hotspot.
 */
export function Drawer({ skin, hotspot }: PropProps & { hotspot?: Hotspot }) {
  const box = useRef<Group>(null);
  const [open, setOpen] = useState(false);
  const { hovered, handlers } = useHover();
  const router = useRouter();

  useFrame((_, delta) => {
    if (!box.current) return;
    const k = Math.min(1, delta * 8);
    box.current.position.z += ((open ? 0.78 : 0) - box.current.position.z) * k;
  });

  const W = 1.7;
  const H = 0.34;
  const D = 1.1;

  return (
    <group
      {...handlers}
      onClick={(e) => {
        e.stopPropagation();
        if (open && hotspot) router.push(hotspot.href);
        else setOpen((o) => !o);
      }}
    >
      {/* the housing, fixed under the top */}
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[W + 0.12, H + 0.1, D]} />
        <meshStandardMaterial color={skin.deskEdge} roughness={0.85} />
        <Ink thickness={2.6} />
      </mesh>
      <group ref={box}>
        {/* the tray */}
        <mesh position={[0, -0.03, 0]}>
          <boxGeometry args={[W - 0.06, H - 0.1, D - 0.08]} />
          <meshStandardMaterial color={skin.drawer} roughness={0.9} />
        </mesh>
        {/* what's in it: a sheet of small stickers */}
        {[
          [-0.5, ACCENT.orange],
          [-0.1, ACCENT.yellow],
          [0.3, ACCENT.blue],
          [0.62, ACCENT.green],
        ].map(([x, c], i) => (
          <mesh key={i} position={[x as number, 0.11, -0.05 + (i % 2) * 0.16]} rotation={[0, (i - 1.5) * 0.18, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.03, 18]} />
            <meshStandardMaterial color={c as string} />
            <Ink thickness={2.2} />
          </mesh>
        ))}
        {/* the front, with its knob */}
        <mesh position={[0, 0, D / 2]}>
          <boxGeometry args={[W, H, 0.08]} />
          <meshStandardMaterial color={skin.drawer} roughness={0.8} />
          <Ink thickness={3} />
        </mesh>
        <mesh position={[0, 0, D / 2 + 0.07]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.05, 0.08, 12]} />
          <meshStandardMaterial color={hovered ? ACCENT.yellow : ACCENT.ink} />
        </mesh>
      </group>
      {hovered ? <Label y={0.42}>{open ? (hotspot?.label ?? "close") : "open the drawer"}</Label> : null}
    </group>
  );
}

/* ────────────────────────────── the paper plane ────────────────────────────── */

function usePlaneGeometry() {
  return useMemo(() => {
    const g = new BufferGeometry();
    // nose forward (+z), tail at origin, a keel folded down the middle
    const v = new Float32Array([
      0, 0, 1.25, -0.78, 0.06, -0.62, 0, -0.04, -0.3,
      0, 0, 1.25, 0, -0.04, -0.3, 0.78, 0.06, -0.62,
      0, 0, 1.25, 0, -0.04, -0.3, 0, -0.26, -0.5,
      0, 0, 1.25, 0, -0.26, -0.5, 0, -0.04, -0.3,
    ]);
    g.setAttribute("position", new BufferAttribute(v, 3));
    g.computeVertexNormals();
    return g;
  }, []);
}

export function PaperPlane({ skin }: PropProps) {
  const geo = usePlaneGeometry();
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = Math.sin(t * 0.9) * 0.16;
    ref.current.rotation.z = Math.sin(t * 0.7) * 0.14;
    ref.current.rotation.y = Math.sin(t * 0.45) * 0.12;
  });
  return (
    <group ref={ref}>
      <mesh geometry={geo}>
        <meshStandardMaterial color={skin.white} roughness={0.7} side={DoubleSide} flatShading />
        <Ink thickness={3} />
      </mesh>
    </group>
  );
}
