"use client";

import * as React from "react";
import { Check, Crown, Gem, ShieldCheck, Sparkles, UsersRound, Zap } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/components/providers/i18n-provider";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type PlanId = "light" | "plus" | "ultra";
type SubscriptionPlan = {
  id: PlanId;
  monthly: number;
  annual: number;
  discount: number;
  icon: typeof Zap;
  tint: string;
  featureCount: number;
  recommended?: boolean;
};

const plans = [
  {
    id: "light",
    monthly: 199,
    annual: 1990,
    discount: 17,
    icon: Zap,
    tint: "from-chart-3/18 via-transparent to-transparent",
    featureCount: 7,
    recommended: false,
  },
  {
    id: "plus",
    monthly: 399,
    annual: 3590,
    discount: 25,
    icon: Crown,
    tint: "from-primary/24 via-primary/7 to-transparent",
    featureCount: 8,
    recommended: true,
  },
  {
    id: "ultra",
    monthly: 899,
    annual: 7490,
    discount: 31,
    icon: Gem,
    tint: "from-chart-4/22 via-chart-2/8 to-transparent",
    featureCount: 9,
    recommended: false,
  },
] as const satisfies readonly SubscriptionPlan[];

export function SubscriptionPlans({ placement = "app", showComparison = true }: { placement?: "app" | "landing"; showComparison?: boolean }) {
  const [annual, setAnnual] = React.useState(true);
  const { locale, t } = useI18n();
  const { settings } = usePersonalization();

  function choosePlan(id: PlanId) {
    toast.success(t("subscription.toast.selected", "Тариф выбран в демо-режиме"), {
      description: t(`subscription.plan.${id}.name`, id),
    });
  }

  return (
    <section aria-labelledby={`subscription-title-${placement}`} className={cn("space-y-6", placement === "landing" && "mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-8")}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary">{t("subscription.eyebrow", "Подписка банка")}</p>
          <h2 id={`subscription-title-${placement}`} className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{t("subscription.title", "Больше пользы от ежедневных финансов")}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{t("subscription.description", "Выберите уровень сервисов, бонусов и поддержки. Годовой план оплачивается один раз и уже включает скидку.", { bank: settings.brandName })}</p>
        </div>
        <div className="glass-panel inline-grid w-full grid-cols-2 rounded-2xl border bg-background/48 p-1.5 sm:w-auto" role="group" aria-label={t("subscription.billing.label", "Период оплаты")}>
          <button type="button" aria-pressed={!annual} onClick={() => setAnnual(false)} className={cn("rounded-xl px-4 py-2.5 text-sm font-bold outline-none transition-[background-color,color,box-shadow] focus-visible:ring-2 focus-visible:ring-ring", !annual ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground")}>{t("subscription.billing.month", "Месяц")}</button>
          <button type="button" aria-pressed={annual} onClick={() => setAnnual(true)} className={cn("flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold outline-none transition-[background-color,color,box-shadow] focus-visible:ring-2 focus-visible:ring-ring", annual ? "bg-primary text-primary-foreground shadow-[0_0_26px_-14px_var(--glow-lime)]" : "text-muted-foreground hover:text-foreground")}>{t("subscription.billing.year", "Год")}<span className={cn("rounded-full px-2 py-0.5 font-mono text-[9px]", annual ? "bg-primary-foreground/12" : "bg-primary/10 text-primary")}>{t("subscription.billing.discount", "со скидкой")}</span></button>
        </div>
      </div>

      <div className="grid auto-rows-fr gap-4 lg:grid-cols-3">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const monthlyEquivalent = annual ? Math.round(plan.annual / 12) : plan.monthly;
          const saving = plan.monthly * 12 - plan.annual;
          return (
            <Card key={plan.id} className={cn("surface-glow relative flex h-full min-w-0 flex-col overflow-hidden border p-5 sm:p-6", plan.recommended ? "border-primary/45 shadow-[0_0_55px_-34px_var(--glow-lime)]" : "border-border/80")}>
              <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br", plan.tint)} />
              <div className="relative flex h-full flex-col">
                <div className="flex items-start justify-between gap-3">
                  <span className={cn("grid size-12 place-items-center rounded-2xl border bg-background/58", plan.recommended ? "border-primary/30 text-primary" : "border-border text-foreground")}><Icon className="size-5" /></span>
                  <div className="flex flex-col items-end gap-1.5">
                    {plan.recommended ? <span className="rounded-full bg-primary px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.12em] text-primary-foreground">{t("subscription.recommended", "Оптимальный")}</span> : null}
                    {annual ? <span className="rounded-full border border-primary/20 bg-primary/8 px-2.5 py-1 font-mono text-[10px] font-bold text-primary">−{plan.discount}%</span> : null}
                  </div>
                </div>

                <p className="mt-6 font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">{t(`subscription.plan.${plan.id}.audience`)}</p>
                <h3 className="mt-1 text-2xl font-bold">{t(`subscription.plan.${plan.id}.name`)}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{t(`subscription.plan.${plan.id}.tagline`)}</p>

                <div className="mt-6 rounded-2xl border border-white/6 bg-background/38 p-4 backdrop-blur-xl">
                  <div className="flex flex-wrap items-end gap-x-2 gap-y-1"><span className="number-display text-4xl font-bold tracking-tight">{monthlyEquivalent.toLocaleString(locale)}</span><span className="pb-1 text-sm text-muted-foreground">{t("subscription.price.perMonth", "₽ / месяц")}</span></div>
                  {annual ? <><p className="mt-2 text-xs font-semibold">{plan.annual.toLocaleString(locale)} ₽ · {t("subscription.price.billedYear", "спишется за год")}</p><p className="mt-1 font-mono text-[10px] text-primary">{t("subscription.price.saving", "Экономия {amount} ₽ за год", { amount: saving.toLocaleString(locale) })}</p></> : <p className="mt-2 text-xs text-muted-foreground">{t("subscription.price.cancel", "Помесячно, без годовой скидки · отмена в любой момент")}</p>}
                </div>

                <div className="mt-6 flex-1 space-y-3">
                  {Array.from({ length: plan.featureCount }, (_, index) => (
                    <p key={index} className="flex items-start gap-2.5 text-sm leading-5"><span className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full", plan.recommended ? "bg-primary text-primary-foreground" : "bg-secondary text-primary")}><Check className="size-3" /></span><span>{t(`subscription.plan.${plan.id}.feature.${index + 1}`)}</span></p>
                  ))}
                </div>

                <div className="mt-6 border-t border-border/70 pt-4">
                  <p className="text-[10px] font-bold uppercase tracking-[.14em] text-muted-foreground">{t("subscription.included", "Включённые сервисы")}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">{[1, 2, 3].map((index) => <span key={index} className="rounded-full bg-secondary/72 px-2.5 py-1 text-[10px] font-semibold">{t(`subscription.plan.${plan.id}.service.${index}`)}</span>)}</div>
                  <Button className="mt-5 w-full" variant={plan.recommended ? "default" : "outline"} onClick={() => choosePlan(plan.id)}>{t("subscription.choose", "Выбрать тариф")}<Sparkles /></Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {showComparison ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: ShieldCheck, key: "security" },
          { icon: UsersRound, key: "family" },
          { icon: Sparkles, key: "bonuses" },
          { icon: Crown, key: "priority" },
        ].map(({ icon: Icon, key }) => <div key={key} className="glass-panel flex min-w-0 gap-3 rounded-2xl border bg-background/32 p-4"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="size-4" /></span><div className="min-w-0"><p className="text-sm font-bold">{t(`subscription.fact.${key}.title`)}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{t(`subscription.fact.${key}.description`)}</p></div></div>)}
      </div> : null}

      <p className="text-center text-[11px] leading-5 text-muted-foreground">{t("subscription.legal", "Условия демонстрационные. До подключения банк покажет состав тарифа, дату первого списания и порядок отказа от подписки.")}</p>
    </section>
  );
}
