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

type SearchItem = { id: string; icon: typeof Search; href?: Route; kind?: OperationKind };

const searchItems: SearchItem[] = [
  { id: "transfer", icon: Send, kind: "transfer" },
  { id: "topUp", icon: WalletCards, kind: "top-up" },
  { id: "payment", icon: QrCode, kind: "payment" },
  { id: "operations", icon: History, href: "/history" },
  { id: "cards", icon: CreditCard, href: "/cards" },
  { id: "analytics", icon: BarChart3, href: "/analytics" },
  { id: "appearance", icon: Sparkles, href: "/settings/appearance" },
  { id: "settings", icon: Settings, href: "/settings" },
  { id: "services", icon: LayoutGrid, href: "/services" },
  { id: "documents", icon: FileText, href: "/profile/documents" },
];

export function SearchCommand({ className }: { className?: string }) {
  const router = useRouter();
  const { settings } = usePersonalization();
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const localizedItems = useMemo(() => searchItems.map((item) => ({
    ...item,
    title: t(`search.item.${item.id}.title`),
    description: t(`search.item.${item.id}.description`),
    keywords: t(`search.item.${item.id}.keywords`),
  })), [t]);
  const results = useMemo(() => {
    if (!deferredQuery) return localizedItems.slice(0, 6);
    return localizedItems.filter((item) => `${item.title} ${item.description} ${item.keywords}`.toLowerCase().includes(deferredQuery)).slice(0, 8);
  }, [deferredQuery, localizedItems]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && (event.code === "KeyK" || event.key.toLowerCase() === "k")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        setOpen((current) => !current);
      }
    };
    // Capture before page-level handlers so Ctrl/Cmd+K belongs to the bank
    // command palette instead of a nested widget or browser-search shim.
    document.addEventListener("keydown", onKeyDown, { capture: true });
    return () => document.removeEventListener("keydown", onKeyDown, { capture: true });
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
      <DialogContent className="glass-panel left-0 top-0 h-dvh max-h-dvh w-screen max-w-none translate-x-0 translate-y-0 gap-0 overflow-hidden rounded-none border-0 bg-background/95 p-0 backdrop-blur-3xl sm:w-screen sm:p-0">
        <DialogHeader className="sr-only"><DialogTitle>{t("search.title")}</DialogTitle><DialogDescription>{t("search.description")}</DialogDescription></DialogHeader>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 app-grid opacity-55" />
        <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(3.5rem,env(safe-area-inset-top))] sm:px-6 sm:pt-16">
        <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-card/70 shadow-2xl"><Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-primary" /><Input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("search.placeholder")} className="h-16 rounded-none border-0 bg-transparent pl-14 pr-12 text-base shadow-none focus-visible:ring-0 sm:h-20 sm:text-xl" /></div>
        <div className="min-h-0 flex-1 overflow-y-auto py-5">
          <div className="flex items-center justify-between px-1 py-2"><div><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">{query ? t("search.results") : t("search.suggestions")}</p><h2 className="mt-1 text-xl font-bold sm:text-2xl">{query ? t("search.query", undefined, { query }) : t("search.destination")}</h2></div><span className="text-[10px] text-muted-foreground">{t("search.found", undefined, { count: results.length })}</span></div>
          <AnimatePresence mode="popLayout" initial={false}>
            {results.length ? <motion.div layout className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">{results.map((item, index) => {
              const Icon = item.icon;
              return <motion.button key={item.id} type="button" layout initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.985 }} transition={{ duration: 0.42 / settings.motionSpeed, delay: Math.min(index * 0.02, 0.1), ease: MOTION_EASINGS[settings.easingPanel].value }} onClick={() => select(item)} className="group flex aspect-square min-w-0 cursor-pointer flex-col items-start justify-between rounded-2xl border bg-card/64 p-3 text-left outline-none transition-[border-color,background-color,box-shadow] hover:border-primary/25 hover:bg-secondary/45 hover:shadow-[0_0_34px_-25px_var(--glow-lime)] focus-visible:ring-2 focus-visible:ring-ring sm:p-4"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary sm:size-11"><Icon className="size-4 sm:size-5" /></span><span className="min-w-0"><span className="block text-sm font-bold sm:text-base">{item.title}</span><span className="mt-1 line-clamp-2 block text-[10px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">{item.description}</span></span></motion.button>;
            })}</motion.div> : <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid min-h-56 place-items-center text-center"><div><Search className="mx-auto size-7 text-muted-foreground" /><p className="mt-3 text-sm font-medium">{t("search.empty.title")}</p><p className="mt-1 text-xs text-muted-foreground">{t("search.empty.description")}</p></div></motion.div>}
          </AnimatePresence>
        </div>
        <div className="flex items-center justify-between border-t border-primary/10 px-1 py-3 text-[10px] text-muted-foreground"><span>{t("search.keyboard.select")}</span><span>{t("search.keyboard.close")}</span></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
