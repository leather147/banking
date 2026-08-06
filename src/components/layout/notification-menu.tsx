"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, CheckCircle2, ChevronDown, ShieldCheck, WalletCards } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { useNotifications } from "@/components/providers/notification-provider";
import { Button } from "@/components/ui/button";
import { APP_NOTIFICATIONS, type AppNotification } from "@/lib/notifications";
import { cn } from "@/lib/utils";

const icons = { security: ShieldCheck, offer: WalletCards, system: CheckCircle2 } as const;

export function MobileNotificationButton() {
  const { unreadCount } = useNotifications();
  return <Link href="/notifications" aria-label={unreadCount ? `Уведомления, непрочитанных: ${unreadCount}` : "Уведомления"} className="relative grid size-10 shrink-0 place-items-center rounded-full outline-none transition-colors hover:bg-secondary/65 focus-visible:ring-2 focus-visible:ring-ring lg:hidden"><Bell className="size-4" />{unreadCount ? <span className="absolute right-2 top-2 size-2 rounded-full bg-primary shadow-[0_0_12px_var(--glow-lime)]" /> : null}</Link>;
}

export function NotificationMenu() {
  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const { unreadCount, isRead, markRead } = useNotifications();
  return <div className="hidden lg:block"><DropdownMenu.Root open={open} onOpenChange={setOpen}>
    <DropdownMenu.Trigger asChild><Button variant="ghost" size="icon" aria-label={unreadCount ? `Уведомления, непрочитанных: ${unreadCount}` : "Уведомления"} className="relative shrink-0 rounded-full border-0 bg-transparent shadow-none hover:bg-secondary/65"><Bell />{unreadCount ? <span className="absolute right-2 top-2 size-2 rounded-full bg-primary shadow-[0_0_12px_var(--glow-lime)]" /> : null}</Button></DropdownMenu.Trigger>
    <DropdownMenu.Portal><DropdownMenu.Content align="end" sideOffset={10} className="glass-panel z-50 max-h-[min(620px,calc(100vh-6rem))] w-[min(390px,calc(100vw-1.5rem))] overflow-y-auto rounded-2xl border border-primary/15 bg-popover/82 p-2 shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out">
      <div className="sticky top-0 z-10 flex items-center justify-between rounded-xl bg-popover/75 px-3 py-2 backdrop-blur-xl"><p className="font-semibold">Уведомления</p><span className="text-[10px] text-muted-foreground">{unreadCount ? `${unreadCount} новых` : "Всё прочитано"}</span></div>
      {APP_NOTIFICATIONS.map((notification) => <NotificationItem key={notification.id} notification={notification} expanded={expanded === notification.id} read={isRead(notification.id)} onExpand={() => setExpanded((current) => current === notification.id ? null : notification.id)} onFullyViewed={() => markRead(notification.id)} />)}
    </DropdownMenu.Content></DropdownMenu.Portal>
  </DropdownMenu.Root></div>;
}

function NotificationItem({ notification, expanded, read, onExpand, onFullyViewed }: { notification: AppNotification; expanded: boolean; read: boolean; onExpand: () => void; onFullyViewed: () => void }) {
  const Icon = icons[notification.type];
  return <div className={cn("relative rounded-xl transition-colors", expanded ? "bg-secondary/55" : "hover:bg-secondary/45")}><button type="button" onClick={onExpand} className="flex w-full items-start gap-3 rounded-xl p-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"><span className="relative grid size-9 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary"><Icon className="size-4" />{!read ? <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-primary" /> : null}</span><span className="min-w-0 flex-1"><span className="block text-sm font-medium">{notification.title}</span><span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{notification.summary}</span><span className="mt-1 block text-[10px] text-muted-foreground">{notification.time}</span></span><ChevronDown className={cn("mt-1 size-4 shrink-0 text-muted-foreground transition-transform", expanded && "rotate-180")} /></button>{expanded ? <div className="animate-in fade-in slide-in-from-top-1 px-3 pb-3 pl-[3.75rem] duration-500 [animation-timing-function:var(--ease-panel)]"><p className="text-xs leading-5 text-muted-foreground">{notification.body}</p><ReadSentinel onViewed={onFullyViewed} /></div> : null}</div>;
}

export function ReadSentinel({ onViewed }: { onViewed: () => void }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const viewed = React.useRef(false);
  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !viewed.current) timer = setTimeout(() => { viewed.current = true; onViewed(); }, 650);
      else if (timer) clearTimeout(timer);
    }, { threshold: 1 });
    observer.observe(node);
    return () => { observer.disconnect(); if (timer) clearTimeout(timer); };
  }, [onViewed]);
  return <span ref={ref} aria-hidden="true" className="mt-2 block h-px w-full" />;
}
