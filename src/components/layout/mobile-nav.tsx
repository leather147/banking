"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Clock3, CreditCard, Home, LayoutGrid, Send } from "lucide-react";
import { motion } from "motion/react";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { useI18n } from "@/components/providers/i18n-provider";
import { MOTION_EASINGS } from "@/lib/motion";
import { createOperationPath } from "@/lib/operations";
import { normalizeOrder, type NavigationItemId } from "@/lib/personalization";
import { cn } from "@/lib/utils";

const itemMap = {
  home: { label: "Главная", href: "/", icon: Home },
  payments: { label: "Платежи", href: "/payments", icon: Send },
  cards: { label: "Карты", href: "/cards", icon: CreditCard },
  history: { label: "История", href: "/history", icon: Clock3 },
  analytics: { label: "Аналитика", href: "/analytics", icon: BarChart3 },
  services: { label: "Ещё", href: "/services", icon: LayoutGrid },
} satisfies Record<NavigationItemId, { label: string; href: Route; icon: typeof Home }>;

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { settings } = usePersonalization();
  const { t } = useI18n();
  const itemIds = normalizeOrder(settings.navigationOrder, Object.keys(itemMap) as NavigationItemId[]).slice(0, 5);
  return (
    <nav aria-label="Мобильная навигация" className="glass-panel mobile-nav-shell shell-glow fixed bottom-3 left-1/2 z-40 flex w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 items-stretch gap-1 overflow-visible border border-primary/15 bg-card/72 p-1.5 shadow-2xl lg:hidden">
      {itemIds.map((itemId) => {
        const item = { ...itemMap[itemId], label: t(`nav.${itemId}`, itemMap[itemId].label) };
        const paymentPaths = ["/payments", "/transfers", "/top-up"];
        const active = item.href === "/" ? pathname === "/" : item.href === "/payments" ? paymentPaths.some((path) => pathname.startsWith(path)) : pathname.startsWith(item.href);
        const Icon = item.icon;
        const className = cn("mobile-nav-item relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] text-muted-foreground outline-none transition-[color,transform] focus-visible:ring-2 focus-visible:ring-ring", active && "text-primary-foreground");
        const transition = { duration: 0.38 / settings.motionSpeed, ease: MOTION_EASINGS[settings.easingMicro].value };
        const content = <>{active ? <motion.span layoutId="mobile-nav-active" className="absolute inset-0 z-0 rounded-[inherit] bg-primary shadow-[0_0_26px_-8px_var(--glow-lime)]" transition={transition} /> : null}<motion.span className="relative z-10" animate={{ y: active ? -1 : 0 }} transition={transition}><Icon className="size-4" /></motion.span><span className="relative z-10 max-w-full truncate">{item.label}</span></>;
        return item.href === "/payments" ? <button type="button" key={item.href} className={className} onClick={() => router.push(createOperationPath("payment"))}>{content}</button> : <Link key={item.href} href={item.href} className={className}>{content}</Link>;
      })}
    </nav>
  );
}
