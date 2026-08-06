"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MessageSquareText } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeading } from "@/components/shared/page-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCookieState } from "@/lib/cookies";
import { CODE_WORD_HASH_COOKIE, hashLocalSecret, verifyLocalSecret } from "@/lib/security";

export function CodeWordScreen() {
  const router = useRouter();
  const [hash, setHash] = useCookieState(CODE_WORD_HASH_COOKIE, z.string(), "");
  const [current, setCurrent] = React.useState("");
  const [next, setNext] = React.useState("");
  const [repeat, setRepeat] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (next.trim().length < 4) return toast.error("Кодовое слово должно содержать не менее четырёх символов");
    if (next.trim().toLocaleLowerCase() !== repeat.trim().toLocaleLowerCase()) return toast.error("Кодовые слова не совпадают");
    setBusy(true);
    try {
      if (hash && !(await verifyLocalSecret(current.trim().toLocaleLowerCase(), hash))) return toast.error("Текущее кодовое слово указано неверно");
      setHash(await hashLocalSecret(next.trim().toLocaleLowerCase()));
      toast.success(hash ? "Кодовое слово изменено" : "Кодовое слово задано");
      router.replace("/settings/security");
    } finally {
      setBusy(false);
    }
  }

  return <div className="mx-auto max-w-xl"><PageHeading eyebrow="ВОССТАНОВЛЕНИЕ" title={hash ? "Изменить кодовое слово" : "Задать кодовое слово"} description="Слово используется в демонстрационном сценарии обращения в поддержку." /><Card><CardHeader><span className="grid size-11 place-items-center rounded-2xl bg-primary/12 text-primary"><MessageSquareText className="size-5" /></span><CardTitle className="mt-2">Проверка и новое значение</CardTitle></CardHeader><CardContent><form onSubmit={submit} className="space-y-4">{hash ? <div><label htmlFor="current-word" className="mb-2 block text-sm font-medium">Текущее кодовое слово</label><Input id="current-word" type="password" autoComplete="off" value={current} onChange={(event) => setCurrent(event.target.value)} required /></div> : null}<div><label htmlFor="new-word" className="mb-2 block text-sm font-medium">Новое кодовое слово</label><Input id="new-word" type="password" autoComplete="off" value={next} onChange={(event) => setNext(event.target.value)} required /></div><div><label htmlFor="repeat-word" className="mb-2 block text-sm font-medium">Повторите слово</label><Input id="repeat-word" type="password" autoComplete="off" value={repeat} onChange={(event) => setRepeat(event.target.value)} required /></div><Button type="submit" className="w-full" disabled={busy}>{busy ? "Проверяем…" : "Сохранить кодовое слово"}</Button></form></CardContent></Card></div>;
}
