import { LicenseBrowser } from "@/components/settings/license-browser";
import { PageHeading } from "@/components/shared/page-heading";
import { SettingsShell } from "@/components/settings/settings-shell";

export default function LicensesPage() { return <><PageHeading title="Лицензионные соглашения" description="Собранные на этапе сборки документы всех установленных библиотек." /><SettingsShell><LicenseBrowser /></SettingsShell></>; }
