import { z } from "zod";

export const accentColorSchema = z.enum(["lime", "orange", "blue", "violet", "rose"]);
export const backgroundStyleSchema = z.enum(["aurora", "halo", "prism", "quiet"]);
export const easingPresetSchema = z.enum(["silk", "cinematic", "soft", "gentle", "standard", "linear"]);
export const navigationItemSchema = z.enum(["home", "payments", "cards", "history", "analytics", "services"]);
export const secondaryNavigationItemSchema = z.enum(["savings", "bonuses", "subscriptions", "family", "support"]);
export const quickActionItemSchema = z.enum(["transfer", "top-up", "payment", "services"]);
export const dashboardItemSchema = z.enum(["pulse", "spending", "upcoming", "goals", "services", "history"]);
export const topbarItemSchema = z.enum(["search", "shortcuts", "transfer", "notifications", "profile"]);
export const toastPositionSchema = z.enum(["top-right", "top-center", "bottom-right", "bottom-center"]);
export const measurementSystemSchema = z.enum(["metric", "imperial"]);
export const cardDisplayStyleSchema = z.enum(["compact", "classic", "cinematic"]);

export type AccentColor = z.infer<typeof accentColorSchema>;
export type EasingPreset = z.infer<typeof easingPresetSchema>;
export type NavigationItemId = z.infer<typeof navigationItemSchema>;
export type SecondaryNavigationItemId = z.infer<typeof secondaryNavigationItemSchema>;
export type QuickActionItemId = z.infer<typeof quickActionItemSchema>;
export type DashboardItemId = z.infer<typeof dashboardItemSchema>;
export type TopbarItemId = z.infer<typeof topbarItemSchema>;

export const DEFAULT_NAVIGATION_ORDER: NavigationItemId[] = ["home", "payments", "cards", "history", "analytics", "services"];
export const DEFAULT_SECONDARY_NAVIGATION_ORDER: SecondaryNavigationItemId[] = ["savings", "bonuses", "subscriptions", "family", "support"];
export const DEFAULT_QUICK_ACTION_ORDER: QuickActionItemId[] = ["transfer", "top-up", "payment", "services"];
export const DEFAULT_DASHBOARD_ORDER: DashboardItemId[] = ["pulse", "spending", "upcoming", "goals", "services", "history"];
export const DEFAULT_TOPBAR_ORDER: TopbarItemId[] = ["search", "shortcuts", "transfer", "notifications", "profile"];

export const ACCENT_PALETTES = {
  lime: {
    label: "Лайм",
    primary: "oklch(0.82 0.22 126)",
    foreground: "oklch(0.16 0.04 126)",
    secondary: "oklch(0.72 0.2 55)",
    tertiary: "oklch(0.64 0.2 255)",
    fourth: "oklch(0.7 0.22 342)",
  },
  orange: {
    label: "Янтарь",
    primary: "oklch(0.75 0.2 52)",
    foreground: "oklch(0.17 0.035 52)",
    secondary: "oklch(0.8 0.18 83)",
    tertiary: "oklch(0.65 0.2 255)",
    fourth: "oklch(0.71 0.22 24)",
  },
  blue: {
    label: "Электрик",
    primary: "oklch(0.72 0.18 247)",
    foreground: "oklch(0.14 0.035 247)",
    secondary: "oklch(0.69 0.2 285)",
    tertiary: "oklch(0.75 0.17 197)",
    fourth: "oklch(0.73 0.2 333)",
  },
  violet: {
    label: "Ультрафиолет",
    primary: "oklch(0.72 0.2 302)",
    foreground: "oklch(0.15 0.035 302)",
    secondary: "oklch(0.72 0.2 342)",
    tertiary: "oklch(0.67 0.2 255)",
    fourth: "oklch(0.77 0.18 84)",
  },
  rose: {
    label: "Малина",
    primary: "oklch(0.72 0.21 350)",
    foreground: "oklch(0.16 0.035 350)",
    secondary: "oklch(0.72 0.2 25)",
    tertiary: "oklch(0.66 0.2 285)",
    fourth: "oklch(0.77 0.18 84)",
  },
} as const satisfies Record<AccentColor, { label: string; primary: string; foreground: string; secondary: string; tertiary: string; fourth: string }>;

export const personalizationSchema = z.object({
  density: z.enum(["comfortable", "compact"]).default("comfortable"),
  animations: z.boolean().default(true),
  motionSpeed: z.number().min(0.25).max(1.8).default(0.8),
  interfaceScale: z.number().min(0.85).max(1.15).default(1),
  glassBlur: z.boolean().default(true),
  glassBlurAmount: z.number().min(6).max(40).default(22),
  glassOpacity: z.number().min(45).max(96).default(78),
  glassSaturation: z.number().min(80).max(190).default(138),
  glassContrast: z.number().min(90).max(125).default(104),
  glassBorderOpacity: z.number().min(4).max(28).default(11),
  glassShadowIntensity: z.number().min(0).max(100).default(58),
  glassNoise: z.boolean().default(true),
  bottomFadeOpacity: z.number().min(0).max(90).default(64),
  radiusScale: z.number().min(0.75).max(1.35).default(1),
  hoverHints: z.boolean().default(true),
  skeletonShimmer: z.boolean().default(true),
  ambientGlow: z.boolean().default(true),
  compactCards: z.boolean().default(false),
  strongerFocus: z.boolean().default(false),
  highContrast: z.boolean().default(false),
  largeTouchTargets: z.boolean().default(false),
  backgroundEnabled: z.boolean().default(true),
  backgroundStyle: backgroundStyleSchema.default("aurora"),
  backgroundIntensity: z.number().min(0.15).max(1.2).default(0.72),
  accentColor: accentColorSchema.default("lime"),
  brandName: z.string().trim().min(2).max(24).default("Lumen Bank"),
  measurementSystem: measurementSystemSchema.default("metric"),
  balanceHidden: z.boolean().default(false),
  cardDisplayStyle: cardDisplayStyleSchema.default("compact"),
  demoCardCount: z.number().int().min(1).max(3).default(2),
  sidebarCollapsed: z.boolean().default(false),
  layoutEditMode: z.boolean().default(false),
  tabNavigation: z.boolean().default(true),
  focusWrap: z.boolean().default(false),
  skipLinks: z.boolean().default(true),
  announceChanges: z.boolean().default(true),
  useSystemDateTime: z.boolean().default(false),
  demoDate: z.string().default("2026-08-05"),
  demoTime: z.string().default("20:42"),
  navigationOrder: z.array(navigationItemSchema).default(DEFAULT_NAVIGATION_ORDER),
  secondaryNavigationOrder: z.array(secondaryNavigationItemSchema).default(DEFAULT_SECONDARY_NAVIGATION_ORDER),
  quickActionOrder: z.array(quickActionItemSchema).default(DEFAULT_QUICK_ACTION_ORDER),
  dashboardOrder: z.array(dashboardItemSchema).default(DEFAULT_DASHBOARD_ORDER),
  topbarOrder: z.array(topbarItemSchema).default(DEFAULT_TOPBAR_ORDER),
  easingRoute: easingPresetSchema.default("soft"),
  easingPanel: easingPresetSchema.default("soft"),
  easingModal: easingPresetSchema.default("gentle"),
  easingMicro: easingPresetSchema.default("soft"),
  routePerspective: z.number().min(0).max(80).default(34),
  touchMomentum: z.boolean().default(true),
  dockMagnification: z.boolean().default(true),
  toastPosition: toastPositionSchema.default("top-right"),
});

export type PersonalizationSettings = z.infer<typeof personalizationSchema>;

export const DEFAULT_PERSONALIZATION: PersonalizationSettings = personalizationSchema.parse({});

export const PERSONALIZATION_COOKIE = "lumen-settings-appearance";

export function parsePersonalizationCookie(raw?: string) {
  if (!raw) return DEFAULT_PERSONALIZATION;
  try {
    const parsed = personalizationSchema.safeParse(JSON.parse(decodeURIComponent(raw)));
    return parsed.success ? parsed.data : DEFAULT_PERSONALIZATION;
  } catch {
    return DEFAULT_PERSONALIZATION;
  }
}

export function normalizeOrder<T extends string>(configured: readonly T[], available: readonly T[]) {
  // Persisted layouts can outlive a release. Keep known user ordering, discard
  // removed ids and append newly introduced surfaces in their default order.
  return [...new Set([...configured.filter((item) => available.includes(item)), ...available])];
}

export function getConfiguredDate(settings: Pick<PersonalizationSettings, "useSystemDateTime" | "demoDate" | "demoTime">) {
  if (settings.useSystemDateTime) return new Date();
  const value = new Date(`${settings.demoDate}T${settings.demoTime}:00`);
  return Number.isNaN(value.getTime()) ? new Date() : value;
}
