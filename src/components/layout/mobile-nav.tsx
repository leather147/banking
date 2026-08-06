"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { useI18n } from "@/components/providers/i18n-provider";
import { MOTION_EASINGS } from "@/lib/motion";
import { normalizeOrder, type NavigationItemId } from "@/lib/personalization";
import { cn } from "@/lib/utils";
import { AppIcon, type AppIconName } from "@/components/ui/app-icon";

const itemMap = {
  home: { label: "Главная", href: "/", icon: "home" },
  payments: { label: "Платежи", href: "/payments", icon: "payments" },
  cards: { label: "Карты", href: "/cards", icon: "cards" },
  history: { label: "Операции", href: "/history", icon: "operations" },
  analytics: { label: "Аналитика", href: "/analytics", icon: "analytics" },
  services: { label: "Ещё", href: "/services", icon: "services" },
} satisfies Record<NavigationItemId, { label: string; href: Route; icon: AppIconName }>;

export function MobileNav() {
  const pathname = usePathname();
  const { settings } = usePersonalization();
  const { t } = useI18n();
  const itemIds = normalizeOrder(settings.navigationOrder, Object.keys(itemMap) as NavigationItemId[]).slice(0, 5);
  return (
    <nav aria-label={t("nav.mobile.aria", "Мобильная навигация")} className="glass-panel mobile-nav-shell shell-glow fixed left-1/2 z-40 flex w-[calc(100%-1.25rem)] max-w-md -translate-x-1/2 items-stretch gap-1 overflow-visible border border-primary/15 bg-card/72 p-1.5 shadow-2xl lg:hidden">
      {itemIds.map((itemId) => {
        const item = { ...itemMap[itemId], label: t(`nav.${itemId}`, itemMap[itemId].label) };
        const paymentPaths = ["/payments", "/transfers", "/top-up"];
        const active = item.href === "/" ? pathname === "/" : item.href === "/payments" ? paymentPaths.some((path) => pathname.startsWith(path)) : pathname.startsWith(item.href);
        const className = cn("mobile-nav-item relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-0.5 py-2 text-[clamp(0.55rem,2.55vw,0.67rem)] text-muted-foreground outline-none transition-[color,border-color,background-color] focus-visible:ring-2 focus-visible:ring-ring", active && "font-bold text-primary");
        const transition = { duration: 0.38 / settings.motionSpeed, ease: MOTION_EASINGS[settings.easingMicro].value };
        const content = <>{active ? <motion.span layoutId="mobile-nav-active" className="absolute inset-0 z-0 rounded-[inherit] border border-primary/55 bg-primary/[0.045] shadow-[inset_0_0_18px_-12px_var(--glow-lime),0_0_24px_-18px_var(--glow-lime)]" transition={transition} /> : null}<span className="relative z-10"><AppIcon name={item.icon} active={active} className="size-4" /></span><span className="relative z-10 max-w-full truncate">{item.label}</span></>;
        return <Link key={item.href} href={item.href} className={className}>{content}</Link>;
      })}
    </nav>
  );
}
