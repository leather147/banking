import type { LucideIcon } from "lucide-react";
import { Accessibility, BadgeRussianRuble, BookOpenText, Cookie, FileCheck2, Landmark, LockKeyhole, ScanFace, ShieldAlert } from "lucide-react";

export type LegalDocument = {
  slug: string;
  icon: LucideIcon;
  titleKey: string;
  summaryKey: string;
  updated: string;
};

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  { slug: "banking-rules", icon: FileCheck2, titleKey: "legal.doc.rules.title", summaryKey: "legal.doc.rules.summary", updated: "01.08.2026" },
  { slug: "privacy-policy", icon: LockKeyhole, titleKey: "legal.doc.privacy.title", summaryKey: "legal.doc.privacy.summary", updated: "01.08.2026" },
  { slug: "personal-data", icon: ScanFace, titleKey: "legal.doc.data.title", summaryKey: "legal.doc.data.summary", updated: "28.07.2026" },
  { slug: "cookies", icon: Cookie, titleKey: "legal.doc.cookies.title", summaryKey: "legal.doc.cookies.summary", updated: "28.07.2026" },
  { slug: "tariffs", icon: BadgeRussianRuble, titleKey: "legal.doc.tariffs.title", summaryKey: "legal.doc.tariffs.summary", updated: "25.07.2026" },
  { slug: "anti-fraud", icon: ShieldAlert, titleKey: "legal.doc.fraud.title", summaryKey: "legal.doc.fraud.summary", updated: "04.08.2026" },
  { slug: "requisites", icon: Landmark, titleKey: "legal.doc.requisites.title", summaryKey: "legal.doc.requisites.summary", updated: "01.08.2026" },
  { slug: "accessibility", icon: Accessibility, titleKey: "legal.doc.accessibility.title", summaryKey: "legal.doc.accessibility.summary", updated: "18.07.2026" },
  { slug: "licenses", icon: BookOpenText, titleKey: "settings.section.licenses", summaryKey: "settings.section.licenses.description", updated: "06.08.2026" },
];

export const LEGAL_FAQS = ["status", "data", "cancel", "fraud", "support", "cookies"] as const;

export function findLegalDocument(slug: string) {
  return LEGAL_DOCUMENTS.find((document) => document.slug === slug);
}
