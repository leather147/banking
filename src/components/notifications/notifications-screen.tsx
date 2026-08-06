"use client";

import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { ArrowLeft, BellRing, CheckCircle2, ChevronRight, ShieldCheck, WalletCards } from "lucide-react";
import { ReadSentinel } from "@/components/layout/notification-menu";
import { useNotifications } from "@/components/providers/notification-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_NOTIFICATIONS, type AppNotification } from "@/lib/notifications";

const icons = { security: ShieldCheck, offer: WalletCards, system: CheckCircle2 } as const;

function useDesktopReturn() {
  const router = useRouter();
  React.useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const check = () => { if (media.matches) router.replace("/"); };
    check();
    media.addEventListener("change", check);
    return () => media.removeEventListener("change", check);
  }, [router]);
}

export function NotificationsScreen() {
  useDesktopReturn();
  const { unreadCount, isRead } = useNotifications();
  return <div className="lg:hidden"><div className="mb-4 flex items-center gap-3"><Button asChild variant="ghost" size="icon"><Link href="/" aria-label="Назад"><ArrowLeft /></Link></Button><div><h1 className="text-xl font-semibold">Уведомления</h1><p className="text-xs text-muted-foreground">{unreadCount ? `${unreadCount} непрочитанных` : "Всё прочитано"}</p></div></div><Card><CardContent className="space-y-1 p-2">{APP_NOTIFICATIONS.map((notification) => <NotificationLink key={notification.id} notification={notification} read={isRead(notification.id)} />)}</CardContent></Card></div>;
}

function NotificationLink({ notification, read }: { notification: AppNotification; read: boolean }) {
  const Icon = icons[notification.type];
  return <Link href={`/notifications/${notification.id}` as Route} className="flex items-start gap-3 rounded-xl p-3 outline-none transition-[background-color,transform] active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-ring"><span className="relative grid size-10 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary"><Icon className="size-4" />{!read ? <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-primary shadow-[0_0_10px_var(--glow-lime)]" /> : null}</span><span className="min-w-0 flex-1"><span className="block text-sm font-medium">{notification.title}</span><span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{notification.summary}</span><span className="mt-1 block text-[10px] text-muted-foreground">{notification.time}</span></span><ChevronRight className="mt-3 size-4 shrink-0 text-muted-foreground" /></Link>;
}

export function NotificationDetailScreen({ notification }: { notification: AppNotification }) {
  useDesktopReturn();
  const { isRead, markRead } = useNotifications();
  const Icon = icons[notification.type];
  const handleViewed = React.useCallback(() => markRead(notification.id), [markRead, notification.id]);
  return <div className="lg:hidden"><div className="mb-4 flex items-center gap-3"><Button asChild variant="ghost" size="icon"><Link href="/notifications" aria-label="К уведомлениям"><ArrowLeft /></Link></Button><div><h1 className="text-xl font-semibold">Уведомление</h1><p className="text-xs text-muted-foreground">{isRead(notification.id) ? "Прочитано" : "Новое"}</p></div></div><Card className="overflow-hidden"><CardHeader className="border-b"><span className="mb-2 grid size-12 place-items-center rounded-2xl bg-primary/12 text-primary"><Icon className="size-5" /></span><CardTitle>{notification.title}</CardTitle><p className="text-xs text-muted-foreground">{notification.time}</p></CardHeader><CardContent className="flex min-h-[50vh] flex-col pt-5"><p className="text-sm leading-7 text-muted-foreground">{notification.body}</p><div className="mt-auto rounded-2xl border bg-background/40 p-4"><div className="flex items-center gap-2 text-sm font-medium"><BellRing className="size-4 text-primary" />Почему это важно</div><p className="mt-2 text-xs leading-5 text-muted-foreground">Статус изменится на «прочитано» только после того, как нижняя часть сообщения окажется на экране.</p></div><ReadSentinel onViewed={handleViewed} /></CardContent></Card></div>;
}
