import type { Metadata } from "next";
import { CardsScreen } from "@/components/cards/cards-screen";
import { PersonalizedPageHeading } from "@/components/shared/personalized-page-heading";

export const metadata: Metadata = { title: "Карты" };

export default function CardsPage() {
  return <><PersonalizedPageHeading eyebrowTemplate="{bank} Black" title="Мои карты" description="Реквизиты, лимиты и основные настройки вашей демонстрационной карты." /><CardsScreen /></>;
}
