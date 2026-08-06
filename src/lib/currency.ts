import type { PersonalizationSettings } from "@/lib/personalization";

export type CurrencyCode = PersonalizationSettings["currencyCode"];

// Demonstration rates are intentionally static: switching the display currency
// must stay deterministic and cannot be mistaken for a live FX quotation.
export const DEMO_RUB_RATES: Record<CurrencyCode, number> = {
  RUB: 1,
  USD: 0.0111,
  EUR: 0.0102,
  CNY: 0.0795,
  KZT: 5.84,
};

export function convertFromRub(amount: number, currency: CurrencyCode) {
  return amount * DEMO_RUB_RATES[currency];
}

export function formatAppMoney(amountRub: number, locale: string, currency: CurrencyCode, expenseStyle: PersonalizationSettings["expenseSignStyle"] = "signed") {
  const normalized = expenseStyle === "absolute" && amountRub < 0 ? Math.abs(amountRub) : amountRub;
  return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: currency === "RUB" || currency === "KZT" ? 0 : 2 }).format(convertFromRub(normalized, currency));
}
