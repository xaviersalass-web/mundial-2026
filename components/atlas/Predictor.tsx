"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { WC_DATA } from "@/lib/atlas/data";
import type { Contender } from "@/lib/atlas/data";

function miniConfetti(fromEl: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rect = fromEl.getBoundingClientRect();
  const cvs = document.createElement("canvas");
  cvs.style.cssText =
    "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:130";
  document.body.appendChild(cvs);
  const ctx = cvs.getContext("2d");
  if (!ctx) {
    cvs.remove();
    return;
  }
  const dpr = devicePixelRatio;
  cvs.width = innerWidth * dpr;
  cvs.height = innerHeight * dpr;
  const cols = ["#1f8f5b", "#5aa9e6", "#e6b422", "#e9622f", "#c14b8a", "#f4efe4"];
  const cx = (rect.left + rect.width / 2) * dpr,
    cy = (rect.top + rect.height / 2) * dpr;
  let ps = Array.from({ length: 70 }, () => {
    const a = Math.random() * Math.PI * 2,
      sp = (Math.random() * 8 + 3) * dpr;
    return {
      x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 4 * dpr,
      g: 0.22 * dpr, s: (Math.random() * 6 + 4) * dpr, rot: Math.random() * 7,
      vr: (Math.random() - 0.5) * 0.3, col: cols[(Math.random() * cols.length) | 0], life: 1,
    };
  });
  let frame = 0;
  (function run() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    frame++;
    ps.forEach((p) => {
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.vx *= 0.98; p.life -= 0.014;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.col;
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
      ctx.restore();
    });
    ps = ps.filter((p) => p.life > 0);
    if (ps.length && frame < 160) requestAnimationFrame(run);
    else cvs.remove();
  })();
}

export function Predictor() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [picked, setPicked] = useState<Contender | null>(null);
  const contenders = WC_DATA.twentySix.contenders;
  const maxPct = Math.max(...contenders.map((c) => c.pct));

  // Reveal the probability bars (staggered) when the grid scrolls into view.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            grid.querySelectorAll(".pred-chip").forEach((ch, i) =>
              setTimeout(() => ch.classList.add("show"), i * 60),
            );
            obs.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    obs.observe(grid);
    return () => obs.disconnect();
  }, []);

  function choose(c: Contender, e: React.MouseEvent<HTMLButtonElement>) {
    setPicked(c);
    miniConfetti(e.currentTarget);
  }

  return (
    <>
      <div className="predictor-head">
        <div className="kicker">Pick your winner</div>
        <p className="predictor-sub">
          Tap a contender to lock your prediction. Bars show illustrative
          pre-tournament win probability.
        </p>
      </div>
      <div className="predictor-grid" ref={gridRef}>
        {contenders.map((c) => (
          <button
            key={c.code}
            className={`pred-chip${picked?.code === c.code ? " selected" : ""}`}
            style={{ "--pct": (c.pct / maxPct) * 100 + "%" } as CSSProperties}
            onClick={(e) => choose(c, e)}
          >
            <span className="pc-code">{c.code}</span>
            <span className="pc-name">{c.name}</span>
            <span className="pc-pct">{c.pct}% implied</span>
            <span className="pc-bar" style={{ background: c.color }} />
          </button>
        ))}
      </div>
      <div className="predictor-result" hidden={!picked}>
        {picked && (
          <div className="pr-card">
            <span className="pr-k mono">YOUR 2026 CHAMPION</span>
            <span className="pr-name display">{picked.name.toUpperCase()}</span>
            <span className="pr-meta mono">
              {picked.code} · {picked.pct}% implied win probability · your call to glory
            </span>
            <button className="pr-reset mono" onClick={() => setPicked(null)}>
              ↻ Pick again
            </button>
          </div>
        )}
      </div>
    </>
  );
}
