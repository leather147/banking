import type { Route } from "next";
import { BadgePercent, CircleHelp, PiggyBank, ReceiptText, UsersRound } from "lucide-react";
import type { SecondaryNavigationItemId } from "@/lib/personalization";

export type SecondaryService = {
  id: SecondaryNavigationItemId;
  label: string;
  shortLabel: string;
  description: string;
  metric: string;
  href: Route;
  icon: typeof PiggyBank;
};

export const SECONDARY_SERVICES: Record<SecondaryNavigationItemId, SecondaryService> = {
  savings: { id: "savings", label: "Накопления", shortLabel: "Цели и счета", description: "Копилки, цели и доходность накопительных счетов", metric: "12,8% годовых", href: "/savings", icon: PiggyBank },
  bonuses: { id: "bonuses", label: "Бонусы", shortLabel: "Спасибо", description: "Кэшбэк, персональные категории и предложения", metric: "4 280 бонусов", href: "/bonuses", icon: BadgePercent },
  subscriptions: { id: "subscriptions", label: "Подписки", shortLabel: "Регулярные списания", description: "Контроль подписок и ближайших автоплатежей", metric: "1 487 ₽ / мес.", href: "/subscriptions", icon: ReceiptText },
  family: { id: "family", label: "Семейный банк", shortLabel: "Общие финансы", description: "Совместные цели, лимиты и детские карты", metric: "3 участника", href: "/family", icon: UsersRound },
  support: { id: "support", label: "Поддержка", shortLabel: "Помощь 24/7", description: "Чат, справка и контроль обращений", metric: "Ответ за 1 минуту", href: "/support", icon: CircleHelp },
};
