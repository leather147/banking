"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Brand } from "@/components/layout/brand";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { MOTION_EASINGS } from "@/lib/motion";

export function InitialLoader() {
  const [visible, setVisible] = useState(true);
  const { settings } = usePersonalization();

  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(false), settings.animations ? 820 : 260);
    return () => window.clearTimeout(timeout);
  }, [settings.animations]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          role="status"
          aria-label={`${settings.brandName} загружается`}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(14px)" }}
          transition={{ duration: settings.animations ? 0.5 / settings.motionSpeed : 0.08, ease: MOTION_EASINGS[settings.easingPanel].value }}
          className="initial-loader-shell glass-panel fixed inset-0 z-[100] grid place-items-center bg-background/88"
        >
          <motion.div initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.58 / settings.motionSpeed, ease: MOTION_EASINGS[settings.easingPanel].value }} className="flex flex-col items-center gap-6">
            <Brand />
            <div className="relative h-1 w-40 overflow-hidden rounded-full bg-secondary"><motion.span className="absolute inset-y-0 left-0 rounded-full bg-primary shadow-[0_0_18px_var(--glow-lime)]" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: settings.animations ? 0.72 / settings.motionSpeed : 0.18, ease: MOTION_EASINGS[settings.easingMicro].value }} /></div>
            <span className="sr-only">Загрузка приложения</span>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
