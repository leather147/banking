"use client";

import { Cookie, Settings2 } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCookieState } from "@/lib/cookies";

const consentSchema = z.enum(["all", "necessary", "unset"]);

export function CookieBanner() {
  const [consent, setConsent, hydrated] = useCookieState("lumen-cookie-consent", consentSchema, "unset");

  if (!hydrated || consent !== "unset") return null;

  const accept = (value: "all" | "necessary") => {
    setConsent(value);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="fixed inset-x-3 bottom-24 z-50 mx-auto max-w-2xl md:bottom-5">
      <Card className="border-primary/25 bg-card/95 p-4 shadow-2xl backdrop-blur-xl sm:p-5">
        <div className="flex gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary"><Cookie className="size-5" /></div>
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold">Cookie помогают сохранить ваш выбор</h2>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">В этой демо-версии cookie хранят тему, настройки и данные тестового профиля только в вашем браузере.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => accept("all")}>Принять все</Button>
              <Button size="sm" variant="outline" onClick={() => accept("necessary")}>Только необходимые</Button>
              <Button asChild size="sm" variant="ghost"><Link href="/settings/privacy"><Settings2 />Настроить</Link></Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
