"use client";

import { Card } from "@/components/ui/card";
import { SectionNav } from "@/components/shared/section-nav";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { getVisibleSettingsItems } from "@/lib/settings-navigation";

export function SettingsShell({ children }: { children: React.ReactNode }) {
  const { settings } = usePersonalization();
  return <div className="min-w-0 space-y-4">
    <Card className="hidden min-w-0 p-3 lg:block"><SectionNav items={getVisibleSettingsItems(settings.developerMode)} variant="tiles" /></Card>
    <div className="mx-auto min-w-0 max-w-5xl">{children}</div>
  </div>;
}
