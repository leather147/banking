import type { Metadata } from "next";
import { OperationRouteLauncher } from "@/components/operations/operation-route-launcher";

export const metadata: Metadata = { title: "Новое пополнение" };

export default function TopUpLauncherPage() {
  return <OperationRouteLauncher kind="top-up" />;
}
