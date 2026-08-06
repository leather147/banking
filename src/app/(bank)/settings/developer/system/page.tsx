import { PageHeading } from "@/components/shared/page-heading";
import { DeveloperSettingsPanel } from "@/components/settings/developer-settings-panel";
import { SettingsShell } from "@/components/settings/settings-shell";

export default function DeveloperSystemPage() { return <><PageHeading title="Поведение среды" description="Параметры touch, dock и загрузочных состояний." /><SettingsShell><DeveloperSettingsPanel section="system" /></SettingsShell></>; }
