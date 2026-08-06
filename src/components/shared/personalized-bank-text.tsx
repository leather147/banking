"use client";

import { usePersonalization } from "@/components/providers/personalization-provider";

export function PersonalizedBankText({ before = "", after = "", className }: { before?: string; after?: string; className?: string }) {
  const { settings } = usePersonalization();
  return <span className={className}>{before}{settings.brandName}{after}</span>;
}
