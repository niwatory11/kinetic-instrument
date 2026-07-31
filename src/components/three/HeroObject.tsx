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

/* Additive rim-glow shell. Fakes a bloom halo around the core WITHOUT any
   postprocessing pass: a slightly larger sphere whose fragments brighten
   toward the silhouette edge (fresnel), blended additively over the scene. */
const GLOW_VERTEX = /* glsl */ `
  varying vec3 vN;
  varying vec3 vView;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vN = normalize(mat3(modelMatrix) * normal);
    vView = normalize(cameraPosition - world.xyz);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const GLOW_FRAGMENT = /* glsl */ `
  uniform float uProgress;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec3 vN;
  varying vec3 vView;
  void main() {
    float rim = pow(1.0 - clamp(dot(normalize(vN), normalize(vView)), 0.0, 1.0), 3.0);
    vec3 col = mix(uColorA, uColorB, smoothstep(0.1, 0.9, uProgress));
    gl_FragColor = vec4(col, rim * 0.85);
  }
`;

/* Spherical-shell point cloud: instrument "dust"/reference bearings drifting
   around the assembly. Deterministic golden-angle spiral so the field reads
   as ordered, not noisy (fits the precision-instrument language). */
function buildShellPoints(count: number, rMin: number, rMax: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count;
    const y = 1 - t * 2; // 1 -> -1
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const radius = rMin + (rMax - rMin) * ((i * 97) % 100) / 100;
    positions[i * 3] = Math.cos(theta) * r * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
  return positions;
}

/* Flat graduated dial (protractor ticks) sitting behind the instrument.
   Every 5th tick is a major (longer) graduation. Pure line segments. */
function buildDial(radius: number, ticks: number): Float32Array {
  const positions = new Float32Array(ticks * 2 * 3);
  for (let i = 0; i < ticks; i++) {
    const angle = (i / ticks) * Math.PI * 2;
    const major = i % 5 === 0;
    const inner = radius - (major ? 0.12 : 0.05);
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    positions[i * 6] = c * inner;
    positions[i * 6 + 1] = s * inner;
    positions[i * 6 + 2] = 0;
    positions[i * 6 + 3] = c * radius;
    positions[i * 6 + 4] = s * radius;
    positions[i * 6 + 5] = 0;
  }
  return positions;
}

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
  const glowMatRef = useRef<THREE.ShaderMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const cageRef = useRef<THREE.Group>(null);

  /* Geometry budget: ~15k vertices desktop, ~7k on mobile. */
  const segments = compact
    ? { ringRadial: 10, ringTubular: 96, coreDetail: 1 }
    : { ringRadial: 16, ringTubular: 160, coreDetail: 1 };

  /* Instrument "dust" field + graduated dial, sized down on mobile. */
  const shellPositions = useMemo(
    () => buildShellPoints(compact ? 180 : 420, 2.1, 3.2),
    [compact],
  );
  const dialPositions = useMemo(() => buildDial(1.95, compact ? 48 : 72), [compact]);

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

  /* Separate uniforms object for the additive glow shell (same amber->ember
     progress mapping as the core so halo and core stay chromatically locked). */
  const glowUniforms = useMemo(
    () => ({
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
    const glowMat = glowMatRef.current;
    if (glowMat) glowMat.uniforms.uProgress.value = eased;

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

    /* Ambient layers drift on their own axes for parallax depth. */
    const points = pointsRef.current;
    if (points) points.rotation.y = t * 0.04;
    const cage = cageRef.current;
    if (cage) {
      cage.rotation.y = -t * 0.06;
      cage.rotation.x = 0.2 + eased * 0.35;
    }
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

      {/* Fake-bloom halo: additive rim glow, hue-locked to the core. No
          postprocessing pass — just a larger sphere blended additively. */}
      <mesh scale={1.6}>
        <icosahedronGeometry args={[0.58, 2]} />
        <shaderMaterial
          ref={glowMatRef}
          vertexShader={GLOW_VERTEX}
          fragmentShader={GLOW_FRAGMENT}
          uniforms={glowUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
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
                emissiveIntensity={1.15}
                metalness={0.4}
                roughness={0.3}
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
                  <sphereGeometry args={[0.055, 16, 16]} />
                  <meshStandardMaterial
                    color="#ffd9a0"
                    emissive="#f5a93f"
                    emissiveIntensity={0.9}
                    metalness={0.6}
                    roughness={0.25}
                  />
                </mesh>
              ))}
            </group>
          )}
        </group>
      ))}

      {/* Graduated dial behind the assembly: protractor ticks in the accent
          hue, every 5th one a longer major graduation. Pure line segments. */}
      <group rotation={[Math.PI / 2.3, 0, 0]} position={[0, 0, -0.15]}>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[dialPositions, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color="#f5a93f" transparent opacity={0.24} />
        </lineSegments>
      </group>

      {/* Reference frame: faint wireframe cage the instrument sits inside,
          counter-rotating for parallax. */}
      <group ref={cageRef}>
        <mesh>
          <icosahedronGeometry args={[2.4, 1]} />
          <meshBasicMaterial color="#5f7cff" wireframe transparent opacity={0.07} />
        </mesh>
      </group>

      {/* Instrument dust: ordered golden-angle point field for atmosphere. */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[shellPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#e9ecf1"
          size={0.02}
          sizeAttenuation
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
