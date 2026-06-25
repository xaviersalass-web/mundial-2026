"use client";

import { useEffect, useState } from "react";
import { Confetti } from "@/components/atlas/Confetti";
import { Counter } from "@/components/atlas/Counter";
import { WC_DATA } from "@/lib/atlas/data";

const NATIONS = [
  "BRAZIL", "GERMANY", "ITALY", "ARGENTINA", "FRANCE", "URUGUAY", "ENGLAND", "SPAIN",
  "NETHERLANDS", "PORTUGAL", "CROATIA", "MEXICO", "USA", "CANADA", "JAPAN", "MOROCCO",
  "BELGIUM", "DENMARK",
];
const MARQUEE = NATIONS.join("   ·   ");

export function Hero() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const r = requestAnimationFrame(() => setReady(true));
    const t = setTimeout(() => setReady(true), 120);
    return () => {
      cancelAnimationFrame(r);
      clearTimeout(t);
    };
  }, []);

  const h = WC_DATA.hero;

  return (
    <header className={`hero${ready ? " ready" : ""}`} id="top">
      <Confetti />
      <div className="hero-grid" />

      <div className="hero-inner wrap">
        <div className="hero-kicker mono">1930 — 2026 · 23 EDITIONS · 1 OBSESSION</div>
        <h1 className="hero-title display">
          <span className="l l1">A&nbsp;CENTURY</span>
          <span className="l l2">OF&nbsp;THE</span>
          <span className="l l3">
            WORLD&nbsp;CUP<em aria-hidden="true">.</em>
          </span>
        </h1>
        <p className="hero-lead lead">
          Ninety-six years of the planet&apos;s biggest tournament, told through its
          numbers — the dynasties, the goal machines, the shifting tempo of the game,
          and the 48-team spectacle landing across North America in 2026.
        </p>

        <div className="hero-stats">
          <div className="hstat">
            <Counter className="hnum mono" target={23} />
            <span className="hlab">editions by 2026</span>
          </div>
          <div className="hstat">
            <Counter className="hnum mono" target={h.matchesAllTime} />
            <span className="hlab">finals matches played</span>
          </div>
          <div className="hstat">
            <Counter className="hnum mono" target={h.goalsAllTime} />
            <span className="hlab">goals scored, all-time</span>
          </div>
          <div className="hstat">
            <Counter className="hnum mono" target={h.nationsHosted} />
            <span className="hlab">nations have hosted</span>
          </div>
        </div>
      </div>

      <div className="hero-marquee" aria-hidden="true">
        <div className="marquee-track">
          <span className="m-item">{MARQUEE}</span>
          <span className="m-item">{MARQUEE}</span>
        </div>
      </div>

      <a className="scroll-cue mono" href="#titles">
        SCROLL ↓
      </a>
    </header>
  );
}
