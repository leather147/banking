"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { Card } from "@/components/ui/card";
import { DEFAULT_SECONDARY_NAVIGATION_ORDER, normalizeOrder } from "@/lib/personalization";
import { SECONDARY_SERVICES } from "@/lib/secondary-services";
import { useI18n } from "@/components/providers/i18n-provider";

export function EverydayServices() {
  const { settings } = usePersonalization();
  const { t } = useI18n();
  const services = normalizeOrder(settings.secondaryNavigationOrder, DEFAULT_SECONDARY_NAVIGATION_ORDER).map((id) => SECONDARY_SERVICES[id]);

  return (
    <div>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">Каждый день</p><h2 className="mt-1 text-lg font-bold tracking-tight">{t("nav.section.extra", "Больше в {bank}", { bank: settings.brandName })}</h2></div>
        <span className="hidden text-xs text-muted-foreground sm:block">Отдельные пространства ваших финансов</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {services.map(({ href, label, description, metric, icon: Icon }) => (
          <Link key={href} href={href} className="group min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Card className="flex h-full min-h-36 flex-col p-4 transition-[border-color,background-color,box-shadow] hover:border-primary/25 hover:bg-secondary/42 hover:shadow-[0_0_28px_-22px_var(--glow-lime)]">
              <div className="flex items-start justify-between"><span className="grid size-10 place-items-center rounded-xl bg-primary/12 text-primary"><Icon className="size-4" /></span><ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-primary" /></div>
              <div className="mt-auto pt-4"><p className="font-bold">{label}</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{description}</p><p className="mt-2 font-mono text-[10px] text-primary">{metric}</p></div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
