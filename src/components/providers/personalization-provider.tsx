"use client";

import * as React from "react";
import { useCookieState } from "@/lib/cookies";
import { MOTION_EASINGS } from "@/lib/motion";
import { ACCENT_PALETTES, DEFAULT_DASHBOARD_ORDER, DEFAULT_PERSONALIZATION, PERSONALIZATION_COOKIE, normalizeOrder, personalizationSchema, type PersonalizationSettings } from "@/lib/personalization";

type PersonalizationContextValue = {
  settings: PersonalizationSettings;
  hydrated: boolean;
  setSetting: <K extends keyof PersonalizationSettings>(key: K, value: PersonalizationSettings[K]) => void;
  resetPersonalization: () => void;
};

const PersonalizationContext = React.createContext<PersonalizationContextValue | null>(null);

export function PersonalizationProvider({ initialSettings = DEFAULT_PERSONALIZATION, children }: { initialSettings?: PersonalizationSettings; children: React.ReactNode }) {
  const [settings, setSettings, hydrated] = useCookieState(PERSONALIZATION_COOKIE, personalizationSchema, initialSettings);
  const previousBrandName = React.useRef(initialSettings.brandName);

  React.useEffect(() => {
    const root = document.documentElement;
    // Data attributes and CSS custom properties are the runtime contract for
    // the whole design system. Updating them here avoids rerendering every
    // presentational component when a visual preference changes.
    root.dataset.density = settings.density;
    root.dataset.motion = settings.animations ? "full" : "reduced";
    root.dataset.glass = settings.glassBlur ? "on" : "off";
    root.dataset.hints = settings.hoverHints ? "on" : "off";
    root.dataset.skeletons = settings.skeletonShimmer ? "shimmer" : "pulse";
    root.dataset.ambient = settings.ambientGlow ? "on" : "off";
    root.dataset.background = settings.backgroundEnabled ? "on" : "off";
    root.dataset.backgroundStyle = settings.backgroundStyle;
    root.dataset.glassNoise = settings.glassNoise ? "on" : "off";
    root.dataset.compactCards = settings.compactCards ? "on" : "off";
    root.dataset.focus = settings.strongerFocus ? "strong" : "normal";
    root.dataset.contrast = settings.highContrast ? "high" : "normal";
    root.dataset.touchTargets = settings.largeTouchTargets ? "large" : "normal";
    root.dataset.touchMomentum = settings.touchMomentum ? "on" : "off";
    root.dataset.dockMagnification = settings.dockMagnification ? "on" : "off";
    root.dataset.toastPosition = settings.toastPosition;
    root.dataset.sidebar = settings.sidebarCollapsed ? "collapsed" : "expanded";
    root.dataset.measurementSystem = settings.measurementSystem;
    root.dataset.tabNavigation = settings.tabNavigation ? "on" : "off";
    root.dataset.focusWrap = settings.focusWrap ? "on" : "off";
    root.style.setProperty("--interface-scale", String(settings.interfaceScale));
    root.style.setProperty("--motion-speed", String(settings.motionSpeed));
    root.style.setProperty("--glass-blur", `${settings.glassBlurAmount}px`);
    root.style.setProperty("--glass-opacity", `${settings.glassOpacity}%`);
    root.style.setProperty("--glass-saturation", `${settings.glassSaturation}%`);
    root.style.setProperty("--glass-contrast", `${settings.glassContrast}%`);
    root.style.setProperty("--glass-border-opacity", `${settings.glassBorderOpacity}%`);
    root.style.setProperty("--glass-shadow-intensity", `${settings.glassShadowIntensity}%`);
    root.style.setProperty("--background-intensity", String(settings.backgroundIntensity));
    root.style.setProperty("--mobile-fade-opacity", `${settings.bottomFadeOpacity}%`);
    root.style.setProperty("--ui-radius-scale", String(settings.radiusScale));
    root.style.setProperty("--ease-route", MOTION_EASINGS[settings.easingRoute].css);
    root.style.setProperty("--ease-panel", MOTION_EASINGS[settings.easingPanel].css);
    root.style.setProperty("--ease-modal", MOTION_EASINGS[settings.easingModal].css);
    root.style.setProperty("--ease-micro", MOTION_EASINGS[settings.easingMicro].css);
    root.style.setProperty("--route-perspective", `${settings.routePerspective}px`);
    normalizeOrder(settings.dashboardOrder, DEFAULT_DASHBOARD_ORDER).forEach((id, index) => root.style.setProperty(`--dashboard-order-${id}`, String(index + 1)));

    const palette = ACCENT_PALETTES[settings.accentColor];
    root.style.setProperty("--primary", palette.primary);
    root.style.setProperty("--primary-foreground", palette.foreground);
    root.style.setProperty("--ring", palette.primary);
    root.style.setProperty("--chart-1", palette.primary);
    root.style.setProperty("--glow-lime", palette.primary);
    root.style.setProperty("--glow-orange", palette.secondary);
    root.style.setProperty("--glow-blue", palette.tertiary);
    root.style.setProperty("--glow-pink", palette.fourth);

  }, [settings]);

  React.useEffect(() => {
    const previous = previousBrandName.current;
    if (previous === settings.brandName) return;
    document.title = document.title.endsWith(previous)
      ? `${document.title.slice(0, -previous.length)}${settings.brandName}`
      : settings.brandName;
    previousBrandName.current = settings.brandName;
  }, [settings.brandName]);

  const setSetting = React.useCallback(<K extends keyof PersonalizationSettings,>(key: K, value: PersonalizationSettings[K]) => {
    setSettings((current) => ({ ...current, [key]: value }));
  }, [setSettings]);

  const resetPersonalization = React.useCallback(() => setSettings(DEFAULT_PERSONALIZATION), [setSettings]);
  const value = React.useMemo(() => ({ settings, hydrated, setSetting, resetPersonalization }), [hydrated, resetPersonalization, setSetting, settings]);

  return <PersonalizationContext.Provider value={value}>{settings.skipLinks ? <a href="#app-scroll-region" className="fixed left-4 top-3 z-[9999] -translate-y-20 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-xl transition-transform focus:translate-y-0">К основному содержимому</a> : null}{children}{settings.announceChanges ? <div id="app-live-region" className="sr-only" aria-live="polite" aria-atomic="true" /> : null}</PersonalizationContext.Provider>;
}

export function usePersonalization() {
  const context = React.useContext(PersonalizationContext);
  if (!context) throw new Error("usePersonalization must be used inside PersonalizationProvider");
  return context;
}
