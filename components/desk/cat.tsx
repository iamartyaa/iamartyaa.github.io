"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Group, Mesh } from "three";

import { ACCENT, INK, type Skin, type Vec3 } from "./config";
import { Ink, Label, useHover } from "./primitives";

/**
 * The cat: loaf shape, ears with pink insides, blinking, tail on its own clock
 * — and the only thing on the desk with an opinion about being clicked.
 *
 * Poke him and he crouches, hops to another corner of the desk along a real
 * parabola, lands with a squash, and turns to face where he came from. The
 * spots come from the layout, cycled, so the desk is never quite the same twice.
 */
export function Cat({ skin, spots }: { skin: Skin; spots: Vec3[] }) {
  const root = useRef<Group>(null);
  const body = useRef<Group>(null);
  const tail = useRef<Mesh>(null);
  const lids = useRef<Group>(null);
  const [spot, setSpot] = useState(0);
  const [hopping, setHopping] = useState(false);
  const { hovered, handlers } = useHover();
  const from = useRef<Vec3>(spots[0]);
  const startedAt = useRef(-99);

  const poke = () => {
    from.current = spots[spot];
    startedAt.current = -1; // the next frame stamps it, because it has the clock
    setSpot((n) => (n + 1) % spots.length);
    setHopping(true);
  };

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (startedAt.current === -1) startedAt.current = t;

    const to = spots[spot];
    const since = startedAt.current > 0 ? t - startedAt.current : 99;
    const DUR = 0.78;

    if (root.current) {
      if (since < DUR) {
        const k = since / DUR;
        const e = 1 - Math.pow(1 - k, 2.2);
        root.current.position.x = from.current[0] + (to[0] - from.current[0]) * e;
        root.current.position.z = from.current[2] + (to[2] - from.current[2]) * e;
        root.current.position.y = to[1] + Math.sin(k * Math.PI) * 0.62;
        root.current.rotation.y = Math.atan2(to[0] - from.current[0], to[2] - from.current[2]) - Math.PI;
      } else {
        root.current.position.set(to[0], to[1], to[2]);
        if (hopping) setHopping(false);
      }
    }

    if (body.current) {
      const stretch = since < DUR ? 1 + Math.sin((since / DUR) * Math.PI) * 0.08 : 1;
      const land = since >= DUR && since < DUR + 0.22 ? 1 - (0.22 - (since - DUR)) * 0.5 : 1;
      const breathe = 1 + Math.sin(t * 1.6) * 0.012;
      body.current.scale.y += (stretch * land * breathe - body.current.scale.y) * 0.35;
    }

    if (tail.current) {
      const excited = since < DUR + 1.4 ? 3.4 : 1.5;
      tail.current.rotation.x = Math.sin(t * excited) * 0.4 - 0.5;
    }
    if (lids.current) {
      const blink = Math.sin(t * 1.1) > 0.985 ? 0.05 : 1;
      lids.current.scale.y += (blink - lids.current.scale.y) * 0.4;
    }
  });

  return (
    <group
      ref={root}
      position={spots[0]}
      rotation={[0, -0.12, 0]}
      {...handlers}
      onClick={(e) => {
        e.stopPropagation();
        poke();
      }}
    >
      <group ref={body}>
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

      {hopping ? (
        <Label y={1.25} tone="ink" hand>
          mrrp!
        </Label>
      ) : hovered ? (
        <Label y={1.2}>poke the cat</Label>
      ) : null}
    </group>
  );
}
