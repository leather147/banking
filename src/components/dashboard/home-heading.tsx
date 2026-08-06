"use client";

import { Badge } from "@/components/ui/badge";
import { PageHeading } from "@/components/shared/page-heading";
import { useI18n } from "@/components/providers/i18n-provider";

export function HomeHeading() {
  const { t } = useI18n();
  return <PageHeading eyebrow={t("dashboard.eyebrow")} title={t("dashboard.title")} description={t("dashboard.description")} actions={<Badge variant="success">{t("dashboard.systems")}</Badge>} />;
}
