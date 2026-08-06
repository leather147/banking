import type { Route } from "next";
import { Accessibility, BellRing, BookOpenText, Braces, Info, Languages, Laptop2, LockKeyhole, MoonStar, Scale, ShieldCheck } from "lucide-react";
import type { SectionNavItem } from "@/components/shared/section-nav";

export const SETTINGS_ITEMS = [
  { label: "Персонализация", translationKey: "settings.section.appearance", description: "Glass, glow, масштаб и фон", descriptionKey: "settings.section.appearance.description", href: "/settings/appearance", icon: MoonStar },
  { label: "Доступность", translationKey: "settings.section.accessibility", description: "Фокус, контраст и touch-зоны", descriptionKey: "settings.section.accessibility.description", href: "/settings/accessibility", icon: Accessibility },
  { label: "Язык и регион", translationKey: "settings.section.language", description: "10 встроенных локалей", descriptionKey: "settings.section.language.description", href: "/settings/language", icon: Languages },
  { label: "Безопасность", translationKey: "settings.section.security", description: "Вход и подтверждения", descriptionKey: "settings.section.security.description", href: "/settings/security", icon: LockKeyhole },
  { label: "Уведомления", translationKey: "settings.section.notifications", description: "Push, email и SMS", descriptionKey: "settings.section.notifications.description", href: "/settings/notifications", icon: BellRing },
  { label: "Приватность", translationKey: "settings.section.privacy", description: "Cookie и персонализация", descriptionKey: "settings.section.privacy.description", href: "/settings/privacy", icon: ShieldCheck },
  { label: "Правовая информация", translationKey: "settings.section.legal", description: "Документы, реквизиты и ответы", descriptionKey: "settings.section.legal.description", href: "/settings/legal", icon: Scale },
  { label: "Устройства", translationKey: "settings.section.devices", description: "Активные сеансы", descriptionKey: "settings.section.devices.description", href: "/settings/devices", icon: Laptop2 },
  { label: "Разработчик", translationKey: "settings.section.developer", description: "Тема, motion и компоновка", descriptionKey: "settings.section.developer.description", href: "/settings/developer", icon: Braces },
  { label: "Лицензии", translationKey: "settings.section.licenses", description: "Документы зависимостей", descriptionKey: "settings.section.licenses.description", href: "/settings/licenses", icon: BookOpenText },
  { label: "О приложении", translationKey: "settings.section.about", description: "Версия и среда", descriptionKey: "settings.section.about.description", href: "/settings/about", icon: Info },
] satisfies (SectionNavItem & { href: Route })[];

export function findSettingsItem(pathname: string) {
  return SETTINGS_ITEMS.find((item) => pathname === item.href || (item.href === "/settings/developer" && pathname.startsWith("/settings/developer/")));
}
