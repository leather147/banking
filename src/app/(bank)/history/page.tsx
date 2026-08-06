import type { Metadata } from "next";
import { TransactionHistory } from "@/components/history/transaction-history";
import { PageHeading } from "@/components/shared/page-heading";

export const metadata: Metadata = { title: "История операций" };

export default function HistoryPage() {
  return <><PageHeading eyebrow="Операции" title="История" description="Все списания, поступления и переводы с быстрым поиском и фильтрами." /><TransactionHistory /></>;
}
