"use client";

import * as React from "react";
import { ShieldCheck, X } from "lucide-react";
import { z } from "zod";
import { PinPad } from "@/components/security/pin-pad";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { Button } from "@/components/ui/button";
import { useCookieState } from "@/lib/cookies";
import { LAST_AUTH_COOKIE, PIN_HASH_COOKIE, verifyLocalSecret } from "@/lib/security";

export function SecurityGate() {
  const { settings } = usePersonalization();
  const [pinHash, , pinHydrated] = useCookieState(PIN_HASH_COOKIE, z.string(), "");
  const [lastAuth, setLastAuth, authHydrated] = useCookieState(LAST_AUTH_COOKIE, z.number().nonnegative(), 0);
  const [pin, setPin] = React.useState("");
  const [error, setError] = React.useState("");
  const [openedAt] = React.useState(() => Date.now());
  const open = pinHydrated && authHydrated && Boolean(pinHash) && openedAt - lastAuth >= settings.pinReauthMinutes * 60_000;

  async function unlock(value: string) {
    if (!(await verifyLocalSecret(value, pinHash))) {
      setPin("");
      setError("Код не подошёл");
      return;
    }
    setLastAuth(Date.now());
  }

  if (!open) return null;
  return <div className="fixed inset-0 z-[2147483000] grid place-items-center overflow-y-auto bg-background/82 p-3 backdrop-blur-2xl" role="dialog" aria-modal="true" aria-labelledby="security-gate-title"><div className="glass-panel relative my-auto w-full max-w-md rounded-[calc(var(--radius)*1.35)] border border-primary/25 bg-card/92 p-5 shadow-2xl sm:p-7"><Button type="button" variant="ghost" size="icon" onClick={() => setError("Для продолжения подтвердите код-пароль")} className="absolute right-3 top-3" aria-label="Закрыть невозможно без подтверждения"><X /></Button><span className="grid size-12 place-items-center rounded-2xl bg-primary/12 text-primary"><ShieldCheck className="size-5" /></span><h2 id="security-gate-title" className="mt-5 text-2xl font-bold">С возвращением</h2><p className="mb-5 mt-2 text-sm leading-6 text-muted-foreground">Срок доверенной сессии истёк. Введите код-пароль, чтобы открыть приложение.</p><PinPad value={pin} onChange={(next) => { setPin(next); setError(""); }} onComplete={unlock} error={error} /></div></div>;
}
