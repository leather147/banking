import type { Metadata } from "next";
import { OperationRouteLauncher } from "@/components/operations/operation-route-launcher";

export const metadata: Metadata = { title: "Новый перевод" };

export default function TransfersLauncherPage() {
  return <OperationRouteLauncher kind="transfer" />;
}
