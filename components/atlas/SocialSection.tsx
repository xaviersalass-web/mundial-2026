"use client";

import { useEffect, useRef } from "react";
import { Reveal } from "@/components/atlas/Reveal";
import { X_ACCOUNTS } from "@/lib/atlas/fallback";

declare global {
  interface Window {
    twttr?: { widgets?: { load?: (el?: HTMLElement) => void } };
  }
}

const WIDGETS_SRC = "https://platform.twitter.com/widgets.js";

export function SocialSection() {
  const tlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = () => window.twttr?.widgets?.load?.(tlRef.current ?? undefined);
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${WIDGETS_SRC}"]`);
    if (existing) {
      load();
      return;
    }
    const s = document.createElement("script");
    s.src = WIDGETS_SRC;
    s.async = true;
    s.onload = load;
    document.body.appendChild(s);
  }, []);

  return (
    <section className="section-pad social" id="social">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="kicker">The conversation — X</div>
          <h2 className="section-title">
            Live from
            <br />
            the timeline
          </h2>
          <p className="lead">
            Real-time posts from the official #FIFAWorldCup account, plus the verified
            accounts worth following through the tournament.
          </p>
        </Reveal>

        <div className="x-wrap">
          <Reveal className="x-timeline-frame d1">
            <div className="x-timeline" ref={tlRef}>
              <a
                className="twitter-timeline"
                data-theme="light"
                data-height="620"
                data-chrome="noheader nofooter transparent"
                href="https://twitter.com/FIFAWorldCup?ref_src=twsrc%5Etfw"
              >
                Posts from @FIFAWorldCup
              </a>
            </div>
          </Reveal>

          <Reveal className="x-accounts d2">
            <div className="x-accounts-head kicker">Follow the cup</div>
            {X_ACCOUNTS.map((a) => (
              <a
                key={a.handle}
                className="x-account"
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="x-acc-name">{a.name}</span>
                <span className="x-acc-handle mono">{a.handle}</span>
                <span className="x-acc-go" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
