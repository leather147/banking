"use client";

import NumberFlow from "@number-flow/react";
import Link from "next/link";
import { Copy, CreditCard, Eye, EyeOff, Plus, ScanLine, Settings2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/components/providers/i18n-provider";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { getVisibleCards } from "@/lib/cards";
import { cn } from "@/lib/utils";

export function BankCard() {
  const { t } = useI18n();
  const { settings, setSetting } = usePersonalization();
  const cards = getVisibleCards(settings.demoCardCount);
  const [active, setActive] = React.useState(0);
  const railRef = React.useRef<HTMLDivElement>(null);

  function handleScroll() {
    const rail = railRef.current;
    if (!rail) return;
    const width = rail.firstElementChild?.clientWidth ?? rail.clientWidth;
    setActive(Math.min(cards.length, Math.max(0, Math.round(rail.scrollLeft / Math.max(width + 12, 1)))));
  }

  return (
    <Card className="glow-hero metric-glow overflow-hidden border-primary/25 p-4 sm:p-5 xl:h-full">
      <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold text-muted-foreground">{t("dashboard.card")}</p><h2 className="mt-1 text-lg font-bold">Карты и доступный баланс</h2></div><Link href="/cards" className="inline-flex size-9 items-center justify-center rounded-xl bg-secondary text-muted-foreground outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring" aria-label="Настроить карты"><Settings2 className="size-4" /></Link></div>
      <div ref={railRef} onScroll={handleScroll} className="hide-scrollbar mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto touch-pan-x">
        {cards.map((card) => <div key={card.id} className="flex min-w-full snap-center items-center gap-3 sm:min-w-[78%] xl:min-w-full 2xl:min-w-[78%]">
          <div className={cn("bank-card-art relative aspect-[1.62/1] shrink-0 overflow-hidden rounded-[calc(.8rem*var(--ui-radius-scale))] border border-white/15 p-3 text-white", settings.cardDisplayStyle === "compact" ? "w-[8rem]" : settings.cardDisplayStyle === "cinematic" ? "w-[11rem]" : "w-[9.5rem]")}><div className="flex items-start justify-between"><p className="max-w-24 truncate text-[8px] font-bold uppercase tracking-[0.16em]">{settings.brandName}</p><ScanLine className="size-3.5 text-white/75" /></div><div className="absolute inset-x-3 bottom-3"><p className="font-mono text-[9px] tracking-[0.08em]">5478 •••• {card.last4}</p><div className="mt-2 flex justify-between font-mono text-[7px] text-white/70"><span>A. LEBEDEV</span><span>{card.expires}</span></div></div></div>
          <div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-muted-foreground">{settings.brandName} {card.name}</p><p className="number-display mt-1 whitespace-nowrap text-2xl font-bold tracking-tight sm:text-[1.7rem]">{settings.balanceHidden ? "•••••• ₽" : <><NumberFlow value={card.balance} locales="ru-RU" /> ₽</>}</p><p className="mt-2 font-mono text-[11px] text-muted-foreground">•• {card.last4} · {card.network}</p></div>
        </div>)}
        <Link href="/cards" className="grid min-w-full snap-center place-items-center rounded-2xl border border-dashed border-primary/25 bg-primary/5 p-5 text-center outline-none transition-[border-color,background-color] hover:border-primary/45 hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-ring sm:min-w-[78%]"><span><span className="mx-auto grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground"><Plus className="size-5" /></span><span className="mt-3 block text-sm font-bold">Оформить новую карту</span><span className="mt-1 block text-[11px] text-muted-foreground">Персональное предложение уже готово</span></span></Link>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3"><div className="flex gap-1.5" aria-label="Положение в списке карт">{Array.from({ length: cards.length + 1 }, (_, index) => <span key={index} className={cn("h-1.5 rounded-full transition-[width,background-color]", active === index ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/25")} />)}</div><Button size="icon-sm" variant="ghost" onClick={() => setSetting("balanceHidden", !settings.balanceHidden)} aria-label={settings.balanceHidden ? "Показать баланс" : "Скрыть баланс"}>{settings.balanceHidden ? <Eye /> : <EyeOff />}</Button></div>
      <div className="mt-3 grid grid-cols-2 gap-2"><Button size="sm" variant="secondary" onClick={() => { navigator.clipboard?.writeText("5478 0000 0000 0932"); toast.success("Номер карты скопирован"); }}><Copy />{t("dashboard.details")}</Button><Button size="sm" variant="secondary" asChild><Link href="/cards"><CreditCard />{t("dashboard.manage")}</Link></Button></div>
    </Card>
  );
}
