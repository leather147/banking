import type { Metadata } from "next";
import { ServicesScreen } from "@/components/services/services-screen";
import { PageHeading } from "@/components/shared/page-heading";

export const metadata: Metadata = { title: "Все сервисы" };

export default function ServicesPage() {
  return (
    <>
      <PageHeading eyebrow="Каталог" title="Все сервисы" description="Продукты, бонусы, поддержка и полезные банковские разделы." />
      <ServicesScreen />
    </>
  );
}
