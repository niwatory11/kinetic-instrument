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
 *  - Entrance reveals: the hero name rises letter-by-letter on load, the
 *    rest of the hero copy trails it, sections fade/slide on scroll.
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
      const lenis = new Lenis({ lerp: 0.12 });
      /* Marker used by tests and CSS to detect that Lenis drives scroll. */
      document.documentElement.dataset.lenis = "on";

      /*
       * In-page links are scrolled here rather than by Lenis' `anchors`
       * option, so the destination can be rounded to a whole pixel.
       * Lenis ends a lerp scroll once Math.round(value) equals
       * Math.round(target). Section tops sit on half pixels at some widths,
       * and a target ending in .5 is approached from below without ever
       * rounding up — the scroll only "ends" about 5s later, when the float
       * finally converges. Until then Lenis keeps writing its own position
       * every frame, so Home / End / PageDown and the scrollbar snap back,
       * and the next jump is measured from a stale position. A whole-pixel
       * target ends as soon as the page is within half a pixel of it.
       *
       * The click is not cancelled: the browser still updates the URL hash
       * and moves the keyboard's starting point to the target.
       */
      const onAnchorClick = (event: MouseEvent) => {
        if (event.defaultPrevented || event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const link =
          event.target instanceof Element
            ? event.target.closest<HTMLAnchorElement>("a[href]")
            : null;
        if (
          !link?.hash ||
          link.host !== window.location.host ||
          link.pathname !== window.location.pathname
        ) {
          return;
        }
        const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
        if (!target) return;
        const margin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
        lenis.scrollTo(
          Math.round(target.getBoundingClientRect().top + window.scrollY - margin),
        );
      };
      document.addEventListener("click", onAnchorClick);

      lenis.on("scroll", () => {
        interaction.progress = lenis.progress || 0;
        ScrollTrigger.update();
      });
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      /*
       * Hero entrance is one beat, not two: the name boots up first —
       * each letter rising out of the overflow mask its line wraps it in —
       * and the surrounding copy starts as the last letter launches, so the
       * two read as a single instrument powering on. Deriving the copy's
       * delay from the letter count keeps that overlap intact if the name
       * changes length; the clamp stops a long name pushing copy too late.
       */
      const nameDelay = 0.15;
      const letterStagger = 0.045;
      const letters = gsap.utils.toArray<HTMLElement>("[data-hero-letter]");
      const copyDelay = gsap.utils.clamp(
        0.3,
        0.7,
        nameDelay + letters.length * letterStagger,
      );

      /*
       * Hero name: masked letters rise into place. Transform only — the mask
       * does the hiding, so no opacity is needed. Guarded on length because
       * GSAP warns when a tween resolves to zero targets.
       */
      const letterTween = letters.length
        ? gsap.from(letters, {
            yPercent: 110,
            duration: 0.9,
            stagger: letterStagger,
            ease: "power3.out",
            delay: nameDelay,
          })
        : null;

      /* Hero copy: staggered rise, trailing the name. */
      const heroTween = gsap.from("[data-hero-fade]", {
        opacity: 0,
        y: 26,
        duration: 1,
        stagger: 0.09,
        ease: "power3.out",
        delay: copyDelay,
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

      /*
       * Process track: the accent fill grows along the hairline as the
       * steps scroll through the viewport (scrubbed, so it reads as a gauge
       * needle rather than a one-off reveal). Axis comes from the element:
       * "x" on lg+ (horizontal track), "y" below (vertical track).
       */
      const fillTweens = gsap.utils.toArray<HTMLElement>("[data-process-fill]").map((el) =>
        gsap.from(el, {
          [el.dataset.processFill === "x" ? "scaleX" : "scaleY"]: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("[data-process]") ?? el,
            start: "top 75%",
            end: "bottom 60%",
            scrub: 0.6,
          },
        }),
      );

      return () => {
        letterTween?.kill();
        heroTween.kill();
        fillTweens.forEach((tween) => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });
        revealTweens.forEach((tween) => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });
        gsap.ticker.remove(tick);
        document.removeEventListener("click", onAnchorClick);
        lenis.destroy();
        delete document.documentElement.dataset.lenis;
        interaction.progress = 0;
      };
    });

    return () => mm.revert();
  }, []);

  return null;
}
