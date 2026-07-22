import { site } from "../../data/site";

/*
 * Hero: full-viewport, left-aligned over the fixed WebGL instrument
 * (the object sits right-of-center on desktop, behind a scrim on mobile).
 * Max 4 text elements: role, name, lead, CTA.
 */
export default function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col justify-center px-5 pt-16 sm:px-8 lg:px-16">
      <div className="mx-auto w-full max-w-[1400px]">
        <p
          data-hero-fade
          className="font-mono text-[13px] uppercase tracking-[0.22em] text-accent"
        >
          {site.role}
        </p>
        <h1
          data-hero-fade
          className="display-wide mt-5 text-[16vw] font-black uppercase leading-[0.92] tracking-[-0.02em] sm:text-[13vw] lg:text-[9.5rem]"
        >
          {site.nameLines[0]}
          <br />
          {site.nameLines[1]}
        </h1>
        <p
          data-hero-fade
          className="mt-7 max-w-md text-base leading-relaxed text-muted sm:text-lg"
        >
          {site.heroLead}
        </p>
        <div data-hero-fade className="mt-10">
          <a
            href="#works"
            className="inline-flex items-center gap-3 bg-accent px-7 py-4 font-mono text-[13px] font-medium uppercase tracking-[0.16em] text-ink transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
          >
            {site.heroCta}
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
}
