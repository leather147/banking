"use client";

import { ArrowDownLeft, ArrowUpRight, CarFront, CircleDollarSign, ReceiptText, ShoppingBasket, Utensils } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/types";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { useI18n } from "@/components/providers/i18n-provider";
import { formatAppMoney } from "@/lib/currency";

const categoryIcons = {
  Переводы: ArrowUpRight,
  Супермаркеты: ShoppingBasket,
  Транспорт: CarFront,
  Подписки: CircleDollarSign,
  Рестораны: Utensils,
  Зарплата: ArrowDownLeft,
};

export function TransactionRow({ transaction, showDate = false }: { transaction: Transaction; showDate?: boolean }) {
  const { settings } = usePersonalization();
  const { locale } = useI18n();
  const Icon = categoryIcons[transaction.category] ?? ReceiptText;
  return (
    <div className="flex items-center gap-3 py-3.5">
      <div className={cn("grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground", transaction.amount > 0 && "bg-primary/12 text-primary", transaction.status === "Отклонено" && "bg-destructive/12 text-destructive", transaction.status === "В обработке" && "bg-muted text-muted-foreground")}><Icon className="size-4" /></div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2"><p className={cn("truncate text-sm font-bold", transaction.status === "Отклонено" && "text-destructive")}>{transaction.title}</p>{transaction.status === "В обработке" ? <Badge variant="secondary" className="hidden sm:inline-flex">В обработке</Badge> : null}{transaction.status === "Отклонено" ? <Badge variant="destructive" className="hidden sm:inline-flex">Отклонено</Badge> : null}</div>
        <p className="truncate text-xs text-muted-foreground">{showDate ? `${transaction.date} · ` : ""}{transaction.subtitle}</p>
      </div>
      <div className="shrink-0 text-right"><p className={cn("text-sm font-medium tabular-nums", transaction.amount > 0 && "text-emerald-600 dark:text-emerald-300")}>{transaction.amount > 0 ? "+" : ""}{formatAppMoney(transaction.amount, locale, settings.currencyCode, settings.expenseSignStyle)}</p><p className="mt-0.5 text-[10px] text-muted-foreground">{transaction.category}</p></div>
    </div>
  );
}
