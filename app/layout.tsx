import type { Metadata } from "next";
import { Anton, Archivo, JetBrains_Mono } from "next/font/google";
import "./atlas/css/styles.css";
import "./atlas/css/charts.css";
import "./atlas/css/sections.css";
import "./atlas/css/gallery.css";
import "./atlas/css/live.css";

// Anton (condensed display), Archivo (UI/body), JetBrains Mono (data tickers).
const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = "https://mundial-2026-rust-ten.vercel.app";
const TITLE = "World Cup Atlas — A Century in Data";
const DESCRIPTION =
  "A scrollytelling data story of the FIFA World Cup, 1930 → 2026: dynasties, goal machines, the shifting tempo of the game, attendance growth, penalty nerve, and the 48-team 2026 spectacle across the USA, Canada and Mexico.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "World Cup Atlas",
  authors: [{ name: "World Cup Atlas" }],
  keywords: [
    "FIFA World Cup",
    "World Cup 2026",
    "data visualization",
    "scrollytelling",
    "football",
    "soccer",
    "infographic",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "World Cup Atlas",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${archivo.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
