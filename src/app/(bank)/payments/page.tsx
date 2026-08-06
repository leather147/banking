import type { Metadata } from "next";
import { OperationRouteLauncher } from "@/components/operations/operation-route-launcher";

export const metadata: Metadata = { title: "Новый платёж" };

export default function PaymentsLauncherPage() {
  return <OperationRouteLauncher kind="payment" />;
}
