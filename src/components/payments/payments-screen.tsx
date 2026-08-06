"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { BadgePercent, CalendarClock, Car, ChevronDown, ChevronRight, CircleDollarSign, Gamepad2, GraduationCap, HandHeart, HeartPulse, Home, Landmark, Plane, QrCode, ReceiptText, Search, ShieldCheck, ShoppingBag, Smartphone, Tv, Wifi } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AmountPresets, FeeBreakdown, formatRubles, maskAccount, maskCard, maskPhone, PaymentNavigation, ResponsiveAmountInput, ReviewDialog, SourceAccount } from "@/components/payments/flow-primitives";
import { SmartSuggestions } from "@/components/operations/smart-suggestions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SECURITY_SETTINGS_DEFAULTS } from "@/lib/app-settings";
import { useCookieState } from "@/lib/cookies";
import { cn } from "@/lib/utils";
import { operationDetailsPath, saveOperation } from "@/lib/operations";
import { preferenceSchema } from "@/lib/schemas";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { getConfiguredDate } from "@/lib/personalization";

const paymentSchema = z.object({
  account: z.string().trim().min(5, "Введите телефон или лицевой счёт"),
  extra: z.string(),
  amount: z.string().trim().min(1, "Введите сумму").refine((value) => Number(value.replace(/\s/g, "")) > 0, "Сумма должна быть больше нуля").refine((value) => Number(value.replace(/\s/g, "")) <= 300000, "Лимит платежа — 300 000 ₽"),
  scheduleAt: z.string(),
});

type PaymentValues = z.infer<typeof paymentSchema>;

const services = [
  { id: "mobile", title: "Мобильная связь", hint: "По номеру телефона", icon: Smartphone, color: "bg-primary/15 text-primary", placeholder: "+7 999 000-00-00", mask: "phone", feeRate: 0 },
  { id: "internet", title: "Интернет", hint: "По лицевому счёту", icon: Wifi, color: "bg-chart-4/15 text-chart-4", placeholder: "Номер лицевого счёта", mask: "account", feeRate: 0 },
  { id: "utilities", title: "ЖКХ и квартплата", hint: "Код плательщика", icon: Home, color: "bg-chart-2/15 text-chart-2", placeholder: "Код плательщика", mask: "account", extraLabel: "Период оплаты", extraPlaceholder: "08.2026", feeRate: 0 },
  { id: "transport", title: "Транспорт", hint: "Карты и проездные", icon: Car, color: "bg-chart-3/15 text-chart-3", placeholder: "Номер транспортной карты", mask: "card", feeRate: .01 },
  { id: "government", title: "Штрафы и налоги", hint: "УИН, ИНН и начисления", icon: Landmark, color: "bg-chart-1/15 text-chart-1", placeholder: "УИН или ИНН", mask: "account", feeRate: 0 },
  { id: "education", title: "Образование", hint: "Школы и вузы", icon: GraduationCap, color: "bg-chart-4/15 text-chart-4", placeholder: "Номер договора", mask: "account", extraLabel: "ФИО учащегося", extraPlaceholder: "Иванов Иван", feeRate: .005 },
  { id: "health", title: "Здоровье", hint: "Клиники и аптеки", icon: HeartPulse, color: "bg-chart-3/15 text-chart-3", placeholder: "Номер заказа", mask: "account", feeRate: 0 },
  { id: "tv", title: "ТВ и подписки", hint: "Цифровые сервисы", icon: Tv, color: "bg-chart-2/15 text-chart-2", placeholder: "ID подписки", mask: "plain", feeRate: 0 },
  { id: "games", title: "Игры", hint: "Кошельки и платформы", icon: Gamepad2, color: "bg-primary/15 text-primary", placeholder: "ID пользователя", mask: "plain", feeRate: .015 },
  { id: "loans", title: "Кредиты", hint: "Погашение по договору", icon: CircleDollarSign, color: "bg-chart-1/15 text-chart-1", placeholder: "Номер договора", mask: "account", feeRate: .01 },
  { id: "insurance", title: "Страхование", hint: "Полисы и взносы", icon: ShieldCheck, color: "bg-chart-4/15 text-chart-4", placeholder: "Номер полиса", mask: "account", feeRate: .005 },
  { id: "marketplaces", title: "Маркетплейсы", hint: "Заказы и кошельки", icon: ShoppingBag, color: "bg-chart-2/15 text-chart-2", placeholder: "Номер заказа", mask: "plain", feeRate: 0 },
  { id: "travel", title: "Путешествия", hint: "Билеты и бронирования", icon: Plane, color: "bg-chart-4/15 text-chart-4", placeholder: "Код бронирования", mask: "plain", feeRate: .01 },
  { id: "charity", title: "Благотворительность", hint: "Проверенные фонды", icon: HandHeart, color: "bg-chart-3/15 text-chart-3", placeholder: "Назначение пожертвования", mask: "plain", feeRate: 0 },
  { id: "receipts", title: "Оплата по квитанции", hint: "Реквизиты или QR-код", icon: ReceiptText, color: "bg-primary/15 text-primary", placeholder: "Номер квитанции", mask: "account", feeRate: .005 },
  { id: "discounts", title: "Сервисы и скидки", hint: "Партнёрские предложения", icon: BadgePercent, color: "bg-chart-1/15 text-chart-1", placeholder: "Номер заказа", mask: "plain", feeRate: 0 },
] as const;

const paymentSuggestions: Record<string, { label: string; value: string; meta: string; kind: "frequent" | "recent" }[]> = {
  mobile: [{ label: "Мой телефон", value: "+7 921 555-35-35", meta: "700 ₽ · ежемесячно", kind: "frequent" }, { label: "Анна", value: "+7 999 807-04-04", meta: "500 ₽ · 3 августа", kind: "recent" }],
  internet: [{ label: "Домашний Wi-Fi", value: "78000408", meta: "1 090 ₽ · часто", kind: "frequent" }, { label: "Дача", value: "44710931", meta: "последний платёж", kind: "recent" }],
  utilities: [{ label: "Квартира", value: "1030094872", meta: "8 420 ₽ · каждый месяц", kind: "frequent" }],
};

export function PaymentsScreen({ slug }: { slug: string }) {
  const router = useRouter();
  const { settings } = usePersonalization();
  const [query, setQuery] = useState("");
  const [servicesExpanded, setServicesExpanded] = useState(true);
  const [serviceId, setServiceId] = useState<(typeof services)[number]["id"]>("mobile");
  const [draft, setDraft] = useState<PaymentValues | null>(null);
  const [security] = useCookieState("lumen-settings-security", preferenceSchema, SECURITY_SETTINGS_DEFAULTS);
  const selected = services.find((service) => service.id === serviceId) ?? services[0];
  const SelectedIcon = selected.icon;
  const filtered = useMemo(() => services.filter((service) => `${service.title} ${service.hint}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const form = useForm<PaymentValues>({ resolver: zodResolver(paymentSchema), defaultValues: { account: "", extra: "", amount: "", scheduleAt: "" } });
  const accountValue = useWatch({ control: form.control, name: "account" });
  const amountValue = useWatch({ control: form.control, name: "amount" });

  function chooseService(id: (typeof services)[number]["id"]) {
    setServiceId(id);
    form.reset();
  }

  function submitPayment(values: PaymentValues) {
    if (security.operationConfirm === false) completePayment(values);
    else setDraft(values);
  }

  function completePayment(values: PaymentValues) {
    const now = getConfiguredDate(settings);
    const scheduled = values.scheduleAt ? new Date(values.scheduleAt) : null;
    const amount = Number(values.amount.replace(/\s/g, ""));
    const fee = Math.round(amount * selected.feeRate);
    saveOperation({
      slug,
      kind: "payment",
      title: selected.title,
      subtitle: selected.hint,
      amount: -amount,
      fee,
      status: scheduled && scheduled > now ? "processing" : "completed",
      createdAt: now.toISOString(),
      scheduledAt: scheduled?.toISOString(),
      source: `${settings.brandName} Black •• 0932`,
      recipient: values.account,
      currency: "RUB",
      legalReference: "Правила дистанционного банковского обслуживания физических лиц",
      details: { Категория: selected.title, Услуга: selected.title, Канал: `${settings.brandName} Online`, ...(values.extra ? { "Дополнительные данные": values.extra } : {}), "Тариф комиссии": selected.feeRate ? `${selected.feeRate * 100}%` : "Без комиссии" },
    });
    toast.success("Платёж подтверждён в демо-режиме");
    setDraft(null);
    router.push(operationDetailsPath(slug));
  }

  function maskServiceValue(value: string) {
    if (selected.mask === "phone") return maskPhone(value);
    if (selected.mask === "card") return maskCard(value);
    if (selected.mask === "account") return maskAccount(value);
    return value.slice(0, 32);
  }

  const currentFee = Math.round(Number(amountValue.replace(/\s/g, "")) * selected.feeRate) || 0;

  return (
    <>
      <PaymentNavigation active="payment" />
      <Card className="mb-4 overflow-hidden border-primary/25">
        <CardContent className="bg-background/28 p-4 backdrop-blur-xl sm:p-5">
          <Label htmlFor="service-search" className="sr-only">Поиск услуги</Label>
          <div className="relative"><Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" /><Input id="service-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Найдите услугу, компанию или начисление" className="h-14 bg-card/80 pl-12 text-base shadow-xl" /></div>
        </CardContent>
      </Card>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_390px]">
        <Card>
          <CardHeader><div className="flex items-center justify-between gap-3"><div><CardTitle className="text-lg">Оплата услуг</CardTitle><CardDescription>Выберите категорию — форма откроется справа</CardDescription></div><Button type="button" variant="ghost" size="sm" className="md:hidden" onClick={() => setServicesExpanded((value) => !value)} aria-expanded={servicesExpanded}>{servicesExpanded ? "Свернуть" : "Показать"}<ChevronDown className={cn("transition-transform", servicesExpanded && "rotate-180")} /></Button></div></CardHeader>
          <CardContent>
            <div className={cn("grid transition-[grid-template-rows,opacity] duration-500 ease-out md:grid-rows-[1fr] md:opacity-100", servicesExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}><div className="min-h-0 overflow-hidden">{filtered.length ? <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((service) => {
                const Icon = service.icon;
                const active = selected.id === service.id;
                return <button key={service.id} type="button" aria-pressed={active} onClick={() => chooseService(service.id)} className={cn("group flex min-h-28 flex-col items-start justify-between rounded-2xl border bg-background/45 p-3.5 text-left outline-none transition-[border-color,background-color,box-shadow,color] hover:border-primary/25 hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring", active && "border-primary/45 bg-primary/10 shadow-[0_0_32px_-20px_var(--glow-lime)]")}><span className={`grid size-10 place-items-center rounded-xl ${service.color}`}><Icon className="size-4" /></span><span className="w-full"><span className="flex items-center justify-between gap-2 text-sm font-medium">{service.title}<ChevronRight className="size-4 text-muted-foreground" /></span><span className="mt-0.5 block text-[11px] text-muted-foreground">{service.hint}</span></span></button>;
              })}
            </div> : <div className="grid min-h-64 place-items-center text-center"><div><Search className="mx-auto size-7 text-muted-foreground" /><p className="mt-3 font-medium">Ничего не найдено</p><p className="mt-1 text-sm text-muted-foreground">Попробуйте изменить запрос.</p></div></div>}</div></div>
            {!servicesExpanded ? <button type="button" onClick={() => setServicesExpanded(true)} className="flex w-full items-center justify-between rounded-2xl border bg-background/35 p-4 text-left font-medium transition-[border-color,background-color] hover:border-primary/25 hover:bg-secondary/35 md:hidden"><span>{selected.title}</span><span className="text-xs text-muted-foreground">Изменить услугу</span></button> : null}
          </CardContent>
        </Card>

        <Card className="h-fit xl:sticky xl:top-[88px]">
          <CardHeader className="border-b"><div className="flex items-center gap-3"><span className={`grid size-11 place-items-center rounded-xl ${selected.color}`}><SelectedIcon className="size-5" /></span><div><CardTitle>{selected.title}</CardTitle><CardDescription>{selected.hint}</CardDescription></div></div></CardHeader>
          <CardContent className="pt-5">
            <form onSubmit={form.handleSubmit(submitPayment)} className="space-y-5">
              <SmartSuggestions suggestions={paymentSuggestions[selected.id] ?? [{ label: "Последние реквизиты", value: "408-219-55", meta: selected.hint, kind: "recent" }]} value={accountValue} onSelect={(value) => form.setValue("account", value, { shouldValidate: true })} title="Часто используемые" />
              <div className="space-y-2"><Label htmlFor="payment-account">{selected.id === "mobile" ? "Номер телефона" : "Реквизиты"}</Label><Input id="payment-account" placeholder={selected.placeholder} autoComplete="off" value={accountValue} onChange={(event) => form.setValue("account", maskServiceValue(event.target.value), { shouldDirty: true, shouldValidate: true })} />{form.formState.errors.account ? <p className="text-xs text-destructive">{form.formState.errors.account.message}</p> : null}</div>
              {"extraLabel" in selected ? <div className="space-y-2"><Label htmlFor="payment-extra">{selected.extraLabel}</Label><Input id="payment-extra" placeholder={selected.extraPlaceholder} {...form.register("extra")} /></div> : null}
              <div className="space-y-2"><Label htmlFor="payment-amount">Сумма</Label><ResponsiveAmountInput id="payment-amount" value={amountValue} onChange={(value) => form.setValue("amount", value, { shouldDirty: true, shouldValidate: true })} />{form.formState.errors.amount ? <p className="text-xs text-destructive">{form.formState.errors.amount.message}</p> : null}<AmountPresets onSelect={(value) => form.setValue("amount", value, { shouldValidate: true })} /></div>
              <div className="space-y-2"><Label htmlFor="payment-schedule" className="flex items-center gap-2"><CalendarClock className="size-4 text-primary" />Дата и время платежа</Label><Input id="payment-schedule" type="datetime-local" {...form.register("scheduleAt")} /><p className="text-xs text-muted-foreground">Оставьте пустым, чтобы оплатить сразу.</p></div>
              <SourceAccount />
              <FeeBreakdown fee={currentFee} description={selected.feeRate ? "Комиссия рассчитывается до подтверждения и включается в итоговое списание." : "Для выбранной услуги комиссия банка отсутствует."} rows={[{ label: "Тариф", value: selected.feeRate ? `${selected.feeRate * 100}%` : "0%" }, { label: "Максимальная сумма", value: "300 000 ₽" }]} />
              <Button type="submit" size="lg" className="w-full"><QrCode />Продолжить</Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-4">
        <CardHeader><CardTitle>Шаблоны и автоплатежи</CardTitle></CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-3">
          <Template title="Мобильный" meta="+7 921 •• 35 · 700 ₽" initials="М" />
          <Template title="Домашний интернет" meta="Лицевой счёт •• 408" initials="WI" />
          <Template title="Квартплата" meta="Каждое 10 число" initials="Д" />
        </CardContent>
      </Card>
      <ReviewDialog open={Boolean(draft)} onOpenChange={(open) => { if (!open) setDraft(null); }} title="Проверьте платёж" description={`Оплата категории «${selected.title}».`} rows={draft ? [{ label: "Услуга", value: selected.title }, { label: "Реквизиты", value: draft.account }, { label: "Сумма", value: formatRubles(draft.amount) }, { label: "Комиссия", value: formatRubles(Math.round(Number(draft.amount.replace(/\s/g, "")) * selected.feeRate)) }, ...(draft.scheduleAt ? [{ label: "Исполнить", value: new Date(draft.scheduleAt).toLocaleString("ru-RU") }] : [])] : []} confirmLabel="Оплатить" onConfirm={() => { if (draft) completePayment(draft); }} />
    </>
  );
}

function Template({ title, meta, initials }: { title: string; meta: string; initials: string }) {
  return <button type="button" onClick={() => toast.success(`Шаблон «${title}» выбран`)} className="flex items-center gap-3 rounded-xl border bg-background/40 p-3 text-left outline-none transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring"><span className="grid size-10 place-items-center rounded-xl bg-secondary text-xs font-semibold">{initials}</span><span><span className="block text-sm font-medium">{title}</span><span className="block text-xs text-muted-foreground">{meta}</span></span><ChevronRight className="ml-auto size-4 text-muted-foreground" /></button>;
}
