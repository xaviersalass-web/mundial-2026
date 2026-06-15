"use client";

import { useLang } from "@/lib/i18n/useLang";
import { teamName } from "@/lib/i18n/countries";
import type { GroupStanding } from "@/lib/types/models";
import { TeamBadge } from "@/components/TeamBadge";

export function GroupTable({ standing }: { standing: GroupStanding }) {
  const { t, lang } = useLang();
  const groupLetter = standing.group.replace(/group\s*/i, "");

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
      <div className="border-b border-white/10 px-3 py-2 text-sm font-bold">
        {t("groups.group")} {groupLetter}
      </div>
      <table className="w-full text-sm">
        <thead className="text-[11px] uppercase tracking-wide text-white/40">
          <tr>
            <th className="px-2 py-1.5 text-left font-medium">{t("table.pos")}</th>
            <th className="py-1.5 text-left font-medium">{t("table.team")}</th>
            <th className="px-1 py-1.5 text-center font-medium">{t("table.played")}</th>
            <th className="px-1 py-1.5 text-center font-medium">{t("table.gd")}</th>
            <th className="px-2 py-1.5 text-center font-medium">{t("table.points")}</th>
          </tr>
        </thead>
        <tbody>
          {standing.rows.map((r) => {
            const qualifies = r.position <= 2;
            return (
              <tr
                key={r.team.id ?? r.position}
                className="border-t border-white/5"
              >
                <td className="px-2 py-1.5">
                  <span
                    className={
                      qualifies
                        ? "inline-block w-4 border-l-2 border-emerald-400 pl-1 text-white/80"
                        : "inline-block w-4 pl-1 text-white/50"
                    }
                  >
                    {r.position}
                  </span>
                </td>
                <td className="flex items-center gap-2 py-1.5">
                  <TeamBadge team={r.team} size={20} />
                  <span className="truncate">{teamName(r.team, lang)}</span>
                </td>
                <td className="px-1 py-1.5 text-center tabular-nums text-white/60">
                  {r.played}
                </td>
                <td className="px-1 py-1.5 text-center tabular-nums text-white/60">
                  {r.goalDifference > 0 ? `+${r.goalDifference}` : r.goalDifference}
                </td>
                <td className="px-2 py-1.5 text-center font-bold tabular-nums">
                  {r.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
