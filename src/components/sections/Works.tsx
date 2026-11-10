import Image from "next/image";
import { site, works, type Work } from "../../data/site";
import SectionHeading from "../SectionHeading";

/*
 * Selected works as alternating case-study rows (zig-zag on lg+).
 * Each row has three parts:
 *  - visual: a framed desktop screenshot with a phone screenshot overlapping
 *    its lower corner, so responsiveness is shown, not claimed. The frame
 *    bar prints the real URL in mono: an instrument readout.
 *  - text:   what the site is, what was built, the stack and the links.
 *  - detail: a close-up of one crafted part of the site with a short note,
 *    so a visitor sees more than the first screen without leaving the page.
 *    (No deep link: three of the sites render on the client, so a URL with
 *    a #section opens them at the top, not at the section.)
 * On lg+ the detail sits under the visual and the text spans both rows;
 * below lg the DOM order (visual, text, detail) is the reading order.
 */
function WorkVisual({ work, flip, className }: { work: Work; flip: boolean; className: string }) {
  const live = work.links[0];
  const frame = (
    <div className="border border-line bg-surface">
      <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
        <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 bg-accent" />
        <span className="truncate font-mono text-[11px] tracking-[0.06em] text-muted">
          {work.url}
        </span>
      </div>
      <div className="overflow-hidden">
        <Image
          src={work.desktop}
          alt={`${work.title}のトップページ（PC表示）`}
          sizes="(min-width: 1024px) 56vw, 100vw"
          className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.025]"
        />
      </div>
    </div>
  );

  return (
    <div className={`relative pb-10 sm:pb-14 ${className}`}>
      {live ? (
        <a
          href={live.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
          aria-label={`${work.title}のサイトを新しいタブで開く`}
        >
          {frame}
        </a>
      ) : (
        <div className="group">{frame}</div>
      )}
      {/* Phone: overlaps the frame's lower corner, opposite the text column. */}
      <div
        className={`absolute bottom-0 w-[24%] min-w-[92px] max-w-[168px] overflow-hidden rounded-[14px] border-[3px] border-bezel bg-ink shadow-[0_24px_60px_-20px_rgba(0,0,0,0.85)] ${
          flip ? "left-4 sm:left-8" : "right-4 sm:right-8"
        }`}
      >
        <Image
          src={work.mobile}
          alt={`${work.title}のトップページ（スマホ表示）`}
          sizes="168px"
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}

function WorkText({ work, index, className }: { work: Work; index: number; className: string }) {
  return (
    <div className={`lg:py-6 ${className}`}>
      <p className="flex items-center gap-3 font-mono text-xs tracking-[0.16em] text-accent">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span aria-hidden="true" className="h-px w-8 bg-line" />
        <span className="text-muted">{work.year}</span>
      </p>
      <h3 className="mt-5 text-2xl font-bold tracking-[0.02em] sm:text-3xl">{work.title}</h3>
      <p className="mt-2 text-sm text-muted">{work.kind}</p>
      <p className="mt-6 max-w-[34em] leading-[1.9] text-fg/90">{work.summary}</p>

      <ul className="mt-6 space-y-2.5 border-t border-line pt-6">
        {work.points.map((point) => (
          <li key={point} className="flex gap-3 text-[15px] leading-[1.75] text-fg/85">
            <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
            {point}
          </li>
        ))}
      </ul>

      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
        {work.tech.join(" / ")}
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        {work.links.length > 0 ? (
          work.links.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={
                i === 0
                  ? "inline-flex items-center gap-2 bg-accent px-5 py-3 text-sm font-bold text-ink transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
                  : "inline-flex items-center gap-1.5 border-b border-line py-1 text-sm text-fg/85 transition-colors hover:border-accent hover:text-accent"
              }
            >
              {link.label}
              <span aria-hidden="true">↗</span>
              <span className="sr-only">（新しいタブで開きます）</span>
            </a>
          ))
        ) : (
          <p className="border border-line px-3 py-2 font-mono text-xs tracking-[0.1em] text-muted">
            {work.status}
          </p>
        )}
      </div>
    </div>
  );
}

/*
 * Close-up: the image keeps the site's own colors (it is a screenshot), so
 * it gets the same hairline frame as the main visual but no bar; the note
 * beside it carries the label. Image and note sit side by side and are
 * bottom-aligned so the note reads as a caption; they stack on phones and
 * again at lg, where the two-column row leaves the note too narrow a slot.
 */
function WorkDetail({ work, className }: { work: Work; className: string }) {
  const { detail } = work;
  return (
    <figure
      className={`grid gap-5 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] sm:items-end sm:gap-7 lg:grid-cols-1 lg:gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] xl:gap-7 ${className}`}
    >
      <div className="border border-line bg-surface">
        <Image
          src={detail.image}
          alt={detail.alt}
          sizes="(min-width: 1024px) 34vw, (min-width: 640px) 58vw, 100vw"
          className="h-auto w-full"
        />
      </div>
      <figcaption>
        <p className="flex items-center gap-3 text-xs tracking-[0.12em] text-accent">
          <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 bg-accent" />
          {site.works.detailLabel}
        </p>
        <h4 className="mt-3 text-[17px] font-bold leading-[1.5] tracking-[0.02em]">{detail.title}</h4>
        <p className="mt-2 text-sm leading-[1.85] text-muted">{detail.body}</p>
      </figcaption>
    </figure>
  );
}

export default function Works() {
  return (
    <section id="works" className="relative scroll-mt-16 px-5 py-28 sm:px-8 lg:px-16 lg:py-40">
      <div className="mx-auto w-full max-w-[1400px]">
        <SectionHeading
          index="01"
          label={site.works.label}
          heading={site.works.heading}
          lead={site.works.note}
        />

        <div className="mt-16 space-y-24 lg:mt-24 lg:space-y-36">
          {works.map((work, index) => {
            const flip = index % 2 === 1;
            /* Explicit grid lines instead of `order`: the text spans both
               rows on lg+, which `order` alone cannot express.
               scroll-mt is the header (64px) plus room for the 30px the
               row still has to rise when a jump lands before its reveal. */
            const visualCol = flip ? "lg:col-start-2" : "lg:col-start-1";
            const textCol = flip ? "lg:col-start-1" : "lg:col-start-2";
            return (
              <article
                key={work.slug}
                id={`work-${work.slug}`}
                data-reveal
                className={`grid scroll-mt-28 grid-cols-1 gap-x-10 gap-y-10 lg:items-start lg:gap-x-16 lg:gap-y-8 ${
                  flip
                    ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]"
                    : "lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]"
                }`}
              >
                <WorkVisual work={work} flip={flip} className={`${visualCol} lg:row-start-1`} />
                <WorkText
                  work={work}
                  index={index}
                  className={`${textCol} lg:row-span-2 lg:row-start-1`}
                />
                <WorkDetail work={work} className={`${visualCol} lg:row-start-2`} />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
