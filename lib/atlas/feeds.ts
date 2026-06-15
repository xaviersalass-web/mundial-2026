/* ============================================================================
   WORLD CUP ATLAS — FEED PARSING (server-only)
   Dependency-light RSS + YouTube-Atom parsing into normalized items. No DB, no
   paid keys. Every item links back to its source (news article / YouTube video).
   ========================================================================== */

import { XMLParser } from "fast-xml-parser";

export interface NewsItem {
  title: string;
  link: string;
  source: string;
  date: string | null; // ISO when parseable
  image: string | null;
}

export interface VideoItem {
  title: string;
  videoId: string;
  link: string;
  thumbnail: string;
  published: string | null;
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  removeNSPrefix: true, // media:content -> content, yt:videoId -> videoId
  trimValues: true,
});

const UA =
  "Mozilla/5.0 (compatible; WorldCupAtlas/1.0; +https://github.com/xaviersalass-web/mundial-2026)";

async function fetchXml(
  url: string,
  revalidate: number,
  tag: string,
): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/rss+xml, application/xml, text/xml, */*" },
    next: { revalidate, tags: [tag] },
  });
  if (!res.ok) throw new Error(`feed ${res.status} for ${url}`);
  return res.text();
}

function toArray<T>(x: T | T[] | undefined | null): T[] {
  if (x == null) return [];
  return Array.isArray(x) ? x : [x];
}

function text(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "object" && "#text" in (v as Record<string, unknown>)) {
    return String((v as Record<string, unknown>)["#text"]).trim();
  }
  return String(v).trim();
}

function toIso(d: string): string | null {
  if (!d) return null;
  const t = Date.parse(d);
  return Number.isNaN(t) ? null : new Date(t).toISOString();
}

function firstUrl(...candidates: unknown[]): string | null {
  for (const c of candidates) {
    if (typeof c === "string" && c.startsWith("http")) return c;
  }
  return null;
}

function extractImage(item: Record<string, unknown>): string | null {
  // enclosure (@_url, @_type=image/*)
  const enc = toArray(item.enclosure as Record<string, unknown>[])[0] as
    | Record<string, unknown>
    | undefined;
  // media:content / media:thumbnail (NS stripped -> content / thumbnail)
  const mc = toArray(item.content as Record<string, unknown>[])[0] as
    | Record<string, unknown>
    | undefined;
  const mt = toArray(item.thumbnail as Record<string, unknown>[])[0] as
    | Record<string, unknown>
    | undefined;
  const group = item.group as Record<string, unknown> | undefined;
  const gThumb = group
    ? (toArray(group.thumbnail as Record<string, unknown>[])[0] as
        | Record<string, unknown>
        | undefined)
    : undefined;
  const fromUrl = firstUrl(
    enc?.["@_url"],
    mc?.["@_url"],
    mt?.["@_url"],
    gThumb?.["@_url"],
  );
  if (fromUrl) return fromUrl;
  // last resort: first <img src> in description/content:encoded
  const html = text(item.description) || text(item.encoded);
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

function linkFrom(item: Record<string, unknown>): string {
  const l = item.link;
  if (typeof l === "string") return l;
  // Atom: link can be object/array with @_href (rel="alternate")
  const arr = toArray(l as Record<string, unknown>[]);
  const alt =
    arr.find((x) => (x as Record<string, unknown>)?.["@_rel"] === "alternate") ??
    arr[0];
  return text((alt as Record<string, unknown>)?.["@_href"]) || text(l);
}

/** Parse an RSS 2.0 or Atom feed into NewsItems. */
export function parseNews(xml: string, source: string): NewsItem[] {
  const doc = parser.parse(xml) as Record<string, unknown>;
  const rss = doc.rss as Record<string, unknown> | undefined;
  const channel = rss?.channel as Record<string, unknown> | undefined;
  const feed = doc.feed as Record<string, unknown> | undefined;

  const rawItems = channel
    ? toArray(channel.item as Record<string, unknown>[])
    : toArray((feed?.entry as Record<string, unknown>[]) ?? []);

  return rawItems
    .map((it) => {
      const item = it as Record<string, unknown>;
      const dateStr = text(item.pubDate) || text(item.published) || text(item.updated);
      return {
        title: text(item.title),
        link: linkFrom(item),
        source,
        date: toIso(dateStr),
        image: extractImage(item),
      };
    })
    .filter((n) => n.title && n.link);
}

/** Parse a YouTube channel Atom feed into VideoItems. */
export function parseYouTube(xml: string): VideoItem[] {
  const doc = parser.parse(xml) as Record<string, unknown>;
  const feed = doc.feed as Record<string, unknown> | undefined;
  const entries = toArray((feed?.entry as Record<string, unknown>[]) ?? []);
  return entries
    .map((e) => {
      const entry = e as Record<string, unknown>;
      const videoId = text(entry.videoId);
      const group = entry.group as Record<string, unknown> | undefined;
      const thumb = group
        ? (toArray(group.thumbnail as Record<string, unknown>[])[0] as
            | Record<string, unknown>
            | undefined)
        : undefined;
      const thumbnail =
        firstUrl(thumb?.["@_url"]) ||
        (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : "");
      return {
        title: text(entry.title),
        videoId,
        link: videoId
          ? `https://www.youtube.com/watch?v=${videoId}`
          : linkFrom(entry),
        thumbnail,
        published: toIso(text(entry.published) || text(entry.updated)),
      };
    })
    .filter((v) => v.title && v.videoId);
}

/** Fetch + parse one news feed (server-side, cached). */
export async function fetchNewsFeed(
  url: string,
  source: string,
  revalidate = 900,
): Promise<NewsItem[]> {
  const xml = await fetchXml(url, revalidate, `news:${source}`);
  return parseNews(xml, source);
}

/** Fetch + parse a YouTube channel feed (server-side, cached). */
export async function fetchYouTubeFeed(
  channelId: string,
  revalidate = 1800,
): Promise<VideoItem[]> {
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const xml = await fetchXml(url, revalidate, `videos:${channelId}`);
  return parseYouTube(xml);
}

/** Heuristic: does an item look World-Cup-relevant? */
export function isWorldCupRelevant(title: string): boolean {
  return /world cup|fifa|mundial|wc 2026|wc2026|copa del mundo/i.test(title);
}
