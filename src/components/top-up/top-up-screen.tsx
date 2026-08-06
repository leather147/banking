"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ArrowDownToLine, CreditCard, Landmark, MapPin, ShieldCheck, WalletCards } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AmountPresets, FeeBreakdown, formatRubles, maskCard, PaymentNavigation, ResponsiveAmountInput, ReviewDialog, SourceAccount } from "@/components/payments/flow-primitives";
import { SmartSuggestions } from "@/components/operations/smart-suggestions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SECURITY_SETTINGS_DEFAULTS } from "@/lib/app-settings";
import { useCookieState } from "@/lib/cookies";
import { operationDetailsPath, saveOperation } from "@/lib/operations";
import { preferenceSchema } from "@/lib/schemas";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { getConfiguredDate } from "@/lib/personalization";

const topUpSchema = z.object({
  method: z.enum(["external", "own"]),
  cardNumber: z.string(),
  amount: z.string().trim().min(1, "Введите сумму").refine((value) => Number(value.replace(/\s/g, "")) >= 100, "Минимальная сумма — 100 ₽").refine((value) => Number(value.replace(/\s/g, "")) <= 300000, "Максимальная сумма — 300 000 ₽"),
}).superRefine((values, context) => {
  if (values.method === "external" && values.cardNumber.replace(/\s/g, "").length !== 16) context.addIssue({ code: "custom", path: ["cardNumber"], message: "Введите 16 цифр номера карты" });
});

type TopUpValues = z.infer<typeof topUpSchema>;
type TopUpMethod = "external" | "own" | "cash";

export function TopUpScreen({ slug }: { slug: string }) {
  const router = useRouter();
  const { settings } = usePersonalization();
  const [method, setMethod] = useState<TopUpMethod>("external");
  const [draft, setDraft] = useState<TopUpValues | null>(null);
  const [security] = useCookieState("lumen-settings-security", preferenceSchema, SECURITY_SETTINGS_DEFAULTS);
  const form = useForm<TopUpValues>({ resolver: zodResolver(topUpSchema), defaultValues: { method: "external", cardNumber: "", amount: "" } });

  function changeMethod(value: string) {
    const next = value as TopUpMethod;
    setMethod(next);
    if (next !== "cash") form.setValue("method", next, { shouldValidate: false });
  }

  function submitTopUp(values: TopUpValues) {
    if (security.operationConfirm === false) completeTopUp(values);
    else setDraft(values);
  }

  function completeTopUp(values: TopUpValues) {
    const external = values.method === "external";
    saveOperation({
      slug,
      kind: "top-up",
      title: `Пополнение ${settings.brandName} Black`,
      subtitle: external ? "С карты другого банка" : "Со своего счёта",
      amount: Number(values.amount.replace(/\s/g, "")),
      fee: 0,
      status: "completed",
      createdAt: getConfiguredDate(settings).toISOString(),
      source: external ? `Карта •• ${values.cardNumber.replace(/\s/g, "").slice(-4)}` : "Накопительный счёт",
      recipient: `${settings.brandName} Black •• 0932`,
      currency: "RUB",
      legalReference: "Условия переводов без открытия банковского счёта",
      details: { Категория: "Пополнение", Зачисление: "Мгновенно", Канал: `${settings.brandName} Online`, "Комиссия банка": "0 ₽", "Возможная комиссия": "По тарифу банка-эмитента" },
    });
    toast.success("Пополнение подтверждено в демо-режиме");
    setDraft(null);
    router.push(operationDetailsPath(slug));
  }

  return (
    <>
      <PaymentNavigation active="top-up" />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader className="border-b"><CardTitle className="text-lg">Пополнить карту</CardTitle><CardDescription>Выберите удобный способ зачисления денег</CardDescription></CardHeader>
          <CardContent className="pt-5">
            <Tabs value={method} onValueChange={changeMethod}>
              <TabsList className="grid h-auto w-full grid-cols-3 gap-1">
                <TabsTrigger className="h-11 gap-2" value="external"><CreditCard />Другая карта</TabsTrigger>
                <TabsTrigger className="h-11 gap-2" value="own"><Landmark />Свой счёт</TabsTrigger>
                <TabsTrigger className="h-11 gap-2" value="cash"><MapPin />Наличными</TabsTrigger>
              </TabsList>
              <TabsContent value="external"><TopUpForm form={form} showCard onSubmit={form.handleSubmit(submitTopUp)} /></TabsContent>
              <TabsContent value="own"><TopUpForm form={form} onSubmit={form.handleSubmit(submitTopUp)} /></TabsContent>
              <TabsContent value="cash">
                <div className="mt-5 overflow-hidden rounded-2xl border">
                  <div className="metric-glow relative min-h-64 p-5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,color-mix(in_oklab,var(--glow-lime)_18%,transparent),transparent_40%),radial-gradient(circle_at_80%_70%,color-mix(in_oklab,var(--glow-blue)_18%,transparent),transparent_42%)] opacity-70" />
                    <div className="relative max-w-md rounded-2xl border bg-card/90 p-4 backdrop-blur-xl">
                      <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground"><MapPin className="size-4" /></span>
                      <h2 className="mt-4 font-semibold">Банкоматы рядом</h2>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">В демо-версии карта недоступна. Найдите банкомат с функцией приёма наличных в мобильном приложении.</p>
                      <Button type="button" className="mt-4" onClick={() => toast("Поиск банкоматов работает как демонстрационная заглушка")}>Показать список</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Куда зачислить</CardTitle></CardHeader>
            <CardContent><SourceAccount label="Карта пополнения" balance={326840} /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" />Условия пополнения</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Condition label={`Комиссия ${settings.brandName}`} value="0 ₽" />
              <Condition label="Зачисление" value="Мгновенно" />
              <Condition label="Лимит за операцию" value="300 000 ₽" />
              <p className="rounded-xl bg-secondary p-3 text-xs leading-5 text-muted-foreground">Сторонний банк может взять собственную комиссию. Не вводите реальные карточные данные: это демонстрационный интерфейс.</p>
            </CardContent>
          </Card>
        </div>
      </div>
      <ReviewDialog open={Boolean(draft)} onOpenChange={(open) => { if (!open) setDraft(null); }} title="Проверьте пополнение" description="Средства будут показаны только в рамках демонстрации." rows={draft ? [{ label: "Способ", value: draft.method === "external" ? `Карта •• ${draft.cardNumber.replace(/\s/g, "").slice(-4)}` : "Свой накопительный счёт" }, { label: "Карта пополнения", value: `${settings.brandName} Black •• 0932` }, { label: "Сумма", value: formatRubles(draft.amount) }, { label: "Комиссия", value: "0 ₽" }] : []} confirmLabel="Пополнить" onConfirm={() => { if (draft) completeTopUp(draft); }} />
    </>
  );
}

function TopUpForm({ form, showCard = false, onSubmit }: { form: ReturnType<typeof useForm<TopUpValues>>; showCard?: boolean; onSubmit: () => void }) {
  const cardNumber = useWatch({ control: form.control, name: "cardNumber" });
  const amount = useWatch({ control: form.control, name: "amount" });
  return (
    <form onSubmit={onSubmit} className="mt-5 max-w-3xl space-y-5">
      {showCard ? <><SmartSuggestions title="Недавние источники" value={cardNumber} onSelect={(value) => form.setValue("cardNumber", maskCard(value), { shouldValidate: true })} suggestions={[{ label: "Alfa", value: "5484690020124431", meta: "Карта •• 4431", kind: "recent" }, { label: "Ozon", value: "2202200481971171", meta: "Карта •• 1171", kind: "frequent" }, { label: "Зарплатная", value: "4276020019086632", meta: "Карта •• 6632", kind: "frequent" }]} /><div className="space-y-2"><Label htmlFor="top-up-card">Карта другого банка</Label><div className="relative"><Input id="top-up-card" inputMode="numeric" autoComplete="off" placeholder="0000 0000 0000 0000" className="pr-12" value={cardNumber} onChange={(event) => form.setValue("cardNumber", maskCard(event.target.value), { shouldDirty: true, shouldValidate: true })} /><CreditCard className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /></div>{form.formState.errors.cardNumber ? <p className="text-xs text-destructive">{form.formState.errors.cardNumber.message}</p> : null}</div></> : <SourceAccount label="Счёт списания" title="Накопительный счёт" balance={148200} />}
      <div className="space-y-2"><Label htmlFor={`top-up-amount-${showCard ? "card" : "own"}`}>Сумма пополнения</Label><ResponsiveAmountInput id={`top-up-amount-${showCard ? "card" : "own"}`} value={amount} onChange={(value) => form.setValue("amount", value, { shouldDirty: true, shouldValidate: true })} />{form.formState.errors.amount ? <p className="text-xs text-destructive">{form.formState.errors.amount.message}</p> : null}<AmountPresets onSelect={(value) => form.setValue("amount", value, { shouldValidate: true })} /></div>
      <FeeBreakdown fee={0} description="Банк не берёт комиссию. Банк, выпустивший карту списания, может применить собственный тариф." rows={[{ label: "Зачисление", value: "Обычно мгновенно" }, { label: "Лимит", value: "100–300 000 ₽" }]} />
      <div className="flex items-center gap-2 rounded-xl bg-primary/10 p-3 text-xs text-muted-foreground"><ArrowDownToLine className="size-4 shrink-0 text-primary" />Пополнение обычно занимает несколько секунд.</div>
      <Button type="submit" size="lg" className="w-full"><WalletCards />Продолжить</Button>
    </form>
  );
}

function Condition({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}</span></div>;
}
