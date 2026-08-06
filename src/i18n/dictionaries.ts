import type { Locale } from "@/i18n/config";

export type Dictionary = Record<string, string>;

const loaders: Record<Locale, () => Promise<Dictionary>> = {
  ru: () => import("@/i18n/locales/ru.json").then((module) => module.default),
  en: () => import("@/i18n/locales/en.json").then((module) => module.default),
  be: () => import("@/i18n/locales/be.json").then((module) => module.default),
  kk: () => import("@/i18n/locales/kk.json").then((module) => module.default),
  es: () => import("@/i18n/locales/es.json").then((module) => module.default),
  zh: () => import("@/i18n/locales/zh.json").then((module) => module.default),
  ja: () => import("@/i18n/locales/ja.json").then((module) => module.default),
  uk: () => import("@/i18n/locales/uk.json").then((module) => module.default),
  de: () => import("@/i18n/locales/de.json").then((module) => module.default),
  fr: () => import("@/i18n/locales/fr.json").then((module) => module.default),
};

const extensionLoaders: Record<Locale, () => Promise<Dictionary>> = {
  ru: () => import("@/i18n/locales/extensions/ru.json").then((module) => module.default),
  en: () => import("@/i18n/locales/extensions/en.json").then((module) => module.default),
  be: () => import("@/i18n/locales/extensions/be.json").then((module) => module.default),
  kk: () => import("@/i18n/locales/extensions/kk.json").then((module) => module.default),
  es: () => import("@/i18n/locales/extensions/es.json").then((module) => module.default),
  zh: () => import("@/i18n/locales/extensions/zh.json").then((module) => module.default),
  ja: () => import("@/i18n/locales/extensions/ja.json").then((module) => module.default),
  uk: () => import("@/i18n/locales/extensions/uk.json").then((module) => module.default),
  de: () => import("@/i18n/locales/extensions/de.json").then((module) => module.default),
  fr: () => import("@/i18n/locales/extensions/fr.json").then((module) => module.default),
};

const productLoaders: Record<Locale, () => Promise<Dictionary>> = {
  ru: () => import("@/i18n/locales/product/ru.json").then((module) => module.default),
  en: () => import("@/i18n/locales/product/en.json").then((module) => module.default),
  be: () => import("@/i18n/locales/product/be.json").then((module) => module.default),
  kk: () => import("@/i18n/locales/product/kk.json").then((module) => module.default),
  es: () => import("@/i18n/locales/product/es.json").then((module) => module.default),
  zh: () => import("@/i18n/locales/product/zh.json").then((module) => module.default),
  ja: () => import("@/i18n/locales/product/ja.json").then((module) => module.default),
  uk: () => import("@/i18n/locales/product/uk.json").then((module) => module.default),
  de: () => import("@/i18n/locales/product/de.json").then((module) => module.default),
  fr: () => import("@/i18n/locales/product/fr.json").then((module) => module.default),
};

const featureLoaders: Record<"en" | "ru", () => Promise<Dictionary>> = {
  en: () => import("@/i18n/locales/features/en.json").then((module) => module.default),
  ru: () => import("@/i18n/locales/features/ru.json").then((module) => module.default),
};

export async function loadDictionary(locale: Locale) {
  // Product copy falls back to English per key while shell and settings remain
  // locale-specific. Separate dynamic imports keep each language out of the
  // initial client chunk until the user selects it.
  const [coreBase, extensionBase, productBase, featureBase, core, extension, productLocale, featureLocale] = await Promise.all([
    loaders.en(),
    extensionLoaders.en(),
    productLoaders.en(),
    featureLoaders.en(),
    loaders[locale](),
    extensionLoaders[locale](),
    locale === "en" ? Promise.resolve({}) : productLoaders[locale](),
    locale === "ru" ? featureLoaders.ru() : Promise.resolve({}),
  ]);
  return { ...coreBase, ...extensionBase, ...productBase, ...featureBase, ...core, ...extension, ...productLocale, ...featureLocale };
}
