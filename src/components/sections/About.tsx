import { site } from "../../data/site";

export default function About() {
  return (
    <section id="about" className="relative scroll-mt-16 px-5 py-28 sm:px-8 lg:px-16 lg:py-40">
      <div className="mx-auto w-full max-w-[1400px]">
        <h2
          data-reveal
          className="display-wide text-3xl font-black uppercase tracking-[-0.01em] sm:text-4xl"
        >
          {site.about.heading}
        </h2>
        <p data-reveal className="mt-8 max-w-[62ch] text-lg leading-relaxed text-muted">
          {site.about.body}
        </p>
        <ul data-reveal className="mt-10 flex max-w-2xl flex-wrap gap-3">
          {site.about.tags.map((tag) => (
            <li
              key={tag}
              className="border border-line bg-surface/60 px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] text-fg"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
