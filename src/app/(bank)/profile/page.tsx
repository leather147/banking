import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Contact, FileBadge2, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeading } from "@/components/shared/page-heading";
import { PersonalizedBankText } from "@/components/shared/personalized-bank-text";

const profileItems = [
  { label: "Личные данные", description: "Имя, дата рождения и город", href: "/profile/personal" as const, icon: UserRound },
  { label: "Контакты", description: "Телефон, email и Telegram", href: "/profile/contacts" as const, icon: Contact },
  { label: "Документы", description: "Паспортные данные", href: "/profile/documents" as const, icon: FileBadge2 },
];

export const metadata: Metadata = { title: "Профиль" };

export default function ProfilePage() {
  return <><PageHeading eyebrow="Учётная запись" title="Профиль" description="Контактные данные, документы и параметры вашей демонстрационной учётной записи." /><Card className="metric-glow mb-4 p-5 sm:p-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><Avatar className="size-20 border-primary/30"><AvatarFallback className="bg-primary/15 text-xl text-primary">АЛ</AvatarFallback></Avatar><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-semibold">Алексей Лебедев</h2><Badge variant="success"><ShieldCheck className="mr-1 size-3" />Проверен</Badge></div><p className="mt-1 text-sm text-muted-foreground">Клиент с августа 2022 · <PersonalizedBankText after=" Plus" /></p><p className="mt-3 inline-flex items-center gap-2 text-xs text-primary"><Sparkles className="size-3" />Уровень профиля заполнен на 92%</p></div></div></Card><div className="grid gap-3">{profileItems.map(({ href, label, description, icon: Icon }) => <Link key={href} href={href} className="flex items-center gap-4 rounded-2xl border bg-card p-4 outline-none transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring"><span className="grid size-11 place-items-center rounded-xl bg-secondary"><Icon className="size-5 text-primary" /></span><span><span className="block font-medium">{label}</span><span className="block text-sm text-muted-foreground">{description}</span></span><ChevronRight className="ml-auto size-4 text-muted-foreground" /></Link>)}</div></>;
}
