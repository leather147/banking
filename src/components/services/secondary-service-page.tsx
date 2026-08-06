"use client";

import { ArrowUpRight, CheckCircle2, Clock3, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { SecondaryNavigationItemId } from "@/lib/personalization";
import { SECONDARY_SERVICES } from "@/lib/secondary-services";

export function SecondaryServicePage({ serviceId }: { serviceId: SecondaryNavigationItemId }) {
  const service = SECONDARY_SERVICES[serviceId];
  const Icon = service.icon;
  return (
    <div className="space-y-4">
      <Card className="glow-hero metric-glow overflow-hidden p-5 sm:p-7">
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl"><span className="grid size-12 place-items-center rounded-2xl bg-primary/15 text-primary"><Icon className="size-5" /></span><p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">{service.shortLabel}</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{service.label}</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">{service.description}. Это полноценный демонстрационный экран: действия сохраняют текущую механику приложения, не отправляя реальные банковские запросы.</p></div>
          <div className="rounded-2xl border bg-background/45 p-4 sm:min-w-52"><p className="text-xs text-muted-foreground">Сейчас</p><p className="number-display mt-1 text-2xl">{service.metric}</p><Button className="mt-4 w-full" onClick={() => toast.success(`${service.label}: действие выполнено в демо-режиме`)}>Открыть детали<ArrowUpRight /></Button></div>
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        {[{ icon: Sparkles, title: "Рекомендации", text: "Подборка на основе демонстрационной истории операций." }, { icon: Clock3, title: "Ближайшее событие", text: "Ничего важного не пропустите — напомним заранее." }, { icon: CheckCircle2, title: "Всё настроено", text: "Параметры синхронизированы с cookie этого браузера." }].map(({ icon: ItemIcon, title, text }) => <Card key={title}><CardContent className="p-5"><span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary"><ItemIcon className="size-4" /></span><h2 className="mt-4 font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></CardContent></Card>)}
      </div>
    </div>
  );
}
