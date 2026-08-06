"use client";

import type { Route } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, Bell, CircleHelp, Coins, CreditCard, FileText, Gift, Headphones, HeartPulse, MessageCircle, Percent, PiggyBank, Plane, Scale, Search, Shield, Sparkles, Store, Umbrella } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PaymentNavigation } from "@/components/payments/flow-primitives";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePersonalization } from "@/components/providers/personalization-provider";

type ServiceItem = { title: string; description: string; icon: typeof CreditCard; href?: Route };

const groups: { title: string; items: ServiceItem[] }[] = [
  { title: "Финансы", items: [
    { title: "Карты и счета", description: "Баланс и управление", icon: CreditCard, href: "/cards" },
    { title: "Накопления", description: "Цели и копилки", icon: PiggyBank },
    { title: "Инвестиции", description: "Портфель и идеи", icon: BarChart3, href: "/analytics" },
    { title: "Обмен валют", description: "Курсы и конвертация", icon: Coins },
  ] },
  { title: "Защита и документы", items: [
    { title: "Страхование", description: "Полисы для вас", icon: Umbrella },
    { title: "Здоровье", description: "Врачи и программы", icon: HeartPulse },
    { title: "Документы", description: "Данные и справки", icon: FileText, href: "/profile/documents" },
    { title: "Безопасность", description: "Вход и приватность", icon: Shield, href: "/settings/security" },
  ] },
  { title: "Покупки и бонусы", items: [
    { title: "Спасибо", description: "Бонусы и уровень", icon: Gift },
    { title: "Предложения", description: "Кешбэк партнёров", icon: Percent },
    { title: "Маркет", description: "Покупки с выгодой", icon: Store },
    { title: "Путешествия", description: "Билеты и отели", icon: Plane },
  ] },
  { title: "Поддержка", items: [
    { title: "Чат с банком", description: "Ответим онлайн", icon: MessageCircle },
    { title: "Позвонить", description: "Служба поддержки", icon: Headphones },
    { title: "Уведомления", description: "Каналы и события", icon: Bell, href: "/settings/notifications" },
    { title: "Правовой центр", description: "Документы и ответы", icon: Scale, href: "/settings/legal" },
  ] },
];

export function ServicesScreen() {
  const [query, setQuery] = useState("");
  const { settings } = usePersonalization();
  const filteredGroups = useMemo(() => groups.map((group) => ({ ...group, items: group.items.map((item) => item.title === "Спасибо" ? { ...item, title: `${settings.brandName} Спасибо` } : item).filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(query.toLowerCase())) })).filter((group) => group.items.length), [query, settings.brandName]);

  return (
    <>
      <PaymentNavigation active="services" />
      <Card className="glow-hero metric-glow relative mb-4 overflow-hidden border-primary/30">
        <CardContent className="relative z-10 grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div><span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-[11px] text-primary"><Sparkles className="size-3" />{settings.brandName} Plus</span><h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">Все возможности банка в одном месте</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Управляйте продуктами, бонусами и поддержкой из единого каталога.</p></div>
          <Button type="button" variant="outline" className="w-fit bg-background/65" onClick={() => toast(`Витрина ${settings.brandName} Plus открыта в демо-режиме`)}>Узнать о подписке<ArrowRight /></Button>
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardContent className="p-4">
          <Label htmlFor="catalog-search" className="sr-only">Поиск сервиса</Label>
          <div className="relative"><Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" /><Input id="catalog-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по продуктам и сервисам" className="h-13 pl-12" /></div>
        </CardContent>
      </Card>
      {filteredGroups.length ? <div className="grid gap-4 xl:grid-cols-2">
        {filteredGroups.map((group) => <Card key={group.title}><CardHeader><CardTitle>{group.title}</CardTitle><CardDescription>Доступные разделы и настройки</CardDescription></CardHeader><CardContent className="grid gap-2 sm:grid-cols-2">{group.items.map((item) => <ServiceTile key={item.title} item={item} />)}</CardContent></Card>)}
      </div> : <Card><CardContent className="grid min-h-72 place-items-center text-center"><div><CircleHelp className="mx-auto size-8 text-muted-foreground" /><p className="mt-3 font-medium">Сервис не найден</p><p className="mt-1 text-sm text-muted-foreground">Попробуйте другой запрос.</p></div></CardContent></Card>}
    </>
  );
}

function ServiceTile({ item }: { item: ServiceItem }) {
  const content = <><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary"><item.icon className="size-4" /></span><span className="min-w-0"><span className="block text-sm font-medium">{item.title}</span><span className="block truncate text-[11px] text-muted-foreground">{item.description}</span></span><ArrowRight className="ml-auto size-4 text-muted-foreground" /></>;
  const className = "flex min-h-16 items-center gap-3 rounded-2xl border bg-background/45 p-3 text-left outline-none transition-[background-color,border-color,box-shadow] hover:border-primary/25 hover:bg-secondary hover:shadow-[0_0_24px_-20px_var(--glow-lime)] focus-visible:ring-2 focus-visible:ring-ring";
  return item.href ? <Link href={item.href} className={className}>{content}</Link> : <button type="button" className={className} onClick={() => toast(`Раздел «${item.title}» доступен как демонстрационная заглушка`)}>{content}</button>;
}
