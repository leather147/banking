"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarClock, Clock3, CreditCard, Phone, Repeat2, Send, Star, UserRound } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AmountPresets, FeeBreakdown, formatRubles, maskAccount, maskAmount, maskCard, maskPhone, PaymentNavigation, ResponsiveAmountInput, ReviewDialog, SourceAccount } from "@/components/payments/flow-primitives";
import { SmartSuggestions, type SmartSuggestion } from "@/components/operations/smart-suggestions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SECURITY_SETTINGS_DEFAULTS } from "@/lib/app-settings";
import { useCookieState } from "@/lib/cookies";
import { operationDetailsPath, saveOperation } from "@/lib/operations";
import { preferenceSchema } from "@/lib/schemas";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { getConfiguredDate } from "@/lib/personalization";

const transferSchema = z.object({
  recipient: z.string().trim().min(10, "Введите телефон, карту или счёт"),
  amount: z.string().trim().min(1, "Введите сумму").refine((value) => Number(value.replace(/\s/g, "")) > 0, "Сумма должна быть больше нуля").refine((value) => Number(value.replace(/\s/g, "")) <= 500000, "Лимит демо-перевода — 500 000 ₽"),
  message: z.string().max(80, "Не больше 80 символов"),
  currency: z.enum(["RUB", "USD", "EUR", "CNY", "KZT"]),
  scheduleAt: z.string(),
});

type TransferValues = z.infer<typeof transferSchema>;
type TransferMode = "phone" | "card" | "account";

const exchangeRates = { RUB: 1, USD: 91.42, EUR: 99.8, CNY: 12.65, KZT: 0.19 } as const;

const recipients = [
  { name: "Елена", meta: "+7 921 •• 35", value: "+7 921 555-35-35", initials: "ЕЛ", tint: "bg-chart-3/15 text-chart-3" },
  { name: "Илья", meta: "+7 916 •• 18", value: "+7 916 230-18-18", initials: "ИМ", tint: "bg-chart-4/15 text-chart-4" },
  { name: "Анна", meta: "+7 999 •• 04", value: "+7 999 807-04-04", initials: "АВ", tint: "bg-chart-2/15 text-chart-2" },
  { name: "Мария", meta: "+7 903 •• 71", value: "+7 903 110-71-71", initials: "МК", tint: "bg-primary/15 text-primary" },
];

const modeLabels: Record<TransferMode, { label: string; placeholder: string }> = {
  phone: { label: "Телефон получателя", placeholder: "+7 999 000-00-00" },
  card: { label: "Номер карты", placeholder: "0000 0000 0000 0000" },
  account: { label: "Номер счёта", placeholder: "20 цифр номера счёта" },
};

const transferSuggestions: Record<TransferMode, SmartSuggestion[]> = {
  phone: [
    { label: "Елена", value: "+7 921 555-35-35", meta: "+7 921 •• 35 · сегодня", kind: "frequent" },
    { label: "Анна", value: "+7 999 807-04-04", meta: "+7 999 •• 04 · 3 августа", kind: "recent" },
    { label: "Илья", value: "+7 916 230-18-18", meta: "+7 916 •• 18 · часто", kind: "frequent" },
  ],
  card: [
    { label: "Моя Alfa", value: "5484 6900 2012 4431", meta: "Карта •• 4431", kind: "recent" },
    { label: "Мария", value: "2202 2004 8197 1171", meta: "Мир •• 1171", kind: "frequent" },
  ],
  account: [
    { label: "Аренда", value: "40817810900001234567", meta: "Счёт •• 4567", kind: "frequent" },
    { label: "Последний счёт", value: "40817810455000987112", meta: "Счёт •• 7112", kind: "recent" },
  ],
};

export function TransfersScreen({ slug }: { slug: string }) {
  const router = useRouter();
  const { settings } = usePersonalization();
  const [mode, setMode] = useState<TransferMode>("phone");
  const [draft, setDraft] = useState<TransferValues | null>(null);
  const [security] = useCookieState("lumen-settings-security", preferenceSchema, SECURITY_SETTINGS_DEFAULTS);
  const form = useForm<TransferValues>({ resolver: zodResolver(transferSchema), defaultValues: { recipient: "", amount: "", message: "", currency: "RUB", scheduleAt: "" } });
  const recipientValue = useWatch({ control: form.control, name: "recipient" });
  const amountValue = useWatch({ control: form.control, name: "amount" });
  const currency = useWatch({ control: form.control, name: "currency" });
  const selectedMode = modeLabels[mode];
  const numericAmount = Number(amountValue.replace(/\s/g, "")) || 0;
  const international = currency !== "RUB";
  const fee = international ? Math.max(250, Math.round(numericAmount * exchangeRates[currency] * 0.015)) : mode === "card" ? Math.max(numericAmount ? 50 : 0, Math.round(numericAmount * 0.01)) : 0;

  function submitTransfer(values: TransferValues) {
    if (security.operationConfirm === false) completeTransfer(values);
    else setDraft(values);
  }

  function completeTransfer(values: TransferValues) {
    const recipientName = recipients.find((item) => item.value === values.recipient)?.name ?? values.recipient;
    const createdAt = getConfiguredDate(settings);
    const scheduled = values.scheduleAt ? new Date(values.scheduleAt) : null;
    const rate = exchangeRates[values.currency];
    const sourceAmount = Number(values.amount.replace(/\s/g, ""));
    const amountRub = Math.round(sourceAmount * rate);
    const operationFee = values.currency !== "RUB" ? Math.max(250, Math.round(amountRub * 0.015)) : mode === "card" ? Math.max(50, Math.round(sourceAmount * 0.01)) : 0;
    const processing = scheduled ? scheduled.getTime() > createdAt.getTime() : false;
    saveOperation({
      slug,
      kind: "transfer",
      title: `Перевод · ${recipientName}`,
      subtitle: mode === "phone" ? "По номеру телефона" : mode === "card" ? "По номеру карты" : "По банковскому счёту",
      amount: -amountRub,
      fee: operationFee,
      status: processing ? "processing" : "completed",
      createdAt: createdAt.toISOString(),
      source: `${settings.brandName} Black •• 0932`,
      recipient: values.recipient,
      scheduledAt: scheduled?.toISOString(),
      currency: values.currency,
      exchangeRate: values.currency === "RUB" ? undefined : rate,
      legalReference: "Правила переводов физических лиц, разделы 3, 5 и 8",
      details: { Категория: "Переводы", Сообщение: values.message || "Без сообщения", Канал: `${settings.brandName} Online`, Валюта: values.currency, Сумма: `${values.amount} ${values.currency}` },
    });
    toast.success("Перевод подтверждён в демо-режиме");
    setDraft(null);
    router.push(operationDetailsPath(slug));
  }

  return (
    <>
      <PaymentNavigation active="transfer" />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-card/45 sm:flex-row sm:items-start sm:justify-between">
            <div><CardTitle className="text-lg">Новый перевод</CardTitle><CardDescription className="mt-1">Данные получателя → сумма → подтверждение</CardDescription></div>
            <span className="mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] text-primary"><span className="grid size-4 place-items-center rounded-full bg-primary text-primary-foreground">1</span>Реквизиты</span>
          </CardHeader>
          <CardContent className="space-y-6 pt-5">
            <section>
              <div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-medium">Частые получатели</h2><Button type="button" variant="ghost" size="sm" onClick={() => toast("Полный список контактов доступен как демонстрационная заглушка")}>Все контакты<ArrowRight /></Button></div>
              <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
                {recipients.map((recipient) => (
                  <button key={recipient.name} type="button" onClick={() => form.setValue("recipient", recipient.value, { shouldValidate: true })} className="flex min-w-[116px] items-center gap-2 rounded-2xl border bg-background/45 p-2.5 text-left outline-none transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring">
                    <span className={`grid size-9 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${recipient.tint}`}>{recipient.initials}</span>
                    <span className="min-w-0"><span className="block truncate text-xs font-medium">{recipient.name}</span><span className="block truncate text-[10px] text-muted-foreground">{recipient.meta}</span></span>
                  </button>
                ))}
              </div>
            </section>
            <form onSubmit={form.handleSubmit(submitTransfer)} className="max-w-3xl space-y-5">
              <Tabs value={mode} onValueChange={(value) => setMode(value as TransferMode)}>
                <TabsList className="grid h-auto w-full grid-cols-3 gap-1">
                  <TabsTrigger className="h-10 gap-2" value="phone"><Phone />По телефону</TabsTrigger>
                  <TabsTrigger className="h-10 gap-2" value="card"><CreditCard />По карте</TabsTrigger>
                  <TabsTrigger className="h-10 gap-2" value="account"><UserRound />По счёту</TabsTrigger>
                </TabsList>
              </Tabs>
              <SmartSuggestions suggestions={transferSuggestions[mode]} value={recipientValue} onSelect={(value) => form.setValue("recipient", value, { shouldValidate: true })} title="Получатели и реквизиты" />
              <div className="space-y-2"><Label htmlFor="transfer-recipient">{selectedMode.label}</Label><Input id="transfer-recipient" name="recipient" value={recipientValue} onChange={(event) => form.setValue("recipient", mode === "phone" ? maskPhone(event.target.value) : mode === "card" ? maskCard(event.target.value) : maskAccount(event.target.value), { shouldValidate: form.formState.isSubmitted })} onBlur={() => form.trigger("recipient")} autoComplete="off" placeholder={selectedMode.placeholder} />{form.formState.errors.recipient ? <p className="text-xs text-destructive">{form.formState.errors.recipient.message}</p> : null}</div>
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_160px]"><div className="space-y-2"><Label htmlFor="transfer-amount">Сумма</Label><ResponsiveAmountInput id="transfer-amount" value={amountValue} onChange={(value) => form.setValue("amount", maskAmount(value), { shouldValidate: form.formState.isSubmitted })} currency={currency === "RUB" ? "₽" : currency} />{form.formState.errors.amount ? <p className="text-xs text-destructive">{form.formState.errors.amount.message}</p> : null}</div><div className="space-y-2"><Label>Валюта</Label><Select value={currency} onValueChange={(value) => form.setValue("currency", value as TransferValues["currency"])}><SelectTrigger className="h-20 text-base font-bold" aria-label="Валюта перевода"><SelectValue /></SelectTrigger><SelectContent>{Object.keys(exchangeRates).map((code) => <SelectItem key={code} value={code}>{code}</SelectItem>)}</SelectContent></Select></div></div>
              <AmountPresets onSelect={(value) => form.setValue("amount", value, { shouldValidate: true })} />
              <div className="space-y-2"><Label htmlFor="transfer-message">Сообщение получателю</Label><Input id="transfer-message" placeholder="Например, за ужин" {...form.register("message")} />{form.formState.errors.message ? <p className="text-xs text-destructive">{form.formState.errors.message.message}</p> : null}</div>
              <div className="space-y-2"><Label htmlFor="transfer-schedule" className="flex items-center gap-2"><CalendarClock className="size-4 text-primary" />Дата исполнения</Label><Input id="transfer-schedule" type="datetime-local" min={new Date().toISOString().slice(0, 16)} {...form.register("scheduleAt")} /><p className="text-xs text-muted-foreground">Оставьте пустым, чтобы выполнить перевод сразу. Будущий перевод появится в истории со статусом «В обработке».</p></div>
              <SourceAccount />
              <FeeBreakdown fee={fee} description={international ? "Международный перевод: 1,5%, минимум 250 ₽. Курс фиксируется на экране подтверждения." : mode === "card" ? "Перевод по номеру карты: 1%, минимум 50 ₽." : "Переводы по СБП и внутри банка выполняются без комиссии в пределах лимита."} rows={[{ label: "Месячный бесплатный лимит", value: "Осталось 86 400 ₽" }, ...(international ? [{ label: "Ориентировочный курс", value: `1 ${currency} = ${exchangeRates[currency]} ₽` }] : [])]} />
              <Button type="submit" size="lg" className="w-full"><Send />Продолжить</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Clock3 className="size-4 text-primary" />Последние переводы</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              <RecentTransfer initials="ЕЛ" title="Елена Л." meta="Сегодня, 12:42" amount="− 2 400 ₽" />
              <RecentTransfer initials="ИМ" title="Илья М." meta="Вчера, 19:08" amount="− 860 ₽" />
              <RecentTransfer initials="АВ" title="Анна В." meta="3 августа" amount="− 5 000 ₽" />
            </CardContent>
          </Card>
          <Card className="metric-glow overflow-hidden">
            <CardContent className="p-5">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/15 text-primary"><Repeat2 className="size-4" /></span>
              <h2 className="mt-4 font-semibold">Регулярные переводы</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Создайте расписание — интерфейс напомнит о платеже в нужный день.</p>
              <Button type="button" variant="outline" className="mt-4 w-full" onClick={() => toast("Настройка автоперевода откроется в следующем обновлении")}><Star />Настроить</Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <ReviewDialog open={Boolean(draft)} onOpenChange={(open) => { if (!open) setDraft(null); }} title="Проверьте перевод" description="Убедитесь, что получатель, валюта и дата исполнения указаны верно." rows={draft ? [{ label: "Получатель", value: draft.recipient }, { label: "Сумма", value: `${draft.amount} ${draft.currency}` }, ...(draft.currency !== "RUB" ? [{ label: "Курс", value: `1 ${draft.currency} = ${exchangeRates[draft.currency]} ₽` }] : []), { label: "Комиссия", value: formatRubles(draft.currency !== "RUB" ? Math.max(250, Math.round(Number(draft.amount.replace(/\s/g, "")) * exchangeRates[draft.currency] * 0.015)) : mode === "card" ? Math.max(50, Math.round(Number(draft.amount.replace(/\s/g, "")) * 0.01)) : 0) }, ...(draft.scheduleAt ? [{ label: "Исполнить", value: new Date(draft.scheduleAt).toLocaleString("ru-RU") }] : []), { label: "С карты", value: `${settings.brandName} Black •• 0932` }] : []} confirmLabel="Перевести" onConfirm={() => { if (draft) completeTransfer(draft); }} />
    </>
  );
}

function RecentTransfer({ initials, title, meta, amount }: { initials: string; title: string; meta: string; amount: string }) {
  return <button type="button" onClick={() => toast.success(`Реквизиты «${title}» выбраны`)} className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left outline-none transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring"><span className="grid size-9 place-items-center rounded-full bg-secondary text-[10px] font-semibold">{initials}</span><span><span className="block text-sm font-medium">{title}</span><span className="block text-[10px] text-muted-foreground">{meta}</span></span><span className="ml-auto text-sm font-medium tabular-nums">{amount}</span></button>;
}
