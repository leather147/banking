"use client";

import Link from "next/link";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";

export function Brand({ compact = false, className }: { compact?: boolean; className?: string }) {
  const { settings } = usePersonalization();
  const { t } = useI18n();
  const monogram = settings.brandName.trim().slice(0, 1).toLocaleUpperCase("ru-RU") || "L";
  return (
    <Link href="/" className={cn("group flex items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}>
      <span className="relative grid size-10 place-items-center overflow-hidden rounded-2xl bg-primary text-primary-foreground shadow-[0_0_28px_-8px_var(--primary)]">
        <span className="absolute inset-[3px] rounded-[0.75rem] border border-white/35" />
        <span className="relative text-sm font-black">{monogram}</span>
      </span>
      {compact ? null : (
        <span className="leading-tight">
          <span className="block max-w-40 truncate font-semibold tracking-tight">{settings.brandName}</span>
          <span className="block text-[11px] text-muted-foreground">{t("app.tagline")}</span>
        </span>
      )}
    </Link>
  );
}
