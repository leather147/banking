"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  BadgePercent,
  BarChart3,
  Check,
  ChevronRight,
  Clock3,
  CreditCard,
  Grid2X2,
  Home,
  Languages,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  PiggyBank,
  Send,
  Settings,
  Sun,
} from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu } from "radix-ui";
import { useTheme } from "@/components/providers/theme-provider";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { useI18n } from "@/components/providers/i18n-provider";
import { MOTION_EASINGS } from "@/lib/motion";
import { createOperationPath } from "@/lib/operations";
import { DEFAULT_SECONDARY_NAVIGATION_ORDER, normalizeOrder, type NavigationItemId } from "@/lib/personalization";
import { SECONDARY_SERVICES } from "@/lib/secondary-services";
import { LOCALE_OPTIONS } from "@/i18n/config";
import { cn } from "@/lib/utils";

type NavItem = { label: string; href: Route; icon: typeof Home };

const navigation = {
  home: { label: "Главная", href: "/", icon: Home },
  payments: { label: "Платежи", href: "/payments", icon: Send },
  cards: { label: "Карты", href: "/cards", icon: CreditCard },
  history: { label: "История", href: "/history", icon: Clock3 },
  analytics: { label: "Аналитика", href: "/analytics", icon: BarChart3 },
  services: { label: "Все сервисы", href: "/services", icon: Grid2X2 },
} satisfies Record<NavigationItemId, NavItem>;

function NavLink({ item, motionSpeed, easing, collapsed = false, compact = false }: { item: NavItem; motionSpeed: number; easing: [number, number, number, number] | "linear"; collapsed?: boolean; compact?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const paymentPaths = ["/payments", "/transfers", "/top-up"];
  const active = item.href === "/" ? pathname === "/" : item.href === "/payments" ? paymentPaths.some((path) => pathname.startsWith(path)) : pathname.startsWith(item.href);
  const Icon = item.icon;
  const className = cn(
    "relative flex h-10 w-full items-center gap-3 overflow-hidden rounded-xl px-3 text-sm text-muted-foreground outline-none transition-[color,background-color,transform] hover:bg-secondary/65 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
    compact && "h-9 text-[13px]",
    collapsed && "justify-center px-0",
    active && "bg-primary/12 font-bold text-primary shadow-[0_0_30px_-20px_var(--glow-lime)]",
  );
  const content = <>
    {active ? <motion.span layoutId="sidebar-active" className="absolute inset-0 -z-10 rounded-xl bg-primary/10" transition={{ duration: 0.42 / motionSpeed, ease: easing }} /> : null}
    <Icon className={cn("size-4 shrink-0", active && "fill-current/20 stroke-[2.5]")} />
    {collapsed ? null : <span className="truncate">{item.label}</span>}
  </>;
  const control = item.href === "/payments"
    ? <button type="button" aria-label={item.label} className={className} onClick={() => router.push(createOperationPath("payment"))}>{content}</button>
    : <Link href={item.href} aria-label={item.label} className={className}>{content}</Link>;

  if (!collapsed) return control;
  return <Tooltip><TooltipTrigger asChild>{control}</TooltipTrigger><TooltipContent side="right" sideOffset={12}>{item.label}</TooltipContent></Tooltip>;
}

function SidebarPromo({ href, icon: Icon, eyebrow, title, detail }: { href: Route; icon: typeof PiggyBank; eyebrow: string; title: string; detail: string }) {
  return <Link href={href} className="glass-panel group/promo relative block overflow-hidden rounded-2xl border border-primary/12 bg-background/32 p-3 outline-none transition-[border-color,background-color,box-shadow] hover:border-primary/30 hover:bg-background/48 hover:shadow-[0_0_28px_-20px_var(--glow-lime)] focus-visible:ring-2 focus-visible:ring-ring">
    <span aria-hidden="true" className="absolute -right-5 -top-7 size-20 rounded-full bg-primary/12 blur-2xl" />
    <span className="relative flex items-start gap-2.5"><span className="grid size-8 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary"><Icon className="size-4" /></span><span className="min-w-0 flex-1"><span className="block text-[9px] font-bold uppercase tracking-[0.14em] text-primary">{eyebrow}</span><span className="mt-0.5 block text-xs font-bold">{title}</span><span className="mt-1 block text-[10px] leading-4 text-muted-foreground">{detail}</span></span><ChevronRight className="mt-1 size-3.5 text-muted-foreground transition-colors group-hover/promo:text-primary" /></span>
  </Link>;
}

export function AppSidebar() {
  const { theme, toggleTheme } = useTheme();
  const { settings, setSetting } = usePersonalization();
  const { locale, pending: localePending, setLocale, t } = useI18n();
  const collapsed = settings.sidebarCollapsed;
  const items = normalizeOrder(settings.navigationOrder, Object.keys(navigation) as NavigationItemId[]).map((id) => ({ ...navigation[id], label: t(`nav.${id}`, navigation[id].label) }));
  const extraItems = normalizeOrder(settings.secondaryNavigationOrder, DEFAULT_SECONDARY_NAVIGATION_ORDER).map((id) => ({ ...SECONDARY_SERVICES[id], label: t(`nav.${id}`, SECONDARY_SERVICES[id].label) }));
  const easing = MOTION_EASINGS[settings.easingMicro].value;
  const appearanceLabel = t("sidebar.appearance", "Оформление");
  const settingsLabel = t("nav.settings", "Настройки");
  const activeLocale = LOCALE_OPTIONS.find((option) => option.id === locale) ?? LOCALE_OPTIONS[0];

  return (
    <TooltipProvider delayDuration={1800} skipDelayDuration={300}>
      <aside className={cn("app-sidebar glass-panel shell-glow fixed inset-y-0 left-0 z-40 hidden border-r border-primary/10 py-4 transition-[width,padding] lg:flex lg:flex-col", collapsed ? "w-[84px] px-3" : "w-[248px] px-4")}>
        <div className="group/sidebar-brand relative shrink-0">
          <Brand compact={collapsed} className={cn("px-1 transition-opacity group-hover/sidebar-brand:opacity-0", !collapsed && "px-2")} />
          <button type="button" onClick={() => setSetting("sidebarCollapsed", !collapsed)} aria-label={collapsed ? t("sidebar.expand", "Развернуть боковое меню") : t("sidebar.collapse", "Свернуть боковое меню")} className={cn("absolute inset-0 flex items-center rounded-xl bg-secondary/72 px-3 opacity-0 outline-none backdrop-blur-xl transition-opacity group-hover/sidebar-brand:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring", collapsed ? "justify-center" : "gap-3")}>
            {collapsed ? <PanelLeftOpen className="size-4 text-primary" /> : <><PanelLeftClose className="size-4 text-primary" /><span className="text-sm font-semibold">{t("sidebar.collapseShort", "Свернуть меню")}</span></>}
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-0.5">
          {collapsed ? <div className="h-6" /> : <p className="mb-2 mt-6 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t("nav.section.main")}</p>}
          <nav aria-label={t("nav.section.main")} className="space-y-1">{items.map((item) => <NavLink key={item.href} item={item} motionSpeed={settings.motionSpeed} easing={easing} collapsed={collapsed} />)}</nav>
          <Separator className="my-4" />
          {collapsed ? null : <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t("nav.section.extra", "Больше сервисов", { bank: settings.brandName })}</p>}
          <nav aria-label={t("nav.section.extra", "Больше сервисов", { bank: settings.brandName })} className="space-y-0.5">{extraItems.map((item) => <NavLink key={item.href} item={item} motionSpeed={settings.motionSpeed} easing={easing} compact collapsed={collapsed} />)}</nav>

          {collapsed ? null : <div className="mt-5 space-y-2 pb-3">
            <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{t("sidebar.offers", "Предложения банка")}</p>
            <SidebarPromo href="/savings" icon={PiggyBank} eyebrow={t("sidebar.offer.rate", "Доход каждый день")} title={t("sidebar.offer.savings", "Накопительный счёт")} detail={t("sidebar.offer.savingsDetail", "До 12,8% годовых на ежедневный остаток")} />
            <SidebarPromo href="/bonuses" icon={BadgePercent} eyebrow={t("sidebar.offer.personal", "Для вас")} title={`${settings.brandName} Plus`} detail={t("sidebar.offer.plusDetail", "Больше бонусов и сервисов в одной подписке")} />
          </div>}
        </div>

        <div className="shrink-0 space-y-2 border-t border-border/65 pt-3">
          <NavLink item={{ label: settingsLabel, href: "/settings", icon: Settings }} motionSpeed={settings.motionSpeed} easing={easing} collapsed={collapsed} />
          <DropdownMenu.Root>
            {collapsed ? <Tooltip><TooltipTrigger asChild><DropdownMenu.Trigger asChild><Button variant="secondary" size="icon" className="mx-auto flex" aria-label={t("sidebar.language", "Сменить язык")} disabled={localePending}><Languages /></Button></DropdownMenu.Trigger></TooltipTrigger><TooltipContent side="right" sideOffset={12}>{t("sidebar.language", "Сменить язык")} · {activeLocale.label}</TooltipContent></Tooltip> : <DropdownMenu.Trigger asChild><Button variant="secondary" className="w-full justify-start" disabled={localePending}><Languages /><span className="min-w-0 flex-1 truncate text-left">{t("sidebar.language", "Язык")}</span><span className="font-mono text-[10px] text-muted-foreground">{activeLocale.region}</span></Button></DropdownMenu.Trigger>}
            <DropdownMenu.Portal><DropdownMenu.Content side="right" align="end" sideOffset={12} className="glass-panel z-[80] grid max-h-[min(70vh,480px)] w-64 gap-1 overflow-y-auto rounded-2xl border bg-popover/92 p-2 shadow-2xl backdrop-blur-2xl">{LOCALE_OPTIONS.map((option) => <DropdownMenu.Item key={option.id} onSelect={() => void setLocale(option.id)} className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm outline-none transition-colors hover:bg-secondary focus:bg-secondary"><span className="grid size-8 place-items-center rounded-xl bg-secondary font-mono text-[10px] text-primary">{option.region}</span><span className="min-w-0 flex-1 truncate font-semibold">{option.label}</span>{option.id === locale ? <Check className="size-4 text-primary" /> : null}</DropdownMenu.Item>)}</DropdownMenu.Content></DropdownMenu.Portal>
          </DropdownMenu.Root>
          {collapsed ? <Tooltip><TooltipTrigger asChild><Button variant="secondary" size="icon" className="mx-auto flex" onClick={(event) => toggleTheme({ x: event.clientX, y: event.clientY })} aria-label={theme === "dark" ? t("theme.light", "Светлая тема") : t("theme.dark", "Тёмная тема")}>{theme === "dark" ? <Sun /> : <Moon />}</Button></TooltipTrigger><TooltipContent side="right" sideOffset={12}>{theme === "dark" ? t("theme.light", "Светлая тема") : t("theme.dark", "Тёмная тема")}</TooltipContent></Tooltip> : <div className="glass-panel rounded-2xl border border-primary/10 bg-background/35 p-2.5"><div className="mb-2 flex items-center justify-between px-1 text-[10px] text-muted-foreground"><span>{appearanceLabel}</span><span>{theme === "dark" ? t("theme.darkShort", "Тёмная") : t("theme.lightShort", "Светлая")}</span></div><Button variant="secondary" className="w-full justify-start" onClick={(event) => toggleTheme({ x: event.clientX, y: event.clientY })}>{theme === "dark" ? <Sun /> : <Moon />}{theme === "dark" ? t("theme.light", "Светлая тема") : t("theme.dark", "Тёмная тема")}</Button></div>}
        </div>
      </aside>
    </TooltipProvider>
  );
}
