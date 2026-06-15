"use client";

import { useLang } from "@/lib/i18n/useLang";
import { formatTime, isLive, statusLabel } from "@/lib/i18n/format";
import { teamName } from "@/lib/i18n/countries";
import type { Lang } from "@/lib/i18n/dict";
import type { Match } from "@/lib/types/models";
import { TeamBadge } from "@/components/TeamBadge";

function Side({
  team,
  score,
  lang,
}: {
  team: Match["home"];
  score: number | null;
  lang: Lang;
}) {
  return (
    <div className="flex items-center gap-2">
      <TeamBadge team={team} size={26} />
      <span className="truncate text-sm font-medium">
        {teamName(team, lang)}
      </span>
      <span className="ml-auto tabular-nums text-lg font-bold">
        {score ?? "–"}
      </span>
    </div>
  );
}

export function ScoreCard({ match }: { match: Match }) {
  const { lang } = useLang();
  const live = isLive(match.status);

  return (
    <div className="flex min-w-[230px] flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-white/50">
        <span>{match.group ?? match.stage}</span>
        <span
          className={
            live
              ? "flex items-center gap-1 font-semibold text-emerald-400"
              : "text-white/50"
          }
        >
          {live && (
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          )}
          {match.status === "IN_PLAY" && match.minute != null
            ? `${match.minute}'`
            : match.status === "TIMED" || match.status === "SCHEDULED"
              ? formatTime(match.utcDate, lang)
              : statusLabel(match.status, lang)}
        </span>
      </div>
      <Side team={match.home} score={match.score.home} lang={lang} />
      <Side team={match.away} score={match.score.away} lang={lang} />
    </div>
  );
}
