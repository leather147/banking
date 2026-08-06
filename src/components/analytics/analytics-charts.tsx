"use client";

import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AnalyticsCategory, AnalyticsMonth } from "@/lib/analytics";
import type { CurrencyCode } from "@/lib/currency";

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

export function CashflowChart({ data, locale, currency }: { data: AnalyticsMonth[]; locale: string; currency: CurrencyCode }) {
  const formatter = new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0, notation: "compact" });
  return <ResponsiveContainer width="100%" height="100%">
    <AreaChart accessibilityLayer data={data} margin={{ left: -18, right: 8, top: 15 }}>
      <defs><linearGradient id="account-income" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.3} /><stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} /></linearGradient><linearGradient id="account-expense" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.2} /><stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} /></linearGradient></defs>
      <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 7" />
      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
      <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} tickFormatter={(value) => formatter.format(Number(value))} />
      <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} formatter={(value, name) => [formatter.format(Number(value)), name === "income" ? "Доход" : "Расход"]} />
      <Area type="monotone" dataKey="income" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#account-income)" />
      <Area type="monotone" dataKey="expense" stroke="var(--chart-2)" strokeWidth={2.2} fill="url(#account-expense)" />
    </AreaChart>
  </ResponsiveContainer>;
}

export function CategoryChart({ data, locale, currency }: { data: AnalyticsCategory[]; locale: string; currency: CurrencyCode }) {
  const formatter = new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 });
  return <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={88} paddingAngle={4} stroke="transparent">{data.map((item, index) => <Cell key={item.name} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} formatter={(value) => [formatter.format(Number(value))]} /></PieChart></ResponsiveContainer>;
}

export const ANALYTICS_COLORS = COLORS;
