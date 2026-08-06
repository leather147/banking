"use client";

import * as React from "react";
import { Copy, CreditCard, Eye, EyeOff, Globe2, LockKeyhole, Magnet, Plus, Radio, ScanLine, ShoppingBag, Snowflake } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cardControlsSchema, singleCardControlSchema } from "@/lib/schemas";
import { useCookieState } from "@/lib/cookies";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { BankOfferGrid } from "@/components/shared/bank-offer-grid";
import { useI18n } from "@/components/providers/i18n-provider";
import { getVisibleCards, type BankCardRecord } from "@/lib/cards";
import { cn } from "@/lib/utils";
import type { z } from "zod";

type CardControls = z.infer<typeof singleCardControlSchema>;

const makeControls = (card: BankCardRecord): CardControls => ({
  frozen: false,
  online: true,
  contactless: true,
  international: card.id === "travel",
  cashWithdrawal: true,
  magneticStripe: false,
  subscriptions: true,
  transferReceive: true,
  dailyLimit: card.id === "family" ? 60000 : 150000,
  cashLimit: 50000,
  cardName: card.name,
  style: card.style,
});

const DEFAULT_CONTROLS = Object.fromEntries(getVisibleCards(3).map((card) => [card.id, makeControls(card)]));

export function CardsScreen() {
  const { settings } = usePersonalization();
  const { t } = useI18n();
  const cards = getVisibleCards(settings.demoCardCount);
  const [controls, setControls] = useCookieState("lumen-card-controls-v2", cardControlsSchema, DEFAULT_CONTROLS);
  const [selectedId, setSelectedId] = React.useState(cards[0]?.id ?? "black");
  const [showNumber, setShowNumber] = React.useState(false);
  const railRef = React.useRef<HTMLDivElement>(null);
  const selected = cards.find((card) => card.id === selectedId) ?? cards[0];
  const current = controls[selected.id] ?? makeControls(selected);

  function updateControl<K extends keyof CardControls>(key: K, value: CardControls[K], announce = true) {
    setControls((state) => ({ ...state, [selected.id]: { ...(state[selected.id] ?? makeControls(selected)), [key]: value } }));
    if (announce) toast.success(t("cards.toast.saved", "Настройка карты •• {last4} сохранена", { last4: selected.last4 }));
  }

  function handleRailScroll() {
    const rail = railRef.current;
    if (!rail) return;
    const center = rail.scrollLeft + rail.clientWidth / 2;
    const nodes = Array.from(rail.querySelectorAll<HTMLElement>("[data-card-id]"));
    const nearest = nodes.reduce<HTMLElement | null>((best, node) => {
      if (!best) return node;
      const nodeDistance = Math.abs(node.offsetLeft + node.offsetWidth / 2 - center);
      const bestDistance = Math.abs(best.offsetLeft + best.offsetWidth / 2 - center);
      return nodeDistance < bestDistance ? node : best;
    }, null);
    if (nearest?.dataset.cardId) setSelectedId(nearest.dataset.cardId);
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">{t("cards.eyebrow", "Мои карты")}</p><h2 className="mt-1 text-xl font-bold">{selected.name} •• {selected.last4}</h2><p className="mt-1 text-sm text-muted-foreground">{t("cards.swipeHint", "Листайте карты горизонтально — настройки ниже меняются для каждой отдельно.")}</p></div><span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs text-primary">{t("cards.activeCount", "{count} активных", { count: cards.length })}</span></div>
        <div ref={railRef} onScroll={handleRailScroll} className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 touch-pan-x">
          {cards.map((card) => {
            const cardControls = controls[card.id] ?? makeControls(card);
            return <button key={card.id} data-card-id={card.id} type="button" onClick={() => setSelectedId(card.id)} className={cn("min-w-[min(84vw,410px)] snap-center rounded-[1.65rem] border p-1 text-left outline-none transition-[border-color,box-shadow,opacity] sm:min-w-[390px]", selected.id === card.id ? "border-primary/55 shadow-[0_0_36px_-20px_var(--glow-lime)]" : "border-transparent opacity-80 hover:opacity-100", cardControls.frozen && "grayscale")}>
              <CardArtwork card={card} controls={cardControls} showNumber={showNumber && selected.id === card.id} brandName={settings.brandName} hideBalance={settings.balanceHidden} frozenLabel={t("cards.frozen", "Заморожена")} productLabel={t(`cards.card.${card.id}.product`, card.product)} />
            </button>;
          })}
          <button type="button" onClick={() => toast(t("cards.toast.new", "Заявка на новую карту открыта в демонстрационном режиме"))} className="group grid min-w-[min(84vw,410px)] snap-center place-items-center rounded-[1.65rem] border border-dashed border-primary/28 bg-primary/5 p-8 text-center outline-none transition-[background-color,border-color,box-shadow] hover:border-primary/50 hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-ring sm:min-w-[390px]">
            <span><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[0_0_30px_-12px_var(--glow-lime)]"><Plus className="size-6" /></span><span className="mt-4 block text-lg font-bold">{t("cards.new.title", "Оформить новую карту")}</span><span className="mt-1 block max-w-64 text-sm leading-6 text-muted-foreground">{t("cards.new.description", "Подберём продукт по вашим расходам, поездкам и бонусам.")}</span></span>
          </button>
        </div>
        <div className="flex flex-wrap gap-2"><Button variant="secondary" onClick={() => setShowNumber((value) => !value)}>{showNumber ? <EyeOff /> : <Eye />}{showNumber ? t("cards.hideDetails", "Скрыть реквизиты") : t("cards.showDetails", "Показать реквизиты")}</Button><Button variant="secondary" onClick={() => { navigator.clipboard?.writeText(`547818426701${selected.last4}`); toast.success(t("cards.toast.copied", "Номер скопирован")); }}><Copy />{t("cards.copy", "Скопировать номер")}</Button><Button variant="outline" onClick={() => toast(t("cards.toast.additional", "Пластиковая карта добавлена в заявку"))}><Plus />{t("cards.additional", "Дополнительная карта")}</Button></div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card><CardHeader><CardTitle>{t("cards.controls.title", "Операции по карте")}</CardTitle><p className="text-sm text-muted-foreground">{t("cards.controls.description", "Все разрешения независимы для карты •• {last4}.", { last4: selected.last4 })}</p></CardHeader><CardContent className="divide-y pt-1">
          <ControlRow icon={<Snowflake />} title={t("cards.control.frozen.title", "Заморозить карту")} description={t("cards.control.frozen.description", "Остановить покупки, переводы и снятие")} checked={current.frozen} onChange={(value) => updateControl("frozen", value)} />
          <ControlRow icon={<ShoppingBag />} title={t("cards.control.online.title", "Покупки в интернете")} description={t("cards.control.online.description", "Онлайн-магазины и приложения")} checked={current.online} onChange={(value) => updateControl("online", value)} />
          <ControlRow icon={<Radio />} title={t("cards.control.contactless.title", "Бесконтактная оплата")} description={t("cards.control.contactless.description", "NFC и токенизированные кошельки")} checked={current.contactless} onChange={(value) => updateControl("contactless", value)} />
          <ControlRow icon={<Globe2 />} title={t("cards.control.international.title", "Операции за границей")} description={t("cards.control.international.description", "Платежи и конвертация за рубежом")} checked={current.international} onChange={(value) => updateControl("international", value)} />
          <ControlRow icon={<CreditCard />} title={t("cards.control.cash.title", "Снятие наличных")} description={t("cards.control.cash.description", "Банкоматы и кассы банков")} checked={current.cashWithdrawal} onChange={(value) => updateControl("cashWithdrawal", value)} />
          <ControlRow icon={<Magnet />} title={t("cards.control.stripe.title", "Магнитная полоса")} description={t("cards.control.stripe.description", "Отключена по умолчанию для безопасности")} checked={current.magneticStripe} onChange={(value) => updateControl("magneticStripe", value)} />
        </CardContent></Card>

        <div className="space-y-4">
          <Card><CardHeader><CardTitle>{t("cards.limits.title", "Лимиты и имя карты")}</CardTitle></CardHeader><CardContent className="space-y-5">
            <div className="space-y-2"><Label htmlFor="card-name">{t("cards.name.label", "Название в приложении")}</Label><Input id="card-name" value={current.cardName} maxLength={24} onChange={(event) => updateControl("cardName", event.target.value, false)} onBlur={() => toast.success(t("cards.toast.nameSaved", "Название карты сохранено"))} /></div>
            <LimitInput id="daily-limit" label={t("cards.limits.daily", "Лимит покупок в день")} value={current.dailyLimit} max={1000000} onChange={(value) => updateControl("dailyLimit", value, false)} />
            <LimitInput id="cash-limit" label={t("cards.limits.cash", "Лимит снятия наличных")} value={current.cashLimit} max={500000} onChange={(value) => updateControl("cashLimit", value, false)} />
            <Button className="w-full" onClick={() => toast.success(t("cards.toast.limitsSaved", "Лимиты карты сохранены"))}>{t("cards.limits.save", "Сохранить лимиты")}</Button>
          </CardContent></Card>
          <Card><CardHeader><CardTitle>{t("cards.style.title", "Стиль карты")}</CardTitle><p className="text-sm text-muted-foreground">{t("cards.style.description", "Оформление меняется только для выбранной карты.")}</p></CardHeader><CardContent className="grid grid-cols-3 gap-2">{(["prism", "aurora", "graphite"] as const).map((style) => <button key={style} type="button" aria-pressed={current.style === style} onClick={() => updateControl("style", style)} className={cn("min-h-20 rounded-2xl border bg-secondary/40 p-3 text-xs font-bold outline-none transition-[border-color,background-color,box-shadow] hover:border-primary/30 focus-visible:ring-2 focus-visible:ring-ring", current.style === style && "border-primary bg-primary/10 shadow-[0_0_24px_-16px_var(--glow-lime)]")}>{t(`cards.style.${style}`, style)}</button>)}</CardContent></Card>
          <Card className="border-primary/20 bg-primary/5 p-5"><div className="flex gap-3"><LockKeyhole className="mt-0.5 size-5 text-primary" /><div><h2 className="text-sm font-bold">{t("cards.protection.title", "Защита операций включена")}</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">{t("cards.protection.description", "Изменения хранятся в cookie демо-приложения. Подтверждение настроено для покупок от 15 000 ₽.")}</p></div></div></Card>
        </div>
      </div>
      <BankOfferGrid context="cards" />
    </div>
  );
}

function CardArtwork({ card, controls, showNumber, brandName, hideBalance, frozenLabel, productLabel }: { card: BankCardRecord; controls: CardControls; showNumber: boolean; brandName: string; hideBalance: boolean; frozenLabel: string; productLabel: string }) {
  const backgrounds = { prism: "bank-card-art", aurora: "bg-[radial-gradient(circle_at_25%_10%,#4de4ff_0%,transparent_36%),linear-gradient(135deg,#101421,#2c1f68_55%,#0c0c12)]", graphite: "bg-[radial-gradient(circle_at_80%_20%,rgba(255,151,64,.45),transparent_35%),linear-gradient(145deg,#222,#080808)]" };
  return <div className={cn("relative aspect-[1.62/1] min-h-0 overflow-hidden rounded-[1.5rem] border border-white/15 p-4 text-white sm:p-6", backgrounds[controls.style])}><div className="flex min-w-0 justify-between gap-3"><div className="min-w-0"><p className="truncate text-[10px] uppercase tracking-[.16em] text-white/60 sm:text-xs sm:tracking-[.18em]">{brandName} {controls.cardName}</p><div className="mt-1 flex min-w-0 flex-wrap items-center gap-1.5"><p className="truncate text-sm font-bold sm:text-base">{productLabel}</p>{controls.frozen ? <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[9px] backdrop-blur sm:text-xs"><Snowflake className="size-3" />{frozenLabel}</span> : null}</div></div><ScanLine className="size-6 shrink-0 sm:size-7" /></div><p className="number-display mt-4 truncate text-xl font-bold sm:mt-7 sm:text-2xl">{hideBalance ? "•••••• ₽" : card.balance.toLocaleString("ru-RU") + " ₽"}</p><div className="absolute inset-x-4 bottom-4 min-w-0 sm:inset-x-6 sm:bottom-6"><p className="truncate font-mono text-[10px] tracking-[.08em] sm:text-base sm:tracking-[.12em]">{showNumber ? `5478 1842 6701 ${card.last4}` : `5478 •••• •••• ${card.last4}`}</p><div className="mt-2 flex justify-between gap-3 font-mono text-[8px] text-white/75 sm:mt-4 sm:text-[10px]"><span className="truncate">ALEXEY LEBEDEV</span><span className="shrink-0">{card.expires}</span></div></div></div>;
}

function ControlRow({ icon, title, description, checked, onChange }: { icon: React.ReactNode; title: string; description: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <div className="flex items-center gap-3 py-4"><span className="grid size-9 place-items-center rounded-xl bg-secondary text-muted-foreground [&_svg]:size-4">{icon}</span><div className="min-w-0 flex-1"><p className="text-sm font-bold">{title}</p><p className="text-xs leading-5 text-muted-foreground">{description}</p></div><Switch checked={checked} onCheckedChange={onChange} aria-label={title} /></div>;
}

function LimitInput({ id, label, value, max, onChange }: { id: string; label: string; value: number; max: number; onChange: (value: number) => void }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}, ₽</Label><Input id={id} type="number" min={0} max={max} value={value} onChange={(event) => onChange(Math.max(0, Math.min(max, Number(event.target.value))))} /></div>;
}
