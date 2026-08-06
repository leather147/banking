"use client";

import type { Route } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgePercent,
  BellRing,
  BookOpenCheck,
  Bot,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  FileCheck2,
  Gift,
  Goal,
  HandHeart,
  Headphones,
  Landmark,
  LineChart,
  LockKeyhole,
  MessageCircleMore,
  PiggyBank,
  ReceiptText,
  RefreshCw,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserRoundCog,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";
import { SubscriptionPlans } from "@/components/subscriptions/subscription-plans";
import { useI18n } from "@/components/providers/i18n-provider";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { SecondaryNavigationItemId } from "@/lib/personalization";
import { SECONDARY_SERVICES } from "@/lib/secondary-services";

type ItemIcon = typeof PiggyBank;
type ServiceFact = { value: string; label: string; detail: string };
type ServiceFeature = { icon: ItemIcon; title: string; description: string };
type ServiceActivity = { title: string; meta: string; value: string; tone?: "positive" | "neutral" };

const serviceContent: Record<SecondaryNavigationItemId, { facts: ServiceFact[]; features: ServiceFeature[]; activity: ServiceActivity[] }> = {
  savings: {
    facts: [
      { value: "12,8%", label: "rate", detail: "rateDetail" },
      { value: "248 000 ₽", label: "total", detail: "totalDetail" },
      { value: "+4 260 ₽", label: "income", detail: "incomeDetail" },
      { value: "3", label: "goals", detail: "goalsDetail" },
    ],
    features: [
      { icon: TrendingUp, title: "daily", description: "dailyDetail" },
      { icon: RefreshCw, title: "autosave", description: "autosaveDetail" },
      { icon: Target, title: "goals", description: "goalsFeatureDetail" },
      { icon: ShieldCheck, title: "reserve", description: "reserveDetail" },
    ],
    activity: [
      { title: "travel", meta: "travelMeta", value: "48 000 / 60 000 ₽", tone: "positive" },
      { title: "reserve", meta: "reserveMeta", value: "120 000 / 300 000 ₽" },
      { title: "car", meta: "carMeta", value: "80 000 / 450 000 ₽" },
    ],
  },
  bonuses: {
    facts: [
      { value: "4 280", label: "balance", detail: "balanceDetail" },
      { value: "10%", label: "cashback", detail: "cashbackDetail" },
      { value: "27", label: "partners", detail: "partnersDetail" },
      { value: "Plus", label: "level", detail: "levelDetail" },
    ],
    features: [
      { icon: BadgePercent, title: "categories", description: "categoriesDetail" },
      { icon: Gift, title: "partners", description: "partnersFeatureDetail" },
      { icon: HandHeart, title: "charity", description: "charityDetail" },
      { icon: LineChart, title: "analytics", description: "analyticsDetail" },
    ],
    activity: [
      { title: "market", meta: "marketMeta", value: "+820", tone: "positive" },
      { title: "cafe", meta: "cafeMeta", value: "+210", tone: "positive" },
      { title: "travel", meta: "travelMeta", value: "+540", tone: "positive" },
    ],
  },
  subscriptions: {
    facts: [
      { value: "5", label: "active", detail: "activeDetail" },
      { value: "1 487 ₽", label: "expense", detail: "expenseDetail" },
      { value: "399 ₽", label: "bankPlan", detail: "bankPlanDetail" },
      { value: "12.08", label: "next", detail: "nextDetail" },
    ],
    features: [
      { icon: ReceiptText, title: "control", description: "controlDetail" },
      { icon: BellRing, title: "reminders", description: "remindersDetail" },
      { icon: MessageCircleMore, title: "cancel", description: "cancelDetail" },
      { icon: Sparkles, title: "optimize", description: "optimizeDetail" },
    ],
    activity: [
      { title: "video", meta: "videoMeta", value: "399 ₽" },
      { title: "music", meta: "musicMeta", value: "169 ₽" },
      { title: "cloud", meta: "cloudMeta", value: "199 ₽" },
    ],
  },
  family: {
    facts: [
      { value: "3", label: "members", detail: "membersDetail" },
      { value: "2", label: "childCards", detail: "childCardsDetail" },
      { value: "180 000 ₽", label: "budget", detail: "budgetDetail" },
      { value: "68%", label: "goal", detail: "goalDetail" },
    ],
    features: [
      { icon: UserRoundCog, title: "roles", description: "rolesDetail" },
      { icon: WalletCards, title: "limits", description: "limitsDetail" },
      { icon: Goal, title: "goals", description: "goalsDetail" },
      { icon: LockKeyhole, title: "parental", description: "parentalDetail" },
    ],
    activity: [
      { title: "alexey", meta: "alexeyMeta", value: "96 120 ₽" },
      { title: "maria", meta: "mariaMeta", value: "48 600 ₽" },
      { title: "daria", meta: "dariaMeta", value: "8 340 ₽" },
    ],
  },
  support: {
    facts: [
      { value: "≈ 1 мин", label: "response", detail: "responseDetail" },
      { value: "24/7", label: "hours", detail: "hoursDetail" },
      { value: "100%", label: "status", detail: "statusDetail" },
      { value: "8", label: "documents", detail: "documentsDetail" },
    ],
    features: [
      { icon: MessageCircleMore, title: "chat", description: "chatDetail" },
      { icon: ShieldCheck, title: "security", description: "securityDetail" },
      { icon: FileCheck2, title: "claims", description: "claimsDetail" },
      { icon: BookOpenCheck, title: "accessibility", description: "accessibilityDetail" },
    ],
    activity: [
      { title: "case", meta: "caseMeta", value: "№ 48291", tone: "positive" },
      { title: "document", meta: "documentMeta", value: "PDF" },
      { title: "security", meta: "securityMeta", value: "12:40" },
    ],
  },
};

export function SecondaryServicePage({ serviceId }: { serviceId: SecondaryNavigationItemId }) {
  const service = SECONDARY_SERVICES[serviceId];
  const content = serviceContent[serviceId];
  const Icon = service.icon;
  const { t } = useI18n();
  const { settings } = usePersonalization();
  const prefix = `service.${serviceId}`;
  const label = t(`nav.${serviceId}`, service.label);

  return (
    <div className="space-y-5">
      <Card className="glow-hero metric-glow overflow-hidden p-5 sm:p-7">
        <div className="relative z-10 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(250px,320px)] xl:items-end">
          <div className="max-w-3xl">
            <span className="grid size-12 place-items-center rounded-2xl bg-primary/15 text-primary"><Icon className="size-5" /></span>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">{t(`${prefix}.eyebrow`, service.shortLabel)}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{label}</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{t(`${prefix}.description`, service.description, { bank: settings.brandName })}</p>
          </div>
          <div className="rounded-2xl border bg-background/45 p-4">
            <p className="text-xs text-muted-foreground">{t("service.summary.now", "Сейчас")}</p>
            <p className="number-display mt-1 text-2xl">{t(`${prefix}.metric`, service.metric)}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{t(`${prefix}.summary`)}</p>
            <Button className="mt-4 w-full" onClick={() => toast.success(t("service.toast.demo", "Действие выполнено в демо-режиме"), { description: label })}>{t(`${prefix}.action`, "Открыть детали")}<ArrowUpRight /></Button>
          </div>
        </div>
      </Card>

      <div className="grid auto-rows-fr gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {content.facts.map((fact) => <Card key={fact.label} className="surface-glow min-w-0 p-4"><p className="number-display text-2xl font-bold">{t(`${prefix}.fact.${fact.label}.value`, fact.value)}</p><h2 className="mt-3 text-sm font-bold">{t(`${prefix}.fact.${fact.label}`)}</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">{t(`${prefix}.fact.${fact.detail}`)}</p></Card>)}
      </div>

      {serviceId === "subscriptions" ? <Card className="overflow-hidden p-5 sm:p-7"><SubscriptionPlans /></Card> : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,.65fr)]">
        <Card className="p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-primary">{t("service.features.eyebrow", "Возможности")}</p><h2 className="mt-1 text-xl font-bold">{t(`${prefix}.features.title`)}</h2></div><p className="max-w-md text-xs leading-5 text-muted-foreground">{t(`${prefix}.features.description`)}</p></div>
          <div className="mt-5 grid auto-rows-fr gap-3 sm:grid-cols-2">
            {content.features.map(({ icon: FeatureIcon, title, description }) => <div key={title} className="rounded-2xl border bg-background/35 p-4"><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><FeatureIcon className="size-4" /></span><h3 className="mt-4 text-sm font-bold">{t(`${prefix}.feature.${title}`)}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{t(`${prefix}.feature.${description}`)}</p></div>)}
          </div>
        </Card>

        <Card className="h-fit overflow-hidden">
          <div className="border-b p-5"><p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-primary">{t(`${prefix}.activity.eyebrow`)}</p><h2 className="mt-1 text-lg font-bold">{t(`${prefix}.activity.title`)}</h2></div>
          <div className="divide-y">
            {content.activity.map((item, index) => <div key={item.title} className="flex min-w-0 items-center gap-3 p-4"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary font-mono text-[10px] text-primary">{String(index + 1).padStart(2, "0")}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{t(`${prefix}.activity.${item.title}`)}</p><p className="mt-0.5 truncate text-[11px] text-muted-foreground">{t(`${prefix}.activity.${item.meta}`)}</p></div><span className={item.tone === "positive" ? "shrink-0 font-mono text-xs font-bold text-primary" : "shrink-0 font-mono text-xs font-bold"}>{item.value}</span></div>)}
          </div>
          <button type="button" onClick={() => toast(t("service.toast.history", "История открыта в демонстрационном режиме"))} className="flex w-full items-center justify-between border-t px-5 py-4 text-sm font-bold outline-none transition-colors hover:bg-secondary/45 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">{t(`${prefix}.activity.all`)}<ChevronRight className="size-4 text-muted-foreground" /></button>
        </Card>
      </div>

      {serviceId === "support" ? <SupportLegalCenter /> : null}

      <Card className="p-5 sm:p-6">
        <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><CircleHelp className="size-4" /></span><div><h2 className="text-lg font-bold">{t(`${prefix}.faq.title`)}</h2><p className="mt-1 text-xs text-muted-foreground">{t("service.faq.description", "Короткие ответы на вопросы об условиях и управлении сервисом.")}</p></div></div>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {[1, 2].map((index) => <details key={index} className="group rounded-2xl border bg-background/32 p-4 open:bg-secondary/35"><summary className="cursor-pointer list-none pr-6 text-sm font-bold outline-none">{t(`${prefix}.faq.${index}.question`)}</summary><p className="mt-3 text-xs leading-6 text-muted-foreground">{t(`${prefix}.faq.${index}.answer`, "")}</p></details>)}
        </div>
      </Card>
    </div>
  );
}

const legalLinks: { href: Route; icon: ItemIcon; key: string }[] = [
  { href: "/settings/legal/rules" as Route, icon: Landmark, key: "rules" },
  { href: "/settings/legal/tariffs" as Route, icon: Scale, key: "tariffs" },
  { href: "/settings/legal/privacy" as Route, icon: ShieldCheck, key: "privacy" },
  { href: "/settings/legal/requisites" as Route, icon: FileCheck2, key: "requisites" },
];

function SupportLegalCenter() {
  const { t } = useI18n();
  return <Card className="metric-glow overflow-hidden p-5 sm:p-6"><div className="grid gap-5 xl:grid-cols-[minmax(0,.72fr)_minmax(0,1.28fr)]"><div><span className="grid size-11 place-items-center rounded-2xl bg-primary/12 text-primary"><Landmark className="size-5" /></span><p className="mt-5 font-mono text-[10px] font-bold uppercase tracking-[.16em] text-primary">{t("service.support.legal.eyebrow", "Правовая помощь")}</p><h2 className="mt-2 text-2xl font-bold">{t("service.support.legal.title", "Документы и порядок обращения")}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{t("service.support.legal.description", "Здесь собраны правила обслуживания, тарифы, реквизиты и порядок подачи обращения. Материалы демонстрационные и не являются публичной офертой.")}</p><div className="mt-5 flex flex-wrap gap-2"><Badge variant="success"><CheckCircle2 className="mr-1 size-3" />{t("service.support.legal.disclosure", "Условия раскрыты")}</Badge><Badge variant="secondary"><CalendarClock className="mr-1 size-3" />{t("service.support.legal.updated", "Проверено 5 августа 2026")}</Badge></div></div><div className="grid gap-2 sm:grid-cols-2">{legalLinks.map(({ href, icon: Icon, key }) => <Link key={key} href={href} className="group flex min-w-0 items-start gap-3 rounded-2xl border bg-background/38 p-4 outline-none transition-[border-color,background-color,box-shadow] hover:border-primary/25 hover:bg-secondary/45 focus-visible:ring-2 focus-visible:ring-ring"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-primary"><Icon className="size-4" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-bold">{t(`service.support.legal.${key}.title`)}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{t(`service.support.legal.${key}.description`)}</span></span><ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" /></Link>)}</div></div><div className="mt-5 grid gap-3 border-t pt-5 md:grid-cols-3">{[{ icon: Headphones, key: "appeal" }, { icon: Bot, key: "fraud" }, { icon: Scale, key: "ombudsman" }].map(({ icon: Icon, key }) => <div key={key} className="flex gap-3 rounded-2xl bg-secondary/35 p-4"><Icon className="size-4 shrink-0 text-primary" /><div><p className="text-sm font-bold">{t(`service.support.process.${key}.title`)}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{t(`service.support.process.${key}.description`)}</p></div></div>)}</div></Card>;
}
