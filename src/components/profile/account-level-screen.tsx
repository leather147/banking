"use client";

import { Check, Crown, Gauge, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PageHeading } from "@/components/shared/page-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const levels = [
  { name: "Базовый", icon: ShieldCheck, caption: "Для ежедневных операций", items: ["Переводы до 300 000 ₽", "Стандартная проверка", "Поддержка в чате"] },
  { name: "Активный", icon: Gauge, caption: "Текущий уровень", items: ["Повышенные лимиты", "Быстрые справки", "Приоритет спорных операций"], active: true },
  { name: "Премиальный", icon: Crown, caption: "Для расширенного обслуживания", items: ["Персональная линия", "Лимиты по согласованию", "Расширенная защита поездок"] },
];

export function AccountLevelScreen() {
  return <div><PageHeading eyebrow="LUMEN BANK ID" title="Уровень счёта" description="Уровень определяет лимиты и обслуживание учётной записи. Он не является подпиской банка." /><div className="grid gap-3 lg:grid-cols-3">{levels.map(({ name, icon: Icon, caption, items, active }) => <Card key={name} className={active ? "border-primary/35 bg-primary/[0.055] p-5" : "p-5"}><div className="flex items-start justify-between"><span className="grid size-11 place-items-center rounded-2xl bg-secondary text-primary"><Icon className="size-5" /></span>{active ? <span className="rounded-full bg-primary/13 px-2.5 py-1 font-mono text-[10px] text-primary">ТЕКУЩИЙ</span> : null}</div><h2 className="mt-6 text-xl font-bold">{name}</h2><p className="mt-1 text-xs text-muted-foreground">{caption}</p><ul className="mt-5 space-y-3">{items.map((item) => <li key={item} className="flex gap-2 text-sm"><Check className="mt-0.5 size-4 shrink-0 text-primary" />{item}</li>)}</ul><Button variant={active ? "outline" : "default"} disabled={active} className="mt-6 w-full" onClick={() => toast.success("Заявка на изменение уровня создана", { description: "Это демонстрационный сценарий без передачи данных." })}>{active ? "Уровень подключён" : "Подать заявку"}</Button></Card>)}</div><Card className="mt-4 flex items-start gap-3 p-5"><Sparkles className="mt-0.5 size-5 shrink-0 text-primary" /><div><p className="font-bold">Чем уровень отличается от подписки</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Уровень связан с проверкой профиля, лимитами и обслуживанием счёта. Подписка объединяет бонусы и сервисы и управляется отдельно.</p></div></Card></div>;
}
