import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

/*
 * Type system: Archivo (variable, width axis used for the wide display cut)
 * plus IBM Plex Mono for instrument-style micro labels. Two families total.
 */
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
  title: "Taro Yamada | Creative Developer",
  description:
    "Sample portfolio of a creative developer: interactive 3D, WebGL and motion-driven interfaces. All listed works are fictional sample projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable} antialiased`}>
      <body className="font-sans">
        {/* Keyboard users can jump past the fixed header. */}
        <a
          href="#main"
          className="fixed left-4 top-4 z-50 -translate-y-24 bg-accent px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-ink transition-transform focus-visible:translate-y-0"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
