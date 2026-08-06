import { PageHeading } from "@/components/shared/page-heading";
import { DeveloperSettingsPanel } from "@/components/settings/developer-settings-panel";
import { SettingsShell } from "@/components/settings/settings-shell";

export default function DeveloperThemePage() { return <><PageHeading title="Тема и фон" description="Название, accent-палитра и цветные слои приложения." /><SettingsShell><DeveloperSettingsPanel section="theme" /></SettingsShell></>; }
