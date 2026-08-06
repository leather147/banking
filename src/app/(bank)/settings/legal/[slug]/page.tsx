import { notFound } from "next/navigation";
import { LegalDocumentScreen } from "@/components/legal/legal-document-screen";
import { LicenseBrowser } from "@/components/settings/license-browser";
import { PageHeading } from "@/components/shared/page-heading";
import { SettingsShell } from "@/components/settings/settings-shell";
import { findLegalDocument, LEGAL_DOCUMENTS } from "@/lib/legal";

export function generateStaticParams() {
  return LEGAL_DOCUMENTS.map(({ slug }) => ({ slug }));
}

export default async function LegalDocumentPage({ params }: PageProps<"/settings/legal/[slug]">) {
  const { slug } = await params;
  if (!findLegalDocument(slug)) notFound();
  if (slug === "licenses") return <SettingsShell><PageHeading title="Лицензионные соглашения" description="Собранные на этапе сборки документы установленных библиотек." /><LicenseBrowser /></SettingsShell>;
  return <SettingsShell><LegalDocumentScreen slug={slug} /></SettingsShell>;
}
