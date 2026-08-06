"use client";

import NumberFlow from "@number-flow/react";
import { ArrowUpRight, Eye, MoreHorizontal } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { balanceTrend } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/components/providers/i18n-provider";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { convertFromRub, formatAppMoney } from "@/lib/currency";

export function BalanceHero() {
  const { locale, t } = useI18n();
  const { settings, setSetting } = usePersonalization();
  return (
    <Card className="glow-hero metric-glow relative min-h-[270px] overflow-hidden border-primary/30 p-5 sm:min-h-[354px] sm:p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <button type="button" onClick={() => setSetting("balanceHidden", !settings.balanceHidden)} className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><span>{t("dashboard.balance")}</span><Eye className="size-3.5" /></button>
          <div className="number-display glow-text mt-2 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
            {settings.balanceHidden ? <span aria-label={t("dashboard.balance.hidden", "Баланс скрыт")}>••••••</span> : <NumberFlow value={convertFromRub(728120, settings.currencyCode)} format={{ style: "currency", currency: settings.currencyCode, maximumFractionDigits: settings.currencyCode === "RUB" || settings.currencyCode === "KZT" ? 0 : 2 }} />}
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm"><span className="inline-flex items-center gap-1 font-bold text-primary"><ArrowUpRight className="size-4" />7,6%</span><span className="text-muted-foreground">{t("dashboard.last30")}</span></div>
        </div>
        <Button size="icon" variant="outline" aria-label="Другие действия"><MoreHorizontal /></Button>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[132px] px-2 pb-3 opacity-60 sm:h-[215px] sm:px-4 sm:opacity-100">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart accessibilityLayer data={balanceTrend} margin={{ top: 12, left: 0, right: 0, bottom: 0 }}>
            <defs><linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.32} /><stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 7" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} tickMargin={10} />
            <Tooltip cursor={{ stroke: "var(--chart-1)", strokeDasharray: "4 4" }} contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} formatter={(value) => [formatAppMoney(Number(value) * 1_000, locale, settings.currencyCode), t("dashboard.balance", "Баланс")]} />
            <Area type="monotone" dataKey="value" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#balanceFill)" activeDot={{ r: 5, fill: "var(--chart-1)", stroke: "var(--background)", strokeWidth: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
