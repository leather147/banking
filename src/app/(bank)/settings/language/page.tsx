import { LanguageSettingsPanel } from "@/components/settings/language-settings-panel";
import { SettingsShell } from "@/components/settings/settings-shell";
import { PageHeading } from "@/components/shared/page-heading";

export default function LanguageSettingsPage() { return <><PageHeading title="Язык и регион" description="Переключение языка без перезагрузки и расширяемая структура переводов." /><SettingsShell><LanguageSettingsPanel /></SettingsShell></>; }
