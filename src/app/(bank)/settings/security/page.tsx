import { PageHeading } from "@/components/shared/page-heading"; import { SettingsPanel } from "@/components/settings/settings-panel"; import { SettingsShell } from "@/components/settings/settings-shell";
import { SecurityActions } from "@/components/security/security-actions";
export default function SecurityPage() { return <><PageHeading title="Безопасность" description="Параметры входа и подтверждения операций." /><SettingsShell><div className="space-y-4"><SecurityActions /><SettingsPanel section="security" /></div></SettingsShell></>; }
