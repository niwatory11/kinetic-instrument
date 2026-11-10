import { site } from "../../data/site";
import SectionHeading from "../SectionHeading";

/*
 * About: prose on the left, the toolset as a ruled two-column readout on
 * the right (instrument spec plate) instead of a cloud of pill tags.
 */
export default function About() {
  return (
    <section id="about" className="relative scroll-mt-16 px-5 py-28 sm:px-8 lg:px-16 lg:py-36">
      <div className="mx-auto w-full max-w-[1400px]">
        <SectionHeading index="04" label={site.about.label} heading={site.about.heading} />

        <div className="mt-12 grid gap-14 lg:mt-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-20">
          <div data-reveal className="space-y-6">
            {site.about.body.map((paragraph) => (
              <p key={paragraph} className="max-w-[36em] text-[17px] leading-[2] text-fg/90">
                {paragraph}
              </p>
            ))}
          </div>

          <div data-reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">Toolset</p>
            {/* Solid plate: this list sits where the veil fades out, so
                without it the rings pass behind the labels. */}
            <ul className="mt-4 grid grid-cols-1 border-l border-t border-line bg-ink/85 sm:grid-cols-2">
              {site.about.tags.map((tag) => (
                <li
                  key={tag}
                  className="border-b border-r border-line px-4 py-3.5 font-mono text-xs tracking-[0.06em] text-fg/90"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
