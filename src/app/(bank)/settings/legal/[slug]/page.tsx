import { notFound } from "next/navigation";
import { LegalDocumentScreen } from "@/components/legal/legal-document-screen";
import { SettingsShell } from "@/components/settings/settings-shell";
import { findLegalDocument, LEGAL_DOCUMENTS } from "@/lib/legal";

export function generateStaticParams() {
  return LEGAL_DOCUMENTS.map(({ slug }) => ({ slug }));
}

export default async function LegalDocumentPage({ params }: PageProps<"/settings/legal/[slug]">) {
  const { slug } = await params;
  if (!findLegalDocument(slug)) notFound();
  return <SettingsShell><LegalDocumentScreen slug={slug} /></SettingsShell>;
}
