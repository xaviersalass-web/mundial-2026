"use client";

import useSWR from "swr";
import { Reveal } from "@/components/atlas/Reveal";
import type { NewsItem } from "@/lib/atlas/feeds";

interface NewsResponse {
  items: NewsItem[];
  live: boolean;
  updatedAt: string;
}

const fetcher = (u: string) => fetch(u).then((r) => r.json() as Promise<NewsResponse>);

function fmt(d: string | null): string {
  if (!d) return "";
  const t = Date.parse(d);
  if (Number.isNaN(t)) return "";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(t);
}

export function NewsSection() {
  const { data, isLoading } = useSWR<NewsResponse>("/api/news", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5 * 60 * 1000,
  });
  const items = data?.items ?? [];

  return (
    <section className="section-pad alt" id="news">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="kicker">Live wire — news</div>
          <h2 className="section-title">
            The pulse
            <br />
            of the cup
          </h2>
          <p className="lead">
            Headlines from across the football world, pulled straight from the newsroom
            feeds. Tap any story to read it at the source.
          </p>
        </Reveal>

        <div className="news-grid">
          {isLoading && !data
            ? Array.from({ length: 6 }).map((_, i) => (
                <div className="news-card skeleton" key={i} style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="sk-line w40" />
                  <div className="sk-line w90" />
                  <div className="sk-line w70" />
                </div>
              ))
            : items.map((n, i) => (
                <a
                  key={n.link}
                  className="news-card"
                  href={n.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ animationDelay: `${Math.min(i, 8) * 55}ms` }}
                >
                  <div className="news-meta">
                    <span className="news-src">{n.source}</span>
                    {n.date && <span className="news-date mono">{fmt(n.date)}</span>}
                  </div>
                  <div className="news-title">{n.title}</div>
                  <span className="news-go mono">Read at source →</span>
                </a>
              ))}
        </div>
      </div>
    </section>
  );
}
