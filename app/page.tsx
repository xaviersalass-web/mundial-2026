/*
 * World Cup Atlas — implemented from the Claude Design handoff (World Cup Atlas.html).
 * A portfolio-grade scrollytelling data story, 1930 → 2026. Recreated pixel-faithfully
 * in Next.js: the CSS lives in app/atlas/css/*, the hand-built SVG charts in
 * lib/atlas/charts.ts, the interactions in components/atlas/*.
 */

import { Progress } from "@/components/atlas/Progress";
import { Hero } from "@/components/atlas/Hero";
import { Reveal } from "@/components/atlas/Reveal";
import { PhotoSlot } from "@/components/atlas/PhotoSlot";
import { Predictor } from "@/components/atlas/Predictor";
import {
  GrowthChart,
  NerveChart,
  ScorersChart,
  TempoChart,
  TitlesChart,
} from "@/components/atlas/ChartSections";
import { NewsSection } from "@/components/atlas/NewsSection";
import { VideoSection } from "@/components/atlas/VideoSection";
import { SocialSection } from "@/components/atlas/SocialSection";
import { PhotoCredits } from "@/components/atlas/PhotoCredits";
import { photoSrc } from "@/lib/atlas/photos";

const MOMENTS = [
  { cls: "m1", k: "Champions", t: "The trophy", ph: "Add the hero moment — the trophy lift", photo: "trophy" },
  { cls: "m2", k: "Celebration", t: "Pure euphoria", ph: "Add a celebration photo", photo: "moment-celebration" },
  { cls: "m3", k: "Top scorer", t: "The Golden Boot", ph: "Add a top-scorer photo", photo: undefined },
  { cls: "m4", k: "Atmosphere", t: "A stadium roar", ph: "Add a crowd / stadium photo", photo: "moment-atmosphere" },
  { cls: "m5", k: "Drama", t: "The final whistle", ph: "Add a decisive-moment photo", photo: undefined },
  { cls: "m6", k: "Kickoff", t: "Opening atmosphere", ph: "Add an opening-ceremony photo", photo: "moment-opening" },
];

const CITIES = [
  { key: "city-nynj", name: "New York / New Jersey", venue: "MetLife Stadium · Final", ph: "New York / NJ" },
  { key: "city-la", name: "Los Angeles", venue: "SoFi Stadium", ph: "Los Angeles" },
  { key: "city-dallas", name: "Dallas", venue: "AT&T Stadium", ph: "Dallas" },
  { key: "city-miami", name: "Miami", venue: "Hard Rock Stadium", ph: "Miami" },
  { key: "city-mexico", name: "Mexico City", venue: "Estadio Azteca · Opener", ph: "Mexico City" },
  { key: "city-toronto", name: "Toronto", venue: "BMO Field", ph: "Toronto" },
  { key: "city-vancouver", name: "Vancouver", venue: "BC Place", ph: "Vancouver" },
  { key: "city-atlanta", name: "Atlanta", venue: "Mercedes-Benz Stadium", ph: "Atlanta" },
];

const PODIUM = [
  { ph: "Klose", name: "Miroslav Klose", meta: "GER · 2002–2014", goals: "16" },
  { ph: "Ronaldo", name: "Ronaldo Nazário", meta: "BRA · 1998–2006", goals: "15" },
  { ph: "Müller", name: "Gerd Müller", meta: "GER · 1970–1974", goals: "14" },
];

export default function Home() {
  return (
    <>
      <Progress />

      <nav className="topnav">
        <div className="brand">
          WC<span>·</span>ATLAS
        </div>
        <div className="navlinks">
          <a href="#titles">Dynasties</a>
          <a href="#scorers">Scorers</a>
          <a href="#moments">Moments</a>
          <a href="#tempo">Tempo</a>
          <a href="#growth">Growth</a>
          <a href="#nerve">Nerve</a>
          <a href="#twentysix">2026</a>
          <a href="#news">News</a>
          <a href="#watch">Watch</a>
          <a href="#social">X</a>
        </div>
      </nav>

      <Hero />

      {/* 1. DYNASTIES */}
      <section className="section-pad" id="titles">
        <div className="wrap">
          <Reveal className="section-head">
            <div className="kicker">01 — Country dominance</div>
            <h2 className="section-title">
              The
              <br />
              dynasties
            </h2>
            <p className="lead">
              Only eight nations have ever lifted the trophy. Brazil sit alone at the
              summit with five stars — but Germany have reached more finals than anyone.
              Toggle to see who shows up when it matters most.
            </p>
          </Reveal>
          <TitlesChart />
        </div>
      </section>

      {/* 2. SCORERS */}
      <section className="section-pad alt" id="scorers">
        <div className="wrap">
          <Reveal className="section-head">
            <div className="kicker">02 — Goal machines</div>
            <h2 className="section-title">
              Built to
              <br />
              score
            </h2>
            <p className="lead">
              The all-time finals scoring chart blends eras: Klose’s relentless
              consistency, Fontaine’s impossible 13 in a single 1958 run, and the modern
              giants Messi and Mbappé still climbing.
            </p>
          </Reveal>

          <Reveal className="podium d1">
            {PODIUM.map((p, i) => (
              <figure className="pod" key={p.name}>
                <div className="pod-photo">
                  <span className="pod-rank">{i + 1}</span>
                  <PhotoSlot variant="slot-light" shape="circle" placeholder={p.ph} />
                </div>
                <figcaption>
                  <div className="pod-name">{p.name}</div>
                  <div className="pod-meta">{p.meta}</div>
                  <div className="pod-goals">{p.goals}</div>
                </figcaption>
              </figure>
            ))}
          </Reveal>

          <ScorersChart />
        </div>
      </section>

      {/* MOMENTS GALLERY */}
      <section className="moments" id="moments">
        <div className="wrap">
          <Reveal className="section-head">
            <div className="kicker">Through the lens</div>
            <h2 className="section-title">
              Moments that
              <br />
              made history
            </h2>
            <p className="lead">
              The numbers tell one story — the images tell another. Add your own licensed
              photography to the frames below to bring each chapter to life.
            </p>
          </Reveal>
        </div>
        <Reveal className="moments-grid d1">
          {MOMENTS.map((m) => (
            <figure className={`m-cell ${m.cls}`} key={m.cls}>
              <PhotoSlot
                variant="slot-dark"
                shape="rounded"
                radius={14}
                placeholder={m.ph}
                src={m.photo ? photoSrc(m.photo) : undefined}
              />
              <figcaption>
                <span className="mc-k">{m.k}</span>
                <span className="mc-t">{m.t}</span>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </section>

      {/* 3. TEMPO */}
      <section className="section-pad" id="tempo">
        <div className="wrap">
          <div className="two-col">
            <Reveal className="section-head">
              <div className="kicker">03 — Goals per match</div>
              <h2 className="section-title">
                The game
                <br />
                slowed,
                <br />
                then settled
              </h2>
              <p className="lead">
                Football used to be a shootout. The 1954 tournament averaged a wild 5.38
                goals a game; by 1990 tactical caution dragged it to 2.21. The modern era
                has found an equilibrium around 2.6.
              </p>
              <div className="stat-row">
                <div className="bigstat">
                  <span className="bn display">5.38</span>
                  <span className="bl">1954 — all-time high</span>
                </div>
                <div className="bigstat">
                  <span className="bn display">2.21</span>
                  <span className="bl">1990 — all-time low</span>
                </div>
              </div>
            </Reveal>
            <TempoChart />
          </div>
        </div>
      </section>

      {/* 4. GROWTH */}
      <section className="section-pad alt" id="growth">
        <div className="wrap">
          <Reveal className="section-head">
            <div className="kicker">04 — Attendance &amp; scale</div>
            <h2 className="section-title">
              A bigger
              <br />
              stage every
              <br />
              cycle
            </h2>
            <p className="lead">
              From 13 teams in front of 590,000 fans in 1930 to a projected 6 million
              attendees across 104 matches in 2026 — the World Cup’s growth curve bends
              sharply upward as the field expands to 48 nations.
            </p>
          </Reveal>
          <GrowthChart />
        </div>
      </section>

      {/* 5. NERVE */}
      <section className="section-pad" id="nerve">
        <div className="wrap">
          <div className="two-col">
            <Reveal className="section-head">
              <div className="kicker">05 — Penalty shootouts</div>
              <h2 className="section-title">
                Twelve
                <br />
                yards of
                <br />
                nerve
              </h2>
              <p className="lead">
                Since shootouts arrived in 1982, some nations have made the spot their
                stage — and others their graveyard. Germany and Argentina rarely blink;
                England’s history from twelve yards is famously cruel.
              </p>
              <div className="stat-row">
                <div className="bigstat">
                  <span className="bn display">36</span>
                  <span className="bl">shootouts since 1982</span>
                </div>
                <div className="bigstat">
                  <span className="bn display">70%</span>
                  <span className="bl">of all spot-kicks scored</span>
                </div>
              </div>
            </Reveal>
            <NerveChart />
          </div>
        </div>
      </section>

      {/* 6. 2026 + PREDICTOR */}
      <section className="section-pad two6" id="twentysix">
        <div className="wrap">
          <Reveal className="section-head">
            <div className="kicker">06 — The road to 2026</div>
            <h2 className="section-title">
              48 teams.
              <br />
              3 nations.
              <br />
              104 matches.
            </h2>
            <p className="lead">
              The biggest World Cup ever kicks off June 11, 2026, across the United States,
              Canada and Mexico — building to the final at MetLife Stadium on July 19.
              Who’s your pick to lift it?
            </p>
          </Reveal>

          <Reveal className="two6-facts d1">
            <div className="fact">
              <span className="fn display">48</span>
              <span className="fl">nations</span>
            </div>
            <div className="fact">
              <span className="fn display">104</span>
              <span className="fl">matches</span>
            </div>
            <div className="fact">
              <span className="fn display">16</span>
              <span className="fl">host cities</span>
            </div>
            <div className="fact">
              <span className="fn display">03</span>
              <span className="fl">host countries</span>
            </div>
          </Reveal>

          <Reveal className="cities d2">
            <div className="cities-head">
              <div className="kicker">16 host cities</div>
              <span className="ch-note">Add a licensed city / stadium photo to each frame</span>
            </div>
            <div className="cities-grid">
              {CITIES.map((c) => (
                <figure className="city" key={c.name}>
                  <PhotoSlot
                    variant="slot-26"
                    shape="rounded"
                    radius={12}
                    placeholder={c.ph}
                    src={photoSrc(c.key)}
                  />
                  <div className="city-name">{c.name}</div>
                  <div className="city-venue">{c.venue}</div>
                </figure>
              ))}
            </div>
          </Reveal>

          <Reveal className="predictor d2">
            <Predictor />
          </Reveal>
        </div>
      </section>

      {/* LIVE HUB — news, video, X (free legal feeds, all linking to source) */}
      <NewsSection />
      <VideoSection />
      <SocialSection />
      <PhotoCredits />

      {/* FOOTER */}
      <footer className="site-foot">
        <div className="wrap">
          <div className="big">
            SEE YOU
            <br />
            IN 2026.
          </div>
          <div className="meta">
            WORLD CUP ATLAS
            <br />
            A data story · 1930 — 2026
            <br />
            Figures: historical FIFA World Cup records
            <br />
            Built as a design portfolio piece
          </div>
        </div>
      </footer>
    </>
  );
}
