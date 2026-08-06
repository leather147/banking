"use client";

import * as React from "react";
import { Delete } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "delete"] as const;

export function PinPad({ value, onChange, onComplete, disabled = false, error }: { value: string; onChange: (value: string) => void; onComplete: (value: string) => void; disabled?: boolean; error?: string }) {
  const enter = React.useCallback((key: string) => {
    if (disabled) return;
    if (key === "delete") {
      onChange(value.slice(0, -1));
      return;
    }
    if (!/^\d$/.test(key) || value.length >= 4) return;
    const next = `${value}${key}`;
    onChange(next);
    if (next.length === 4) window.setTimeout(() => onComplete(next), 180);
  }, [disabled, onChange, onComplete, value]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (/^\d$/.test(event.key)) {
        event.preventDefault();
        enter(event.key);
      } else if (event.key === "Backspace" || event.key === "Delete") {
        event.preventDefault();
        enter("delete");
      }
    };
    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", onKeyDown, { capture: true });
  }, [enter]);

  return <div className="mx-auto w-full max-w-[330px]" role="group" aria-label="Клавиатура код-пароля">
    <div className={cn("mb-5 flex min-h-14 items-center justify-center gap-3 rounded-2xl border bg-background/48", error && "border-destructive/45 animate-shake")} aria-live="polite">
      {[0, 1, 2, 3].map((index) => <span key={index} className="relative grid size-4 place-items-center"><span className="absolute size-3 rounded-full border border-primary/40" /><AnimatePresence>{value.length > index ? <motion.span initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }} className="absolute size-3 rounded-full bg-primary shadow-[0_0_14px_var(--glow-lime)]" /> : null}</AnimatePresence></span>)}
    </div>
    {error ? <p className="-mt-2 mb-4 text-center text-xs font-medium text-destructive">{error}</p> : null}
    <div className="grid grid-cols-3 gap-2.5">{KEYS.map((key, index) => key === "" ? <span key={`empty-${index}`} /> : <Button key={key} type="button" variant="outline" disabled={disabled} onClick={() => enter(key)} className="h-16 rounded-2xl text-xl font-bold tabular-nums active:bg-primary/14">{key === "delete" ? <Delete className="size-5" /> : key}</Button>)}</div>
    <p className="mt-4 text-center text-[10px] leading-4 text-muted-foreground">На компьютере можно использовать цифровой ряд и Backspace. Экранная клавиатура устройства не открывается.</p>
  </div>;
}
