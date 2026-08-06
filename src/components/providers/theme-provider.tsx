"use client";

import * as React from "react";
import type { Theme } from "@/types";
import { setCookie } from "@/lib/cookies";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme, origin?: ThemeOrigin) => void;
  toggleTheme: (origin?: ThemeOrigin) => void;
};

export type ThemeOrigin = { x: number; y: number };

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ initialTheme, children }: { initialTheme: Theme; children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>(initialTheme);
  const themeRef = React.useRef<Theme>(initialTheme);
  const rippleRef = React.useRef<HTMLElement | null>(null);
  const animationRef = React.useRef<Animation | null>(null);
  const applyTimerRef = React.useRef<number | null>(null);

  const applyTheme = React.useCallback((nextTheme: Theme) => {
    themeRef.current = nextTheme;
    setThemeState(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.classList.toggle("light", nextTheme === "light");
    setCookie("lumen-theme", nextTheme);
  }, []);

  const setTheme = React.useCallback((nextTheme: Theme, origin?: ThemeOrigin) => {
    if (nextTheme === themeRef.current) return;
    // Reserve the requested theme immediately. A second toggle during the
    // ripple must reverse the pending transition rather than replay stale UI.
    themeRef.current = nextTheme;
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches || root.dataset.motion === "reduced";
    if (reduceMotion) {
      applyTheme(nextTheme);
      return;
    }

    const keyboardOrigin = origin?.x === 0 && origin?.y === 0;
    const x = origin && !keyboardOrigin ? origin.x : window.innerWidth / 2;
    const y = origin && !keyboardOrigin ? origin.y : window.innerHeight / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const speed = Number.parseFloat(getComputedStyle(root).getPropertyValue("--motion-speed")) || 1;
    const duration = Math.min(1800, 820 / speed);
    root.style.setProperty("--theme-ripple-x", `${x}px`);
    root.style.setProperty("--theme-ripple-y", `${y}px`);
    root.dataset.themeDirection = nextTheme;

    animationRef.current?.cancel();
    rippleRef.current?.remove();
    if (applyTimerRef.current !== null) window.clearTimeout(applyTimerRef.current);
    const ripple = document.createElement("span");
    rippleRef.current = ripple;
    ripple.setAttribute("aria-hidden", "true");
    Object.assign(ripple.style, {
      position: "fixed",
      left: `${x}px`,
      top: `${y}px`,
      width: "24px",
      height: "24px",
      borderRadius: "9999px",
      pointerEvents: "none",
      zIndex: "2147483647",
      background: nextTheme === "dark" ? "oklch(0.115 0.008 286)" : "oklch(0.968 0.004 286)",
      transform: "translate(-50%, -50%) scale(0)",
      willChange: "transform, opacity",
    });
    document.body.append(ripple);
    const scale = (radius * 2.12) / 24;
    const animation = ripple.animate(
      [
        { transform: "translate(-50%, -50%) scale(0)", opacity: 0.9 },
        { transform: `translate(-50%, -50%) scale(${scale})`, opacity: 0.78, offset: 0.72 },
        { transform: `translate(-50%, -50%) scale(${scale})`, opacity: 0 },
      ],
      { duration: duration + 240, easing: "cubic-bezier(0.16, 0.8, 0.2, 1)", fill: "forwards" },
    );
    animationRef.current = animation;
    // Switch underneath the covering circle, then let the same circle fade.
    // Applying at the animation end exposes a one-frame flash around its edge.
    applyTimerRef.current = window.setTimeout(() => {
      applyTimerRef.current = null;
      if (themeRef.current === nextTheme) applyTheme(nextTheme);
    }, duration * 0.7);
    animation.finished.catch(() => undefined).finally(() => {
      if (themeRef.current === nextTheme && !document.documentElement.classList.contains(nextTheme)) applyTheme(nextTheme);
      if (rippleRef.current === ripple) rippleRef.current = null;
      if (animationRef.current === animation) animationRef.current = null;
      ripple.remove();
      delete root.dataset.themeDirection;
    });
  }, [applyTheme]);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  React.useEffect(() => {
    // This cleanup is intentionally mount-scoped. Tying it to `theme` would
    // cancel the active ripple as soon as applyTheme updates React state.
    return () => {
      animationRef.current?.cancel();
      rippleRef.current?.remove();
      if (applyTimerRef.current !== null) window.clearTimeout(applyTimerRef.current);
    };
  }, []);

  const value = React.useMemo(
    () => ({ theme, setTheme, toggleTheme: (origin?: ThemeOrigin) => setTheme(themeRef.current === "dark" ? "light" : "dark", origin) }),
    [setTheme, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}
