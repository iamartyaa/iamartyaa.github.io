"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { AdditiveBlending, DoubleSide, type Group, type Mesh, type MeshStandardMaterial, type PointLight } from "three";

import { ACCENT } from "./config";
import { Ink, Label, useHover } from "./primitives";
import { lamp } from "./state";

/**
 * THE LAMP — and the physics of turning it on.
 *
 * A real lamp does not go from dark to lit in one frame. Pull the chain and:
 *   • the filament warms up over ~0.4s, with two or three dips while the
 *     contact settles — the flicker you see on an old desk lamp;
 *   • the shade and the bulb start to glow, the pool of light spreads out on
 *     the wood, and the lamp becomes the only thing casting a shadow — the
 *     daylight shadows fade out, so every shadow on the desk swings round to
 *     point away from the lamp;
 *   • the shade rocks on its arm from the tug and settles.
 * Pull it again and it decays fast, with one dim after-glow blink as the
 * filament cools. Nothing here is a keyframe: it is one curve driven by time
 * since the pull, so it looks the same whether you pull once or hammer it.
 */

/* filament dips during warm-up: [start, length, level] in seconds / fraction */
const DIPS: [number, number, number][] = [
  [0.05, 0.05, 0.3],
  [0.15, 0.045, 0.5],
  [0.27, 0.035, 0.72],
];

function warmUp(t: number) {
  const ramp = 1 - Math.exp(-t / 0.16);
  let v = ramp;
  for (const [start, len, level] of DIPS) {
    if (t >= start && t < start + len) {
      // a rounded dip rather than a square one
      const k = Math.sin(((t - start) / len) * Math.PI);
      v *= 1 - (1 - level) * k;
    }
  }
  // the filament hums for a second after it settles
  if (t < 1.4) {
    const fade = 1 - t / 1.4;
    v *= 1 + (Math.sin(t * 53) + Math.sin(t * 89) * 0.5) * 0.02 * fade;
  }
  return Math.max(0, Math.min(1, v));
}

function coolDown(t: number) {
  const decay = Math.exp(-t / 0.08);
  // one soft blink as the coil cools
  const blink = t > 0.17 && t < 0.25 ? 0.2 * Math.sin(((t - 0.17) / 0.08) * Math.PI) : 0;
  return Math.max(decay, blink);
}

/**
 * Runs the lamp's clock. Mount once per scene. `night` is the theme; the lamp
 * state it writes is what every lit thing reads back on the same frame.
 */
export function LampPhysics({ night }: { night: boolean }) {
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    if (!lamp.primed) {
      // first frame: no history, so the current theme is where we start —
      // except a night load, which warms up on arrival because that is nice.
      lamp.primed = true;
      lamp.night = night;
      lamp.room = night ? 1 : 0;
      lamp.phase = 0;
      lamp.power = 0;
    } else if (lamp.night !== night) {
      lamp.night = night;
      lamp.phase = 0;
      // the tug: a kick to the shade, opposite ways for on and off
      lamp.swingVel += night ? -0.9 : 0.7;
    }

    lamp.phase += dt;
    const target = night ? warmUp(lamp.phase) : coolDown(lamp.phase);
    lamp.power += (target - lamp.power) * Math.min(1, dt * 45);

    // the room follows the theme with a short lag, so the sun dims rather than switches
    lamp.room += ((night ? 1 : 0) - lamp.room) * Math.min(1, dt * 6);

    // shade swing: a damped spring, ~2 Hz
    const acc = -lamp.swing * 180 - lamp.swingVel * 7;
    lamp.swingVel += acc * dt;
    lamp.swing += lamp.swingVel * dt;
  });
  return null;
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
  const { hovered, handlers } = useHover();

  useFrame((_, delta) => {
    const k = Math.min(1, delta * 14);
    pulled.current += (target.current - pulled.current) * k;
    if (target.current === 1 && pulled.current > 0.86) target.current = 0;
    if (chain.current) chain.current.position.y = -pulled.current * 0.26;
  });

  return (
    <group
      ref={chain}
      {...handlers}
      onClick={(e) => {
        e.stopPropagation();
        target.current = 1;
        onPull();
      }}
    >
      {/* generous invisible grab area around a very thin cord */}
      <mesh position={[0, -0.42, 0]} visible={false}>
        <cylinderGeometry args={[0.18, 0.18, 0.9, 6]} />
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
      {hovered ? <Label y={-1.02}>pull the string</Label> : null}
    </group>
  );
}

/** The lamp: base, arm, shade, bulb, its light, and the chain. */
export function LampObject({ onPull }: { onPull: () => void }) {
  const shade = useRef<Group>(null);
  const shadeMat = useRef<MeshStandardMaterial>(null);
  const bulbMat = useRef<MeshStandardMaterial>(null);
  const light = useRef<PointLight>(null);
  const SHADE_TILT = -0.52;

  useFrame(() => {
    const p = lamp.power;
    if (shade.current) shade.current.rotation.z = SHADE_TILT + lamp.swing;
    if (shadeMat.current) shadeMat.current.emissiveIntensity = 0.55 * p;
    if (bulbMat.current) {
      bulbMat.current.emissiveIntensity = 0.15 + 1.6 * p;
      bulbMat.current.color.setRGB(0.93 - 0.05 * p, 0.86 + 0.08 * p, 0.74 + 0.16 * p);
    }
    if (light.current) {
      light.current.intensity = 34 * p;
      light.current.distance = 7 + 5 * p;
      light.current.shadow.intensity = p;
    }
  });

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
      <group ref={shade} position={[0.42, 1.78, 0]} rotation={[0, 0, SHADE_TILT]}>
        <mesh castShadow>
          <coneGeometry args={[0.46, 0.54, 22, 1, true]} />
          <meshStandardMaterial
            ref={shadeMat}
            color={ACCENT.orange}
            emissive="#ff7a3a"
            emissiveIntensity={0}
            side={DoubleSide}
            roughness={0.45}
          />
          <Ink thickness={4} />
        </mesh>
        {/* the bulb: dull glass by day, the brightest thing on the desk at night */}
        <mesh position={[0, -0.2, 0]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial ref={bulbMat} color="#eddcbd" emissive="#ffe2a8" emissiveIntensity={0.15} roughness={0.3} />
        </mesh>
        <pointLight
          ref={light}
          position={[0, -0.26, 0]}
          intensity={0}
          distance={7}
          decay={2}
          color="#ffcf8f"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.002}
          shadow-radius={4}
        />
        {/* hangs from the rim of the shade, and hangs straight down whatever
            angle the shade is tilted at */}
        <group position={[0.3, -0.24, 0]} rotation={[0, 0, -SHADE_TILT]}>
          <PullChain onPull={onPull} />
        </group>
      </group>
    </group>
  );
}

/** The pool of lamplight on the desk. Spreads out as the filament warms. */
export function LightPool({ position }: { position: [number, number, number] }) {
  const mesh = useRef<Mesh>(null);
  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const p = lamp.power;
    m.visible = p > 0.01;
    const s = 0.6 + 0.4 * p;
    m.scale.set(s, s, 1);
    (m.material as MeshStandardMaterial).opacity = 0.26 * p;
  });
  return (
    <mesh ref={mesh} position={position} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
      <circleGeometry args={[2.5, 40]} />
      <meshBasicMaterial color="#ffc27a" transparent opacity={0} blending={AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}
