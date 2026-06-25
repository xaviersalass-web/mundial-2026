import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Static social share card (Open Graph + Twitter). Branded to match the hero:
// dark "paper-ink", Anton display type, gold accent. 1200x630.
export const alt = "World Cup Atlas — A Century in Data · FIFA World Cup 1930 → 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const anton = await readFile(join(process.cwd(), "assets/Anton-Regular.ttf"));

  const INK = "#161410";
  const PAPER = "#f4efe4";
  const GOLD = "#e8b84b";
  const MUTED = "rgba(244,239,228,0.62)";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          color: PAPER,
          fontFamily: "Anton",
          padding: "64px 72px",
          position: "relative",
        }}
      >
        {/* top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 10,
            background: "linear-gradient(90deg, #3fb27f, #e8b84b, #c84fa8)",
            display: "flex",
          }}
        />

        {/* kicker */}
        <div
          style={{
            display: "flex",
            fontSize: 30,
            letterSpacing: 6,
            color: GOLD,
          }}
        >
          1930 — 2026 · 23 EDITIONS · 1 OBSESSION
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 0.92 }}>
          <div style={{ display: "flex", fontSize: 132 }}>A CENTURY</div>
          <div style={{ display: "flex", fontSize: 132 }}>
            OF THE WORLD CUP<span style={{ color: GOLD }}>.</span>
          </div>
        </div>

        {/* stats row */}
        <div style={{ display: "flex", gap: 64 }}>
          {[
            ["48", "TEAMS"],
            ["104", "MATCHES"],
            ["16", "HOST CITIES"],
            ["3", "NATIONS"],
          ].map(([n, l]) => (
            <div key={l} style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 64, color: GOLD }}>{n}</div>
              <div style={{ display: "flex", fontSize: 24, letterSpacing: 3, color: MUTED }}>
                {l}
              </div>
            </div>
          ))}
        </div>

        {/* footer wordmark */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 28,
            letterSpacing: 4,
          }}
        >
          <div style={{ display: "flex" }}>
            WORLD CUP <span style={{ color: MUTED, margin: "0 8px" }}>·</span> ATLAS
          </div>
          <div style={{ display: "flex", color: MUTED, fontSize: 24 }}>
            A DATA STORY
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Anton", data: anton, style: "normal", weight: 400 }],
    },
  );
}
