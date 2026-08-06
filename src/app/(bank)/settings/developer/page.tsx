import Link from "next/link";
import { ChevronRight, Gauge, Grid2X2, MonitorCog, Palette } from "lucide-react";
import { PageHeading } from "@/components/shared/page-heading";
import { SettingsShell } from "@/components/settings/settings-shell";
import { Card } from "@/components/ui/card";

const sections = [
  { href: "/settings/developer/theme" as const, title: "Тема и фон", description: "Accent, название, glow и фоновая композиция", icon: Palette },
  { href: "/settings/developer/layout" as const, title: "Компоновка", description: "Порядок меню, действий, главной и top bar", icon: Grid2X2 },
  { href: "/settings/developer/motion" as const, title: "Анимации", description: "Скорость, перспектива и easing категорий", icon: Gauge },
  { href: "/settings/developer/system" as const, title: "Поведение среды", description: "Touch-scroll, dock и skeleton-загрузка", icon: MonitorCog },
];

export default function DeveloperSettingsPage() {
  return <><PageHeading title="Настройки разработчика" description="Точная конфигурация интерфейса, не меняющая банковские сценарии." /><SettingsShell><div className="grid gap-3 sm:grid-cols-2">{sections.map(({ href, title, description, icon: Icon }) => <Link key={href} href={href} className="outline-none focus-visible:ring-2 focus-visible:ring-ring"><Card className="flex h-full items-center gap-4 p-4 transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-secondary"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary"><Icon className="size-5" /></span><span className="min-w-0 flex-1"><span className="block font-medium">{title}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{description}</span></span><ChevronRight className="size-4 text-muted-foreground" /></Card></Link>)}</div></SettingsShell></>;
}
