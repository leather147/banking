import type { Metadata } from "next";
import { PageHeading } from "@/components/shared/page-heading";
import { TransfersScreen } from "@/components/transfers/transfers-screen";

export const metadata: Metadata = { title: "Перевод" };

export default async function TransferOperationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <><PageHeading eyebrow={`Операция · ${slug.slice(-7)}`} title="Переводы" description="Отправляйте деньги по телефону, номеру карты или банковскому счёту." /><TransfersScreen slug={slug} /></>;
}
