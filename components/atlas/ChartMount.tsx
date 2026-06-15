"use client";

import { useEffect, useRef } from "react";

/**
 * Mounts a hand-built SVG chart and triggers its draw-in animation when the
 * chart scrolls into view (threshold 0.28). `build` renders the SVG into the
 * mount node and returns a play() function. Changing `mode` rebuilds + replays
 * (used by the metric/year toggles).
 */
export function ChartMount({
  build,
  mode,
}: {
  build: (node: HTMLElement) => () => void;
  mode?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const buildRef = useRef(build);
  buildRef.current = build;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const play = buildRef.current(node);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            play();
            obs.disconnect();
          }
        });
      },
      { threshold: 0.28 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [mode]);

  return <div className="chart-mount" ref={ref} />;
}
