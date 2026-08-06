"use client";

import Link from "next/link";
import { ChevronRight, KeyRound, MessageSquareText, ShieldCheck, TimerReset } from "lucide-react";
import { z } from "zod";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCookieState } from "@/lib/cookies";
import { CODE_WORD_HASH_COOKIE, PIN_HASH_COOKIE } from "@/lib/security";

export function SecurityActions() {
  const { settings, setSetting } = usePersonalization();
  const [pinHash] = useCookieState(PIN_HASH_COOKIE, z.string(), "");
  const [wordHash] = useCookieState(CODE_WORD_HASH_COOKIE, z.string(), "");
  const rows = [
    { href: pinHash ? "/settings/security/pin/change" : "/settings/security/pin/create", icon: KeyRound, title: pinHash ? "Изменить код-пароль" : "Задать код-пароль", description: pinHash ? "Код настроен на этом устройстве" : "Защитите повторный вход четырьмя цифрами" },
    { href: "/settings/security/code-word", icon: MessageSquareText, title: wordHash ? "Изменить кодовое слово" : "Задать кодовое слово", description: wordHash ? "Используется при обращении в поддержку" : "Дополнительная проверка личности" },
  ] as const;
  return <Card className="border-primary/20"><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" />Код-пароль и восстановление</CardTitle><p className="text-sm text-muted-foreground">Демонстрационные секреты хешируются локально и не отправляются на сервер.</p></CardHeader><CardContent className="space-y-2">{rows.map(({ href, icon: Icon, title, description }) => <Link key={href} href={href} className="group flex min-w-0 cursor-pointer items-center gap-3 rounded-2xl border bg-background/40 p-3 outline-none transition-[border-color,background-color] hover:border-primary/25 hover:bg-secondary/35 focus-visible:ring-2 focus-visible:ring-ring"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary"><Icon className="size-4" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-bold">{title}</span><span className="block text-xs leading-5 text-muted-foreground">{description}</span></span><ChevronRight className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" /></Link>)}<div className="mt-4 rounded-2xl border bg-primary/[0.045] p-4"><div className="flex items-center gap-2 text-sm font-bold"><TimerReset className="size-4 text-primary" />Период повторного запроса</div><p className="mt-1 text-xs leading-5 text-muted-foreground">После обновления или нового входа код запрашивается не чаще выбранного периода.</p><select value={settings.pinReauthMinutes} onChange={(event) => setSetting("pinReauthMinutes", Number(event.target.value))} className="mt-3 h-10 w-full cursor-pointer rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"><option value={15}>15 минут</option><option value={30}>30 минут</option><option value={60}>1 час</option><option value={240}>4 часа</option><option value={1440}>24 часа</option></select></div></CardContent></Card>;
}
