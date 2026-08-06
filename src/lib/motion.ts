import type { EasingPreset } from "@/lib/personalization";

export type MotionEase = [number, number, number, number] | "linear";

export const MOTION_EASINGS: Record<EasingPreset, { label: string; value: MotionEase; css: string }> = {
  silk: { label: "Шёлковый ease-out", value: [0.12, 0.82, 0.18, 1], css: "cubic-bezier(0.12, 0.82, 0.18, 1)" },
  cinematic: { label: "Кинематографичный", value: [0.14, 0.74, 0.18, 1], css: "cubic-bezier(0.14, 0.74, 0.18, 1)" },
  soft: { label: "Мягкий выход", value: [0.16, 1, 0.3, 1], css: "cubic-bezier(0.16, 1, 0.3, 1)" },
  gentle: { label: "Плавный", value: [0.22, 0.88, 0.24, 1], css: "cubic-bezier(0.22, 0.88, 0.24, 1)" },
  standard: { label: "Сбалансированный", value: [0.22, 1, 0.36, 1], css: "cubic-bezier(0.22, 1, 0.36, 1)" },
  linear: { label: "Линейный", value: "linear", css: "linear" },
};

export function getRouteDepth(pathname: string) {
  if (pathname === "/") return 0;
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === "operations") return 3;
  if (segments[0] === "notifications") return segments.length > 1 ? 3 : 1;
  if (["transfers", "top-up", "payments"].includes(segments[0])) return segments.length > 1 ? 2 : 1;
  if (["settings", "profile"].includes(segments[0])) return Math.min(3, segments.length);
  return Math.min(2, segments.length);
}
