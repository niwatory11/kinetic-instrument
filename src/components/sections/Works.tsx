import { works } from "../../data/site";

/*
 * Selected works. Asymmetric 12-col grid (7/5 then 5/7) instead of the
 * generic equal-card row. Card visuals are code-generated CSS patterns in
 * the instrument language (rings, dots, strata, sweeps): swap `pattern`
 * for a real <Image> per project when actual case-study art exists.
 * Cards are intentionally non-links: these are fictional samples.
 */
export default function Works() {
  return (
    <section id="works" className="relative scroll-mt-16 px-5 py-28 sm:px-8 lg:px-16 lg:py-40">
      <div className="mx-auto w-full max-w-[1400px]">
        <div data-reveal className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display-wide text-3xl font-black uppercase tracking-[-0.01em] sm:text-4xl">
            Selected Works
          </h2>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
            Fictional sample projects
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-12">
          {works.map((work) => (
            <article
              key={work.title}
              data-reveal
              className={`group border border-line bg-surface/90 ${work.span}`}
            >
              <div className="relative overflow-hidden border-b border-line">
                <div
                  className={`aspect-[16/10] transition-transform duration-500 ease-out group-hover:scale-[1.05] ${work.pattern}`}
                />
                {/* Category label: revealed on hover, always visible on touch. */}
                <p className="absolute bottom-0 left-0 translate-y-2 bg-ink/85 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-accent opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
                  {work.kind}
                </p>
              </div>
              <div className="flex items-start justify-between gap-4 p-6">
                <div>
                  <h3 className="text-xl font-bold transition-colors duration-200 group-hover:text-accent">
                    {work.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{work.summary}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono text-xs text-muted">{work.year}</p>
                  <p className="mt-2 border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    Sample Project
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p data-reveal className="mt-8 text-xs text-muted">
          Fictional sample concepts — the projects above illustrate layout, motion and
          interaction only.
        </p>
      </div>
    </section>
  );
}
