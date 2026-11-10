import { site, works } from "../../data/site";

/* The name is announced once on the <h1>; the split letters are decorative. */
const heroName = site.nameLines.join(" ");

/*
 * Hero: full-viewport, left-aligned over the fixed WebGL instrument
 * (the object sits right-of-center on desktop, behind a scrim on mobile).
 * The name is split per letter so MotionOrchestrator can run the kinetic
 * reveal: every line is its own overflow-hidden mask the letters rise out of,
 * and every letter is inline-block so transforms apply.
 * Text elements: role, name, call sign, lead, CTA pair (works + contact).
 * At the foot of the hero a works index lists every project by number,
 * name and trade (an instrument's channel list), so the first screen
 * already says what was built; each entry jumps to its case study.
 */
export default function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col px-5 pt-16 sm:px-8 lg:px-16">
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center py-8 sm:py-10">
        <p
          data-hero-fade
          className="font-mono text-[13px] uppercase tracking-[0.22em] text-accent"
        >
          {site.role}
        </p>
        <h1
          aria-label={heroName}
          className="display-wide mt-5 text-[11.5vw] font-black uppercase leading-[0.92] tracking-[-0.02em] sm:text-[12vw] lg:text-[min(11.8vw,8.25rem)]"
        >
          {site.nameLines.map((line, lineIndex) => (
            <span
              key={`${lineIndex}-${line}`}
              aria-hidden="true"
              className="block overflow-hidden"
            >
              {Array.from(line).map((char, charIndex) => (
                <span
                  key={`${lineIndex}-${charIndex}-${char}`}
                  data-hero-letter
                  className="inline-block"
                >
                  {/* Word gaps would collapse inside an inline-block. */}
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
          ))}
        </h1>
        {/* Instrument nameplate for the wordmark above: muted so the accent
            stays reserved for the role line and the CTA. */}
        <p
          data-hero-fade
          className="mt-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-muted"
        >
          <span aria-hidden="true" className="h-px w-8 shrink-0 bg-line" />
          {site.callSign}
        </p>
        <p
          data-hero-fade
          className="mt-7 max-w-[25em] text-[15px] leading-[1.95] text-fg/80 sm:text-[17px]"
        >
          {site.heroLead}
        </p>
        <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a
            href="#works"
            className="inline-flex items-center gap-3 bg-accent px-7 py-4 text-[15px] font-bold text-ink transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
          >
            {site.heroCta}
            <span aria-hidden="true">&rarr;</span>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 border-b border-line py-1 text-[15px] text-fg/85 transition-colors hover:border-accent hover:text-accent"
          >
            {site.heroSubCta}
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>

      <nav
        aria-label={site.heroIndexLabel}
        data-hero-fade
        className="mx-auto w-full max-w-[1400px] pb-5 sm:pb-7"
      >
        <ol className="grid grid-cols-2 gap-x-5 border-t border-line lg:grid-cols-4 lg:gap-x-10">
          {works.map((work, index) => (
            <li key={work.slug}>
              <a
                href={`#work-${work.slug}`}
                className="group flex h-full items-baseline gap-3 py-3.5 lg:py-5"
              >
                <span className="font-mono text-[11px] tracking-[0.16em] text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-bold leading-[1.5] tracking-[0.02em] text-fg/90 transition-colors group-hover:text-accent sm:text-sm">
                    {work.indexTitle ?? work.title}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-[1.6] text-muted sm:text-xs">
                    {work.field}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </section>
  );
}
