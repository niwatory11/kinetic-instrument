import { site } from "../../data/site";

/*
 * Contact sits outside the veil (see page.tsx), so the instrument returns
 * at full strength behind the closing call to action.
 */
export default function Contact() {
  return (
    <section id="contact" className="relative scroll-mt-16 px-5 py-32 sm:px-8 lg:px-16 lg:py-48">
      <div className="mx-auto w-full max-w-[1400px]">
        <p
          data-reveal
          className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-muted"
        >
          <span className="text-accent">05</span>
          <span>{site.contact.label}</span>
        </p>
        <h2
          data-reveal
          className="mt-8 max-w-[12em] text-[clamp(2rem,1.3rem+2.8vw,3.5rem)] font-bold leading-[1.35] tracking-[0.01em]"
        >
          {site.contact.heading}
        </h2>
        <p data-reveal className="mt-8 max-w-[32em] text-[17px] leading-[1.95] text-fg/85">
          {site.contact.body}
        </p>
        <div data-reveal className="mt-12">
          <a
            href={site.contact.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-accent px-7 py-4 text-[15px] font-bold text-ink transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
          >
            {site.contact.cta}
            <span aria-hidden="true">↗</span>
            <span className="sr-only">（新しいタブで開きます）</span>
          </a>
        </div>
      </div>
    </section>
  );
}
