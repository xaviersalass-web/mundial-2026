"use client";

import useSWR from "swr";
import { Reveal } from "@/components/atlas/Reveal";
import type { VideoItem } from "@/lib/atlas/feeds";

interface VideoResponse {
  items: VideoItem[];
  live: boolean;
  updatedAt: string;
}

const fetcher = (u: string) => fetch(u).then((r) => r.json() as Promise<VideoResponse>);

export function VideoSection() {
  const { data, isLoading } = useSWR<VideoResponse>("/api/videos", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10 * 60 * 1000,
  });
  const items = data?.items ?? [];

  return (
    <section className="videos" id="watch">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="kicker">Trending — video</div>
          <h2 className="section-title">
            Watch the
            <br />
            tournament
          </h2>
          <p className="lead">
            The latest official highlights and clips from FIFA&apos;s channel. Every card
            opens the full video on YouTube.
          </p>
        </Reveal>

        <div className="video-grid">
          {isLoading && !data
            ? Array.from({ length: 6 }).map((_, i) => (
                <div className="video-card skeleton" key={i} style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="video-thumb" />
                  <div className="sk-line w90" />
                </div>
              ))
            : items.map((v, i) => (
                <a
                  key={v.videoId}
                  className="video-card"
                  href={v.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ animationDelay: `${Math.min(i, 8) * 55}ms` }}
                >
                  <div className="video-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={v.thumbnail} alt={v.title} loading="lazy" />
                    <span className="video-play" aria-hidden="true">
                      ▶
                    </span>
                  </div>
                  <div className="video-title">{v.title}</div>
                </a>
              ))}
        </div>
      </div>
    </section>
  );
}
