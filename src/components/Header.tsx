import { site } from "../data/site";

const NAV = [
  { label: "実績", href: "#works" },
  { label: "できること", href: "#services" },
  { label: "流れ", href: "#process" },
  { label: "相談", href: "#contact" },
];

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-ink/65 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-16">
        <a
          href="#main"
          className="display-wide whitespace-nowrap text-xs font-black uppercase tracking-[0.08em] text-fg sm:text-sm"
        >
          {site.name}
        </a>
        <nav aria-label="メイン">
          <ul className="flex items-center gap-4 sm:gap-8">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-block py-3 text-xs text-fg/75 transition-colors hover:text-accent sm:text-sm"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
