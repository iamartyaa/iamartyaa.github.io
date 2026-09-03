"use client";

import { ContactShadows, PresentationControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useTheme } from "next-themes";

import { useThemeToggle } from "@/components/motion/theme-toggle";

import { CAMERA, DAY, HOME_LAYOUT, NIGHT, type DeskLayout } from "./config";
import { LampPhysics } from "./lamp";
import { SceneLights } from "./lights";
import { DeskWorld } from "./rig";

/**
 * THE DESK — the hero object.
 *
 * Built entirely from code geometry (no model pipeline) so it stays in the
 * sticker language: flat palette fills plus an ink outline on every mesh, the
 * same 2.4px stroke the SVG cast uses. Drag to spin, hover an object to see
 * what it opens, click to go there. At night the room dims and the lamp is the
 * only thing still burning — and it warms up like a real one (lamp.tsx).
 *
 * What is on the desk is data (config.ts); this file is only the stage.
 */
export default function DeskScene({
  layout = HOME_LAYOUT,
  active = true,
  lean = false,
}: {
  layout?: DeskLayout;
  /** False while the canvas is off-screen: the loop stops, the GPU rests. */
  active?: boolean;
  /** Touch devices: fewer pixels, no shadow maps, no contact-shadow pass. */
  lean?: boolean;
}) {
  const { resolvedTheme } = useTheme();
  // The lamp's chain is the site's theme switch. Same beUI View Transition
  // wipe as everywhere else, but it starts at the top-left — where the lamp
  // stands — so the dark spreads out of the lamp you just pulled.
  const { toggle } = useThemeToggle({ variant: "circle-blur", start: "top-left" });
  const night = resolvedTheme === "dark";
  const skin = night ? NIGHT : DAY;
  const shadows = !lean;

  return (
    <Canvas
      shadows={shadows}
      dpr={lean ? [1, 1.5] : [1, 2]}
      frameloop={active ? "always" : "never"}
      camera={{ position: CAMERA.position, fov: CAMERA.fov }}
      gl={{ antialias: true, alpha: true, powerPreference: lean ? "low-power" : "high-performance" }}
      style={{ touchAction: "pan-y" }}
    >
      <LampPhysics night={night} />
      <SceneLights shadows={shadows} />

      {/* No snap and no azimuth fence: the desk spins all the way round and
          stays where you left it. Polar stays bounded — nobody wants to look
          at the underside of a desk. */}
      <PresentationControls
        global
        cursor
        speed={1.4}
        zoom={1}
        rotation={CAMERA.rest}
        polar={CAMERA.polar}
        azimuth={[-Infinity, Infinity]}
      >
        <DeskWorld layout={layout} skin={skin} onPull={toggle} />
      </PresentationControls>

      {lean ? null : (
        <ContactShadows
          position={[0, -1.62, 0]}
          opacity={night ? 0.5 : 0.28}
          scale={16}
          blur={2.8}
          far={4.5}
          color={night ? "#000000" : "#4a3520"}
        />
      )}
    </Canvas>
  );
}
