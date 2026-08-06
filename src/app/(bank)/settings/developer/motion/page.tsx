import { PageHeading } from "@/components/shared/page-heading";
import { DeveloperSettingsPanel } from "@/components/settings/developer-settings-panel";
import { SettingsShell } from "@/components/settings/settings-shell";

export default function DeveloperMotionPage() { return <><PageHeading title="Motion-система" description="Мягкие ease-out функции, скорость и глубина маршрутов." /><SettingsShell><DeveloperSettingsPanel section="motion" /></SettingsShell></>; }
