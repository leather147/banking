import type { Metadata } from "next";
import { OperationDetails } from "@/components/operations/operation-details";

export const metadata: Metadata = { title: "Операция" };

export default async function OperationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <OperationDetails slug={slug} />;
}
