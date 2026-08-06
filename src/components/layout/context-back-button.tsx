"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";

const primaryRoutes = new Set(["/", "/payments", "/cards", "/history", "/analytics", "/services", "/profile", "/settings", "/savings", "/bonuses", "/subscriptions", "/family", "/support", "/notifications"]);

function getBackTarget(pathname: string): Route | null {
  if (primaryRoutes.has(pathname)) return null;
  if (pathname.startsWith("/settings/developer/")) return "/settings/developer";
  if (pathname.startsWith("/settings/")) return "/settings";
  if (pathname.startsWith("/profile/")) return "/profile";
  if (pathname.startsWith("/operations/")) return "/history";
  if (pathname.startsWith("/notifications/")) return null;
  if (/^\/(payments|transfers|top-up)\//.test(pathname)) return "/";
  return null;
}

export function ContextBackButton() {
  const pathname = usePathname();
  const { t } = useI18n();
  const target = getBackTarget(pathname);
  if (!target) return null;
  return <Link href={target} className="glass-panel mb-4 inline-flex items-center gap-2 rounded-full border border-primary/12 bg-background/42 px-3 py-2 text-sm font-semibold outline-none transition-[border-color,background-color,box-shadow] hover:border-primary/30 hover:bg-secondary/60 hover:shadow-[0_0_22px_-18px_var(--glow-lime)] focus-visible:ring-2 focus-visible:ring-ring"><ArrowLeft className="size-4" />{t("common.back")}</Link>;
}
