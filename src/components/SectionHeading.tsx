/*
 * Shared section header: a full-width hairline carrying the index and the
 * Latin mono label (an instrument channel readout), then the Japanese
 * heading on the left and the lead pinned to the right column on lg+.
 */
export default function SectionHeading({
  index,
  label,
  heading,
  lead,
}: {
  index: string;
  label: string;
  heading: string;
  lead?: string;
}) {
  return (
    <div data-reveal>
      <p className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
        <span className="text-accent">{index}</span>
        <span>{label}</span>
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
      </p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
        <h2 className="text-[clamp(2rem,1.4rem+2.6vw,3.5rem)] font-bold leading-[1.25] tracking-[0.02em]">
          {heading}
        </h2>
        {lead ? (
          <p className="max-w-[32em] text-[15px] leading-[1.9] text-muted lg:justify-self-end">
            {lead}
          </p>
        ) : null}
      </div>
    </div>
  );
}
