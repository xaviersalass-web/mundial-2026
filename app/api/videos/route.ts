import { fetchYouTubeFeed, type VideoItem } from "@/lib/atlas/feeds";
import { FALLBACK_VIDEOS } from "@/lib/atlas/fallback";

export const runtime = "nodejs";
export const fetchCache = "default-cache";

// Official FIFA channel ONLY (UCpcTrCXblq78GZrTUTLWeBw). There are impostor channels.
const FIFA_CHANNEL = "UCpcTrCXblq78GZrTUTLWeBw";

export async function GET() {
  let items: VideoItem[] = [];
  try {
    items = await fetchYouTubeFeed(FIFA_CHANNEL, 1800);
  } catch {
    items = [];
  }

  // Prefer World Cup 2026 uploads when present.
  const wc = items.filter((v) => /world cup|2026|mundial/i.test(v.title));
  const chosen = wc.length >= 6 ? wc : items;

  const live = chosen.length > 0;
  const out = (live ? chosen : FALLBACK_VIDEOS).slice(0, 8);

  return Response.json(
    { items: out, live, updatedAt: new Date().toISOString() },
    {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    },
  );
}
