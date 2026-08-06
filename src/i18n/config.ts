export const LOCALES = ["ru", "en", "be", "kk", "es", "zh", "ja", "uk", "de", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ru";
export const LOCALE_COOKIE = "lumen-locale";

export const LOCALE_OPTIONS: { id: Locale; label: string; region: string }[] = [
  { id: "ru", label: "Русский", region: "RU" },
  { id: "en", label: "English", region: "EN" },
  { id: "be", label: "Беларуская", region: "BY" },
  { id: "kk", label: "Қазақша", region: "KZ" },
  { id: "es", label: "Español", region: "ES" },
  { id: "zh", label: "中文", region: "ZH" },
  { id: "ja", label: "日本語", region: "JA" },
  { id: "uk", label: "Українська", region: "UA" },
  { id: "de", label: "Deutsch", region: "DE" },
  { id: "fr", label: "Français", region: "FR" },
];

export function isLocale(value: string): value is Locale { return (LOCALES as readonly string[]).includes(value); }

export function parseLocaleCookie(raw?: string): Locale {
  if (!raw) return DEFAULT_LOCALE;
  try {
    const value = JSON.parse(decodeURIComponent(raw));
    return typeof value === "string" && isLocale(value) ? value : DEFAULT_LOCALE;
  } catch {
    return isLocale(raw) ? raw : DEFAULT_LOCALE;
  }
}
