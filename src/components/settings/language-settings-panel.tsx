"use client";

import { Check, Languages, LoaderCircle, Ruler } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/components/providers/i18n-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LOCALE_OPTIONS } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { usePersonalization } from "@/components/providers/personalization-provider";

export function LanguageSettingsPanel() {
  const { locale, pending, setLocale, t } = useI18n();
  const { settings, setSetting } = usePersonalization();
  return <div className="space-y-4">
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Languages className="size-5 text-primary" />{t("settings.language.title", "Язык приложения")}</CardTitle><p className="text-sm text-muted-foreground">{t("settings.language.description", "Словари загружаются отдельными чанками и легко расширяются через pull request.")}</p></CardHeader><CardContent><div className="grid auto-rows-fr gap-2 sm:grid-cols-2 xl:grid-cols-3">{LOCALE_OPTIONS.map((option) => <button key={option.id} type="button" disabled={pending} onClick={async () => { await setLocale(option.id); toast.success(option.label, { description: "✓" }); }} className={cn("glass-panel flex h-full min-h-16 items-center gap-3 rounded-2xl border bg-background/35 p-3 text-left outline-none transition-[border-color,background-color,box-shadow] hover:border-primary/30 hover:bg-secondary/35 hover:shadow-[0_0_22px_-18px_var(--glow-lime)] focus-visible:ring-2 focus-visible:ring-ring", locale === option.id && "border-primary/45 bg-primary/10")}><span className="grid size-9 place-items-center rounded-xl bg-secondary font-mono text-[10px] font-bold text-primary">{option.region}</span><span className="font-semibold">{option.label}</span>{pending ? <LoaderCircle className="ml-auto size-4 animate-spin" /> : locale === option.id ? <Check className="ml-auto size-4 text-primary" /> : null}</button>)}</div></CardContent></Card>
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Ruler className="size-5 text-primary" />{t("settings.units.title", "Система единиц")}</CardTitle><p className="text-sm text-muted-foreground">{t("settings.units.description", "Используется для температуры, расстояний и адресных подсказок.")}</p></CardHeader><CardContent className="grid grid-cols-2 gap-3">{([{ id: "metric", labelKey: "settings.units.metric", fallback: "Метрическая", example: "18°C · 1,2 км" }, { id: "imperial", labelKey: "settings.units.imperial", fallback: "Имперская", example: "64°F · 0.7 mi" }] as const).map((item) => <button key={item.id} type="button" onClick={() => { setSetting("measurementSystem", item.id); toast.success(t("settings.units.saved", "Система единиц обновлена")); }} className={cn("glass-panel relative min-h-24 rounded-2xl border bg-background/35 p-4 text-left outline-none transition-[border-color,background-color,box-shadow] hover:border-primary/30 hover:bg-secondary/35 hover:shadow-[0_0_22px_-18px_var(--glow-lime)] focus-visible:ring-2 focus-visible:ring-ring", settings.measurementSystem === item.id && "border-primary/45 bg-primary/10")}><span className="block font-bold">{t(item.labelKey, item.fallback)}</span><span className="mt-2 block font-mono text-xs text-muted-foreground">{item.example}</span>{settings.measurementSystem === item.id ? <Check className="absolute right-3 top-3 size-4 text-primary" /> : null}</button>)}</CardContent></Card>
  </div>;
}
