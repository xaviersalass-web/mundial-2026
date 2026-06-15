"use client";

import { useEffect, useRef } from "react";

/** Animated count-up used in the hero stats (ticks 0 → target with easeOutCubic). */
export function Counter({ target, className }: { target: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const elm = ref.current;
    if (!elm) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elm.textContent = target.toLocaleString();
      return;
    }
    const dur = 1600;
    let start: number | null = null;
    let raf = 0;
    function step(now: number) {
      if (start === null) start = now;
      const t = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - t, 3);
      elm!.textContent = Math.round(target * e).toLocaleString();
      if (t < 1) raf = requestAnimationFrame(step);
      else elm!.textContent = target.toLocaleString();
    }
    const timer = setTimeout(() => {
      raf = requestAnimationFrame(step);
    }, 700);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [target]);

  return (
    <span className={className} ref={ref}>
      0
    </span>
  );
}
