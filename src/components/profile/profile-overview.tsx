"use client";

import type { Route } from "next";
import Link from "next/link";
import { Bell, ChevronRight, Contact, FileBadge2, Globe2, KeyRound, Laptop2, Landmark, ShieldCheck, Sparkles, UserRound, UsersRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeading } from "@/components/shared/page-heading";
import { BankOfferGrid } from "@/components/shared/bank-offer-grid";
import { useI18n } from "@/components/providers/i18n-provider";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { ProfileQuickActions } from "@/components/profile/profile-quick-actions";

const menuItems: { id: string; href: Route; icon: typeof UserRound }[] = [
  { id: "personal", href: "/profile/personal", icon: UserRound },
  { id: "contacts", href: "/profile/contacts", icon: Contact },
  { id: "documents", href: "/profile/documents", icon: FileBadge2 },
  { id: "security", href: "/settings/security", icon: KeyRound },
  { id: "devices", href: "/settings/devices", icon: Laptop2 },
  { id: "notifications", href: "/settings/notifications", icon: Bell },
  { id: "language", href: "/settings/language", icon: Globe2 },
  { id: "family", href: "/family", icon: UsersRound },
  { id: "legal", href: "/settings/legal", icon: Landmark },
];

export function ProfileOverview() {
  const { t } = useI18n();
  const { settings } = usePersonalization();
  return <div className="space-y-5"><PageHeading eyebrow={t("profile.eyebrow", "Учётная запись")} title={t("profile.title", "Профиль")} description={t("profile.description", "Контактные данные, документы и параметры вашей демонстрационной учётной записи.")} />
    <Card className="metric-glow p-5 sm:p-6"><div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center"><div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center"><Avatar className="size-20 shrink-0 border-primary/30"><AvatarFallback className="bg-primary/15 text-xl text-primary">АЛ</AvatarFallback></Avatar><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="truncate text-xl font-semibold">{t("profile.name", "Алексей Лебедев")}</h2><Badge variant="success"><ShieldCheck className="mr-1 size-3" />{t("profile.verified", "Проверен")}</Badge></div><p className="mt-1 text-sm text-muted-foreground">{t("profile.memberSince", "Клиент с августа 2022 · {bank} Plus", { bank: settings.brandName })}</p><p className="mt-3 inline-flex items-center gap-2 text-xs text-primary"><Sparkles className="size-3" />{t("profile.completion", "Профиль заполнен на 92%")}</p></div></div><div className="grid grid-cols-3 gap-2 xl:w-[360px]">{[{ value: "4", key: "products" }, { value: "2", key: "devices" }, { value: "7", key: "years" }].map((item) => <div key={item.key} className="rounded-2xl bg-secondary/45 p-3 text-center"><p className="number-display text-xl font-bold">{item.value}</p><p className="mt-1 text-[10px] leading-4 text-muted-foreground">{t(`profile.stat.${item.key}`)}</p></div>)}</div></div></Card>

    <ProfileQuickActions />

    <section aria-labelledby="profile-management"><div className="mb-4"><p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-primary">{t("profile.management.eyebrow", "Управление")}</p><h2 id="profile-management" className="mt-1 text-xl font-bold">{t("profile.management.title", "Данные и доступ")}</h2><p className="mt-1 text-xs text-muted-foreground">{t("profile.management.description", "Основные параметры учётной записи, безопасности и семейного доступа.")}</p></div><div className="grid auto-rows-fr gap-3 sm:grid-cols-2 xl:grid-cols-3">{menuItems.map(({ id, href, icon: Icon }) => <Link key={id} href={href} className="group flex min-w-0 items-start gap-3 rounded-2xl border bg-card p-4 outline-none transition-[border-color,background-color,box-shadow] hover:border-primary/25 hover:bg-secondary/35 focus-visible:ring-2 focus-visible:ring-ring"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary"><Icon className="size-5" /></span><span className="min-w-0 flex-1"><span className="block truncate font-medium">{t(`profile.menu.${id}.title`)}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{t(`profile.menu.${id}.description`)}</span></span><ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" /></Link>)}</div></section>

    <div className="grid gap-4 xl:grid-cols-2"><Card className="p-5"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><ShieldCheck className="size-4" /></span><div><h2 className="font-bold">{t("profile.security.title", "Состояние безопасности")}</h2><p className="text-xs text-muted-foreground">{t("profile.security.description", "Все основные меры защиты включены")}</p></div></div><div className="mt-5 divide-y">{["login", "device", "recovery"].map((key) => <div key={key} className="flex items-center justify-between gap-4 py-3 text-sm"><span className="text-muted-foreground">{t(`profile.security.${key}`)}</span><Badge variant="success">{t(`profile.security.${key}.status`)}</Badge></div>)}</div></Card><Card className="p-5"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><FileBadge2 className="size-4" /></span><div><h2 className="font-bold">{t("profile.identity.title", "{bank} ID", { bank: settings.brandName })}</h2><p className="text-xs text-muted-foreground">{t("profile.identity.description", "Единый профиль для продуктов и документов")}</p></div></div><div className="mt-5 grid grid-cols-2 gap-3">{["verification", "consents", "statements", "support"].map((key) => <div key={key} className="rounded-xl bg-secondary/38 p-3"><p className="text-xs font-bold">{t(`profile.identity.${key}.title`)}</p><p className="mt-1 text-[10px] leading-4 text-muted-foreground">{t(`profile.identity.${key}.description`)}</p></div>)}</div></Card></div>
    <BankOfferGrid context="profile" />
  </div>;
}
