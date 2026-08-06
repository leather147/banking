"use client";

import type { Route } from "next";
import Link from "next/link";
import { BadgePercent, CalendarClock, ChevronRight, CreditCard, Goal, Plane, ReceiptText, ShieldCheck, Sparkles, UsersRound, WalletCards } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { Card } from "@/components/ui/card";

type OfferContext = "profile" | "cards" | "analytics" | "payments";

const offers = {
  profile: [
    { id: "family", href: "/family", icon: UsersRound, metric: "3 + 3" },
    { id: "plus", href: "/subscriptions", icon: Sparkles, metric: "−25%" },
    { id: "security", href: "/settings/security", icon: ShieldCheck, metric: "24/7" },
  ],
  cards: [
    { id: "travel", href: "/cards", icon: Plane, metric: "0% FX" },
    { id: "junior", href: "/family", icon: CreditCard, metric: "6–17" },
    { id: "protection", href: "/support", icon: ShieldCheck, metric: "1 000 000 ₽" },
  ],
  analytics: [
    { id: "roundup", href: "/savings", icon: Goal, metric: "+3 840 ₽" },
    { id: "budget", href: "/analytics", icon: WalletCards, metric: "64%" },
    { id: "cashback", href: "/bonuses", icon: BadgePercent, metric: "+1 570" },
  ],
  payments: [
    { id: "autopay", href: "/payments", icon: CalendarClock, metric: "3" },
    { id: "templates", href: "/payments", icon: ReceiptText, metric: "8 сек" },
    { id: "subscription", href: "/subscriptions", icon: Sparkles, metric: "−25%" },
  ],
} as const satisfies Record<OfferContext, readonly { id: string; href: Route; icon: typeof Sparkles; metric: string }[]>;

export function BankOfferGrid({ context }: { context: OfferContext }) {
  const { t } = useI18n();
  const { settings } = usePersonalization();
  return <section aria-labelledby={`offers-${context}`} className="space-y-4"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-primary">{t("offers.eyebrow", "Подобрано для вас")}</p><h2 id={`offers-${context}`} className="mt-1 text-xl font-bold">{t(`offers.${context}.title`)}</h2></div><p className="max-w-md text-xs leading-5 text-muted-foreground">{t(`offers.${context}.description`, "Предложения учитывают демонстрационный профиль и не являются индивидуальной финансовой рекомендацией.", { bank: settings.brandName })}</p></div><div className="grid auto-rows-fr gap-3 md:grid-cols-3">{offers[context].map(({ id, href, icon: Icon, metric }) => <Link key={id} href={href} className="group min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-ring"><Card className="surface-glow flex h-full min-h-44 min-w-0 flex-col p-4 transition-[border-color,background-color,box-shadow] group-hover:border-primary/25 group-hover:bg-secondary/28"><div className="flex items-start justify-between gap-3"><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="size-4" /></span><span className="font-mono text-xs font-bold text-primary">{t(`offers.${context}.${id}.metric`, metric)}</span></div><h3 className="mt-6 text-sm font-bold">{t(`offers.${context}.${id}.title`)}</h3><p className="mt-1 flex-1 text-xs leading-5 text-muted-foreground">{t(`offers.${context}.${id}.description`)}</p><span className="mt-4 flex items-center justify-between text-xs font-bold text-primary"><span>{t("offers.details", "Подробнее")}</span><ChevronRight className="size-4 transition-colors group-hover:text-foreground" /></span></Card></Link>)}</div></section>;
}
