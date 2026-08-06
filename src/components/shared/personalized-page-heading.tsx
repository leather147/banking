"use client";

import { usePersonalization } from "@/components/providers/personalization-provider";
import { PageHeading } from "@/components/shared/page-heading";

export function PersonalizedPageHeading({ eyebrowTemplate, title, description }: { eyebrowTemplate: string; title: string; description: string }) {
  const { settings } = usePersonalization();
  return <PageHeading eyebrow={eyebrowTemplate.replace("{bank}", settings.brandName)} title={title} description={description} />;
}
