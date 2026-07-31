/*
 * All visible copy lives here so the placeholder identity and the sample
 * works can be swapped for real content without touching components.
 */

export const site = {
  name: "niwatory",
  /* One entry per display line; the hero renders each line letter-by-letter
     (kinetic reveal), so any number of lines works. */
  nameLines: ["niwatory"],
  role: "Creative Developer",
  /* Instrument-style call sign shown as a micro label under the hero wordmark. */
  callSign: "N-01 / KINETIC INSTRUMENT",
  heroLead:
    "Creative developer engineering interactive 3D scenes and precise, motion-driven interfaces for the web.",
  heroCta: "View Selected Works",
  about: {
    heading: "About",
    body: "I build interactive experiences where design and engineering meet: WebGL scenes, kinetic interfaces, and sites that respond to touch and scroll. I care about motion that explains rather than decorates, and I ship production code, not prototypes. Currently open to freelance projects and studio collaborations.",
    tags: [
      "WebGL / Three.js",
      "React / Next.js",
      "TypeScript",
      "GSAP Motion",
      "Shader Programming",
      "Creative Direction",
    ],
  },
  contact: {
    heading: "Have a project in mind?",
    body: "Tell me about the idea, the deadline and the ambition. I usually reply within two days.",
    cta: "Email me",
    /* TODO: replace with a real inbox before publishing. */
    email: "hello@niwatory.dev",
    socials: [
      { label: "GitHub", href: "https://github.com/niwatory" },
      { label: "X", href: "https://x.com/niwatory" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/niwatory" },
    ],
  },
  footer: {
    note: "The projects on this page are fictional sample concepts, built to demonstrate layout, motion and WebGL — not real client engagements.",
    credit: "Built with Next.js, React Three Fiber, GSAP and Lenis.",
  },
} as const;

export type Work = {
  title: string;
  kind: string;
  year: string;
  summary: string;
  /* Tailwind classes producing a code-generated pattern, one per project.
     Swap for a real <Image> when actual case-study art exists. */
  pattern: string;
  span: string;
};

export const works: Work[] = [
  {
    title: "Helioscope",
    kind: "WebGL Installation",
    year: "2026",
    summary: "A browser-based light instrument driven by generative shaders.",
    pattern:
      "bg-[repeating-radial-gradient(circle_at_70%_38%,rgba(245,169,63,0.5)_0px,rgba(245,169,63,0.5)_1px,transparent_1px,transparent_26px),radial-gradient(circle_at_70%_38%,rgba(245,169,63,0.24),transparent_58%)] bg-surface",
    span: "md:col-span-7",
  },
  {
    title: "Ferrotype",
    kind: "E-commerce Concept",
    year: "2025",
    summary: "Storefront study for a fictional camera archive.",
    pattern:
      "bg-[radial-gradient(rgba(233,236,241,0.32)_1px,transparent_1px),radial-gradient(circle_at_30%_80%,rgba(245,169,63,0.16),transparent_52%)] bg-[length:22px_22px,100%_100%] bg-surface",
    span: "md:col-span-5",
  },
  {
    title: "Waveform Atlas",
    kind: "Audio Visual Essay",
    year: "2025",
    summary: "Scroll-driven essay pairing field recordings with drawn waveforms.",
    pattern:
      "bg-[repeating-linear-gradient(180deg,rgba(233,236,241,0.2)_0px,rgba(233,236,241,0.2)_1px,transparent_1px,transparent_14px),linear-gradient(120deg,rgba(245,169,63,0.2),transparent_55%)] bg-surface",
    span: "md:col-span-5",
  },
  {
    title: "Meridian",
    kind: "Kinetic Type Microsite",
    year: "2024",
    summary: "Typographic microsite where headlines orbit a fixed axis.",
    pattern:
      "bg-[repeating-linear-gradient(64deg,rgba(245,169,63,0.34)_0px,rgba(245,169,63,0.34)_1px,transparent_1px,transparent_20px),conic-gradient(from_210deg_at_78%_30%,rgba(245,169,63,0.2),transparent_140deg)] bg-surface",
    span: "md:col-span-7",
  },
];
