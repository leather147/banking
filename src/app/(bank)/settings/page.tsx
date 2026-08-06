import type { Metadata } from "next";
import { SettingsOverview } from "@/components/settings/settings-overview";

export const metadata: Metadata = { title: "Настройки" };

export default function SettingsPage() {
  return <SettingsOverview />;
}
