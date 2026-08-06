"use client";

import * as React from "react";
import { setCookie } from "@/lib/cookies";
import { LOCALE_COOKIE, type Locale } from "@/i18n/config";
import { loadDictionary, type Dictionary } from "@/i18n/dictionaries";

type I18nContextValue = {
  locale: Locale;
  pending: boolean;
  t: (key: string, fallback?: string, variables?: Record<string, string | number>) => string;
  setLocale: (locale: Locale) => Promise<void>;
};

const I18nContext = React.createContext<I18nContextValue | null>(null);

export function I18nProvider({ initialLocale, initialDictionary, children }: { initialLocale: Locale; initialDictionary: Dictionary; children: React.ReactNode }) {
  const [state, setState] = React.useState({ locale: initialLocale, dictionary: initialDictionary });
  const [pending, startTransition] = React.useTransition();
  const setLocale = React.useCallback(async (locale: Locale) => {
    if (locale === state.locale) return;
    const dictionary = await loadDictionary(locale);
    setCookie(LOCALE_COOKIE, locale);
    document.documentElement.lang = locale;
    startTransition(() => setState({ locale, dictionary }));
  }, [state.locale]);
  const t = React.useCallback((key: string, fallback = key, variables?: Record<string, string | number>) => {
    const template = state.dictionary[key] ?? fallback;
    if (!variables) return template;
    const interpolated = template.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, name: string) => name in variables ? String(variables[name]) : match);
    if (!variables.bank) return interpolated;

    const bankName = String(variables.bank);
    return interpolated
      .replaceAll("Lumen Bank", bankName)
      .replace(/\bLumen\b(?!\s+Bank\b)/g, bankName);
  }, [state.dictionary]);
  const value = React.useMemo(() => ({ locale: state.locale, pending, setLocale, t }), [pending, setLocale, state.locale, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = React.useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider");
  return context;
}
