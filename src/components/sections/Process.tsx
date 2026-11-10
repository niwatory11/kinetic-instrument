import { site, steps } from "../../data/site";
import SectionHeading from "../SectionHeading";

/*
 * Process as a measured track: one hairline with five square nodes,
 * horizontal on lg+, vertical below. The horizontal track ends on the
 * last node: column 5 starts at 80% + 25.6px (4 gaps x 1/5), its node
 * center sits 7.5px further, hence right: calc(20% - 33px).
 * An accent fill line sits on top of the hairline; MotionOrchestrator
 * scrubs it with scroll ([data-process-fill]).
 * Without motion the fill simply renders complete.
 */
export default function Process() {
  return (
    <section id="process" className="relative scroll-mt-16 px-5 py-28 sm:px-8 lg:px-16 lg:py-36">
      <div className="mx-auto w-full max-w-[1400px]">
        <SectionHeading
          index="03"
          label={site.process.label}
          heading={site.process.heading}
          lead={site.process.lead}
        />

        <div data-process className="relative mt-14 lg:mt-20">
          {/* Track: vertical (mobile) and horizontal (lg+). */}
          <span aria-hidden="true" className="absolute bottom-4 left-[7px] top-2 w-px bg-line lg:hidden" />
          <span
            aria-hidden="true"
            data-process-fill="y"
            className="absolute bottom-4 left-[7px] top-2 w-px origin-top bg-accent lg:hidden"
          />
          <span aria-hidden="true" className="absolute left-0 right-[calc(20%-33px)] top-[7px] hidden h-px bg-line lg:block" />
          <span
            aria-hidden="true"
            data-process-fill="x"
            className="absolute left-0 right-[calc(20%-33px)] top-[7px] hidden h-px origin-left bg-accent lg:block"
          />

          <ol className="relative grid gap-10 lg:grid-cols-5 lg:gap-8">
            {steps.map((step, i) => (
              <li key={step.title} data-reveal className="relative pl-10 lg:pl-0 lg:pt-12">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1 grid h-[15px] w-[15px] place-items-center border border-accent bg-ink lg:top-0"
                >
                  <span className="h-[5px] w-[5px] bg-accent" />
                </span>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                  Step {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-lg font-bold leading-[1.5]">{step.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.85] text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
