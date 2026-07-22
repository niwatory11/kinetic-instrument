import { site } from "../data/site";

const NAV = [
  { label: "Works", href: "#works" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
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
        <nav aria-label="Primary">
          <ul className="flex items-center gap-4 sm:gap-8">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-accent sm:text-[13px] sm:tracking-[0.14em]"
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
