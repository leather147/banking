import { PageHeading } from "@/components/shared/page-heading";
import { DeveloperSettingsPanel } from "@/components/settings/developer-settings-panel";
import { SettingsShell } from "@/components/settings/settings-shell";

export default function DeveloperLayoutPage() { return <><PageHeading title="Компоновка" description="Порядок ключевых пунктов, кнопок и блоков интерфейса." /><SettingsShell><DeveloperSettingsPanel section="layout" /></SettingsShell></>; }
