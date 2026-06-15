"use client";

import { useLang } from "@/lib/i18n/useLang";
import { LanguageSwitch } from "@/components/LanguageSwitch";

const NAV_KEYS = [
  "nav.live",
  "nav.groups",
  "nav.bracket",
  "nav.teams",
  "nav.venues",
  "nav.scorers",
] as const;

export function NavBar() {
  const { t } = useLang();
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-neutral-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-black tracking-tight">
            {t("app.title")}
          </span>
          <span className="hidden text-xs text-white/40 sm:inline">
            {t("app.subtitle")}
          </span>
        </div>
        <nav className="ml-auto hidden items-center gap-4 text-sm text-white/60 md:flex">
          {NAV_KEYS.map((k) => (
            <a
              key={k}
              href={`#${k.split(".")[1]}`}
              className="transition hover:text-white"
            >
              {t(k)}
            </a>
          ))}
        </nav>
        <LanguageSwitch />
      </div>
    </header>
  );
}
