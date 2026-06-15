import type { Metadata } from "next";
import { Anton, Archivo, JetBrains_Mono } from "next/font/google";
import "./atlas/css/styles.css";
import "./atlas/css/charts.css";
import "./atlas/css/sections.css";
import "./atlas/css/gallery.css";

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

export const metadata: Metadata = {
  title: "World Cup Atlas — A Century in Data",
  description:
    "A scrollytelling data story of the FIFA World Cup, 1930 → 2026: dynasties, goal machines, the shifting tempo of the game, attendance growth, penalty nerve, and the 48-team 2026 spectacle across the USA, Canada and Mexico.",
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
