"use client";

import { Contact, FileBadge2, UserRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionNav, type SectionNavItem } from "@/components/shared/section-nav";

export const profileItems: SectionNavItem[] = [
  { label: "Личные данные", description: "Имя, дата рождения и город", href: "/profile/personal", icon: UserRound },
  { label: "Контакты", description: "Телефон, email и Telegram", href: "/profile/contacts", icon: Contact },
  { label: "Документы", description: "Паспортные данные", href: "/profile/documents", icon: FileBadge2 },
];

export function ProfileShell({ children }: { children: React.ReactNode }) {
  return <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[260px_minmax(0,1fr)]"><Card className="h-fit min-w-0 p-2 lg:p-3"><SectionNav items={profileItems} /></Card><div className="min-w-0">{children}</div></div>;
}
