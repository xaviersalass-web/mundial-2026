import { fetchNewsFeed, isWorldCupRelevant, type NewsItem } from "@/lib/atlas/feeds";
import { FALLBACK_NEWS } from "@/lib/atlas/fallback";

export const runtime = "nodejs";
export const fetchCache = "default-cache";

// Verified free RSS feeds (server-side only; a browser-like UA is set in feeds.ts).
const FEEDS = [
  { url: "https://feeds.bbci.co.uk/sport/football/world-cup/rss.xml", source: "BBC Sport" },
  { url: "https://www.theguardian.com/football/rss", source: "The Guardian" },
  { url: "https://feeds.bbci.co.uk/sport/football/rss.xml", source: "BBC Sport" },
  { url: "https://e00-marca.uecdn.es/rss/futbol/mundial.xml", source: "Marca" },
  { url: "https://www.skysports.com/rss/0,20514,11661,00.xml", source: "Sky Sports" },
];

export async function GET() {
  const results = await Promise.allSettled(
    FEEDS.map((f) => fetchNewsFeed(f.url, f.source, 600)),
  );

  let items: NewsItem[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") items.push(...r.value);
  }

  // Dedupe by link, then rank World-Cup-relevant first, newest first.
  const seen = new Set<string>();
  items = items.filter((n) => {
    if (seen.has(n.link)) return false;
    seen.add(n.link);
    return true;
  });
  items.sort((a, b) => {
    const ra = isWorldCupRelevant(a.title) ? 1 : 0;
    const rb = isWorldCupRelevant(b.title) ? 1 : 0;
    if (ra !== rb) return rb - ra;
    return (Date.parse(b.date ?? "") || 0) - (Date.parse(a.date ?? "") || 0);
  });

  // If we have enough World-Cup-specific items, keep the section focused.
  const wc = items.filter((n) => isWorldCupRelevant(n.title));
  const chosen = wc.length >= 8 ? wc : items;

  const live = chosen.length > 0;
  const out = (live ? chosen : FALLBACK_NEWS).slice(0, 12);

  return Response.json(
    { items: out, live, updatedAt: new Date().toISOString() },
    {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1800",
      },
    },
  );
}
