import type { Metadata } from "next";
import { TransactionHistory } from "@/components/history/transaction-history";
import { PageHeading } from "@/components/shared/page-heading";

export const metadata: Metadata = { title: "Операции" };

export default function HistoryPage() {
  return <><PageHeading eyebrow="СЧЁТ И КАРТЫ" title="Операции" description="Все списания, поступления и переводы с быстрым поиском, периодами и сортировкой." /><TransactionHistory /></>;
}
