/* ============================================================================
   WORLD CUP ATLAS — STATIC FALLBACK CONTENT
   Curated snapshot (mid-June 2026) served when the live feeds fail or return
   empty, so the news/video sections never look broken. Real, current items.
   ========================================================================== */

import type { NewsItem, VideoItem } from "@/lib/atlas/feeds";

export const FALLBACK_NEWS: NewsItem[] = [
  {
    title: "Mexico beat South Africa 2-0 in World Cup opener at Estadio Azteca",
    link: "https://www.espn.com/soccer/story/_/id/49033183/mexico-south-africa-2026-world-cup-azetca-opening-game",
    source: "ESPN",
    date: "2026-06-11T00:00:00.000Z",
    image: null,
  },
  {
    title: "The U.S. dazzles in its World Cup opener, dominating Paraguay 4-1",
    link: "https://www.npr.org/2026/06/12/nx-s1-5850736/2026-world-cup-usmnt-paraguay",
    source: "NPR",
    date: "2026-06-12T00:00:00.000Z",
    image: null,
  },
  {
    title: "World Cup highlights: Mexico defeats South Africa 2-0 in the opening match",
    link: "https://www.cnn.com/2026/06/11/sport/live-news/world-cup-mexico-south-africa",
    source: "CNN",
    date: "2026-06-11T00:00:00.000Z",
    image: null,
  },
  {
    title: "FIFA World Cup 2026 — every match result on Sunday 14 June",
    link: "https://www.olympics.com/en/news/fifa-world-cup-2026-every-match-result-sunday-14-june-live-scores",
    source: "Olympics.com",
    date: "2026-06-14T00:00:00.000Z",
    image: null,
  },
  {
    title: "Record crowds, hot stadiums: extreme heat could be a player at this World Cup",
    link: "https://www.northcarolinahealthnews.org/2026/06/12/extreme-heat-could-be-a-player-during-2026-summers-world-cup/",
    source: "NC Health News",
    date: "2026-06-12T00:00:00.000Z",
    image: null,
  },
  {
    title: "2026 FIFA World Cup standings: group-stage tables and results",
    link: "https://www.cbssports.com/soccer/news/world-cup-group-standings-table-results/",
    source: "CBS Sports",
    date: null,
    image: null,
  },
];

export const FALLBACK_VIDEOS: VideoItem[] = [
  { title: "Highlights | Brazil 1-1 Morocco | FIFA World Cup 2026™", videoId: "ECnK7UzAjIs", link: "https://www.youtube.com/watch?v=ECnK7UzAjIs", thumbnail: "https://i.ytimg.com/vi/ECnK7UzAjIs/hqdefault.jpg", published: null },
  { title: "Sweden 5-1 Tunisia | Group F | FIFA World Cup 2026™ Highlights", videoId: "ZANJQaCnkug", link: "https://www.youtube.com/watch?v=ZANJQaCnkug", thumbnail: "https://i.ytimg.com/vi/ZANJQaCnkug/hqdefault.jpg", published: null },
  { title: "Highlights | Australia 2-0 Türkiye | FIFA World Cup 2026™", videoId: "5eqzEDe8wHs", link: "https://www.youtube.com/watch?v=5eqzEDe8wHs", thumbnail: "https://i.ytimg.com/vi/5eqzEDe8wHs/hqdefault.jpg", published: null },
  { title: "Highlights | Haiti 0-1 Scotland | FIFA World Cup 2026™", videoId: "TcCufmPCsu4", link: "https://www.youtube.com/watch?v=TcCufmPCsu4", thumbnail: "https://i.ytimg.com/vi/TcCufmPCsu4/hqdefault.jpg", published: null },
];

export const X_ACCOUNTS = [
  { handle: "@FIFAWorldCup", url: "https://x.com/FIFAWorldCup", name: "FIFA World Cup" },
  { handle: "@FIFAcom", url: "https://x.com/FIFAcom", name: "FIFA" },
  { handle: "@FWC26Miami", url: "https://x.com/FWC26Miami", name: "World Cup 2026 Miami" },
  { handle: "@ESPNFC", url: "https://x.com/ESPNFC", name: "ESPN FC" },
];
