"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { BarChart3, Command, CreditCard, FileText, History, LayoutGrid, QrCode, Search, Send, Settings, Sparkles, WalletCards } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { startTransition, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { useI18n } from "@/components/providers/i18n-provider";
import { Input } from "@/components/ui/input";
import { createOperationPath, type OperationKind } from "@/lib/operations";
import { MOTION_EASINGS } from "@/lib/motion";
import { cn } from "@/lib/utils";

type SearchItem = { title: string; description: string; keywords: string; icon: typeof Search; href?: Route; kind?: OperationKind };

const searchItems: SearchItem[] = [
  { title: "Новый перевод", description: "По телефону, карте или счёту", keywords: "перевести сбп получатель", icon: Send, kind: "transfer" },
  { title: "Пополнить карту", description: "С другой карты или своего счёта", keywords: "пополнение деньги", icon: WalletCards, kind: "top-up" },
  { title: "Оплатить услугу", description: "Связь, интернет, ЖКХ", keywords: "платеж мобильный интернет квартплата", icon: QrCode, kind: "payment" },
  { title: "История операций", description: "Поиск списаний и поступлений", keywords: "операции чек квитанция", icon: History, href: "/history" },
  { title: "Карты и счета", description: "Баланс и управление картами", keywords: "реквизиты лимит", icon: CreditCard, href: "/cards" },
  { title: "Аналитика", description: "Категории, бюджет и динамика", keywords: "расходы доходы статистика", icon: BarChart3, href: "/analytics" },
  { title: "Персонализация", description: "Scale, glass, анимации и подсказки", keywords: "тема интерфейс размер blur", icon: Sparkles, href: "/settings/appearance" },
  { title: "Настройки", description: "Безопасность и уведомления", keywords: "приватность устройства", icon: Settings, href: "/settings" },
  { title: "Все сервисы", description: "Продукты, бонусы и поддержка", keywords: "каталог еще", icon: LayoutGrid, href: "/services" },
  { title: "Документы", description: "Паспортные данные и справки", keywords: "справка паспорт", icon: FileText, href: "/profile/documents" },
];

export function SearchCommand({ className }: { className?: string }) {
  const router = useRouter();
  const { settings } = usePersonalization();
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const results = useMemo(() => {
    if (!deferredQuery) return searchItems.slice(0, 6);
    return searchItems.filter((item) => `${item.title} ${item.description} ${item.keywords}`.toLowerCase().includes(deferredQuery)).slice(0, 8);
  }, [deferredQuery]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function select(item: SearchItem) {
    setOpen(false);
    setQuery("");
    startTransition(() => router.push(item.kind ? createOperationPath(item.kind) : item.href ?? "/"));
  }

  return (
    <Dialog open={open} onOpenChange={(next) => { setOpen(next); if (next) window.setTimeout(() => inputRef.current?.focus(), 60); }}>
      <DialogTrigger asChild>
        <button type="button" className={cn("glass-panel group flex h-10 w-full min-w-0 items-center gap-2 rounded-xl border border-transparent bg-background/45 px-3 text-sm text-muted-foreground outline-none transition-[border-color,background-color,box-shadow] hover:border-primary/15 hover:bg-secondary/55 focus-visible:ring-2 focus-visible:ring-ring", className)}>
          <Search className="size-4 shrink-0" />
          <span className="truncate"><span className="hidden sm:inline">{t("top.search")}</span><span className="sm:hidden">{t("top.search", "Поиск")}</span></span>
          <span className="ml-auto hidden items-center gap-1 rounded-md border bg-secondary/70 px-1.5 py-0.5 text-[10px] md:flex"><Command className="size-3" />K</span>
        </button>
      </DialogTrigger>
      <DialogContent className="glass-panel top-[12%] max-w-xl translate-y-0 gap-0 overflow-hidden border-primary/15 bg-popover/78 p-0 sm:top-[14%]">
        <DialogHeader className="sr-only"><DialogTitle>Поиск</DialogTitle><DialogDescription>Найдите операцию, получателя или банковский сервис.</DialogDescription></DialogHeader>
        <div className="relative border-b"><Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" /><Input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Операция, получатель или сервис" className="h-16 rounded-none border-0 bg-transparent pl-14 pr-5 text-base shadow-none focus-visible:ring-0" /></div>
        <div className="max-h-[55vh] overflow-y-auto p-2">
          <div className="flex items-center justify-between px-3 py-2"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{query ? "Результаты" : "Предложения"}</p><span className="text-[10px] text-muted-foreground">{results.length} найдено</span></div>
          <AnimatePresence mode="popLayout" initial={false}>
            {results.length ? results.map((item, index) => {
              const Icon = item.icon;
              return <motion.button key={item.title} type="button" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.42 / settings.motionSpeed, delay: Math.min(index * 0.02, 0.1), ease: MOTION_EASINGS[settings.easingPanel].value }} onClick={() => select(item)} className="group flex w-full items-center gap-3 rounded-xl p-3 text-left outline-none transition-colors hover:bg-secondary/70 focus-visible:bg-secondary focus-visible:ring-2 focus-visible:ring-ring"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary"><Icon className="size-4" /></span><span className="min-w-0"><span className="block text-sm font-bold">{item.title}</span><span className="block truncate text-xs text-muted-foreground">{item.description}</span></span><span className="ml-auto text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">Открыть</span></motion.button>;
            }) : <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid min-h-40 place-items-center text-center"><div><Search className="mx-auto size-7 text-muted-foreground" /><p className="mt-3 text-sm font-medium">Ничего не найдено</p><p className="mt-1 text-xs text-muted-foreground">Попробуйте более короткий запрос.</p></div></motion.div>}
          </AnimatePresence>
        </div>
        <div className="flex items-center justify-between border-t px-4 py-3 text-[10px] text-muted-foreground"><span>Tab выбрать · Enter открыть</span><span>Esc закрыть</span></div>
      </DialogContent>
    </Dialog>
  );
}
