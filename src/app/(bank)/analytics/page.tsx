import type { Metadata } from "next";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";
import { PageHeading } from "@/components/shared/page-heading";

export const metadata: Metadata = { title: "Аналитика" };

export default function AnalyticsPage() {
  return <><PageHeading eyebrow="Август 2026" title="Аналитика" description="Доходы, расходы, категории и цели — без сложных таблиц и лишнего шума." /><AnalyticsDashboard /></>;
}
