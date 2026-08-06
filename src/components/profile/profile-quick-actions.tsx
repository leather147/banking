"use client";

import Link from "next/link";
import { Fingerprint, FileBadge2, KeyRound, LogOut, MessageSquareText, QrCode, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useCookieState } from "@/lib/cookies";
import { preferenceSchema } from "@/lib/schemas";
import { SECURITY_SETTINGS_DEFAULTS } from "@/lib/app-settings";

export function ProfileQuickActions() {
  const [security, setSecurity] = useCookieState("lumen-settings-security", preferenceSchema, SECURITY_SETTINGS_DEFAULTS);
  return <section aria-labelledby="profile-quick-title" className="space-y-3">
    <Link href="/profile/account-level" className="group flex min-w-0 cursor-pointer items-center gap-4 rounded-2xl border border-primary/25 bg-primary/[0.055] p-4 outline-none transition-[border-color,background-color,box-shadow] hover:border-primary/40 hover:bg-primary/[0.075] hover:shadow-[0_0_36px_-26px_var(--glow-lime)] focus-visible:ring-2 focus-visible:ring-ring"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/13 text-primary"><Sparkles className="size-5" /></span><span className="min-w-0 flex-1"><span id="profile-quick-title" className="block font-bold">Повысить уровень счёта</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">Больше лимитов и приоритетная проверка — это не подписка на сервисы.</span></span><span className="shrink-0 rounded-full border border-primary/25 px-2.5 py-1 font-mono text-[10px] text-primary">ACTIVE</span></Link>
    <div className="grid grid-cols-3 gap-2.5">
      <QuickLink href="/profile/personal" icon={UserRound} title="Мои данные" />
      <Dialog><DialogTrigger asChild><button type="button" className="flex min-w-0 cursor-pointer flex-col items-start gap-4 rounded-2xl border bg-card p-3 text-left outline-none transition-[border-color,background-color] hover:border-primary/25 hover:bg-secondary/35 focus-visible:ring-2 focus-visible:ring-ring sm:p-4"><span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary"><QrCode className="size-4" /></span><span className="text-xs font-bold sm:text-sm">QR для пополнения</span></button></DialogTrigger><DialogContent className="max-w-sm"><DialogHeader><DialogTitle>QR-код для пополнения</DialogTitle><DialogDescription>Подходит для демонстрационных сборов, чаевых и переводов.</DialogDescription></DialogHeader><div className="mx-auto grid aspect-square w-52 grid-cols-9 gap-1 rounded-3xl bg-white p-5 shadow-xl" aria-label="Демонстрационный QR-код">{Array.from({ length: 81 }, (_, index) => <span key={index} className={(index * 7 + Math.floor(index / 9) * 3) % 5 < 2 || [0,1,2,9,11,18,19,20,6,7,8,15,17,24,25,26,54,55,56,63,65,72,73,74].includes(index) ? "rounded-[1px] bg-black" : "rounded-[1px] bg-white"} />)}</div><p className="text-center font-mono text-[10px] text-muted-foreground">LUMEN-ID · 4A82 · DEMO</p></DialogContent></Dialog>
      <QuickLink href="/profile/documents" icon={FileBadge2} title="Документы" />
    </div>
    <Card className="divide-y overflow-hidden">
      <div className="flex items-center gap-3 p-4"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary"><Fingerprint className="size-4" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-bold">Использовать биометрию</span><span className="block text-xs text-muted-foreground">Быстрый вход на поддерживаемом устройстве</span></span><Switch checked={Boolean(security.biometrics)} onCheckedChange={(checked) => { setSecurity((current) => ({ ...current, biometrics: checked })); toast.success("Настройка биометрии сохранена"); }} aria-label="Использовать биометрию" /></div>
      <ActionLink href="/settings/security/pin/change" icon={KeyRound} label="Изменить код-пароль" />
      <ActionLink href="/settings/security/code-word" icon={MessageSquareText} label="Изменить кодовое слово" />
      <ActionLink href="/settings/security" icon={ShieldCheck} label="Все параметры безопасности" />
      <button type="button" onClick={() => toast.message("Выход из демонстрационного профиля подтверждён", { description: "Реальная сессия отсутствует, поэтому данные не отправляются." })} className="flex w-full cursor-pointer items-center gap-3 p-4 text-left text-sm font-bold text-destructive outline-none transition-colors hover:bg-destructive/5 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"><LogOut className="size-4" />Выйти из профиля</button>
    </Card>
  </section>;
}

function QuickLink({ href, icon: Icon, title }: { href: "/profile/personal" | "/profile/documents"; icon: typeof UserRound; title: string }) {
  return <Link href={href} className="flex min-w-0 cursor-pointer flex-col items-start gap-4 rounded-2xl border bg-card p-3 outline-none transition-[border-color,background-color] hover:border-primary/25 hover:bg-secondary/35 focus-visible:ring-2 focus-visible:ring-ring sm:p-4"><span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary"><Icon className="size-4" /></span><span className="text-xs font-bold sm:text-sm">{title}</span></Link>;
}

function ActionLink({ href, icon: Icon, label }: { href: "/settings/security/pin/change" | "/settings/security/code-word" | "/settings/security"; icon: typeof KeyRound; label: string }) {
  return <Link href={href} className="flex cursor-pointer items-center gap-3 p-4 text-sm font-bold outline-none transition-colors hover:bg-secondary/35 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"><Icon className="size-4 text-primary" />{label}</Link>;
}
