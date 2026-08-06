"use client";

import NumberFlow from "@number-flow/react";
import Link from "next/link";
import * as React from "react";
import { ArrowDownToLine, Check, ChevronDown, ChevronRight, Info, MoreHorizontal, QrCode, Send, ShieldCheck, WalletCards } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { OperationStartButton } from "@/components/operations/operation-start-button";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { OperationKind } from "@/lib/operations";
import { MOTION_EASINGS } from "@/lib/motion";
import { cn } from "@/lib/utils";

const paymentRoutes = [
  { label: "Перевести", description: "По телефону, карте или счёту", kind: "transfer", icon: Send },
  { label: "Пополнить", description: "С карты или своего счёта", kind: "top-up", icon: ArrowDownToLine },
  { label: "Оплатить", description: "Связь, ЖКХ и другие услуги", kind: "payment", icon: QrCode },
] satisfies { label: string; description: string; kind: OperationKind; icon: typeof Send }[];

export function PaymentNavigation({ active }: { active: OperationKind | "services" }) {
  const { settings } = usePersonalization();
  const { t } = useI18n();
  const transition = { duration: 0.42 / settings.motionSpeed, ease: MOTION_EASINGS[settings.easingMicro].value };
  return (
    <nav aria-label={t("paymentNav.aria", "Платежи и переводы")} className="hide-scrollbar mb-5 flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-4">
      {paymentRoutes.map(({ label, description, kind, icon: Icon }) => {
        const selected = active === kind;
        const className = cn(
          "glass-panel group relative isolate flex min-w-[168px] items-center gap-3 overflow-hidden rounded-2xl border p-3 text-left outline-none transition-[background-color,border-color,box-shadow,color] hover:border-primary/25 hover:bg-secondary/55 focus-visible:ring-2 focus-visible:ring-ring sm:min-w-0",
          selected && "border-primary/55 bg-primary/12 font-bold text-primary shadow-[0_0_30px_-18px_var(--glow-lime)]",
        );
        return (
          <OperationStartButton key={kind} kind={kind} className={className} title={t("paymentNav.start", "Начать новую операцию: {label}", { label: t(`paymentNav.${kind}.label`, label).toLowerCase() })}>
            {selected ? <motion.span layoutId="payment-nav-active" className="absolute inset-0 z-0 bg-primary/8" transition={transition} /> : null}
            <span className={cn("relative z-10 grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground transition-colors group-hover:text-foreground", selected && "bg-primary text-primary-foreground")}>
              <Icon className={cn("size-4", selected && "fill-current/20 stroke-[2.5]")} />
            </span>
            <span className="relative z-10 min-w-0">
              <span className="block text-sm font-medium">{t(`paymentNav.${kind}.label`, label)}</span>
              <span className="hidden truncate text-[10px] text-muted-foreground xl:block">{t(`paymentNav.${kind}.description`, description)}</span>
            </span>
          </OperationStartButton>
        );
      })}
      <Link href="/services" className={cn("glass-panel group relative isolate flex min-w-[168px] items-center gap-3 overflow-hidden rounded-2xl border p-3 outline-none transition-[background-color,border-color,box-shadow,color] hover:border-primary/25 hover:bg-secondary/55 focus-visible:ring-2 focus-visible:ring-ring sm:min-w-0", active === "services" && "border-primary/55 bg-primary/12 font-bold text-primary shadow-[0_0_30px_-18px_var(--glow-lime)]")}>
        {active === "services" ? <motion.span layoutId="payment-nav-active" className="absolute inset-0 z-0 bg-primary/8" transition={transition} /> : null}
        <span className={cn("relative z-10 grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground transition-colors group-hover:text-foreground", active === "services" && "bg-primary text-primary-foreground")}><MoreHorizontal className={cn("size-4", active === "services" && "fill-current/20 stroke-[2.5]")} /></span>
        <span className="relative z-10 min-w-0"><span className="block text-sm font-medium">{t("paymentNav.services.label", "Ещё")}</span><span className="hidden truncate text-[10px] text-muted-foreground xl:block">{t("paymentNav.services.description", "Все продукты и сервисы")}</span></span>
      </Link>
    </nav>
  );
}

export function SourceAccount({ label, title, balance = 326840 }: { label?: string; title?: string; balance?: number }) {
  const { settings } = usePersonalization();
  const { t } = useI18n();
  const accountTitle = title ?? `${settings.brandName} Black`;
  return (
    <div className="rounded-2xl border bg-background/55 p-3.5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label ?? t("sourceAccount.label", "Счёт списания")}</span>
        <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-[11px]" onClick={() => toast(t("sourceAccount.toast", "Выбор другого счёта доступен как демонстрационная заглушка"))}>{t("action.change", "Изменить")}<ChevronDown className="size-3" /></Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="bank-card-art grid size-11 shrink-0 place-items-center rounded-xl text-white"><WalletCards className="size-5" /></span>
        <span className="min-w-[9rem] flex-1">
          <span className="block truncate text-sm font-medium">{accountTitle} •• 0932</span>
          <span className="block text-xs text-muted-foreground">{t("sourceAccount.primary", "Основная карта")}</span>
        </span>
        <span className="ml-auto shrink-0 text-right font-mono text-sm font-semibold tabular-nums"><NumberFlow value={balance} format={{ style: "currency", currency: "RUB", maximumFractionDigits: 0 }} /></span>
      </div>
    </div>
  );
}

export function AmountPresets({ onSelect }: { onSelect: (value: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {["1 000", "3 000", "5 000", "10 000"].map((value) => (
        <Button key={value} type="button" variant="secondary" size="sm" onClick={() => onSelect(value.replace(" ", ""))}>{value} ₽</Button>
      ))}
    </div>
  );
}

export type ReviewRow = { label: string; value: string };

export function ReviewDialog({ open, onOpenChange, title, description, rows, confirmLabel, onConfirm }: { open: boolean; onOpenChange: (open: boolean) => void; title: string; description: string; rows: ReviewRow[]; confirmLabel?: string; onConfirm: () => void }) {
  const [slideMode, setSlideMode] = React.useState(false);
  const { t } = useI18n();
  const effectiveConfirmLabel = confirmLabel ?? t("action.confirm", "Подтвердить");

  React.useEffect(() => {
    const media = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    const update = () => setSlideMode(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <span className="mb-2 grid size-11 place-items-center rounded-2xl bg-primary/15 text-primary"><ShieldCheck className="size-5" /></span>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="divide-y rounded-2xl border bg-background/55 px-4">
          {rows.map((row) => <div key={row.label} className="grid min-w-0 grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] items-start gap-3 py-3 text-sm"><span className="min-w-0 text-muted-foreground">{row.label}</span><span className="min-w-0 break-words text-right font-medium">{row.value}</span></div>)}
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-primary/10 p-3 text-xs text-muted-foreground"><Check className="size-4 shrink-0 text-primary" />{t("review.demoNotice", "Это демонстрация интерфейса: деньги не списываются.")}</div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("action.return", "Вернуться")}</Button>
          {slideMode ? <SlideToConfirm label={effectiveConfirmLabel} onConfirm={onConfirm} /> : <Button type="button" onClick={onConfirm}>{effectiveConfirmLabel}</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function FeeBreakdown({ fee, title, description, rows = [] }: { fee: number; title?: string; description: string; rows?: { label: string; value: string }[] }) {
  const { t } = useI18n();
  return <div className="rounded-2xl border bg-background/32 p-3.5"><div className="flex items-start gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Info className="size-4" /></span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><p className="text-sm font-bold">{title ?? t("payments.fee.title", "Комиссия")}</p><p className={cn("font-mono text-sm font-bold", fee === 0 ? "text-primary" : "text-foreground")}>{formatRubles(fee)}</p></div><p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p></div></div>{rows.length ? <div className="mt-3 divide-y border-t pt-1">{rows.map((row) => <div key={row.label} className="flex items-center justify-between gap-4 py-2 text-xs"><span className="text-muted-foreground">{row.label}</span><span className="font-semibold">{row.value}</span></div>)}</div> : null}</div>;
}

export function ResponsiveAmountInput({ id, value, onChange, currency = "₽", placeholder = "0" }: { id: string; value: string; onChange: (value: string) => void; currency?: string; placeholder?: string }) {
  const digits = value.replace(/\D/g, "").length;
  const sizeClass = digits > 11 ? "text-xl" : digits > 8 ? "text-2xl" : digits > 5 ? "text-3xl" : "text-4xl";
  return <div className="relative"><input id={id} name={id} inputMode="decimal" value={value} onChange={(event) => onChange(maskAmount(event.target.value))} placeholder={placeholder} className={cn("h-20 w-full rounded-2xl border bg-background/55 px-4 pr-16 font-bold tabular-nums outline-none transition-[font-size,border-color,box-shadow] placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring", sizeClass)} /><span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 font-mono text-base text-muted-foreground">{currency}</span></div>;
}

export function SlideToConfirm({ label, onConfirm }: { label: string; onConfirm: () => void }) {
  const [progress, setProgress] = React.useState(0);
  const progressRef = React.useRef(0);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const activeRef = React.useRef(false);
  const { t } = useI18n();

  const commitProgress = React.useCallback((next: number) => {
    progressRef.current = next;
    setProgress(next);
  }, []);

  const update = React.useCallback((clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    commitProgress(Math.max(0, Math.min(1, (clientX - rect.left - 28) / Math.max(1, rect.width - 56))));
  }, [commitProgress]);

  function finish() {
    activeRef.current = false;
    // Pointer move and pointer up may be batched in the same React frame, so
    // the ref is the authoritative drag position at release time.
    if (progressRef.current >= 0.88) {
      commitProgress(1);
      window.setTimeout(onConfirm, 120);
    } else commitProgress(0);
  }

  return <div ref={trackRef} role="slider" aria-label={t("slideConfirm.slide", "Проведите, чтобы {label}", { label: label.toLowerCase() })} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} tabIndex={0} onKeyDown={(event) => { if (event.key === "ArrowRight") commitProgress(Math.min(1, progressRef.current + 0.12)); if (event.key === "ArrowLeft") commitProgress(Math.max(0, progressRef.current - 0.12)); if ((event.key === "Enter" || event.key === " ") && progressRef.current >= 0.88) onConfirm(); }} onPointerDown={(event) => { activeRef.current = true; event.currentTarget.setPointerCapture(event.pointerId); update(event.clientX); }} onPointerMove={(event) => { if (activeRef.current) update(event.clientX); }} onPointerUp={finish} onPointerCancel={() => { activeRef.current = false; commitProgress(0); }} className="relative h-14 min-w-0 flex-1 touch-none select-none overflow-hidden rounded-2xl border border-primary/25 bg-secondary/72 outline-none focus-visible:ring-2 focus-visible:ring-ring">
    <span aria-hidden="true" className="absolute inset-y-0 left-0 bg-primary/24 transition-[width] duration-75" style={{ width: `${progress * 100}%` }} />
    <span className="pointer-events-none absolute inset-0 grid place-items-center px-14 text-center text-xs font-bold"><span className={cn("transition-opacity", progress > 0.58 && "opacity-40")}>{progress > 0.75 ? t("slideConfirm.release", "Отпустите, чтобы {label}", { label: label.toLowerCase() }) : t("slideConfirm.slide", "Проведите, чтобы {label}", { label: label.toLowerCase() })}</span></span>
    <span
      aria-hidden="true"
      className="absolute top-1 grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_22px_-8px_var(--glow-lime)]"
      style={{ left: `calc(0.25rem + ${progress * 100}% - ${progress * 3.25}rem)` }}
    >
      <ChevronRight className="size-5" />
    </span>
  </div>;
}

export function maskPhone(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  if (!digits.startsWith("7")) digits = `7${digits}`;
  digits = digits.slice(0, 11);
  const parts = [`+${digits.slice(0, 1)}`];
  if (digits.length > 1) parts.push(` ${digits.slice(1, 4)}`);
  if (digits.length > 4) parts.push(` ${digits.slice(4, 7)}`);
  if (digits.length > 7) parts.push(`-${digits.slice(7, 9)}`);
  if (digits.length > 9) parts.push(`-${digits.slice(9, 11)}`);
  return parts.join("");
}

export function maskCard(value: string) {
  return value.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim();
}

export function maskAccount(value: string) {
  return value.replace(/\D/g, "").slice(0, 20).replace(/(.{4})/g, "$1 ").trim();
}

export function maskAmount(value: string) {
  const normalized = value.replace(/[^\d.,]/g, "").replace(",", ".");
  const [whole = "", fraction] = normalized.split(".");
  const compact = whole.replace(/^0+(?=\d)/, "").slice(0, 12);
  const formatted = compact.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return fraction === undefined ? formatted : `${formatted}.${fraction.slice(0, 2)}`;
}

export function formatRubles(value: string | number) {
  const amount = typeof value === "number" ? value : Number(value.replace(/\s/g, ""));
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(Number.isFinite(amount) ? amount : 0);
}
