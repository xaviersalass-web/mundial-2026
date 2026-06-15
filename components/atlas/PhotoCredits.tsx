import { PHOTO_CREDITS } from "@/lib/atlas/photos";

/** Visible image attribution — required by the CC BY / CC BY-SA licenses. */
export function PhotoCredits() {
  return (
    <section className="credits" id="credits">
      <div className="wrap">
        <div className="kicker">Image credits</div>
        <ul className="credit-list">
          {PHOTO_CREDITS.map((p) => (
            <li key={p.src} className="credit-item mono">
              <span className="credit-label">{p.label}</span> — {p.attribution} ·{" "}
              {p.license}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
