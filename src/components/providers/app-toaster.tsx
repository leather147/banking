"use client";

import { Toaster, type ToasterProps } from "sonner";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { useTheme } from "@/components/providers/theme-provider";

export function AppToaster() {
  const { theme } = useTheme();
  const { settings } = usePersonalization();
  const position = settings.toastPosition as ToasterProps["position"];
  const top = position?.startsWith("top");
  return <Toaster theme={theme} richColors closeButton position={position} offset={top ? { top: 80, right: 16, left: 16 } : { bottom: 22, right: 16, left: 16 }} mobileOffset={top ? { top: 76, right: 12, left: 12 } : { bottom: 100, right: 12, left: 12 }} duration={5200} gap={10} />;
}
