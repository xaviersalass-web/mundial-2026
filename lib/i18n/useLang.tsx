"use client";

// Lightweight bilingual context. Persists the choice in a cookie + localStorage so
// it survives reloads. Wrap the app in <LangProvider>; read with useLang().
// If you later need locale-routed URLs (/es, /en), this drops in cleanly to next-intl.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { DEFAULT_LANG, dict, type DictKey, type Lang } from "@/lib/i18n/dict";

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: DictKey) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

const COOKIE = "wc26_lang";

function readInitial(): Lang {
  if (typeof document === "undefined") return DEFAULT_LANG;
  const fromLs = window.localStorage?.getItem(COOKIE);
  if (fromLs === "es" || fromLs === "en") return fromLs;
  const m = document.cookie.match(/(?:^|;\s*)wc26_lang=(es|en)/);
  if (m) return m[1] as Lang;
  return DEFAULT_LANG;
}

export function LangProvider({
  children,
  initial,
}: {
  children: React.ReactNode;
  initial?: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(initial ?? DEFAULT_LANG);

  // Hydrate from client storage after mount (avoids SSR/CSR mismatch).
  useEffect(() => {
    const detected = readInitial();
    if (detected !== lang) setLangState(detected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(COOKIE, l);
      document.cookie = `${COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
    } catch {
      // storage may be unavailable (private mode) — language still works in-session
    }
  }, []);

  const toggle = useCallback(
    () => setLang(lang === "es" ? "en" : "es"),
    [lang, setLang],
  );

  const t = useCallback((key: DictKey) => dict[lang][key] ?? key, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within <LangProvider>");
  return ctx;
}
