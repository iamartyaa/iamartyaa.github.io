"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Color, type AmbientLight, type DirectionalLight } from "three";

import { lamp } from "./state";

/**
 * The room's light. Day: flat, bright, picture-book — a soft sun from the
 * front-right and a cool fill from behind. Night: the sun goes down (it eases,
 * it does not switch), and its shadows fade out exactly as the lamp's fade in,
 * so the desk is lit by one source at a time and the shadows swing round.
 */

const DAY_AMBIENT = new Color("#ffffff");
const NIGHT_AMBIENT = new Color("#5f6d8c");
const DAY_SUN = new Color("#ffffff");
const NIGHT_SUN = new Color("#8fa6d8");

export function SceneLights({ shadows }: { shadows: boolean }) {
  const ambient = useRef<AmbientLight>(null);
  const sun = useRef<DirectionalLight>(null);
  const fill = useRef<DirectionalLight>(null);

  useFrame(() => {
    const r = lamp.room;
    if (ambient.current) {
      ambient.current.intensity = 0.9 - 0.66 * r;
      ambient.current.color.copy(DAY_AMBIENT).lerp(NIGHT_AMBIENT, r);
    }
    if (sun.current) {
      sun.current.intensity = 1.5 - 1.2 * r;
      sun.current.color.copy(DAY_SUN).lerp(NIGHT_SUN, r);
      // daylight shadows leave as the lamp's arrive
      sun.current.shadow.intensity = Math.max(0, 1 - lamp.power * 1.15);
    }
    if (fill.current) fill.current.intensity = 0.35 - 0.25 * r;
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={0.9} />
      <directionalLight
        ref={sun}
        position={[4, 7, 5]}
        intensity={1.5}
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
      />
      <directionalLight ref={fill} position={[-5, 3, -4]} intensity={0.35} color="#cfe0ff" />
    </>
  );
}
