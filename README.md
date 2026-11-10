# Kinetic Instrument Portfolio

niwatory のポートフォリオ（日本語）。1ページの中に、制作実績・できること・ご依頼の流れ・自己紹介・連絡先を置いています。ヒーローの3Dは **Three.js のプリミティブとシェーダーだけ**で作っており、外部の3Dモデル（GLB/GLTF/OBJ）は読み込みません。

制作実績に載せているのは、実際に作って公開している4作品（菓寮 月白・常盤精工・湯宿 山霞・NAGINO都市環境技研）です。いずれも架空のブランドを題材にした自主制作で、実在の企業・店舗とは関係ありません。

ヒーローの下端には制作実績の目次（番号・名前・業種）があり、1画面目でどんなサイトを作ったかが分かります。各項目から、その実績の行へ移動できます。

実績の行は、1画面目のスクリーンショット（PC とスマホ）・説明・「見どころ」の3つでできています。「見どころ」は、そのサイトで作り込んだ部分を切り出した画像と短い説明です。説明の下の「この部分を見る」から、公開中のサイトのその章を直接開けます（`works[].detail.href`。各サイトの URL に章の `#id` を付けたもの）。

実績の画像（`src/assets/works/*.webp`）は、公開中の各サイトを撮って webp（品質80）にしたものです。各サイトの見た目を変えたら撮り直してください。

- `<slug>-desktop.webp` / `<slug>-mobile.webp`: 1画面目。PC 幅（1440×900）とスマホ幅（390×844）
- `<slug>-detail.webp`: 見どころ。縦横比 16:10（960×600）。菓寮 月白の「今日の暦」は開いた日で表示が変わるため、月のかたちが見える日付（2026-11-13）にブラウザの時計を合わせて撮っています

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
- **Type**: IBM Plex Sans JP（日本語の本文・見出し）+ Archivo（幅の広いロゴ・ワードマークだけ）+ IBM Plex Mono（小さなラベル）。日本語は `word-break: auto-phrase` で文節の切れ目で折り返す。角は基本 0（スマホの枠だけ丸める）。

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
    SectionHeading.tsx      各セクションの見出し（番号・ラベル・見出し・リード）
    sections/               Hero / Works / Services / Process / About / Contact / Footer
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

1. `src/data/site.ts`: 名前・紹介文・道具・連絡先、`works`（実績。`field` はヒーローの目次に出す業種、`detail` は見どころ）・`services`（できること）・`steps`（ご依頼の流れ）。
2. 実績の画像は `src/assets/works/` に置き、`site.ts` で静的 import する（basePath が自動で付く）。
3. `src/app/layout.tsx`: metadata の title/description。
