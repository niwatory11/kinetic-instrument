import { site } from "../../data/site";

export default function Footer() {
  return (
    <footer className="relative border-t border-line bg-ink/80 px-5 py-10 backdrop-blur-sm sm:px-8 lg:px-16">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <p className="display-wide text-sm font-black uppercase tracking-[0.08em]">
          {site.name}
        </p>
        <p className="max-w-md text-xs leading-relaxed text-muted">{site.footer.note}</p>
        <p className="text-xs text-muted">{site.footer.credit}</p>
      </div>
    </footer>
  );
}
