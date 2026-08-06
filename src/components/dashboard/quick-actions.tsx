"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDownToLine, MoreHorizontal, QrCode, Send } from "lucide-react";
import { startTransition, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { useI18n } from "@/components/providers/i18n-provider";
import { createOperationPath, type OperationKind } from "@/lib/operations";
import { DEFAULT_QUICK_ACTION_ORDER, normalizeOrder, type QuickActionItemId } from "@/lib/personalization";
import { cn } from "@/lib/utils";

type QuickAction = { label: string; description: string; detail: string; kind?: OperationKind; href?: "/services"; icon: typeof Send };

const actions: Record<QuickActionItemId, QuickAction> = {
  transfer: { label: "Перевести", description: "По телефону или карте", detail: "Последний перевод: Елене · 2 400 ₽ сегодня", kind: "transfer", icon: Send },
  "top-up": { label: "Пополнить", description: "С карты другого банка", detail: "Последнее пополнение: 15 000 ₽ · 1 августа", kind: "top-up", icon: ArrowDownToLine },
  payment: { label: "Оплатить", description: "Связь, ЖКХ и услуги", detail: "Последний платёж: Music · 299 ₽", kind: "payment", icon: QrCode },
  services: { label: "Ещё", description: "Все сервисы банка", detail: "Карты, бонусы, защита, документы и поддержка.", href: "/services", icon: MoreHorizontal },
};

const actionClassName = "group flex min-w-0 flex-col items-center gap-2 rounded-2xl border bg-card/55 p-3 text-xs outline-none transition-[background-color,border-color,box-shadow] hover:border-primary/25 hover:bg-secondary/70 hover:shadow-[0_18px_44px_-28px_var(--glow-lime)] focus-visible:ring-2 focus-visible:ring-ring sm:flex-row sm:justify-center sm:text-sm";

export function QuickActions() {
  const router = useRouter();
  const [pending, setPending] = useState<OperationKind | null>(null);
  const { settings } = usePersonalization();
  const { t } = useI18n();
  const orderedActions = normalizeOrder(settings.quickActionOrder, DEFAULT_QUICK_ACTION_ORDER).map((id) => ({ ...actions[id], id }));

  function begin(kind: OperationKind) {
    setPending(kind);
    startTransition(() => router.push(createOperationPath(kind)));
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4">
      {orderedActions.map(({ id, label, description, detail, kind, href, icon: Icon }) => {
        const translatedLabel = t(id === "transfer" ? "top.transfer" : id === "top-up" ? "action.topup" : id === "payment" ? "action.payment" : "nav.services", label);
        return (
        <Tooltip key={label}>
          <TooltipTrigger asChild>
            {kind ? <button type="button" onClick={() => begin(kind)} disabled={pending === kind} className={actionClassName}>
              <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-foreground transition-colors group-hover:bg-background/80", id === "transfer" && "bg-primary text-primary-foreground group-hover:bg-primary")}><Icon className="size-4" /></span>
              <span className="min-w-0 text-center sm:text-left"><span className="block truncate font-semibold">{translatedLabel}</span><span className="hidden truncate text-[10px] text-muted-foreground xl:block">{description}</span></span>
            </button> : <Link href={href ?? "/services"} className={actionClassName}><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-foreground group-hover:bg-background/80"><Icon className="size-4" /></span><span className="min-w-0 text-center sm:text-left"><span className="block truncate font-semibold">{translatedLabel}</span><span className="hidden truncate text-[10px] text-muted-foreground xl:block">{description}</span></span></Link>}
          </TooltipTrigger>
          <TooltipContent data-personal-hint side="bottom" className="glass-panel max-w-56 border-primary/10 bg-popover/80 p-3"><p className="font-medium">{description}</p><p className="mt-1 text-[10px] text-muted-foreground">{detail}</p></TooltipContent>
        </Tooltip>
      );})}
    </div>
  );
}
