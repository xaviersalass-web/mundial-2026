"use client";

import { useState } from "react";
import { Reveal } from "@/components/atlas/Reveal";
import { ChartMount } from "@/components/atlas/ChartMount";
import {
  attendance,
  goalsPerMatch,
  scorers,
  shootouts,
  titles,
} from "@/lib/atlas/charts";

// 1 — Dynasties: trophies won ↔ finals reached
export function TitlesChart() {
  const [mode, setMode] = useState<"wins" | "finals">("wins");
  return (
    <Reveal className="chart-frame d1">
      <div className="chart-controls">
        <div className="toggle-group">
          <button
            className={mode === "wins" ? "active" : ""}
            onClick={() => setMode("wins")}
          >
            Trophies won
          </button>
          <button
            className={mode === "finals" ? "active" : ""}
            onClick={() => setMode("finals")}
          >
            Finals reached
          </button>
        </div>
        <div className="legend mono">
          <span className="lg">
            <i className="lg-solid" /> selected metric
          </span>
          <span className="lg">
            <i className="lg-ghost" /> other metric
          </span>
        </div>
      </div>
      <ChartMount build={(node) => titles(node, mode)} mode={mode} />
    </Reveal>
  );
}

// 2 — Built to score: all-time scorers lollipop
export function ScorersChart() {
  return (
    <Reveal className="chart-frame d2">
      <ChartMount build={(node) => scorers(node)} />
    </Reveal>
  );
}

// 3 — Tempo: goals per match line/area
export function TempoChart() {
  return (
    <Reveal className="chart-frame wide d1">
      <ChartMount build={(node) => goalsPerMatch(node)} />
    </Reveal>
  );
}

// 4 — Growth: attendance bars, total ↔ avg
export function GrowthChart() {
  const [mode, setMode] = useState<"total" | "avg">("total");
  return (
    <Reveal className="chart-frame d1">
      <div className="chart-controls">
        <div className="toggle-group">
          <button
            className={mode === "total" ? "active" : ""}
            onClick={() => setMode("total")}
          >
            Total attendance
          </button>
          <button
            className={mode === "avg" ? "active" : ""}
            onClick={() => setMode("avg")}
          >
            Avg per match
          </button>
        </div>
        <div className="legend mono">
          <span className="lg">
            <i className="lg-solid" /> played
          </span>
          <span className="lg">
            <i className="lg-proj" /> 2026 projected
          </span>
        </div>
      </div>
      <ChartMount build={(node) => attendance(node, mode)} mode={mode} />
      <div className="axis-note mono">
        Number below each bar = teams in that tournament
      </div>
    </Reveal>
  );
}

// 5 — Nerve: penalty shootouts diverging
export function NerveChart() {
  return (
    <Reveal className="chart-frame wide d1">
      <ChartMount build={(node) => shootouts(node)} />
    </Reveal>
  );
}
