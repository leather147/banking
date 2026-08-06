"use client";

import { Clock3, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type SmartSuggestion = {
  label: string;
  value: string;
  meta: string;
  kind: "frequent" | "recent";
};

export function SmartSuggestions({ suggestions, value, onSelect, title = "Умные подсказки" }: { suggestions: SmartSuggestion[]; value?: string; onSelect: (value: string) => void; title?: string }) {
  return (
    <div className="rounded-2xl border border-primary/12 bg-primary/[0.035] p-3">
      <div className="mb-2 flex items-center justify-between gap-3"><p className="flex items-center gap-2 text-[11px] font-semibold"><Sparkles className="size-3.5 text-primary" />{title}</p><span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">частые · последние</span></div>
      <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
        {suggestions.map((item) => (
          <button key={`${item.kind}-${item.value}`} type="button" onClick={() => onSelect(item.value)} className={cn("glass-panel min-w-[148px] rounded-xl border bg-background/40 p-2.5 text-left outline-none transition-[border-color,background-color,box-shadow] hover:border-primary/30 hover:bg-secondary/55 hover:shadow-[0_0_22px_-18px_var(--glow-lime)] focus-visible:ring-2 focus-visible:ring-ring", value === item.value && "border-primary/45 bg-primary/10")}>
            <span className="flex items-center justify-between gap-2"><span className="truncate text-xs font-bold">{item.label}</span><Badge variant={item.kind === "frequent" ? "success" : "secondary"} className="px-1.5 py-0 text-[8px]">{item.kind === "frequent" ? "часто" : <Clock3 className="size-2.5" />}</Badge></span>
            <span className="mt-1 block truncate font-mono text-[9px] text-muted-foreground">{item.meta}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
