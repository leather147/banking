import { PageHeading } from "@/components/shared/page-heading";
import { SettingsPanel } from "@/components/settings/settings-panel";
import { SettingsShell } from "@/components/settings/settings-shell";

export default function AccessibilityPage() {
  return <><PageHeading title="Доступность" description="Контраст, focus, motion и размер интерактивных зон." /><SettingsShell><SettingsPanel section="accessibility" /></SettingsShell></>;
}
