"use client";

import * as React from "react";
import { Check, Copy, Download, ExternalLink, Link2, Mail, MessageCircle, Send, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatRubles } from "@/components/payments/flow-primitives";
import type { OperationRecord } from "@/lib/operations";
import { cn } from "@/lib/utils";

type OperationActionsProps = {
  operation: OperationRecord;
  statusLabel: string;
  date: string;
  bankName: string;
};

export function OperationReceiptActions({ operation, statusLabel, date, bankName }: OperationActionsProps) {
  const [progress, setProgress] = React.useState(0);
  const [downloading, setDownloading] = React.useState(false);
  const [shareOpen, setShareOpen] = React.useState(false);
  const timerRef = React.useRef<number | null>(null);
  const toastIdRef = React.useRef<string | number | null>(null);

  React.useEffect(() => () => {
    // Toasts and progress timers outlive a route visually unless both are
    // explicitly dismissed when the receipt screen unmounts.
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (toastIdRef.current) toast.dismiss(toastIdRef.current);
  }, []);

  // The downloadable artifact intentionally contains only masked display data;
  // share targets receive an even shorter summary below.
  const receiptText = React.useMemo(() => [
    `${bankName} — демонстрационная квитанция`,
    `Операция: ${operation.slug}`,
    `Статус: ${statusLabel}`,
    `Сумма: ${formatRubles(operation.amount)}`,
    `Комиссия: ${formatRubles(operation.fee)}`,
    `Откуда: ${operation.source}`,
    `Получатель: ${operation.recipient}`,
    `Дата: ${date}`,
    operation.rejectionReason ? `Причина отклонения: ${operation.rejectionReason}` : "",
    "Документ сформирован демонстрационным приложением и не подтверждает движение реальных денег.",
  ].filter(Boolean).join("\n"), [bankName, date, operation, statusLabel]);

  function finishDownload() {
    const url = URL.createObjectURL(new Blob([receiptText], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${bankName.toLowerCase().replace(/[^a-zа-яё0-9]+/giu, "-")}-${operation.slug}.txt`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    setDownloading(false);
    setProgress(100);
    if (toastIdRef.current) toast.success("Чек готов", { id: toastIdRef.current, description: "Файл сохранён на устройство" });
    window.setTimeout(() => setProgress(0), 900);
  }

  function downloadReceipt() {
    if (downloading) return;
    setDownloading(true);
    setProgress(4);
    toastIdRef.current = toast.loading("Подготавливаем чек · 4%", { description: "Проверяем реквизиты и подпись документа" });
    timerRef.current = window.setInterval(() => {
      setProgress((current) => {
        const next = Math.min(100, current + Math.max(5, Math.round((100 - current) / 7)));
        if (toastIdRef.current) toast.loading(`Подготавливаем чек · ${next}%`, { id: toastIdRef.current, description: next < 72 ? "Собираем сведения об операции" : "Формируем файл" });
        if (next >= 100) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          timerRef.current = null;
          window.setTimeout(finishDownload, 120);
        }
        return next;
      });
    }, 90);
  }

  return <>
    <Button variant="outline" className="relative overflow-hidden" aria-busy={downloading} onClick={downloadReceipt}>
      <span aria-hidden="true" className="absolute inset-y-0 left-0 bg-primary/16 transition-[width] duration-200" style={{ width: `${progress}%` }} />
      <span className="relative flex items-center gap-2">{progress === 100 ? <Check /> : <Download />}{downloading ? `Скачать чек · ${progress}%` : progress === 100 ? "Чек скачан" : "Скачать чек"}</span>
    </Button>
    <Button variant="outline" onClick={() => setShareOpen(true)}><Share2 />Поделиться</Button>
    <ShareOperationDialog open={shareOpen} onOpenChange={setShareOpen} operation={operation} text={`${statusLabel}: ${operation.title}, ${formatRubles(operation.amount)} · ${operation.slug}`} />
  </>;
}

function ShareOperationDialog({ open, onOpenChange, operation, text }: { open: boolean; onOpenChange: (open: boolean) => void; operation: OperationRecord; text: string }) {
  const encoded = encodeURIComponent(text);
  const options = [
    { label: "Telegram", description: "Отправить в чат", icon: Send, href: `https://t.me/share/url?url=${encodeURIComponent(locationSafe())}&text=${encoded}`, tint: "text-sky-500 bg-sky-500/12" },
    { label: "WhatsApp", description: "Поделиться сообщением", icon: MessageCircle, href: `https://wa.me/?text=${encoded}`, tint: "text-emerald-500 bg-emerald-500/12" },
    { label: "Email", description: "Отправить письмом", icon: Mail, href: `mailto:?subject=${encodeURIComponent(`Операция ${operation.slug}`)}&body=${encoded}`, tint: "text-chart-2 bg-chart-2/12" },
  ];

  function openShare(href: string) {
    window.open(href, "_blank", "noopener,noreferrer,width=720,height=680");
    onOpenChange(false);
  }

  async function copy() {
    await navigator.clipboard?.writeText(text);
    toast.success("Информация об операции скопирована");
    onOpenChange(false);
  }

  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-w-md">
    <DialogHeader><DialogTitle className="flex items-center gap-2"><Share2 className="size-5 text-primary" />Поделиться операцией</DialogTitle><DialogDescription>Выберите канал. В сообщение попадут статус, сумма и идентификатор без полных реквизитов.</DialogDescription></DialogHeader>
    <div className="grid grid-cols-2 gap-2">
      {options.map(({ label, description, icon: Icon, href, tint }) => <button key={label} type="button" onClick={() => openShare(href)} className="rounded-2xl border bg-background/40 p-4 text-left outline-none transition-[border-color,background-color,box-shadow] hover:border-primary/28 hover:bg-secondary/55 focus-visible:ring-2 focus-visible:ring-ring"><span className={cn("grid size-10 place-items-center rounded-xl", tint)}><Icon className="size-4" /></span><span className="mt-3 block font-bold">{label}</span><span className="mt-1 block text-xs text-muted-foreground">{description}</span></button>)}
      <button type="button" onClick={copy} className="rounded-2xl border bg-background/40 p-4 text-left outline-none transition-[border-color,background-color,box-shadow] hover:border-primary/28 hover:bg-secondary/55 focus-visible:ring-2 focus-visible:ring-ring"><span className="grid size-10 place-items-center rounded-xl bg-primary/12 text-primary"><Link2 className="size-4" /></span><span className="mt-3 block font-bold">Скопировать</span><span className="mt-1 block text-xs text-muted-foreground">Безопасная короткая сводка</span></button>
    </div>
    <div className="flex items-center justify-between gap-3 rounded-xl bg-secondary/50 p-3 text-xs text-muted-foreground"><span className="truncate font-mono">{operation.slug}</span><Button size="icon-sm" variant="ghost" aria-label="Скопировать ID" onClick={() => { navigator.clipboard?.writeText(operation.slug); toast.success("ID скопирован"); }}><Copy /></Button></div>
    <p className="flex items-start gap-2 text-[11px] leading-5 text-muted-foreground"><ExternalLink className="mt-0.5 size-3.5 shrink-0" />Социальная сеть откроется в отдельном безопасном окне. Полные платёжные реквизиты не передаются.</p>
  </DialogContent></Dialog>;
}

function locationSafe() {
  return typeof window === "undefined" ? "" : window.location.href;
}
