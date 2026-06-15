// Locale-aware formatting helpers for dates, times and match status labels.

import { dict, type Lang } from "@/lib/i18n/dict";
import type { MatchStatus } from "@/lib/types/models";

const LOCALE: Record<Lang, string> = { es: "es-MX", en: "en-US" };

export function formatKickoff(iso: string, lang: Lang): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(LOCALE[lang], {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function formatTime(iso: string, lang: Lang): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(LOCALE[lang], {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function formatDay(iso: string, lang: Lang): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(LOCALE[lang], {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(d);
}

export function statusLabel(status: MatchStatus, lang: Lang): string {
  const key = `status.${status}` as keyof (typeof dict)["es"];
  return dict[lang][key] ?? status;
}

/** True while the match is actively being played (worth polling/animating). */
export function isLive(status: MatchStatus): boolean {
  return status === "IN_PLAY" || status === "PAUSED";
}
