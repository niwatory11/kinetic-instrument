import { site } from "../../data/site";

export default function Contact() {
  return (
    <section id="contact" className="relative scroll-mt-16 px-5 py-28 sm:px-8 lg:px-16 lg:py-44">
      <div className="mx-auto w-full max-w-[1400px]">
        <h2
          data-reveal
          className="display-wide max-w-4xl text-4xl font-black uppercase leading-[0.98] tracking-[-0.01em] sm:text-6xl lg:text-7xl"
        >
          {site.contact.heading}
        </h2>
        <p data-reveal className="mt-8 max-w-md text-lg leading-relaxed text-muted">
          {site.contact.body}
        </p>
        <div data-reveal className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-6">
          <a
            href={`mailto:${site.contact.email}`}
            className="inline-flex items-center gap-3 bg-accent px-7 py-4 font-mono text-[13px] font-medium uppercase tracking-[0.16em] text-ink transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
          >
            {site.contact.cta}
            <span aria-hidden="true">&rarr;</span>
          </a>
          <ul className="flex flex-wrap items-center gap-6">
            {site.contact.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[13px] uppercase tracking-[0.14em] text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
