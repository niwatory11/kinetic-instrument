# Kinetic Instrument Portfolio

A production-quality single-page portfolio with an interactive 3D hero built **entirely from Three.js primitives and shaders**. No external 3D models (GLB/GLTF/OBJ) are loaded; the hero object is generated in code.

Every listed project is a fictional **Sample Project** built to demonstrate layout, motion and WebGL — not a real client engagement.

## Getting started

```bash
npm install
npm run dev        # development server (http://localhost:3000)
npm run build      # type-check + production build
npm run start      # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Stack

- Next.js 16 (App Router) + TypeScript
- React Three Fiber + drei (WebGL scene)
- GSAP + ScrollTrigger (entrance reveals) and Lenis (inertial scroll)
- Tailwind CSS v4

## Design concept

One idea runs through shape, color and motion: a **kinetic instrument**.

- **Shape**: an armillary-sphere-like assembly of torus rings (the outer one deliberately broken into an arc) around a faceted icosahedron core. Precise and mechanical, not an abstract blob.
- **Color**: near-black cool ink (`#0a0d12`) with a single amber accent (`#f5a93f`), the glow of an instrument panel. The core's fresnel rim shifts amber to ember as you scroll.
- **Motion**: constant angular velocities for the rings, heavy damped pointer-follow for the whole assembly, restrained fade/rise reveals for text. Nothing bounces.
- **Type**: Archivo (variable width axis, wide display cut) + IBM Plex Mono for micro labels. Sharp corners everywhere (radius 0).

## Architecture

```
src/
  app/
    layout.tsx            fonts, metadata, skip link
    page.tsx              section assembly (z-scale documented here)
    globals.css           design tokens (@theme), a11y + reduced-motion base
  components/
    MotionOrchestrator.tsx  Lenis + GSAP/ScrollTrigger sync, all page motion
    Header.tsx
    sections/               Hero / About / Works / Contact / Footer
    three/
      HeroCanvas.tsx        fixed background Canvas, lights, scrims, dpr caps
      HeroObject.tsx        the single swappable 3D subject
  data/site.ts            all copy and works data (swap content here)
  lib/interaction.ts      shared mutable pointer/scroll state for useFrame
```

### Interaction mapping

- Cursor position tilts the instrument (damped lerp, reads like mass).
- Scroll progress (0 to 1) drives: ring tilt spread and growth, core hue (amber to ember), camera dolly-out. Each section therefore sees a different pose of the same object.
- Written to `src/lib/interaction.ts` (a plain mutable module, never React state) and read inside `useFrame`.

### Performance

- `dpr` capped at 1.75 (desktop) / 1.5 (mobile); torus segment counts drop on mobile (~15k to ~7k vertices).
- No external assets in the scene: reflections come from a procedural `<Environment>` built with drei `Lightformer`s.

### Accessibility and reduced motion

- The canvas is decorative: `aria-hidden` + `pointer-events-none`; all information lives in the DOM.
- `prefers-reduced-motion: reduce` switches the canvas to `frameloop="demand"` (one static frame), skips Lenis entirely (native scrolling) and never registers GSAP reveals, so content is fully visible and static.
- Skip link, semantic landmarks, visible focus outlines, AA-contrast text on the dark theme.

## Swapping HeroObject for a real 3D model

`src/components/three/HeroObject.tsx` is the single component to replace. Keep its outer `<group>` (pointer/scroll behaviour is attached there) and swap the primitives inside for a GLTF scene:

```tsx
import { useGLTF } from "@react-three/drei";

// inside HeroObject:
const { scene } = useGLTF("/models/hero.glb");
// ...
<group ref={groupRef} position={[baseX, 0, 0]} scale={baseScale}>
  <primitive object={scene} />
</group>
```

Add `useGLTF.preload("/models/hero.glb")` at module scope and place the file in `public/models/`. Everything else (camera rig, scroll mapping, reduced-motion handling) keeps working unchanged.

## Content swap checklist

1. `src/data/site.ts`: name, role, about, tags, contact email and socials.
2. `works` in the same file: replace the CSS `pattern` fields with real `<Image>` art per project and remove the "Sample Project" labels once projects are real.
3. `src/app/layout.tsx`: metadata title/description.
