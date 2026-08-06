import type { Metadata } from "next";
import { PageHeading } from "@/components/shared/page-heading";
import { TopUpScreen } from "@/components/top-up/top-up-screen";

export const metadata: Metadata = { title: "Пополнение" };

export default async function TopUpOperationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <><PageHeading eyebrow={`Операция · ${slug.slice(-7)}`} title="Пополнение" description="Пополняйте карту с другого банка, своего счёта или наличными." /><TopUpScreen slug={slug} /></>;
}
