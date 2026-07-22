"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { interaction } from "../../lib/interaction";

/*
 * HeroObject: the single swappable 3D subject of the site.
 *
 * Concept: a "kinetic instrument", an armillary-sphere-like assembly built
 * ONLY from Three.js primitives (tori, icosahedron, spheres). Rings rotate
 * at constant angular velocities (mechanical, instrument-like motion), the
 * faceted core carries a small custom fresnel shader whose accent hue
 * shifts from amber to ember as the page is scrolled.
 *
 * Interaction mapping (all read from the shared `interaction` module):
 *  - pointer  -> whole assembly tilts toward the cursor (damped lerp)
 *  - scroll   -> rings tilt apart and grow, core hue shifts, and the
 *                camera dollies out (camera part lives in HeroCanvas)
 *
 * ------------------------------------------------------------------
 * SWAP GUIDE: to replace this procedural object with a real 3D model,
 * keep the outer <group> (pointer/scroll behaviour stays intact) and
 * swap the primitives inside it for a GLTF scene:
 *
 *   import { useGLTF } from "@react-three/drei";
 *   const { scene } = useGLTF("/models/hero.glb");
 *   ...
 *   <group ref={groupRef} position={...}>
 *     <primitive object={scene} />
 *   </group>
 *
 * (plus `useGLTF.preload("/models/hero.glb")` at module scope).
 * ------------------------------------------------------------------
 */

type RingConfig = {
  radius: number;
  tube: number;
  /** Constant spin speed (rad/s) around the ring's own axis. */
  speed: number;
  baseTilt: [number, number];
  /** Extra tilt applied as scroll progress goes 0 -> 1. */
  spread: [number, number];
  /** Arc length; the outer ring is deliberately broken (asymmetry). */
  arc: number;
  accent: boolean;
};

const RINGS: RingConfig[] = [
  { radius: 1.02, tube: 0.03, speed: 0.34, baseTilt: [1.35, 0.2], spread: [0.55, 0.3], arc: Math.PI * 2, accent: false },
  { radius: 1.34, tube: 0.02, speed: -0.22, baseTilt: [0.6, -0.45], spread: [-0.75, 0.55], arc: Math.PI * 2, accent: true },
  { radius: 1.68, tube: 0.024, speed: 0.15, baseTilt: [0.22, 0.85], spread: [0.95, -0.65], arc: Math.PI * 1.62, accent: false },
];

/* Tiny custom shader for the faceted core: flat shading via screen-space
   derivatives + fresnel rim whose color blends amber -> ember with scroll. */
const CORE_VERTEX = /* glsl */ `
  uniform float uTime;
  varying vec3 vWorldPos;
  void main() {
    // Sub-2% radial pulse: alive, but far from a lava-lamp blob.
    vec3 p = position * (1.0 + 0.018 * sin(uTime * 0.9 + position.y * 4.0));
    vec4 world = modelMatrix * vec4(p, 1.0);
    vWorldPos = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const CORE_FRAGMENT = /* glsl */ `
  uniform float uProgress;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec3 vWorldPos;
  void main() {
    // Faceted normals from derivatives (keeps the icosahedron crystalline).
    vec3 N = normalize(cross(dFdx(vWorldPos), dFdy(vWorldPos)));
    vec3 V = normalize(cameraPosition - vWorldPos);
    if (dot(N, V) < 0.0) N = -N;

    vec3 keyDir = normalize(vec3(0.65, 0.7, 0.5));
    vec3 fillDir = normalize(vec3(-0.7, -0.2, 0.4));
    float key = max(dot(N, keyDir), 0.0);
    float fill = max(dot(N, fillDir), 0.0);

    vec3 base = vec3(0.05, 0.06, 0.08);
    vec3 lit = base + vec3(1.0, 0.88, 0.72) * key * 0.18 + vec3(0.5, 0.6, 0.9) * fill * 0.08;

    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.4);
    vec3 accent = mix(uColorA, uColorB, smoothstep(0.1, 0.9, uProgress));
    gl_FragColor = vec4(lit + accent * fres * 0.95, 1.0);
  }
`;

const smoothstep01 = (p: number) => p * p * (3 - 2 * p);

export default function HeroObject({
  reducedMotion,
  compact,
}: {
  reducedMotion: boolean;
  /** Mobile: smaller, centered, lighter geometry. */
  compact: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const tiltRefs = useRef<(THREE.Group | null)[]>([]);
  const spinRefs = useRef<(THREE.Mesh | null)[]>([]);
  const satelliteRef = useRef<THREE.Group>(null);
  const coreMatRef = useRef<THREE.ShaderMaterial>(null);

  /* Geometry budget: ~15k vertices desktop, ~7k on mobile. */
  const segments = compact
    ? { ringRadial: 10, ringTubular: 96, coreDetail: 1 }
    : { ringRadial: 16, ringTubular: 160, coreDetail: 1 };

  /* Stable uniforms object; mutated per-frame through coreMatRef (the
     sanctioned ref escape hatch, keeps react-hooks/immutability happy). */
  const coreUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uColorA: { value: new THREE.Color("#f5a93f") },
      uColorB: { value: new THREE.Color("#ff5f3c") },
    }),
    [],
  );

  const baseX = compact ? 0 : 1.12;
  const baseScale = compact ? 0.68 : 1;

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const eased = smoothstep01(interaction.progress);

    const coreMat = coreMatRef.current;
    if (coreMat) coreMat.uniforms.uProgress.value = eased;

    const group = groupRef.current;
    if (!group) return;

    if (reducedMotion) {
      /* Static composed pose: a single frame is rendered (frameloop="demand"). */
      group.rotation.set(0.35, -0.5, 0);
      return;
    }

    if (coreMat) coreMat.uniforms.uTime.value = t;

    /* Pointer-follow tilt, damped so the instrument feels heavy and precise. */
    const targetX = 0.3 + interaction.pointerY * 0.22 + eased * 0.4;
    const targetY = -0.4 + t * 0.05 + interaction.pointerX * 0.35;
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, targetX, 3, delta);
    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, targetY, 3, delta);

    /* Slow float + slight drift toward center as the page is scrolled. */
    group.position.y = Math.sin(t * 0.5) * 0.07 - eased * 0.15;
    group.position.x = baseX * (1 - eased * 0.45);

    RINGS.forEach((ring, i) => {
      const tilt = tiltRefs.current[i];
      const spin = spinRefs.current[i];
      if (!tilt || !spin) return;
      spin.rotation.z += ring.speed * delta;
      tilt.rotation.x = ring.baseTilt[0] + eased * ring.spread[0];
      tilt.rotation.y = ring.baseTilt[1] + eased * ring.spread[1];
      tilt.scale.setScalar(1 + eased * 0.055 * (i + 1));
    });

    /* Two bearings orbiting in the outer ring's plane. */
    const satellites = satelliteRef.current;
    if (satellites) satellites.rotation.z = t * 0.42;
  });

  return (
    <group
      ref={groupRef}
      position={[baseX, 0, 0]}
      rotation={[0.35, -0.5, 0]}
      scale={baseScale}
    >
      {/* Faceted core with the custom fresnel shader. */}
      <mesh>
        <icosahedronGeometry args={[0.58, segments.coreDetail]} />
        <shaderMaterial
          ref={coreMatRef}
          vertexShader={CORE_VERTEX}
          fragmentShader={CORE_FRAGMENT}
          uniforms={coreUniforms}
        />
      </mesh>

      {/* Instrument rings. The middle one is the single accent element. */}
      {RINGS.map((ring, i) => (
        <group
          key={ring.radius}
          ref={(el) => {
            tiltRefs.current[i] = el;
          }}
          rotation={[ring.baseTilt[0], ring.baseTilt[1], 0]}
        >
          <mesh
            ref={(el) => {
              spinRefs.current[i] = el;
            }}
          >
            <torusGeometry
              args={[ring.radius, ring.tube, segments.ringRadial, segments.ringTubular, ring.arc]}
            />
            {ring.accent ? (
              <meshStandardMaterial
                color="#f5a93f"
                emissive="#f5a93f"
                emissiveIntensity={0.55}
                metalness={0.4}
                roughness={0.35}
              />
            ) : (
              <meshStandardMaterial color="#39404d" metalness={0.92} roughness={0.26} />
            )}
          </mesh>

          {/* Outer ring carries two small bearing spheres. */}
          {i === 2 && (
            <group ref={satelliteRef}>
              {[0, Math.PI].map((angle) => (
                <mesh
                  key={angle}
                  position={[Math.cos(angle) * ring.radius, Math.sin(angle) * ring.radius, 0]}
                >
                  <sphereGeometry args={[0.05, 16, 16]} />
                  <meshStandardMaterial color="#e9ecf1" metalness={0.85} roughness={0.2} />
                </mesh>
              ))}
            </group>
          )}
        </group>
      ))}
    </group>
  );
}
