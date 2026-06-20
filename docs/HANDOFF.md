# World Cup Atlas — Handoff

_Última actualización: 2026-06-20 · rama `main` @ `6abd5c1` (limpia, sincronizada con origin)_

Documento para retomar el trabajo sin contexto previo. Léelo de arriba a abajo.

---

## 1. Qué es

**World Cup Atlas** — página web del Mundial 2026: un *scrollytelling* premium de analítica
histórica (1930→2026) + un **hub de contenido en vivo** (noticias, videos, X, fotos).
Implementado desde un handoff de **Claude Design**.

| | |
|---|---|
| **Repo** | https://github.com/xaviersalass-web/mundial-2026 (PÚBLICO) |
| **Local** | `~/code/mundial-2026` |
| **Producción** | https://mundial-2026-rust-ten.vercel.app |
| **Vercel** | proyecto `mundial-2026`, cuenta `xaviersalass-web`, región `iad1` |
| **Deploy** | GitHub↔Vercel conectado → **push a `main` = auto-deploy** |
| **Stack** | Next.js 16 (App Router, Turbopack) · React 19 · TS · Tailwind4 (no usado en Atlas) · SWR · fast-xml-parser |
| **Base de datos** | NINGUNA (a propósito) |

---

## 2. Estado actual (todo hecho y en producción)

- ✅ **Atlas histórico** pixel-faithful: hero animado (confetti + contadores), 6 gráficas
  SVG hechas a mano que se dibujan al scroll (dynasties, scorers, goals/match, attendance,
  shootouts) con tooltips + toggles, predictor "pick your winner", galerías, footer.
- ✅ **Hub en vivo** (verificado `live:true` en prod):
  - **News** (`#news`) — 5 RSS gratis merge + ranking World-Cup-first + cache + fallback.
  - **Watch** (`#watch`) — RSS oficial del canal FIFA (videos reales del torneo).
  - **X** (`#social`) — timeline embed `@FIFAWorldCup` + tarjetas a cuentas verificadas.
  - **Image credits** (`#credits`) — atribución CC (obligatoria por licencia).
- ✅ **12 fotos con licencia** (Wikimedia Commons + Unsplash) en `public/photos/`,
  cableadas a las 8 sedes + 4 tiles de Moments.
- ✅ Build verde, `tsc` limpio, fonts (Anton/Archivo/JetBrains Mono) self-hosted vía next/font.

---

## 3. Mapa de archivos

```
app/
  layout.tsx              # importa los 5 CSS del Atlas + next/font
  page.tsx                # ensambla TODAS las secciones (server component)
  atlas/css/              # styles, charts, sections, gallery, live  (CSS verbatim del diseño + live)
  api/
    news/route.ts         # merge de 5 feeds RSS  → NewsItem[]
    videos/route.ts       # RSS canal FIFA        → VideoItem[]
    live|standings|scorers|teams|matches/[id]|fixtures|competition/route.ts
                          # capa football-data.org (proxy, demo si no hay token)
lib/
  atlas/
    data.ts               # WC_DATA curado (histórico) — fuente de las gráficas
    charts.ts             # 5 builders SVG (draw-in + tooltips). SOLO corre client (useEffect)
    feeds.ts              # parser RSS/Atom (fast-xml-parser) + fetch helpers (UA browser-like)
    photos.ts             # mapa key→/photos/x.jpg + licencia + atribución
    fallback.ts           # snapshot noticias/videos + cuentas X (respaldo)
  footballData.ts, api/respond.ts, hooks/useApi.ts, i18n/*  # capa live 2026 (no usada por la home aún)
components/atlas/
  Hero, Confetti, Counter, Progress, Reveal, ChartMount, ChartSections,
  Predictor, PhotoSlot, NewsSection, VideoSection, SocialSection, PhotoCredits
public/photos/            # 12 imágenes descargadas (8MB)
```

---

## 4. Fuentes de datos + GOTCHAS (clave para no tropezar)

- **News RSS** (server-side, `lib/atlas/feeds.ts` pone User-Agent browser-like — OBLIGATORIO,
  el Guardian bloquea sin UA): BBC World Cup, Guardian football, BBC football, Marca (ES),
  Sky Sports. Cache 600s. Si todos fallan → `FALLBACK_NEWS`.
- **Videos**: canal FIFA **`UCpcTrCXblq78GZrTUTLWeBw`** ÚNICAMENTE (hay canales impostores).
  RSS `youtube.com/feeds/videos.xml?channel_id=...`. Cache 1800s.
- **Fotos / Wikimedia**: `upload.wikimedia.org` **HARD-BLOQUEA esta IP con HTTP 429**.
  Para descargar más se usó el proxy **`images.weserv.nl/?url=<URL sin https, encodeURIComponent>&w=2000&output=jpg`**
  (gratis; throttlea por IP → cooldown + reintentos). Las URLs correctas se resuelven con la
  **Commons API** `commons.wikimedia.org/w/api.php?action=query&generator=search&prop=imageinfo`
  (esa SÍ responde). Script de referencia: `/tmp/fetch3.mjs` (efímero). Las imágenes ya están
  descargadas en el repo, así que en runtime NO se toca Wikimedia.
- **X / tweets**: NO hay forma gratis de "trending tweets". Se usa el widget de timeline
  (`platform.twitter.com/widgets.js`) — único live gratis, poco fiable (a veces blanco, cookies);
  las tarjetas de cuentas son el respaldo confiable. `react-tweet` necesita IDs curados (no usado).
- **Licencias CC**: las imágenes CC BY / CC BY-SA EXIGEN crédito visible → sección `Image credits`.
  No quitar.
- **football-data.org token**: el Atlas NO lo necesita (es histórico). Las rutas `/api/live` etc.
  corren en modo demo sin él. El token real está SOLO en `.env.local` (gitignored), NO en Vercel.
  Para activar la capa live 2026, añadir `FOOTBALL_DATA_TOKEN` (encriptado) en Vercel.

---

## 5. Correr / construir / desplegar

```bash
cd ~/code/mundial-2026
pnpm install
pnpm dev                 # http://localhost:3000
pnpm build               # build de producción (debe quedar verde)
pnpm exec tsc --noEmit   # typecheck

# Desplegar = push a main (auto-deploy vía GitHub↔Vercel):
git push origin main
# o forzar: vercel --prod --yes
```

Reglas Next 16 a recordar: route handlers NO se cachean por defecto → cada uno exporta
`runtime="nodejs"` + `fetchCache="default-cache"` + header `Cache-Control`. `params` es Promise.
`resolveColor()`/`getComputedStyle` NO pueden correr en render (rompe SSR) — solo en client/useEffect.

---

## 6. Pendientes / próximos pasos (en orden sugerido)

1. **Sección "2026 en vivo"** — partidos de hoy + grupos + goleadores REALES dentro del Atlas,
   usando la capa `lib/footballData.ts` (ya construida) + `useApi.ts` hooks. Requiere poner
   `FOOTBALL_DATA_TOKEN` en Vercel. Cierra el pedido original de "datos en vivo".
2. **Bilingüe ES/EN** — el Atlas vino en inglés. La infra i18n existe (`lib/i18n/*`); falta
   traducir el copy editorial + un LanguageSwitch global.
3. **Tweets curados premium** con `react-tweet` (look estático fino) — pedir al user 5-8 links
   de tweets; extraer IDs; render server-side con cache + skeleton fallback.
4. **Más fotos** (una por cada una de las 16 sedes; retratos de goleadores quedaron en placeholder
   por copyright — buscar CC en Commons) y/o **dominio propio** (hoy es URL `.vercel.app`).
5. **Refresh editorial del snapshot** (`lib/atlas/fallback.ts`) cada cierto tiempo.

---

## 7. Decisión de fondo (no re-litigar)

NO se rehospeda contenido con copyright (FIFA/Getty/agencias) — es infracción y esas URLs se caen.
El enfoque es: **media con licencia libre + embeds oficiales + link a la fuente**. Eso logra el
look premium y es sostenible. Mantener esta línea.

---

## 8. Memoria / reportes relacionados

- Memoria del proyecto: `~/.claude/projects/-Users-xaviersalas/memory/project_mundial_2026_page.md`
  (estado detallado, decisiones, gotchas).
- Bundle del diseño extraído (efímero): `/tmp/wc-atlas/worldcup-2026/`.
- Workflows de research ejecutados: `mundial-2026-research`, `wc-atlas-content-sources`.
