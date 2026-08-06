export type BankCardRecord = {
  id: string;
  name: string;
  product: string;
  balance: number;
  last4: string;
  network: string;
  expires: string;
  style: "prism" | "aurora" | "graphite";
  accent: string;
};

export const BANK_CARDS: BankCardRecord[] = [
  { id: "black", name: "Black", product: "Основная карта", balance: 326840, last4: "0932", network: "Мир", expires: "09/29", style: "prism", accent: "var(--glow-pink)" },
  { id: "travel", name: "Travel", product: "Для путешествий", balance: 148200, last4: "7741", network: "Visa", expires: "03/30", style: "aurora", accent: "var(--glow-blue)" },
  { id: "family", name: "Family", product: "Семейная карта", balance: 68400, last4: "2187", network: "Мир", expires: "11/29", style: "graphite", accent: "var(--glow-orange)" },
];

export function getVisibleCards(count: number) {
  return BANK_CARDS.slice(0, Math.max(1, Math.min(BANK_CARDS.length, count)));
}
