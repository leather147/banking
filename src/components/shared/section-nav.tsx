"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/providers/i18n-provider";

export type SectionNavItem = { label: string; translationKey?: string; description: string; descriptionKey?: string; href: Route; icon: React.ElementType };

export function SectionNav({ items, variant = "list" }: { items: SectionNavItem[]; variant?: "list" | "tiles" | "profile" }) {
  const pathname = usePathname();
  const { t } = useI18n();
  return (
    <nav className={cn(
      "hide-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:mb-0 lg:overflow-visible lg:px-0",
      variant === "tiles" && "lg:grid lg:auto-rows-fr lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6",
      variant === "list" && "lg:block lg:space-y-1",
      variant === "profile" && "mx-0 grid grid-cols-3 overflow-visible px-0 lg:block lg:space-y-1",
    )}>
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link key={item.href} href={item.href} className={cn("flex min-w-max items-center gap-3 rounded-xl border bg-card px-3 py-2.5 text-sm outline-none transition-[border-color,background-color,box-shadow] hover:bg-secondary hover:shadow-[0_0_22px_-18px_var(--glow-lime)] focus-visible:ring-2 focus-visible:ring-ring lg:min-w-0", variant === "list" && "lg:border-transparent lg:bg-transparent", variant === "tiles" && "lg:h-full lg:min-h-20 lg:bg-background/35", variant === "profile" && "min-w-0 justify-center px-2 text-center lg:justify-start lg:border-transparent lg:bg-transparent lg:px-3 lg:text-left", active && "border-primary/25 bg-primary/10 lg:border-primary/20 lg:bg-primary/10")}>
            <Icon className={cn("size-4 text-muted-foreground", active && "text-primary")} />
            <span className="min-w-0"><span className="block truncate font-semibold">{item.translationKey ? t(item.translationKey, item.label) : item.label}</span><span className="hidden truncate text-[11px] text-muted-foreground lg:block">{item.descriptionKey ? t(item.descriptionKey, item.description) : item.description}</span></span>
          </Link>
        );
      })}
    </nav>
  );
}
