import type { Metadata } from "next";
import { PaymentsScreen } from "@/components/payments/payments-screen";
import { PageHeading } from "@/components/shared/page-heading";

export const metadata: Metadata = { title: "Оплата услуг" };

export default async function PaymentOperationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <><PageHeading eyebrow={`Операция · ${slug.slice(-7)}`} title="Оплата услуг" description="Связь, ЖКХ, транспорт, государственные и другие повседневные платежи." /><PaymentsScreen slug={slug} /></>;
}
