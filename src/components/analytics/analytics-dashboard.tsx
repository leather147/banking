"use client";

import NumberFlow from "@number-flow/react";
import { ArrowDownRight, ArrowUpRight, Sparkles, Target } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cashflowData, categoryData } from "@/lib/data";

export function AnalyticsDashboard() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Доходы" value={258400} change="+12,4%" positive icon={<ArrowUpRight />} />
        <Metric label="Расходы" value={96120} change="−8,1%" positive icon={<ArrowDownRight />} />
        <Metric label="Свободно" value={162280} change="63% дохода" icon={<Sparkles />} />
        <Metric label="Накоплено" value={48000} change="80% цели" positive icon={<Target />} />
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,.75fr)]">
        <Card className="glow-hero metric-glow relative overflow-hidden">
          <CardHeader className="flex-row items-start justify-between"><div><CardTitle>Денежный поток</CardTitle><p className="mt-1 text-xs text-muted-foreground">тыс. ₽ · последние 6 месяцев</p></div><Tabs defaultValue="6m"><TabsList><TabsTrigger value="1m">1М</TabsTrigger><TabsTrigger value="6m">6М</TabsTrigger><TabsTrigger value="1y">1Г</TabsTrigger></TabsList></Tabs></CardHeader>
          <CardContent className="h-[330px] pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart accessibilityLayer data={cashflowData} margin={{ left: -18, right: 8, top: 15 }}>
                <defs><linearGradient id="income" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.3} /><stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} /></linearGradient><linearGradient id="expense" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.2} /><stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 7" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} formatter={(value, name) => [`${value} 000 ₽`, name === "income" ? "Доход" : "Расход"]} />
                <Area type="monotone" dataKey="income" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#income)" />
                <Area type="monotone" dataKey="expense" stroke="var(--chart-2)" strokeWidth={2.2} fill="url(#expense)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Структура расходов</CardTitle><p className="text-xs text-muted-foreground">76 900 ₽ распределено</p></CardHeader>
          <CardContent>
            <div className="mx-auto h-[210px] max-w-xs">
              <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={88} paddingAngle={4} stroke="transparent">{categoryData.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} formatter={(value) => [`${Number(value).toLocaleString("ru-RU")} ₽`]} /></PieChart></ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3">{categoryData.map((item) => <div key={item.name} className="flex items-center gap-2"><span className="size-2 rounded-full" style={{ background: item.color }} /><div><p className="text-xs">{item.name}</p><p className="font-mono text-[10px] text-muted-foreground">{item.value.toLocaleString("ru-RU")} ₽</p></div></div>)}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card><CardHeader><CardTitle>Месячный бюджет</CardTitle><p className="text-xs text-muted-foreground">96 120 ₽ из 150 000 ₽</p></CardHeader><CardContent><Progress value={64} className="h-3" /><div className="mt-3 flex justify-between text-xs text-muted-foreground"><span>Осталось 53 880 ₽</span><span>64%</span></div><p className="mt-5 rounded-xl bg-primary/10 p-3 text-sm"><Sparkles className="mr-2 inline size-4 text-primary" />Темп расходов на 8% ниже июля. Отличная динамика.</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Цель «Путешествие»</CardTitle><p className="text-xs text-muted-foreground">48 000 ₽ из 60 000 ₽</p></CardHeader><CardContent><Progress value={80} className="h-3" indicatorClassName="bg-chart-3" /><div className="mt-3 flex justify-between text-xs text-muted-foreground"><span>Осталось 12 000 ₽</span><span>80%</span></div><p className="mt-5 rounded-xl bg-secondary p-3 text-sm"><Target className="mr-2 inline size-4 text-chart-3" />При текущем темпе цель будет закрыта 28 августа.</p></CardContent></Card>
      </div>
    </div>
  );
}

function Metric({ label, value, change, positive = false, icon }: { label: string; value: number; change: string; positive?: boolean; icon: React.ReactNode }) {
  return <Card className="p-5"><div className="flex items-center justify-between text-sm font-medium text-muted-foreground"><span>{label}</span><span className="grid size-8 place-items-center rounded-lg bg-secondary [&_svg]:size-4">{icon}</span></div><p className="number-display mt-5 text-2xl font-bold tracking-tight"><NumberFlow value={value} format={{ style: "currency", currency: "RUB", maximumFractionDigits: 0 }} /></p><p className={positive ? "mt-2 font-mono text-xs text-primary" : "mt-2 font-mono text-xs text-muted-foreground"}>{change}</p></Card>;
}
