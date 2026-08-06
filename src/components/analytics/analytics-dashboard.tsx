"use client";

import NumberFlow from "@number-flow/react";
import dynamic from "next/dynamic";
import * as React from "react";
import { Activity, ArrowDownRight, ArrowUpRight, BadgePercent, Calculator, CircleAlert, Clock3, RefreshCw, Sparkles, WalletCards } from "lucide-react";
import { z } from "zod";
import { BankOfferGrid } from "@/components/shared/bank-offer-grid";
import { useI18n } from "@/components/providers/i18n-provider";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { generateAccountAnalytics } from "@/lib/analytics";
import { getVisibleCards } from "@/lib/cards";
import { useCookieState } from "@/lib/cookies";
import { useOperations } from "@/lib/operations";
import { cn } from "@/lib/utils";
import { convertFromRub, formatAppMoney, type CurrencyCode } from "@/lib/currency";

const CashflowChart = dynamic(() => import("@/components/analytics/analytics-charts").then((module) => module.CashflowChart), { ssr: false, loading: () => <Skeleton className="h-full w-full rounded-2xl" /> });
const CategoryChart = dynamic(() => import("@/components/analytics/analytics-charts").then((module) => module.CategoryChart), { ssr: false, loading: () => <Skeleton className="h-full w-full rounded-full" /> });
const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];
const ANALYTICS_TTL = 60 * 60 * 1_000;

export function AnalyticsDashboard() {
  const { locale, t } = useI18n();
  const { settings } = usePersonalization();
  const [operations, , operationsHydrated] = useOperations();
  const [lastCalculated, setLastCalculated, ttlHydrated] = useCookieState("lumen-analytics-last-calculated", z.number().nonnegative(), 0);
  const [calculating, setCalculating] = React.useState(false);
  const balance = React.useMemo(() => getVisibleCards(settings.demoCardCount).reduce((total, card) => total + card.balance, 0), [settings.demoCardCount]);
  const analytics = React.useMemo(() => generateAccountAnalytics(operations, balance), [balance, operations]);

  React.useEffect(() => {
    if (!ttlHydrated || !operationsHydrated || Date.now() - lastCalculated < ANALYTICS_TTL) return;
    const startTimer = window.setTimeout(() => setCalculating(true), 0);
    const finishTimer = window.setTimeout(() => {
      setCalculating(false);
      setLastCalculated(Date.now());
    }, 1_150);
    return () => { window.clearTimeout(startTimer); window.clearTimeout(finishTimer); };
  }, [lastCalculated, operationsHydrated, setLastCalculated, ttlHydrated]);

  const currency = settings.currencyCode;
  const money = React.useCallback((value: number) => formatAppMoney(value, locale, currency), [currency, locale]);
  const categories = analytics.categories.slice(0, 4);

  return <div className="space-y-4">
    {calculating ? <Card className="overflow-hidden border-primary/30"><CardContent className="relative flex min-h-24 items-center gap-4 p-5"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary"><Calculator className="size-5 animate-pulse" /></span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><p className="font-bold">{t("analytics.computing.title", "Пересчитываем аналитику счёта")}</p><span className="font-mono text-[10px] text-primary">LIVE</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary"><span className="block h-full w-full origin-left animate-[analytics-compute_1.1s_ease-out_forwards] rounded-full bg-primary" /></div><p className="mt-2 text-xs text-muted-foreground">{t("analytics.computing.description", "Сопоставляем операции, категории, комиссии и прогноз остатка.")}</p></div></CardContent></Card> : null}

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Metric label={t("analytics.metric.income", "Доходы")} value={analytics.income} change={t("analytics.metric.income.change", "За доступный период")} positive icon={<ArrowUpRight />} currency={currency} />
      <Metric label={t("analytics.metric.expense", "Расходы")} value={analytics.expense} change={`${analytics.expenseChange > 0 ? "+" : ""}${analytics.expenseChange.toFixed(1)}% к прошлому периоду`} icon={<ArrowDownRight />} currency={currency} />
      <Metric label={t("analytics.metric.free", "Чистый поток")} value={analytics.netCashflow} change={`${analytics.savingsRate.toFixed(0)}% от дохода`} positive={analytics.netCashflow >= 0} icon={<Sparkles />} currency={currency} />
      <Metric label={t("analytics.metric.balance", "Баланс счетов")} value={balance} change={`Прогноз 30 дней: ${money(analytics.projectedBalance30d)}`} positive icon={<WalletCards />} currency={currency} />
    </div>

    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,.75fr)]">
      <Card className="glow-hero metric-glow relative overflow-hidden"><CardHeader><CardTitle>{t("analytics.cashflow.title", "Денежный поток")}</CardTitle><p className="text-xs text-muted-foreground">{t("analytics.cashflow.generated", "Рассчитано по операциям за последние шесть месяцев")}</p></CardHeader><CardContent className="h-[300px] pt-2 sm:h-[330px]"><CashflowChart data={analytics.months.map((month) => ({ ...month, income: convertFromRub(month.income, currency), expense: convertFromRub(month.expense, currency) }))} locale={locale} currency={currency} /></CardContent></Card>
      <Card><CardHeader><CardTitle>{t("analytics.structure.title", "Структура расходов")}</CardTitle><p className="text-xs text-muted-foreground">{money(analytics.expense)} {t("analytics.structure.distributed", "распределено")}</p></CardHeader><CardContent>{categories.length ? <><div className="mx-auto h-[210px] max-w-xs"><CategoryChart data={categories.map((item) => ({ ...item, value: convertFromRub(item.value, currency) }))} locale={locale} currency={currency} /></div><div className="grid grid-cols-2 gap-3">{categories.map((item, index) => <div key={item.name} className="min-w-0"><div className="flex items-center gap-2"><span className="size-2 shrink-0 rounded-full" style={{ background: CHART_COLORS[index % CHART_COLORS.length] }} /><p className="truncate text-xs">{item.name}</p></div><p className="mt-1 font-mono text-[10px] text-muted-foreground">{money(item.value)} · {item.share.toFixed(0)}%</p></div>)}</div></> : <p className="py-20 text-center text-sm text-muted-foreground">{t("analytics.structure.empty", "Недостаточно расходных операций")}</p>}</CardContent></Card>
    </div>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Insight icon={Activity} title={t("analytics.insight.health", "Финансовый индекс")} value={`${analytics.healthScore}/100`} detail={t("analytics.insight.health.detail", "Демонстрационная оценка потока, комиссий и аномалий")} accent />
      <Insight icon={Clock3} title={t("analytics.insight.daily", "В среднем в день")} value={money(analytics.averageDailyExpense)} detail={`${t("analytics.insight.median", "Медианный платёж")}: ${money(analytics.medianExpense)}`} />
      <Insight icon={RefreshCw} title={t("analytics.insight.recurring", "Повторяющиеся") } value={`${analytics.recurringCount}`} detail={t("analytics.insight.recurring.detail", "Группы регулярных списаний с близкой суммой")} />
      <Insight icon={CircleAlert} title={t("analytics.insight.control", "На контроле")} value={`${analytics.anomalyCount + analytics.rejectedCount}`} detail={`${money(analytics.pendingAmount)} ${t("analytics.insight.pending", "сейчас в обработке")}`} />
    </div>

    <div className="grid gap-4 lg:grid-cols-2">
      <Card><CardHeader><CardTitle>{t("analytics.budget.title", "Месячный бюджет")}</CardTitle><p className="text-xs text-muted-foreground">{money(analytics.expense)} {t("analytics.budget.of", "из")} {money(150_000)}</p></CardHeader><CardContent><Progress value={Math.min(100, analytics.expense / 1_500)} className="h-3" /><div className="mt-3 flex justify-between text-xs text-muted-foreground"><span>{t("analytics.budget.remaining", "Осталось")} {money(Math.max(0, 150_000 - analytics.expense))}</span><span>{Math.min(100, analytics.expense / 1_500).toFixed(0)}%</span></div><p className="mt-5 rounded-xl bg-primary/10 p-3 text-sm"><Sparkles className="mr-2 inline size-4 text-primary" />{analytics.expenseChange <= 0 ? t("analytics.budget.insight.good", "Темп расходов ниже прошлого периода.") : t("analytics.budget.insight.watch", "Расходы растут — проверьте крупные категории.")}</p></CardContent></Card>
      <Card><CardHeader><CardTitle>{t("analytics.fees.title", "Комиссии и эффективность")}</CardTitle><p className="text-xs text-muted-foreground">{t("analytics.fees.description", "Фактические комиссии по выполненным операциям")}</p></CardHeader><CardContent><div className="flex items-end justify-between gap-4"><p className="number-display text-3xl font-bold">{money(analytics.fees)}</p><BadgePercent className="size-7 text-primary" /></div><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-secondary/45 p-3"><p className="text-[10px] text-muted-foreground">{t("analytics.fees.share", "Доля расходов")}</p><p className="mt-1 font-mono font-bold">{analytics.expense ? ((analytics.fees / analytics.expense) * 100).toFixed(2) : "0.00"}%</p></div><div className="rounded-xl bg-secondary/45 p-3"><p className="text-[10px] text-muted-foreground">{t("analytics.fees.saved", "Чистый поток")}</p><p className={cn("mt-1 font-mono font-bold", analytics.netCashflow >= 0 ? "text-primary" : "text-destructive")}>{money(analytics.netCashflow)}</p></div></div></CardContent></Card>
    </div>
    <BankOfferGrid context="analytics" />
  </div>;
}

function Metric({ label, value, change, positive = false, icon, currency }: { label: string; value: number; change: string; positive?: boolean; icon: React.ReactNode; currency: CurrencyCode }) {
  return <Card className="p-4 sm:p-5"><div className="flex items-center justify-between gap-3 text-sm font-medium text-muted-foreground"><span>{label}</span><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-secondary [&_svg]:size-4">{icon}</span></div><p className="number-display mt-5 truncate text-[clamp(1.3rem,6vw,1.65rem)] font-bold tracking-tight"><NumberFlow value={convertFromRub(value, currency)} format={{ style: "currency", currency, maximumFractionDigits: currency === "RUB" || currency === "KZT" ? 0 : 2 }} /></p><p className={positive ? "mt-2 text-xs text-primary" : "mt-2 text-xs text-muted-foreground"}>{change}</p></Card>;
}

function Insight({ icon: Icon, title, value, detail, accent = false }: { icon: typeof Activity; title: string; value: string; detail: string; accent?: boolean }) {
  return <Card className={cn("p-4", accent && "border-primary/25 bg-primary/[0.045]")}><span className="grid size-9 place-items-center rounded-xl bg-secondary text-primary"><Icon className="size-4" /></span><p className="mt-4 text-xs text-muted-foreground">{title}</p><p className="number-display mt-1 text-2xl font-bold">{value}</p><p className="mt-1 text-[11px] leading-5 text-muted-foreground">{detail}</p></Card>;
}
