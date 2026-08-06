"use client";

import * as React from "react";
import { BarChart3, Clock3, CreditCard, Home, LayoutGrid, Send } from "lucide-react";
import { usePersonalization } from "@/components/providers/personalization-provider";

export type AppIconName = "home" | "payments" | "cards" | "operations" | "analytics" | "services";

const lucideIcons = { home: Home, payments: Send, cards: CreditCard, operations: Clock3, analytics: BarChart3, services: LayoutGrid };
const phosphorIcons = {
  home: React.lazy(() => import("@phosphor-icons/react/dist/csr/House").then((module) => ({ default: module.HouseIcon }))),
  payments: React.lazy(() => import("@phosphor-icons/react/dist/csr/PaperPlaneTilt").then((module) => ({ default: module.PaperPlaneTiltIcon }))),
  cards: React.lazy(() => import("@phosphor-icons/react/dist/csr/CreditCard").then((module) => ({ default: module.CreditCardIcon }))),
  operations: React.lazy(() => import("@phosphor-icons/react/dist/csr/ClockCounterClockwise").then((module) => ({ default: module.ClockCounterClockwiseIcon }))),
  analytics: React.lazy(() => import("@phosphor-icons/react/dist/csr/ChartBar").then((module) => ({ default: module.ChartBarIcon }))),
  services: React.lazy(() => import("@phosphor-icons/react/dist/csr/SquaresFour").then((module) => ({ default: module.SquaresFourIcon }))),
};

export function AppIcon({ name, active = false, className }: { name: AppIconName; active?: boolean; className?: string }) {
  const { settings } = usePersonalization();
  const LucideIcon = lucideIcons[name];
  if (settings.iconPack === "lucide") return <LucideIcon className={className} strokeWidth={active ? 2.6 : 2} />;
  const PhosphorIcon = phosphorIcons[name];
  return <React.Suspense fallback={<LucideIcon className={className} strokeWidth={active ? 2.6 : 2} />}><PhosphorIcon className={className} weight={active ? "fill" : "regular"} /></React.Suspense>;
}
