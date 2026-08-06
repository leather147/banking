"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { getRouteDepth, MOTION_EASINGS } from "@/lib/motion";

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const { settings } = usePersonalization();
  const disabled = reduceMotion || !settings.animations;
  const nextDepth = getRouteDepth(pathname);
  const [routeState, setRouteState] = useState({ pathname, depth: nextDepth, direction: -1 });
  if (routeState.pathname !== pathname) {
    setRouteState({ pathname, depth: nextDepth, direction: nextDepth < routeState.depth ? 1 : -1 });
  }
  const direction = routeState.direction;
  const distance = Math.max(6, Math.min(18, settings.routePerspective * 0.35));

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={pathname}
        initial={disabled ? false : { opacity: 0, x: direction * distance, filter: "blur(2px)", scale: 0.997, rotateY: direction * -0.2 }}
        animate={{ opacity: 1, x: 0, filter: "blur(0px)", scale: 1, rotateY: 0 }}
        exit={disabled ? undefined : { opacity: 0, x: direction * distance * -0.42, filter: "blur(1.5px)", scale: 0.998, rotateY: direction * 0.14 }}
        transition={{ duration: disabled ? 0.01 : 0.62 / settings.motionSpeed, ease: MOTION_EASINGS[settings.easingRoute].value }}
        className="min-h-full [perspective:1200px] [transform-origin:center_top]"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
