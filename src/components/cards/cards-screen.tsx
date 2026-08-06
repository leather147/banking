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
  const cards = getVisibleCards(settings.demoCardCount);
  const [controls, setControls] = useCookieState("lumen-card-controls-v2", cardControlsSchema, DEFAULT_CONTROLS);
  const [selectedId, setSelectedId] = React.useState(cards[0]?.id ?? "black");
  const [showNumber, setShowNumber] = React.useState(false);
  const railRef = React.useRef<HTMLDivElement>(null);
  const selected = cards.find((card) => card.id === selectedId) ?? cards[0];
  const current = controls[selected.id] ?? makeControls(selected);

  function updateControl<K extends keyof CardControls>(key: K, value: CardControls[K], announce = true) {
    setControls((state) => ({ ...state, [selected.id]: { ...(state[selected.id] ?? makeControls(selected)), [key]: value } }));
    if (announce) toast.success(`Настройка карты •• ${selected.last4} сохранена`);
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
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Мои карты</p><h2 className="mt-1 text-xl font-bold">{selected.name} •• {selected.last4}</h2><p className="mt-1 text-sm text-muted-foreground">Листайте карты горизонтально — настройки ниже меняются для каждой отдельно.</p></div><span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs text-primary">{cards.length} активных</span></div>
        <div ref={railRef} onScroll={handleRailScroll} className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 touch-pan-x">
          {cards.map((card) => {
            const cardControls = controls[card.id] ?? makeControls(card);
            return <button key={card.id} data-card-id={card.id} type="button" onClick={() => setSelectedId(card.id)} className={cn("min-w-[min(84vw,410px)] snap-center rounded-[1.65rem] border p-1 text-left outline-none transition-[border-color,box-shadow,opacity] sm:min-w-[390px]", selected.id === card.id ? "border-primary/55 shadow-[0_0_36px_-20px_var(--glow-lime)]" : "border-transparent opacity-80 hover:opacity-100", cardControls.frozen && "grayscale")}>
              <CardArtwork card={card} controls={cardControls} showNumber={showNumber && selected.id === card.id} brandName={settings.brandName} hideBalance={settings.balanceHidden} />
            </button>;
          })}
          <button type="button" onClick={() => toast("Заявка на новую карту открыта в демонстрационном режиме")} className="group grid min-w-[min(84vw,410px)] snap-center place-items-center rounded-[1.65rem] border border-dashed border-primary/28 bg-primary/5 p-8 text-center outline-none transition-[background-color,border-color,box-shadow] hover:border-primary/50 hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-ring sm:min-w-[390px]">
            <span><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[0_0_30px_-12px_var(--glow-lime)]"><Plus className="size-6" /></span><span className="mt-4 block text-lg font-bold">Оформить новую карту</span><span className="mt-1 block max-w-64 text-sm leading-6 text-muted-foreground">Подберём продукт по вашим расходам, поездкам и бонусам.</span></span>
          </button>
        </div>
        <div className="flex flex-wrap gap-2"><Button variant="secondary" onClick={() => setShowNumber((value) => !value)}>{showNumber ? <EyeOff /> : <Eye />}{showNumber ? "Скрыть реквизиты" : "Показать реквизиты"}</Button><Button variant="secondary" onClick={() => { navigator.clipboard?.writeText(`547818426701${selected.last4}`); toast.success("Номер скопирован"); }}><Copy />Скопировать номер</Button><Button variant="outline" onClick={() => toast("Пластиковая карта добавлена в заявку")}><Plus />Дополнительная карта</Button></div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card><CardHeader><CardTitle>Операции по карте</CardTitle><p className="text-sm text-muted-foreground">Все разрешения независимы для карты •• {selected.last4}.</p></CardHeader><CardContent className="divide-y pt-1">
          <ControlRow icon={<Snowflake />} title="Заморозить карту" description="Остановить покупки, переводы и снятие" checked={current.frozen} onChange={(value) => updateControl("frozen", value)} />
          <ControlRow icon={<ShoppingBag />} title="Покупки в интернете" description="Онлайн-магазины и приложения" checked={current.online} onChange={(value) => updateControl("online", value)} />
          <ControlRow icon={<Radio />} title="Бесконтактная оплата" description="NFC и токенизированные кошельки" checked={current.contactless} onChange={(value) => updateControl("contactless", value)} />
          <ControlRow icon={<Globe2 />} title="Операции за границей" description="Платежи и конвертация вне России" checked={current.international} onChange={(value) => updateControl("international", value)} />
          <ControlRow icon={<CreditCard />} title="Снятие наличных" description="Банкоматы и кассы банков" checked={current.cashWithdrawal} onChange={(value) => updateControl("cashWithdrawal", value)} />
          <ControlRow icon={<Magnet />} title="Магнитная полоса" description="Отключена по умолчанию для безопасности" checked={current.magneticStripe} onChange={(value) => updateControl("magneticStripe", value)} />
        </CardContent></Card>

        <div className="space-y-4">
          <Card><CardHeader><CardTitle>Лимиты и имя карты</CardTitle></CardHeader><CardContent className="space-y-5">
            <div className="space-y-2"><Label htmlFor="card-name">Название в приложении</Label><Input id="card-name" value={current.cardName} maxLength={24} onChange={(event) => updateControl("cardName", event.target.value, false)} onBlur={() => toast.success("Название карты сохранено")} /></div>
            <LimitInput id="daily-limit" label="Лимит покупок в день" value={current.dailyLimit} max={1000000} onChange={(value) => updateControl("dailyLimit", value, false)} />
            <LimitInput id="cash-limit" label="Лимит снятия наличных" value={current.cashLimit} max={500000} onChange={(value) => updateControl("cashLimit", value, false)} />
            <Button className="w-full" onClick={() => toast.success("Лимиты карты сохранены")}>Сохранить лимиты</Button>
          </CardContent></Card>
          <Card><CardHeader><CardTitle>Стиль карты</CardTitle><p className="text-sm text-muted-foreground">Оформление меняется только для выбранной карты.</p></CardHeader><CardContent className="grid grid-cols-3 gap-2">{(["prism", "aurora", "graphite"] as const).map((style) => <button key={style} type="button" aria-pressed={current.style === style} onClick={() => updateControl("style", style)} className={cn("min-h-20 rounded-2xl border bg-secondary/40 p-3 text-xs font-bold capitalize outline-none transition-[border-color,background-color,box-shadow] hover:border-primary/30 focus-visible:ring-2 focus-visible:ring-ring", current.style === style && "border-primary bg-primary/10 shadow-[0_0_24px_-16px_var(--glow-lime)]")}>{style}</button>)}</CardContent></Card>
          <Card className="border-primary/20 bg-primary/5 p-5"><div className="flex gap-3"><LockKeyhole className="mt-0.5 size-5 text-primary" /><div><h2 className="text-sm font-bold">Защита операций включена</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">Изменения хранятся в cookie демо-приложения. Подтверждение настроено для покупок от 15 000 ₽.</p></div></div></Card>
        </div>
      </div>
    </div>
  );
}

function CardArtwork({ card, controls, showNumber, brandName, hideBalance }: { card: BankCardRecord; controls: CardControls; showNumber: boolean; brandName: string; hideBalance: boolean }) {
  const backgrounds = { prism: "bank-card-art", aurora: "bg-[radial-gradient(circle_at_25%_10%,#4de4ff_0%,transparent_36%),linear-gradient(135deg,#101421,#2c1f68_55%,#0c0c12)]", graphite: "bg-[radial-gradient(circle_at_80%_20%,rgba(255,151,64,.45),transparent_35%),linear-gradient(145deg,#222,#080808)]" };
  return <div className={cn("relative aspect-[1.62/1] overflow-hidden rounded-[1.5rem] border border-white/15 p-6 text-white", backgrounds[controls.style])}><div className="flex justify-between"><div><p className="max-w-56 truncate text-xs uppercase tracking-[.18em] text-white/60">{brandName} {controls.cardName}</p><p className="mt-1 font-bold">{card.product}</p></div><ScanLine className="size-7" /></div><p className="number-display mt-7 text-2xl font-bold">{hideBalance ? "•••••• ₽" : card.balance.toLocaleString("ru-RU") + " ₽"}</p><div className="absolute inset-x-6 bottom-6"><p className="font-mono text-base tracking-[.12em]">{showNumber ? `5478 1842 6701 ${card.last4}` : `5478 •••• •••• ${card.last4}`}</p><div className="mt-4 flex justify-between font-mono text-[10px] text-white/75"><span>ALEXEY LEBEDEV</span><span>{card.expires}</span></div></div>{controls.frozen ? <span className="absolute right-5 top-20 inline-flex items-center gap-1 rounded-full bg-black/55 px-3 py-1 text-xs backdrop-blur"><Snowflake className="size-3" />Заморожена</span> : null}</div>;
}

function ControlRow({ icon, title, description, checked, onChange }: { icon: React.ReactNode; title: string; description: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <div className="flex items-center gap-3 py-4"><span className="grid size-9 place-items-center rounded-xl bg-secondary text-muted-foreground [&_svg]:size-4">{icon}</span><div className="min-w-0 flex-1"><p className="text-sm font-bold">{title}</p><p className="text-xs leading-5 text-muted-foreground">{description}</p></div><Switch checked={checked} onCheckedChange={onChange} aria-label={title} /></div>;
}

function LimitInput({ id, label, value, max, onChange }: { id: string; label: string; value: number; max: number; onChange: (value: number) => void }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}, ₽</Label><Input id={id} type="number" min={0} max={max} value={value} onChange={(event) => onChange(Math.max(0, Math.min(max, Number(event.target.value))))} /></div>;
}
