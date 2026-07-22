"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { interaction } from "../lib/interaction";

/*
 * Single client island owning all page-level motion:
 *  - Lenis inertial scroll, driven by GSAP's ticker and synced with
 *    ScrollTrigger (Lenis animates native window scroll).
 *  - Writes scroll progress (0..1) into the shared `interaction` module,
 *    which the WebGL scene reads every frame.
 *  - Entrance reveals: hero fades on load, sections fade/slide on scroll.
 *
 * Everything is registered inside gsap.matchMedia() under
 * "(prefers-reduced-motion: no-preference)". Reduced-motion users get
 * native scrolling and fully visible, static content (gsap.from never
 * runs, so nothing is ever hidden for them).
 */
export default function MotionOrchestrator() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({ lerp: 0.12, anchors: true });
      /* Marker used by tests and CSS to detect that Lenis drives scroll. */
      document.documentElement.dataset.lenis = "on";

      lenis.on("scroll", () => {
        interaction.progress = lenis.progress || 0;
        ScrollTrigger.update();
      });
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      /* Hero entrance: staggered rise on load. */
      const heroTween = gsap.from("[data-hero-fade]", {
        opacity: 0,
        y: 26,
        duration: 1,
        stagger: 0.09,
        ease: "power3.out",
        delay: 0.2,
      });

      /* Section reveals: one restrained fade+rise per element. */
      const revealTweens = gsap.utils.toArray<HTMLElement>("[data-reveal]").map((el) =>
        gsap.from(el, {
          opacity: 0,
          y: 30,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        }),
      );

      return () => {
        heroTween.kill();
        revealTweens.forEach((tween) => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });
        gsap.ticker.remove(tick);
        lenis.destroy();
        delete document.documentElement.dataset.lenis;
        interaction.progress = 0;
      };
    });

    return () => mm.revert();
  }, []);

  return null;
}
