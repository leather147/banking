"use client";

import * as React from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Popover } from "radix-ui";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";

const MIN_YEAR = 1893;
const MAX_YEAR = 2108;
const YEARS = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, index) => MAX_YEAR - index);

function toIsoDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function fromIsoDate(value?: string) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

function sameDay(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate();
}

export function DateRangeCalendar({ from, to, onChange }: { from: string; to: string; onChange: (range: { from: string; to: string }) => void }) {
  const { locale, t } = useI18n();
  const initial = fromIsoDate(from) ?? fromIsoDate(to) ?? new Date(2026, 7, 1);
  const [open, setOpen] = React.useState(false);
  const [viewDate, setViewDate] = React.useState(() => new Date(initial.getFullYear(), initial.getMonth(), 1));
  const start = fromIsoDate(from);
  const end = fromIsoDate(to);
  const weekdays = React.useMemo(() => {
    const base = new Date(2026, 7, 3);
    return Array.from({ length: 7 }, (_, index) => new Intl.DateTimeFormat(locale, { weekday: "short" }).format(new Date(base.getFullYear(), base.getMonth(), base.getDate() + index)));
  }, [locale]);
  const monthLabel = new Intl.DateTimeFormat(locale, { month: "long" }).format(viewDate);
  const first = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const leading = (first.getDay() + 6) % 7;
  const gridStart = new Date(first.getFullYear(), first.getMonth(), 1 - leading);
  const days = Array.from({ length: 42 }, (_, index) => new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index));

  function selectDay(day: Date) {
    const iso = toIsoDate(day);
    if (!start || (start && end)) {
      onChange({ from: iso, to: "" });
      return;
    }
    if (sameDay(start, day)) {
      onChange({ from: iso, to: iso });
      setOpen(false);
      return;
    }
    const ordered = start.getTime() < day.getTime() ? { from: toIsoDate(start), to: iso } : { from: iso, to: toIsoDate(start) };
    onChange(ordered);
    setOpen(false);
  }

  const label = start
    ? end
      ? sameDay(start, end)
        ? new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(start)
        : `${new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }).format(start)} — ${new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(end)}`
      : `${new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(start)} — …`
    : t("operations.calendar.all", "Любая дата");

  return <Popover.Root open={open} onOpenChange={setOpen}>
    <Popover.Trigger asChild><Button variant="outline" className="min-w-0 justify-start"><CalendarDays className="size-4 shrink-0" /><span className="truncate">{label}</span></Button></Popover.Trigger>
    <Popover.Portal><Popover.Content align="end" sideOffset={8} collisionPadding={10} className="glass-panel z-[70] w-[min(22rem,calc(100vw-1rem))] rounded-2xl border border-primary/15 bg-popover/92 p-3 shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out">
      <div className="flex items-center gap-2"><Button type="button" size="icon" variant="ghost" onClick={() => setViewDate((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1))} aria-label={t("operations.calendar.previous", "Предыдущий месяц")}><ChevronLeft /></Button><div className="min-w-0 flex-1 text-center"><p className="truncate text-sm font-bold capitalize">{monthLabel}</p></div><Select value={String(viewDate.getFullYear())} onValueChange={(value) => setViewDate((date) => new Date(Number(value), date.getMonth(), 1))}><SelectTrigger className="h-9 w-[5.4rem]" aria-label={t("operations.calendar.year", "Год")}><SelectValue /></SelectTrigger><SelectContent className="max-h-72">{YEARS.map((year) => <SelectItem key={year} value={String(year)}>{year}</SelectItem>)}</SelectContent></Select><Button type="button" size="icon" variant="ghost" onClick={() => setViewDate((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1))} aria-label={t("operations.calendar.next", "Следующий месяц")}><ChevronRight /></Button></div>
      <div className="mt-3 grid grid-cols-7 gap-1">{weekdays.map((weekday, index) => <span key={`${weekday}-${index}`} className="py-1 text-center text-[9px] font-bold uppercase text-muted-foreground">{weekday}</span>)}{days.map((day) => {
        const iso = toIsoDate(day);
        const outside = day.getMonth() !== viewDate.getMonth();
        const selectedStart = start ? sameDay(start, day) : false;
        const selectedEnd = end ? sameDay(end, day) : false;
        const within = start && end ? day.getTime() > start.getTime() && day.getTime() < end.getTime() : false;
        const disabled = day.getFullYear() < MIN_YEAR || day.getFullYear() > MAX_YEAR;
        return <button key={iso} type="button" disabled={disabled} aria-pressed={selectedStart || selectedEnd} onClick={() => selectDay(day)} className={cn("relative grid aspect-square min-w-0 place-items-center rounded-xl text-xs outline-none transition-[color,background-color,border-color] hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring", outside && "text-muted-foreground/40", within && "bg-primary/8 text-primary", (selectedStart || selectedEnd) && "border border-primary/60 bg-primary/12 font-bold text-primary")}>{day.getDate()}</button>;
      })}</div>
      <div className="mt-3 flex items-center justify-between gap-2 border-t pt-3"><p className="text-[10px] text-muted-foreground">{t("operations.calendar.hint", "Повторный выбор даты создаёт период в один день")}</p><Button type="button" size="sm" variant="ghost" onClick={() => { onChange({ from: "", to: "" }); setOpen(false); }}>{t("action.reset", "Сбросить")}</Button></div>
    </Popover.Content></Popover.Portal>
  </Popover.Root>;
}
