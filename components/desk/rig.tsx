"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { useRef, type ReactNode } from "react";
import type { Group } from "three";

import { Cat } from "./cat";
import { CAMERA, type DeskLayout, type DeskProp, type Hotspot as HotspotSpec, type Skin } from "./config";
import { LampObject, LightPool } from "./lamp";
import { Drawer, Keyboard, Monitor, Mug, Notebook, PaperPlane, Pencil, Plant, StickyNote } from "./objects";
import { Ink, Label, useHover } from "./primitives";

/**
 * THE RIG — the desk body, the props from the layout, and the framing.
 *
 * Nothing here names a specific object: `PropView` maps a layout entry's
 * `kind` to a drawing, and `Hotspot` makes it a door if the entry has one.
 */

/**
 * A liftable, clickable object. Hover raises it and shows its label; the whole
 * group is one hit target so small parts (a keycap, an ear) stay clickable.
 */
function Hotspot({ spec, children }: { spec: HotspotSpec; children: (hovered: boolean) => ReactNode }) {
  const ref = useRef<Group>(null);
  const { hovered, handlers } = useHover();
  const router = useRouter();

  useFrame((_, delta) => {
    if (!ref.current) return;
    const target = hovered ? 0.18 : 0;
    ref.current.position.y += (target - ref.current.position.y) * Math.min(1, delta * 9);
  });

  return (
    <group
      {...handlers}
      onClick={(e) => {
        e.stopPropagation();
        router.push(spec.href);
      }}
    >
      <group ref={ref}>{children(hovered)}</group>
      {hovered ? <Label>{spec.label}</Label> : null}
    </group>
  );
}

function PropView({ prop, skin, onPull }: { prop: DeskProp; skin: Skin; onPull: () => void }) {
  const draw = (hovered: boolean) => {
    switch (prop.kind) {
      case "monitor":
        return <Monitor skin={skin} />;
      case "keyboard":
        return <Keyboard skin={skin} />;
      case "mug":
        return <Mug skin={skin} hovered={hovered} />;
      case "plant":
        return <Plant skin={skin} />;
      case "notebook":
        return <Notebook skin={skin} />;
      case "sticky":
        return <StickyNote skin={skin} />;
      case "pencil":
        return <Pencil />;
      case "lamp":
        return <LampObject onPull={onPull} />;
      case "drawer":
        return <Drawer skin={skin} hotspot={prop.hotspot} />;
      case "plane":
        return <PaperPlane skin={skin} />;
    }
  };

  // The drawer owns its own click (it has two states); everything else with a
  // hotspot is a plain door.
  const door = prop.hotspot && prop.kind !== "drawer";

  return (
    <group position={prop.position} rotation={prop.rotation} scale={prop.scale ?? 1}>
      {door ? <Hotspot spec={prop.hotspot!}>{draw}</Hotspot> : draw(false)}
    </group>
  );
}

function DeskBody({ skin, body }: { skin: Skin; body: DeskLayout["body"] }) {
  const { width: w, depth: d, thickness: t } = body;
  const legX = w / 2 - 0.25;
  const legZ = d / 2 - 0.25;
  return (
    <group>
      <RoundedBox args={[w, t, d]} radius={0.07} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color={skin.desk} roughness={0.72} />
        <Ink />
      </RoundedBox>
      <RoundedBox args={[w, 0.1, 0.12]} radius={0.04} smoothness={3} position={[0, -0.14, d / 2 - 0.02]}>
        <meshStandardMaterial color={skin.deskEdge} roughness={0.8} />
      </RoundedBox>
      {[
        [-legX, legZ],
        [legX, legZ],
        [-legX, -legZ],
        [legX, -legZ],
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

/**
 * Fits the desk to the canvas instead of trusting one camera distance. The
 * scale is chosen so `CAMERA.fit` units fit both the visible width and the
 * visible height — a phone's short landscape canvas and a desktop's tall
 * column get the same composition, just at different sizes.
 */
function FitToViewport({ children }: { children: ReactNode }) {
  const { viewport } = useThree();
  const { width, height, min, max } = CAMERA.fit;
  const scale = Math.min(max, Math.max(min, Math.min(viewport.width / width, viewport.height / height)));
  return <group scale={scale}>{children}</group>;
}

/**
 * The desk leans toward the cursor — the "it's alive" tell before anyone
 * discovers they can drag it — and, as the hero scrolls away, tips toward a
 * top-down view, so leaving the fold reads as standing up from the chair.
 */
function DeskRig({ layout, skin, onPull }: { layout: DeskLayout; skin: Skin; onPull: () => void }) {
  const group = useRef<Group>(null);
  const tilt = useRef(0);

  useFrame((state, delta) => {
    if (!group.current) return;
    const el = state.gl.domElement;
    const rect = el.getBoundingClientRect();
    // how far the canvas has scrolled off the top of the screen, 0..1
    const gone = rect.height > 0 ? Math.max(0, Math.min(1, -rect.top / rect.height)) : 0;
    tilt.current += (gone * CAMERA.scrollTilt - tilt.current) * Math.min(1, delta * 5);

    const { x, y } = state.pointer;
    const lean = 1 - gone;
    group.current.rotation.y += (x * 0.11 * lean - group.current.rotation.y) * 0.05;
    group.current.rotation.x += (-y * 0.045 * lean + tilt.current - group.current.rotation.x) * 0.05;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.06 + tilt.current * 0.6;
  });

  // the lamp's pool sits on the surface, under wherever the lamp stands
  const lampProp = layout.props.find((p) => p.kind === "lamp");
  const pool: [number, number, number] = lampProp
    ? [lampProp.position[0] + 1.2, 0.135, lampProp.position[2] + 0.65]
    : [0, 0.135, 0];

  return (
    <group ref={group}>
      <DeskBody skin={skin} body={layout.body} />
      <group position={[0, layout.body.thickness / 2, 0]}>
        <LightPool position={pool} />
        {layout.props.map((prop) => (
          <PropView key={prop.id} prop={prop} skin={skin} onPull={onPull} />
        ))}
        <Cat skin={skin} spots={layout.catSpots} />
      </group>
    </group>
  );
}

export function DeskWorld({ layout, skin, onPull }: { layout: DeskLayout; skin: Skin; onPull: () => void }) {
  return (
    <FitToViewport>
      <group scale={0.95} position={[0, -0.25, 0]}>
        <DeskRig layout={layout} skin={skin} onPull={onPull} />
      </group>
    </FitToViewport>
  );
}
