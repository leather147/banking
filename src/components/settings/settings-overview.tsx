"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { PageHeading } from "@/components/shared/page-heading";
import { Card } from "@/components/ui/card";
import { SETTINGS_ITEMS } from "@/lib/settings-navigation";
import { usePersonalization } from "@/components/providers/personalization-provider";

export function SettingsOverview() {
  const { t } = useI18n();
  const { settings } = usePersonalization();
  const tileBackgrounds = [
    "from-fuchsia-500/13 via-transparent to-primary/8",
    "from-lime-400/14 via-transparent to-emerald-400/8",
    "from-sky-400/14 via-transparent to-blue-500/8",
    "from-rose-400/14 via-transparent to-orange-400/8",
    "from-violet-400/14 via-transparent to-cyan-400/8",
    "from-emerald-400/14 via-transparent to-primary/8",
    "from-amber-400/14 via-transparent to-orange-500/8",
    "from-indigo-400/14 via-transparent to-sky-400/8",
    "from-primary/16 via-transparent to-fuchsia-400/8",
    "from-cyan-400/14 via-transparent to-blue-500/8",
    "from-slate-400/14 via-transparent to-primary/8",
  ];
  const publicItems = SETTINGS_ITEMS.filter((item) => item.href !== "/settings/developer");
  const developerItem = SETTINGS_ITEMS.find((item) => item.href === "/settings/developer");

  const tile = ({ href, label, translationKey, description, descriptionKey, icon: Icon }: (typeof SETTINGS_ITEMS)[number], index: number) => <Link key={href} href={href} className="aspect-square min-w-0 rounded-[calc(var(--radius)*1.15)] outline-none focus-visible:ring-2 focus-visible:ring-ring"><Card className={`group relative flex size-full min-h-0 flex-col items-start justify-between overflow-hidden bg-gradient-to-br ${tileBackgrounds[index % tileBackgrounds.length]} p-3 transition-[background-color,border-color,box-shadow] hover:border-primary/28 hover:bg-secondary/45 hover:shadow-[0_0_34px_-24px_var(--glow-lime)] sm:p-5`}><span aria-hidden="true" className="absolute -right-7 -top-7 size-24 rounded-full bg-current/5 blur-2xl" /><span className="relative grid size-10 shrink-0 place-items-center rounded-2xl border border-white/8 bg-background/55 shadow-sm backdrop-blur-xl sm:size-12"><Icon className="size-4 text-primary sm:size-5" /></span><span className="relative min-w-0 max-w-full"><span className="relative block min-w-0 pr-5 text-[clamp(.7rem,3.4vw,.95rem)] font-bold leading-[1.18] [overflow-wrap:anywhere] sm:text-base"><span>{translationKey ? t(translationKey, label) : label}</span><ChevronRight className="absolute right-0 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-primary sm:size-4" /></span><span className="mt-1 line-clamp-3 block text-[clamp(.59rem,2.65vw,.75rem)] leading-4 text-muted-foreground sm:text-sm sm:leading-5">{descriptionKey ? t(descriptionKey, description) : description}</span></span></Card></Link>;

  return <><PageHeading eyebrow={t("settings.identity", "{bank} ID", { bank: settings.brandName })} title={t("settings.title", "Настройки")} description={t("settings.description", "Каждый раздел открывается на отдельном маршруте и сохраняет изменения в cookie.")} /><div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">{publicItems.map(tile)}</div>{settings.developerMode && developerItem ? <section className="mt-6 border-t border-dashed border-primary/20 pt-5"><p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-primary">{t("settings.developer.unlocked", "Режим разработчика")}</p><div className="grid grid-cols-2 gap-2.5 sm:max-w-md sm:gap-3">{tile(developerItem, publicItems.length)}</div></section> : null}</>;
}
