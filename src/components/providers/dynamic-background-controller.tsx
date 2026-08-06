"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { usePersonalization } from "@/components/providers/personalization-provider";

export function DynamicBackgroundController() {
  const pathname = usePathname();
  const { settings } = usePersonalization();

  React.useEffect(() => {
    const root = document.documentElement;
    const mode = settings.dynamicBackground;
    const followsPointer = mode === "cursor" || mode === "all";
    if (!followsPointer) return;
    let frame = 0;
    let x = window.innerWidth * 0.5;
    let y = window.innerHeight * 0.34;
    const commit = () => {
      frame = 0;
      root.style.setProperty("--pointer-x", `${x}px`);
      root.style.setProperty("--pointer-y", `${y}px`);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(commit);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [settings.dynamicBackground]);

  React.useEffect(() => {
    const root = document.documentElement;
    const mode = settings.dynamicBackground;
    const operation = /^\/(payments|transfers|top-up)\//.test(pathname);
    root.dataset.operationBackground = operation && (mode === "operation" || mode === "all") ? "on" : "off";
    if (mode === "navigation" || mode === "all") {
      root.dataset.navigationPulse = "off";
      const frame = window.requestAnimationFrame(() => { root.dataset.navigationPulse = "on"; });
      const timer = window.setTimeout(() => { root.dataset.navigationPulse = "off"; }, 1_100);
      return () => { window.cancelAnimationFrame(frame); window.clearTimeout(timer); };
    }
  }, [pathname, settings.dynamicBackground]);

  return null;
}
