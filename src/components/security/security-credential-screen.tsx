"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { KeyRound, ShieldCheck } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { PinPad } from "@/components/security/pin-pad";
import { PageHeading } from "@/components/shared/page-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCookieState } from "@/lib/cookies";
import { hashLocalSecret, LAST_AUTH_COOKIE, PIN_HASH_COOKIE, verifyLocalSecret } from "@/lib/security";

type Mode = "create" | "change" | "unlock";
type Phase = "current" | "new" | "repeat";

export function SecurityCredentialScreen({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [storedHash, setStoredHash, hydrated] = useCookieState(PIN_HASH_COOKIE, z.string(), "");
  const [, setLastAuth] = useCookieState(LAST_AUTH_COOKIE, z.number().nonnegative(), 0);
  const [phase, setPhase] = React.useState<Phase>("current");
  const [value, setValue] = React.useState("");
  const [draftHash, setDraftHash] = React.useState("");
  const [error, setError] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (!hydrated) return;
    if ((mode === "change" || mode === "unlock") && !storedHash) router.replace("/settings/security/pin/create");
  }, [hydrated, mode, router, storedHash]);

  const activePhase: Phase = phase === "current" && mode === "create" && !storedHash ? "new" : phase;

  async function submit(pin: string) {
    setBusy(true);
    setError("");
    try {
      if (activePhase === "current") {
        if (!storedHash || !(await verifyLocalSecret(pin, storedHash))) {
          setValue("");
          setError("Неверный код-пароль");
          return;
        }
        if (mode === "unlock") {
          setLastAuth(Date.now());
          toast.success("Доступ подтверждён");
          router.replace("/");
          return;
        }
        setPhase("new");
        setValue("");
        return;
      }
      if (activePhase === "new") {
        setDraftHash(await hashLocalSecret(pin));
        setPhase("repeat");
        setValue("");
        return;
      }
      const repeatedHash = await hashLocalSecret(pin);
      if (repeatedHash !== draftHash) {
        setPhase("new");
        setValue("");
        setDraftHash("");
        setError("Коды не совпали. Задайте новый код ещё раз");
        return;
      }
      setStoredHash(repeatedHash);
      setLastAuth(Date.now());
      toast.success(mode === "create" ? "Код-пароль создан" : "Код-пароль изменён");
      router.replace("/settings/security");
    } finally {
      setBusy(false);
    }
  }

  const copy = activePhase === "current"
    ? { title: mode === "unlock" ? "Введите код-пароль" : "Подтвердите текущий код", description: "Четыре цифры защищают локальную демонстрационную учётную запись." }
    : activePhase === "new"
      ? { title: "Задайте новый код", description: "Используйте четыре цифры, которые сможете запомнить." }
      : { title: "Повторите код", description: "Повторный ввод исключает случайную опечатку." };

  return <div className="mx-auto max-w-xl"><PageHeading eyebrow="БЕЗОПАСНОСТЬ" title={copy.title} description={copy.description} /><Card className="overflow-hidden border-primary/25"><CardHeader className="items-center text-center"><span className="grid size-12 place-items-center rounded-2xl bg-primary/12 text-primary">{activePhase === "repeat" ? <ShieldCheck className="size-5" /> : <KeyRound className="size-5" />}</span><CardTitle className="mt-2">{activePhase === "current" ? "Подтверждение личности" : activePhase === "new" ? "Новый код" : "Проверка кода"}</CardTitle></CardHeader><CardContent className="pb-6"><PinPad value={value} onChange={(next) => { setValue(next); setError(""); }} onComplete={submit} disabled={!hydrated || busy} error={error} /></CardContent></Card></div>;
}
