"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import HeroObject from "./HeroObject";
import { interaction } from "../../lib/interaction";

/*
 * Fixed full-viewport WebGL background. The DOM content scrolls above it;
 * the canvas is purely decorative, hence aria-hidden + pointer-events-none
 * (all information exists in the DOM).
 *
 * Performance guardrails:
 *  - dpr capped (1.75 desktop / 1.5 mobile)
 *  - geometry detail reduced on mobile (see HeroObject)
 *  - prefers-reduced-motion -> frameloop="demand": one static frame,
 *    no animation loop at all.
 */

/** Media query as external-store subscription (SSR snapshot: false). */
function useMedia(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

function CameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  useFrame((state, delta) => {
    if (reducedMotion) return;
    const p = interaction.progress;
    const eased = p * p * (3 - 2 * p);
    const cam = state.camera;
    /* Scroll -> dolly out; pointer -> subtle counter-parallax. */
    cam.position.z = THREE.MathUtils.damp(cam.position.z, 5.6 + eased * 1.5, 3, delta);
    cam.position.x = THREE.MathUtils.damp(cam.position.x, interaction.pointerX * -0.12, 3, delta);
    cam.position.y = THREE.MathUtils.damp(
      cam.position.y,
      interaction.pointerY * 0.1 - eased * 0.25,
      3,
      delta,
    );
    cam.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroCanvas() {
  const reducedMotion = useMedia("(prefers-reduced-motion: reduce)");
  const compact = useMedia("(max-width: 767px)");

  /* Pointer tracking writes into the shared mutable module (never React
     state: the value changes every frame and is read inside useFrame). */
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      interaction.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      interaction.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        dpr={compact ? [1, 1.5] : [1, 1.75]}
        camera={{ position: [0, 0, 5.6], fov: 38 }}
        frameloop={reducedMotion ? "demand" : "always"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.25} />
        {/* Warm key light (amber, matches the accent). */}
        <directionalLight position={[4, 3, 5]} intensity={1.6} color="#ffd9a0" />
        {/* Cool rim from behind-left for silhouette separation. */}
        <pointLight position={[-5, -2, -4]} intensity={38} color="#5f7cff" />

        {/* Procedural environment (Lightformers): metallic reflections
            without fetching any external HDR asset. */}
        <Environment resolution={256}>
          <Lightformer intensity={2} color="#cfd8e6" position={[0, 3, 4]} scale={[6, 3, 1]} />
          <Lightformer
            intensity={1.2}
            color="#f5a93f"
            position={[-4, -1, 2]}
            scale={[2.5, 2.5, 1]}
            form="ring"
          />
          <Lightformer intensity={1.5} color="#8fb2ff" position={[4, -2, -3]} scale={[4, 2, 1]} />
        </Environment>
        <HeroObject reducedMotion={reducedMotion} compact={compact} />
        <CameraRig reducedMotion={reducedMotion} />
      </Canvas>

      {/* Amber halo where the instrument sits. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_68%_42%,rgba(245,169,63,0.09),transparent_55%)]" />
      {/* Left scrim + vignette: keeps DOM text readable over the 3D scene. */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,13,18,0.88)_0%,rgba(10,13,18,0.45)_42%,rgba(10,13,18,0.1)_72%,rgba(10,13,18,0.35)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(10,13,18,0.65)_100%)]" />
      {/* Phones: the instrument sits centered under the text column, so a
          flat ink layer keeps body copy readable over the rings. */}
      <div className="absolute inset-0 bg-ink/45 md:hidden" />
    </div>
  );
}
