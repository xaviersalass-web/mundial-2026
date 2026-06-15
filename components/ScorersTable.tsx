"use client";

import { useLang } from "@/lib/i18n/useLang";
import type { Scorer } from "@/lib/types/models";
import { TeamBadge } from "@/components/TeamBadge";

export function ScorersTable({ scorers }: { scorers: Scorer[] }) {
  const { t } = useLang();
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
      <table className="w-full text-sm">
        <thead className="text-[11px] uppercase tracking-wide text-white/40">
          <tr>
            <th className="px-3 py-2 text-left font-medium">#</th>
            <th className="py-2 text-left font-medium">{t("scorers.player")}</th>
            <th className="px-2 py-2 text-center font-medium">{t("scorers.goals")}</th>
            <th className="px-2 py-2 text-center font-medium">{t("scorers.assists")}</th>
          </tr>
        </thead>
        <tbody>
          {scorers.map((s) => (
            <tr key={`${s.rank}-${s.player}`} className="border-t border-white/5">
              <td className="px-3 py-2 tabular-nums text-white/50">{s.rank}</td>
              <td className="py-2">
                <div className="flex items-center gap-2">
                  <TeamBadge team={s.team} size={18} />
                  <span className="font-medium">{s.player}</span>
                  <span className="text-white/40">{s.team.tla}</span>
                </div>
              </td>
              <td className="px-2 py-2 text-center font-bold tabular-nums">
                {s.goals}
              </td>
              <td className="px-2 py-2 text-center tabular-nums text-white/60">
                {s.assists ?? "–"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
