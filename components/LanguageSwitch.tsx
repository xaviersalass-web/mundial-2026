"use client";

import { useLang } from "@/lib/i18n/useLang";

export function LanguageSwitch() {
  const { lang, toggle } = useLang();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch language"
      className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold tracking-wide text-white/80 transition hover:border-white/40 hover:text-white"
    >
      {lang === "es" ? "EN" : "ES"}
    </button>
  );
}
