"use client";

import type { Route } from "next";
import Link from "next/link";
import {
  Activity,
  BadgePercent,
  ChevronDown,
  CircleHelp,
  CloudSun,
  FileText,
  Fingerprint,
  Landmark,
  MapPin,
  PiggyBank,
  QrCode,
  Send,
  Settings,
  ShieldCheck,
  TrendingUp,
  UserRound,
  WalletCards,
} from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { Brand } from "@/components/layout/brand";
import { MobileNotificationButton, NotificationMenu } from "@/components/layout/notification-menu";
import { SearchCommand } from "@/components/layout/search-command";
import { OperationStartButton } from "@/components/operations/operation-start-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { useI18n } from "@/components/providers/i18n-provider";
import { DEFAULT_TOPBAR_ORDER, normalizeOrder, type TopbarItemId } from "@/lib/personalization";
import { cn } from "@/lib/utils";

const profileLinks = [
  { href: "/profile", key: "profile.menu.overview", fallback: "Профиль и {bank} ID", icon: UserRound },
  { href: "/profile/personal", key: "profile.menu.personal", fallback: "Личные данные", icon: Fingerprint },
  { href: "/profile/contacts", key: "profile.menu.contacts", fallback: "Контакты и адреса", icon: MapPin },
  { href: "/profile/documents", key: "profile.menu.documents", fallback: "Документы и справки", icon: FileText },
  { href: "/settings/security", key: "profile.menu.security", fallback: "Безопасность", icon: ShieldCheck },
  { href: "/settings/devices", key: "profile.menu.devices", fallback: "Устройства", icon: WalletCards },
] as const;

function ContextChip({ href, icon: Icon, children, className }: { href: Route; icon: typeof Activity; children: React.ReactNode; className?: string }) {
  return <Link href={href} className={cn("glass-panel flex h-9 shrink-0 items-center gap-2 rounded-xl border border-transparent bg-background/30 px-2.5 text-[11px] font-medium text-muted-foreground outline-none transition-[background-color,color,border-color] hover:border-primary/15 hover:bg-secondary/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring", className)}><Icon className="size-3.5 text-primary" />{children}</Link>;
}

export function TopBar() {
  const { settings } = usePersonalization();
  const { t } = useI18n();
  const order = normalizeOrder(settings.topbarOrder, DEFAULT_TOPBAR_ORDER);
  const itemOrder = (id: TopbarItemId) => ({ order: order.indexOf(id) + 1 });
  const temperature = settings.measurementSystem === "metric" ? "18°C" : "64°F";
  return (
    <header className="glass-panel shell-glow relative z-30 flex h-[68px] min-w-0 shrink-0 items-center gap-2 overflow-hidden border-b bg-background/68 px-3 sm:gap-3 sm:px-5 lg:px-6 2xl:px-8">
      <Brand compact className="hidden shrink-0 md:flex lg:hidden" />
      <div className="min-w-[7rem] flex-1 sm:max-w-md xl:max-w-lg 2xl:max-w-xl" style={itemOrder("search")}><SearchCommand /></div>

      <div className="hidden min-w-0 flex-1 items-center justify-end gap-1.5 overflow-hidden min-[1450px]:flex" style={itemOrder("shortcuts")}>
        <ContextChip href="/analytics" icon={TrendingUp}><span className="font-mono">USD 91,42</span></ContextChip>
        <ContextChip href="/support" icon={CloudSun} className="hidden 2xl:flex"><span>{t("top.city", "Москва")} · <span className="font-mono">{temperature}</span></span></ContextChip>
        <ContextChip href="/savings" icon={PiggyBank} className="hidden min-[1500px]:flex"><span className="font-mono">12,8%</span><span>{t("top.balanceRate", "на остаток")}</span></ContextChip>
        <ContextChip href="/bonuses" icon={BadgePercent} className="hidden min-[1700px]:flex"><span className="font-mono">4 280</span><span>{t("top.bonuses", "бонусов")}</span></ContextChip>
        <ContextChip href="/bank" icon={Landmark} className="hidden min-[1380px]:flex">{t("top.aboutBank", "О банке")}</ContextChip>
        <ContextChip href="/services" icon={Activity} className="hidden min-[1580px]:flex">{t("top.servicesOk")}</ContextChip>
      </div>

      <div className="hidden shrink-0 min-[1200px]:block" style={itemOrder("transfer")}><OperationStartButton kind="transfer" title={t("top.newTransfer", "Начать новый перевод")} className={buttonVariants()}><Send />{t("top.transfer")}</OperationStartButton></div>
      <Button asChild variant="ghost" size="icon" className="shrink-0 sm:hidden" aria-label="Оплатить по QR-коду"><Link href="/payments"><QrCode /></Link></Button>
      <div className="shrink-0" style={itemOrder("notifications")}><MobileNotificationButton /><NotificationMenu /></div>
      <div className="topbar-profile shrink-0" style={{ "--topbar-order": itemOrder("profile").order } as React.CSSProperties}>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button variant="ghost" className="relative h-11 shrink-0 gap-2 px-0.5 sm:px-1.5 md:px-2" aria-label={t("profile.menu.open", "Открыть меню учётной записи")}>
              <Avatar className="bg-gradient-to-br from-primary/30 to-primary/5"><AvatarFallback><span className="hidden md:inline">АЛ</span><UserRound className="size-4 md:hidden" /></AvatarFallback></Avatar>
              <span className="hidden text-left md:block"><span className="block text-sm font-bold">{t("profile.name", "Алексей Лебедев")}</span><span className="block text-[10px] text-muted-foreground">{settings.brandName} Plus</span></span>
              <ChevronDown className="hidden size-3 md:block" />
              <span className="absolute -bottom-0.5 right-0 grid size-[18px] place-items-center rounded-full border bg-background text-foreground shadow-sm md:hidden"><ChevronDown className="size-2.5" /></span>
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content align="end" sideOffset={10} className="glass-panel z-50 w-[min(320px,calc(100vw-1rem))] rounded-2xl border border-primary/12 bg-popover/88 p-2 text-sm shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out">
              <div className="mb-2 rounded-xl bg-secondary/45 p-3"><p className="font-bold">{t("profile.name", "Алексей Лебедев")}</p><p className="mt-0.5 text-xs text-muted-foreground">alexey.lebedev@example.com</p><div className="mt-2 flex items-center gap-2"><span className="rounded-full bg-primary/12 px-2 py-1 text-[10px] font-bold text-primary">{settings.brandName} Plus</span><span className="font-mono text-[10px] text-muted-foreground">ID · 4A82</span></div></div>
              <div className="grid gap-1 sm:grid-cols-2">{profileLinks.map(({ href, key, fallback, icon: Icon }) => <DropdownMenu.Item key={href} asChild><Link href={href} className="flex min-h-10 cursor-pointer items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium outline-none hover:bg-secondary focus:bg-secondary"><Icon className="size-3.5 text-primary" />{t(key, fallback, { bank: settings.brandName })}</Link></DropdownMenu.Item>)}</div>
              <DropdownMenu.Separator className="my-2 h-px bg-border" />
              <DropdownMenu.Item asChild><Link href="/settings" className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 font-semibold outline-none hover:bg-secondary focus:bg-secondary"><Settings className="size-4 text-primary" />{t("nav.settings", "Настройки")}</Link></DropdownMenu.Item>
              <DropdownMenu.Item asChild><Link href="/settings/legal" className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 font-semibold outline-none hover:bg-secondary focus:bg-secondary"><CircleHelp className="size-4 text-primary" />{t("profile.menu.helpLegal", "Помощь и документы")}</Link></DropdownMenu.Item>
              <DropdownMenu.Separator className="my-2 h-px bg-border" />
              <DropdownMenu.Item className="cursor-pointer rounded-xl px-3 py-2.5 text-destructive outline-none hover:bg-secondary focus:bg-secondary">{t("profile.menu.logout", "Выйти из демо")}</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
