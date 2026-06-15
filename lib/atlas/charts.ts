/* ============================================================================
   WORLD CUP ATLAS — CHART ENGINE (ported from charts.js)
   Hand-built responsive SVG. Each builder renders the chart collapsed and
   returns a play() function that triggers the draw-in animation when the
   section scrolls into view. Hover tooltips throughout.
   ========================================================================== */
"use client";

import { WC_DATA } from "@/lib/atlas/data";

const SVGNS = "http://www.w3.org/2000/svg";
const D = WC_DATA;

type Attrs = Record<string, string | number>;
type PlayFn = () => void;

// ---- shared tooltip --------------------------------------------------------
let tip: HTMLDivElement | null = null;
function ensureTip(): HTMLDivElement {
  if (!tip) {
    tip = document.createElement("div");
    tip.className = "wc-tip";
    document.body.appendChild(tip);
  }
  return tip;
}
export function showTip(html: string, x: number, y: number) {
  const t = ensureTip();
  t.innerHTML = html;
  t.classList.add("show");
  const pad = 14;
  let left = x + pad,
    top = y + pad;
  const r = t.getBoundingClientRect();
  if (left + r.width > window.innerWidth - 8) left = x - r.width - pad;
  if (top + r.height > window.innerHeight - 8) top = y - r.height - pad;
  t.style.left = left + "px";
  t.style.top = top + "px";
}
export function hideTip() {
  if (tip) tip.classList.remove("show");
}

function el(tag: string, attrs: Attrs): SVGElement {
  const e = document.createElementNS(SVGNS, tag) as SVGElement;
  for (const k in attrs) e.setAttribute(k, String(attrs[k]));
  return e;
}

export function resolveColor(c: string): string {
  if (c && c.startsWith("var(")) {
    const name = c.slice(4, -1).trim();
    return (
      getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
      "#161410"
    );
  }
  return c;
}

// ===========================================================================
// 1. TITLES — horizontal bar race (wins), with finals as ghost bars
// ===========================================================================
export function titles(node: HTMLElement, mode: string = "wins"): PlayFn {
  node.innerHTML = "";
  const data = D.titles
    .slice()
    .sort((a, b) =>
      mode === "wins"
        ? b.wins - a.wins || b.finals - a.finals
        : b.finals - a.finals || b.wins - a.wins,
    );
  const max = Math.max(...data.map((d) => Math.max(d.wins, d.finals)));
  const W = 800,
    rowH = 56,
    gap = 16,
    padL = 132,
    padR = 56;
  const H = data.length * (rowH + gap);
  const svg = el("svg", {
    viewBox: `0 0 ${W} ${H}`,
    class: "chart-svg",
    preserveAspectRatio: "xMidYMid meet",
  });
  svg.setAttribute("width", "100%");
  const plotW = W - padL - padR;

  data.forEach((d, i) => {
    const y = i * (rowH + gap);
    const val = mode === "wins" ? d.wins : d.finals;
    const ghostVal = mode === "wins" ? d.finals : d.wins;
    const col = resolveColor(d.color);

    const lbl = el("text", {
      x: padL - 16,
      y: y + rowH / 2 + 1,
      "text-anchor": "end",
      class: "bar-label",
    });
    lbl.textContent = d.name;
    svg.appendChild(lbl);
    const code = el("text", {
      x: 0,
      y: y + rowH / 2 + 1,
      "text-anchor": "start",
      class: "bar-code",
    });
    code.textContent = d.code;
    svg.appendChild(code);

    const gw = (ghostVal / max) * plotW;
    const ghost = el("rect", {
      x: padL,
      y: y + 6,
      width: gw,
      height: rowH - 12,
      rx: 5,
      class: "bar-ghost",
      fill: col,
    });
    ghost.style.setProperty("--w", gw + "px");
    svg.appendChild(ghost);

    const bw = (val / max) * plotW;
    const g = el("g", { class: "bar-grp" });
    const bar = el("rect", {
      x: padL,
      y: y,
      width: bw,
      height: rowH,
      rx: 7,
      fill: col,
      class: "bar-main",
    });
    bar.style.transitionDelay = i * 70 + "ms";
    g.appendChild(bar);

    const vt = el("text", {
      x: padL + bw - 14,
      y: y + rowH / 2 + 1,
      "text-anchor": "end",
      class: "bar-val",
    });
    vt.textContent = String(val);
    vt.style.transitionDelay = i * 70 + 250 + "ms";
    g.appendChild(vt);
    svg.appendChild(g);

    const hit = el("rect", {
      x: 0,
      y: y - gap / 2,
      width: W,
      height: rowH + gap,
      fill: "transparent",
    });
    hit.style.cursor = "pointer";
    hit.addEventListener("mousemove", (e) =>
      showTip(
        `<span class="t-k">${d.name}</span><span class="t-v"><b>${d.wins}</b> titles · <b>${d.finals}</b> finals</span>`,
        (e as MouseEvent).clientX,
        (e as MouseEvent).clientY,
      ),
    );
    hit.addEventListener("mouseleave", hideTip);
    svg.appendChild(hit);
  });

  node.appendChild(svg);
  return () => svg.classList.add("drawn");
}

// ===========================================================================
// 2. SCORERS — lollipop ranking
// ===========================================================================
export function scorers(node: HTMLElement): PlayFn {
  node.innerHTML = "";
  const data = D.scorers;
  const max = Math.max(...data.map((d) => d.goals));
  const W = 800,
    rowH = 52,
    padL = 188,
    padR = 40,
    padT = 8;
  const H = data.length * rowH + padT;
  const svg = el("svg", {
    viewBox: `0 0 ${W} ${H}`,
    class: "chart-svg",
    preserveAspectRatio: "xMidYMid meet",
  });
  svg.setAttribute("width", "100%");
  const plotW = W - padL - padR;
  const palette = [
    "var(--c-green)",
    "var(--c-gold)",
    "var(--c-ink)",
    "var(--c-blue)",
    "var(--c-sky)",
    "var(--c-green)",
    "var(--c-blue)",
    "var(--c-magenta)",
  ];

  data.forEach((d, i) => {
    const y = padT + i * rowH + rowH / 2;
    const col = resolveColor(palette[i % palette.length]);
    const cx = padL + (d.goals / max) * plotW;

    const rank = el("text", {
      x: 26,
      y: y + 1,
      "text-anchor": "middle",
      class: "lol-rank",
    });
    rank.textContent = String(i + 1);
    svg.appendChild(rank);
    const nm = el("text", {
      x: 48,
      y: y - 5,
      "text-anchor": "start",
      class: "lol-name",
    });
    nm.textContent = d.name;
    svg.appendChild(nm);
    const sub = el("text", {
      x: 48,
      y: y + 13,
      "text-anchor": "start",
      class: "lol-sub",
    });
    sub.textContent = `${d.country} · ${d.span}`;
    svg.appendChild(sub);

    const line = el("line", {
      x1: padL,
      y1: y,
      x2: cx,
      y2: y,
      class: "lol-line",
      stroke: col,
    });
    line.style.setProperty("--x2", String(cx));
    line.style.transitionDelay = i * 60 + "ms";
    svg.appendChild(line);
    const dot = el("circle", { cx: cx, cy: y, r: 15, fill: col, class: "lol-dot" });
    dot.style.transformOrigin = `${cx}px ${y}px`;
    dot.style.transitionDelay = i * 60 + 200 + "ms";
    svg.appendChild(dot);
    const gv = el("text", {
      x: cx,
      y: y + 1,
      "text-anchor": "middle",
      class: "lol-goals",
    });
    gv.textContent = String(d.goals);
    gv.style.transitionDelay = i * 60 + 320 + "ms";
    svg.appendChild(gv);

    const hit = el("rect", {
      x: 0,
      y: y - rowH / 2,
      width: W,
      height: rowH,
      fill: "transparent",
    });
    hit.style.cursor = "pointer";
    hit.addEventListener("mousemove", (e) =>
      showTip(
        `<span class="t-k">${d.country} · ${d.span}</span><span class="t-v"><b>${d.goals}</b> goals in <b>${d.apps}</b> apps · ${(d.goals / d.apps).toFixed(2)} per game</span>`,
        (e as MouseEvent).clientX,
        (e as MouseEvent).clientY,
      ),
    );
    hit.addEventListener("mouseleave", hideTip);
    svg.appendChild(hit);
  });
  node.appendChild(svg);
  return () => svg.classList.add("drawn");
}

// ===========================================================================
// 3. GOALS PER MATCH — line + area over time
// ===========================================================================
export function goalsPerMatch(node: HTMLElement): PlayFn {
  node.innerHTML = "";
  const data = D.goalsPerMatch;
  const W = 900,
    H = 420,
    padL = 48,
    padR = 24,
    padT = 28,
    padB = 46;
  const svg = el("svg", {
    viewBox: `0 0 ${W} ${H}`,
    class: "chart-svg",
    preserveAspectRatio: "xMidYMid meet",
  });
  svg.setAttribute("width", "100%");
  const plotW = W - padL - padR,
    plotH = H - padT - padB;
  const yMax = 6,
    yMin = 2;
  const xs = data.map((d, i) => padL + (i / (data.length - 1)) * plotW);
  const ys = data.map((d) => padT + (1 - (d.gpm - yMin) / (yMax - yMin)) * plotH);

  for (let g = 2; g <= 6; g++) {
    const gy = padT + (1 - (g - yMin) / (yMax - yMin)) * plotH;
    svg.appendChild(
      el("line", { x1: padL, y1: gy, x2: W - padR, y2: gy, class: "grid-line" }),
    );
    const gl = el("text", {
      x: padL - 10,
      y: gy + 4,
      "text-anchor": "end",
      class: "axis-label",
    });
    gl.textContent = g.toFixed(1);
    svg.appendChild(gl);
  }
  data.forEach((d, i) => {
    if (i % 3 === 0 || i === data.length - 1) {
      const t = el("text", {
        x: xs[i],
        y: H - padB + 22,
        "text-anchor": "middle",
        class: "axis-label",
      });
      t.textContent = String(d.year);
      svg.appendChild(t);
    }
  });

  const linePts = xs.map((x, i) => `${x},${ys[i]}`).join(" ");
  const areaPts =
    `${padL},${padT + plotH} ` + linePts + ` ${W - padR},${padT + plotH}`;
  const area = el("polygon", { points: areaPts, class: "gpm-area" });
  svg.appendChild(area);
  const line = el("polyline", { points: linePts, class: "gpm-line" });
  line.style.setProperty("--len", "2800");
  svg.appendChild(line);

  function annotate(idx: number, label: string, dy: number) {
    const ax = xs[idx],
      ay = ys[idx];
    const a = el("text", {
      x: ax,
      y: ay + dy,
      "text-anchor": "middle",
      class: "gpm-annot",
    });
    a.textContent = label;
    svg.appendChild(a);
  }
  annotate(4, "5.38 — 1954 peak", -16);
  annotate(13, "2.21 — 1990 low", 26);

  data.forEach((d, i) => {
    const dot = el("circle", { cx: xs[i], cy: ys[i], r: 4.5, class: "gpm-dot" });
    dot.style.transitionDelay = 700 + i * 30 + "ms";
    svg.appendChild(dot);
    const hit = el("circle", { cx: xs[i], cy: ys[i], r: 16, fill: "transparent" });
    hit.style.cursor = "pointer";
    hit.addEventListener("mousemove", (e) =>
      showTip(
        `<span class="t-k">${d.year} · ${d.host}</span><span class="t-v"><b>${d.gpm.toFixed(2)}</b> goals / match</span>`,
        (e as MouseEvent).clientX,
        (e as MouseEvent).clientY,
      ),
    );
    hit.addEventListener("mouseleave", hideTip);
    svg.appendChild(hit);
  });
  node.appendChild(svg);
  return () => svg.classList.add("drawn");
}

// ===========================================================================
// 4. ATTENDANCE — total bars + avg, 2026 projected
// ===========================================================================
export function attendance(node: HTMLElement, mode: string = "total"): PlayFn {
  node.innerHTML = "";
  const data = D.attendance;
  const W = 900,
    H = 420,
    padL = 54,
    padR = 24,
    padT = 28,
    padB = 60;
  const svg = el("svg", {
    viewBox: `0 0 ${W} ${H}`,
    class: "chart-svg",
    preserveAspectRatio: "xMidYMid meet",
  });
  svg.setAttribute("width", "100%");
  const plotW = W - padL - padR,
    plotH = H - padT - padB;
  const key = mode === "total" ? "totalK" : "avgK";
  const max = Math.max(...data.map((d) => d[key as "totalK" | "avgK"])) * 1.1;
  const bw = (plotW / data.length) * 0.62;
  const step = plotW / data.length;

  [0, 0.5, 1].forEach((f) => {
    const gy = padT + (1 - f) * plotH;
    svg.appendChild(
      el("line", { x1: padL, y1: gy, x2: W - padR, y2: gy, class: "grid-line" }),
    );
    const gl = el("text", {
      x: padL - 10,
      y: gy + 4,
      "text-anchor": "end",
      class: "axis-label",
    });
    gl.textContent =
      mode === "total"
        ? Math.round(((max * f) / 1000) * 10) / 10 + "M"
        : Math.round(max * f) + "k";
    svg.appendChild(gl);
  });

  data.forEach((d, i) => {
    const x = padL + i * step + (step - bw) / 2;
    const h = (d[key as "totalK" | "avgK"] / max) * plotH;
    const y = padT + plotH - h;
    const col = d.projected ? "var(--c-magenta)" : "var(--c-blue)";
    const bar = el("rect", {
      x,
      y,
      width: bw,
      height: h,
      rx: 5,
      fill: resolveColor(col),
      class: "att-bar" + (d.projected ? " proj" : ""),
    });
    bar.style.transformOrigin = `${x}px ${padT + plotH}px`;
    bar.style.transitionDelay = i * 55 + "ms";
    svg.appendChild(bar);

    const t = el("text", {
      x: x + bw / 2,
      y: H - padB + 20,
      "text-anchor": "middle",
      class: "axis-label",
    });
    t.textContent = "'" + String(d.year).slice(2);
    svg.appendChild(t);
    const tm = el("text", {
      x: x + bw / 2,
      y: H - padB + 36,
      "text-anchor": "middle",
      class: "att-teams",
    });
    tm.textContent = String(d.teams);
    svg.appendChild(tm);

    const hit = el("rect", {
      x: padL + i * step,
      y: padT,
      width: step,
      height: plotH + 10,
      fill: "transparent",
    });
    hit.style.cursor = "pointer";
    hit.addEventListener("mousemove", (e) =>
      showTip(
        `<span class="t-k">${d.year}${d.projected ? " · projected" : ""}</span><span class="t-v"><b>${(d.totalK / 1000).toFixed(2)}M</b> total · ${d.avgK}k avg · <b>${d.teams}</b> teams</span>`,
        (e as MouseEvent).clientX,
        (e as MouseEvent).clientY,
      ),
    );
    hit.addEventListener("mouseleave", hideTip);
    svg.appendChild(hit);
  });
  node.appendChild(svg);
  return () => svg.classList.add("drawn");
}

// ===========================================================================
// 5. SHOOTOUTS — diverging won / lost
// ===========================================================================
export function shootouts(node: HTMLElement): PlayFn {
  node.innerHTML = "";
  const data = D.shootouts.teams
    .slice()
    .sort((a, b) => b.won - b.lost - (a.won - a.lost));
  const W = 800,
    rowH = 46,
    gap = 12,
    padL = 120,
    padR = 40,
    padT = 8;
  const mid = padL + (W - padL - padR) / 2;
  const maxSide = 5;
  const unit = (W - padL - padR) / 2 / maxSide;
  const H = data.length * (rowH + gap) + padT;
  const svg = el("svg", {
    viewBox: `0 0 ${W} ${H}`,
    class: "chart-svg",
    preserveAspectRatio: "xMidYMid meet",
  });
  svg.setAttribute("width", "100%");

  svg.appendChild(
    el("line", { x1: mid, y1: 0, x2: mid, y2: H - 18, class: "div-axis" }),
  );
  const wl = el("text", {
    x: mid + 8,
    y: H - 4,
    "text-anchor": "start",
    class: "axis-label",
  });
  wl.textContent = "WON →";
  svg.appendChild(wl);
  const ll = el("text", {
    x: mid - 8,
    y: H - 4,
    "text-anchor": "end",
    class: "axis-label",
  });
  ll.textContent = "← LOST";
  svg.appendChild(ll);

  data.forEach((d, i) => {
    const y = padT + i * (rowH + gap);
    const lbl = el("text", {
      x: padL - 14,
      y: y + rowH / 2 + 1,
      "text-anchor": "end",
      class: "bar-label sm",
    });
    lbl.textContent = d.name;
    svg.appendChild(lbl);

    const wW = d.won * unit,
      lW = d.lost * unit;
    const wb = el("rect", {
      x: mid,
      y: y + 5,
      width: wW,
      height: rowH - 10,
      rx: 5,
      fill: resolveColor("var(--c-green)"),
      class: "so-bar so-won",
    });
    wb.style.setProperty("--w", wW + "px");
    wb.style.transitionDelay = i * 55 + "ms";
    svg.appendChild(wb);
    const lb = el("rect", {
      x: mid - lW,
      y: y + 5,
      width: lW,
      height: rowH - 10,
      rx: 5,
      fill: resolveColor("var(--c-red)"),
      class: "so-bar so-lost",
    });
    lb.style.setProperty("--w", lW + "px");
    lb.style.setProperty("--mid", mid + "px");
    lb.style.transitionDelay = i * 55 + "ms";
    svg.appendChild(lb);

    const wv = el("text", {
      x: mid + wW + 8,
      y: y + rowH / 2 + 1,
      "text-anchor": "start",
      class: "so-val",
    });
    wv.textContent = String(d.won);
    wv.style.transitionDelay = i * 55 + 260 + "ms";
    svg.appendChild(wv);
    const lv = el("text", {
      x: mid - lW - 8,
      y: y + rowH / 2 + 1,
      "text-anchor": "end",
      class: "so-val",
    });
    lv.textContent = String(d.lost);
    lv.style.transitionDelay = i * 55 + 260 + "ms";
    svg.appendChild(lv);

    const hit = el("rect", { x: 0, y: y, width: W, height: rowH, fill: "transparent" });
    hit.style.cursor = "pointer";
    const rate = Math.round((d.won / (d.won + d.lost)) * 100);
    hit.addEventListener("mousemove", (e) =>
      showTip(
        `<span class="t-k">${d.name}</span><span class="t-v"><b>${d.won}</b> won · <b>${d.lost}</b> lost · ${rate}% win rate</span>`,
        (e as MouseEvent).clientX,
        (e as MouseEvent).clientY,
      ),
    );
    hit.addEventListener("mouseleave", hideTip);
    svg.appendChild(hit);
  });
  node.appendChild(svg);
  return () => svg.classList.add("drawn");
}
