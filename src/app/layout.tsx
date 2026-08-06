import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { MOTION_EASINGS } from "@/lib/motion";
import { ACCENT_PALETTES, DEFAULT_DASHBOARD_ORDER, normalizeOrder, parsePersonalizationCookie } from "@/lib/personalization";
import { parseLocaleCookie } from "@/i18n/config";
import { loadDictionary } from "@/i18n/dictionaries";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const personalization = parsePersonalizationCookie(cookieStore.get("lumen-settings-appearance")?.value);
  return { title: { default: personalization.brandName, template: `%s · ${personalization.brandName}` }, description: "Адаптивный демонстрационный интерфейс цифрового банка." };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const rawTheme = cookieStore.get("lumen-theme")?.value;
  let initialTheme: "light" | "dark" = "dark";
  if (rawTheme) {
    try {
      initialTheme = JSON.parse(decodeURIComponent(rawTheme)) === "light" ? "light" : "dark";
    } catch {
      initialTheme = rawTheme === "light" ? "light" : "dark";
    }
  }
  const initialPersonalization = parsePersonalizationCookie(cookieStore.get("lumen-settings-appearance")?.value);
  const initialLocale = parseLocaleCookie(cookieStore.get("lumen-locale")?.value);
  const initialDictionary = await loadDictionary(initialLocale);
  const palette = ACCENT_PALETTES[initialPersonalization.accentColor];
  const initialStyle = {
    "--interface-scale": String(initialPersonalization.interfaceScale),
    "--motion-speed": String(initialPersonalization.motionSpeed),
    "--glass-blur": `${initialPersonalization.glassBlurAmount}px`,
    "--glass-opacity": `${initialPersonalization.glassOpacity}%`,
    "--glass-saturation": `${initialPersonalization.glassSaturation}%`,
    "--glass-contrast": `${initialPersonalization.glassContrast}%`,
    "--glass-border-opacity": `${initialPersonalization.glassBorderOpacity}%`,
    "--glass-shadow-intensity": `${initialPersonalization.glassShadowIntensity}%`,
    "--background-intensity": String(initialPersonalization.backgroundIntensity),
    "--mobile-fade-opacity": `${initialPersonalization.bottomFadeOpacity}%`,
    "--ui-radius-scale": String(initialPersonalization.radiusScale),
    "--ease-route": MOTION_EASINGS[initialPersonalization.easingRoute].css,
    "--ease-panel": MOTION_EASINGS[initialPersonalization.easingPanel].css,
    "--ease-modal": MOTION_EASINGS[initialPersonalization.easingModal].css,
    "--ease-micro": MOTION_EASINGS[initialPersonalization.easingMicro].css,
    "--route-perspective": `${initialPersonalization.routePerspective}px`,
    "--primary": palette.primary,
    "--primary-foreground": palette.foreground,
    "--ring": palette.primary,
    "--chart-1": palette.primary,
    "--glow-lime": palette.primary,
    "--glow-orange": palette.secondary,
    "--glow-blue": palette.tertiary,
    "--glow-pink": palette.fourth,
    ...Object.fromEntries(normalizeOrder(initialPersonalization.dashboardOrder, DEFAULT_DASHBOARD_ORDER).map((id, index) => [`--dashboard-order-${id}`, String(index + 1)])),
  } as React.CSSProperties;

  return (
    <html
      lang={initialLocale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${initialTheme}`}
      data-density={initialPersonalization.density}
      data-motion={initialPersonalization.animations ? "full" : "reduced"}
      data-glass={initialPersonalization.glassBlur ? "on" : "off"}
      data-glass-noise={initialPersonalization.glassNoise ? "on" : "off"}
      data-background={initialPersonalization.backgroundEnabled ? "on" : "off"}
      data-background-style={initialPersonalization.backgroundStyle}
      data-ambient={initialPersonalization.ambientGlow ? "on" : "off"}
      data-hints={initialPersonalization.hoverHints ? "on" : "off"}
      data-skeletons={initialPersonalization.skeletonShimmer ? "shimmer" : "pulse"}
      data-compact-cards={initialPersonalization.compactCards ? "on" : "off"}
      data-focus={initialPersonalization.strongerFocus ? "strong" : "normal"}
      data-contrast={initialPersonalization.highContrast ? "high" : "normal"}
      data-touch-targets={initialPersonalization.largeTouchTargets ? "large" : "normal"}
      data-touch-momentum={initialPersonalization.touchMomentum ? "on" : "off"}
      data-dock-magnification={initialPersonalization.dockMagnification ? "on" : "off"}
      data-sidebar={initialPersonalization.sidebarCollapsed ? "collapsed" : "expanded"}
      data-measurement-system={initialPersonalization.measurementSystem}
      style={initialStyle}
    >
      <body>
        <AppProviders initialTheme={initialTheme} initialPersonalization={initialPersonalization} initialLocale={initialLocale} initialDictionary={initialDictionary}>{children}</AppProviders>
      </body>
    </html>
  );
}
