import { site } from "../../data/site";

export default function Footer() {
  return (
    <footer className="relative border-t border-line bg-ink/80 px-5 py-10 backdrop-blur-sm sm:px-8 lg:px-16">
      <div className="mx-auto grid w-full max-w-[1400px] gap-4 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-start md:gap-12">
        <p className="display-wide text-sm font-black uppercase tracking-[0.08em]">{site.name}</p>
        <p className="max-w-[44em] text-xs leading-[1.9] text-muted">{site.footer.note}</p>
        <p className="text-xs leading-[1.9] text-muted">{site.footer.credit}</p>
      </div>
    </footer>
  );
}
