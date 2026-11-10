import { services, site } from "../../data/site";
import SectionHeading from "../SectionHeading";

/*
 * Services as a ruled spec list rather than an equal card row: index,
 * title and body sit on one baseline per row, deliverables trail in mono.
 * Hover lights the row's index and draws an accent rule from the left.
 */
export default function Services() {
  return (
    <section id="services" className="relative scroll-mt-16 px-5 py-28 sm:px-8 lg:px-16 lg:py-36">
      <div className="mx-auto w-full max-w-[1400px]">
        <SectionHeading
          index="02"
          label={site.services.label}
          heading={site.services.heading}
          lead={site.services.lead}
        />

        <ol className="mt-14 border-b border-line lg:mt-20">
          {services.map((service, i) => (
            <li
              key={service.title}
              data-reveal
              className="group relative grid gap-4 border-t border-line py-9 transition-colors duration-300 hover:bg-surface/50 lg:grid-cols-[7rem_minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-10 lg:px-6 lg:py-11"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-[-1px] h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
              <p className="font-mono text-xs tracking-[0.16em] text-muted transition-colors group-hover:text-accent">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="text-xl font-bold leading-[1.5] tracking-[0.02em] sm:text-2xl">
                {service.title}
              </h3>
              <div>
                <p className="max-w-[36em] leading-[1.9] text-fg/85">{service.body}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {service.items.map((item) => (
                    <li
                      key={item}
                      className="border border-line px-2.5 py-1 text-xs text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
