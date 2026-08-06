"use client";

import { AppToaster } from "@/components/providers/app-toaster";
import { CookieBanner } from "@/components/cookie-banner";
import { InitialLoader } from "@/components/providers/initial-loader";
import { PersonalizationProvider } from "@/components/providers/personalization-provider";
import { NotificationProvider } from "@/components/providers/notification-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/providers/theme-provider";
import type { PersonalizationSettings } from "@/lib/personalization";
import type { Theme } from "@/types";
import { I18nProvider } from "@/components/providers/i18n-provider";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function AppProviders({ initialTheme, initialPersonalization, initialLocale, initialDictionary, children }: { initialTheme: Theme; initialPersonalization: PersonalizationSettings; initialLocale: Locale; initialDictionary: Dictionary; children: React.ReactNode }) {
  return (
    <I18nProvider initialLocale={initialLocale} initialDictionary={initialDictionary}>
      <ThemeProvider initialTheme={initialTheme}>
        <PersonalizationProvider initialSettings={initialPersonalization}>
          <NotificationProvider>
            <TooltipProvider delayDuration={250}>
              {children}
              <InitialLoader />
              <CookieBanner />
              <AppToaster />
            </TooltipProvider>
          </NotificationProvider>
        </PersonalizationProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
