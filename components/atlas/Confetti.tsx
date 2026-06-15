"use client";

import { useEffect, useRef } from "react";

/** Hero confetti canvas — opening burst in the festive palette + gentle ambient fall. */
export function Confetti() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const colors = ["#1f8f5b", "#5aa9e6", "#e6b422", "#e9622f", "#c8443a", "#c14b8a", "#f4efe4"];
    type P = {
      x: number; y: number; vx: number; vy: number; g: number; s: number;
      rot: number; vr: number; col: string; life: number; shape: string;
    };
    let parts: P[] = [];
    let raf = 0;
    let W = 0, H = 0, burstLeft = 60;

    function size() {
      W = canvas!.width = canvas!.offsetWidth * devicePixelRatio;
      H = canvas!.height = canvas!.offsetHeight * devicePixelRatio;
    }
    size();
    window.addEventListener("resize", size);

    function spawn(n: number, burst: boolean) {
      for (let i = 0; i < n; i++) {
        parts.push({
          x: Math.random() * W,
          y: burst ? H * 0.42 + (Math.random() - 0.5) * 40 * devicePixelRatio : -20 * devicePixelRatio,
          vx: (Math.random() - 0.5) * (burst ? 9 : 2) * devicePixelRatio,
          vy: (burst ? -(Math.random() * 9 + 4) : Math.random() * 1.4 + 0.6) * devicePixelRatio,
          g: 0.12 * devicePixelRatio,
          s: (Math.random() * 6 + 4) * devicePixelRatio,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.2,
          col: colors[(Math.random() * colors.length) | 0],
          life: 1,
          shape: Math.random() > 0.5 ? "rect" : "circ",
        });
      }
    }
    spawn(160, true);

    function tick() {
      ctx!.clearRect(0, 0, W, H);
      if (burstLeft-- <= 0 && parts.length < 90 && Math.random() > 0.7) spawn(2, false);
      parts.forEach((p) => {
        p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.vx *= 0.99;
        if (p.y > H * 0.55) p.life -= 0.012;
        ctx!.save();
        ctx!.globalAlpha = Math.max(0, Math.min(1, p.life));
        ctx!.translate(p.x, p.y);
        ctx!.rotate(p.rot);
        ctx!.fillStyle = p.col;
        if (p.shape === "rect") ctx!.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
        else { ctx!.beginPath(); ctx!.arc(0, 0, p.s / 2, 0, 7); ctx!.fill(); }
        ctx!.restore();
      });
      parts = parts.filter((p) => p.life > 0 && p.y < H + 40);
      raf = requestAnimationFrame(tick);
    }
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
    };
  }, []);

  return <canvas className="hero-confetti" ref={ref} />;
}
