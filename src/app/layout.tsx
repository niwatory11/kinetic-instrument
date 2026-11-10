import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans_JP } from "next/font/google";
import "./globals.css";

/*
 * Type system:
 *  - IBM Plex Sans JP: all Japanese copy (body, headings). Its Latin is
 *    IBM Plex Sans, so it harmonizes with the mono labels.
 *  - Archivo (variable, width axis) only for the wide display wordmark.
 *  - IBM Plex Mono for instrument-style micro labels (Latin only).
 * Plex Sans JP is split by Google into unicode-range chunks; preload is off
 * because there is no "japanese" subset to preload, and the browser only
 * fetches the chunks the page actually uses.
 */
const plexJp = IBM_Plex_Sans_JP({
  variable: "--font-plex-jp",
  weight: ["400", "500", "700"],
  preload: false,
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "niwatory | Web制作・フロントエンド開発",
  description:
    "niwatory のポートフォリオ。ランディングページ、コーポレートサイト、3D・WebGL の演出まで、デザインから実装・公開まで担当します。掲載作品は架空のブランドを題材にした自主制作です。",
  openGraph: {
    title: "niwatory | Web制作・フロントエンド開発",
    description:
      "デザインから実装・公開まで、通して担当します。制作実績・できること・ご依頼の流れ。",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${plexJp.variable} ${archivo.variable} ${plexMono.variable} antialiased`}
    >
      <body className="font-sans">
        {/* Keyboard users can jump past the fixed header. */}
        <a
          href="#main"
          className="fixed left-4 top-4 z-50 -translate-y-24 bg-accent px-4 py-2 text-sm font-bold text-ink transition-transform focus-visible:translate-y-0"
        >
          本文へ移動
        </a>
        {children}
      </body>
    </html>
  );
}
