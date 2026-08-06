import type { Metadata } from "next";
import { BankLanding } from "@/components/landing/bank-landing";

export const metadata: Metadata = {
  title: "О банке",
  description: "Продукты, безопасность и правовая информация цифрового банка.",
};

export default function BankLandingPage() {
  return <BankLanding />;
}
