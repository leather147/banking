"use client";

import * as React from "react";
import { useCookieState } from "@/lib/cookies";
import { APP_NOTIFICATIONS, READ_NOTIFICATIONS_COOKIE, readNotificationsSchema } from "@/lib/notifications";

type NotificationContextValue = {
  unreadCount: number;
  isRead: (id: string) => boolean;
  markRead: (id: string) => void;
};

const NotificationContext = React.createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [readIds, setReadIds] = useCookieState(READ_NOTIFICATIONS_COOKIE, readNotificationsSchema, []);
  const [sessionUnread, setSessionUnread] = React.useState(true);

  const isRead = React.useCallback((id: string) => id === "session-security" ? !sessionUnread : readIds.includes(id), [readIds, sessionUnread]);
  const markRead = React.useCallback((id: string) => {
    if (id === "session-security") setSessionUnread(false);
    setReadIds((current) => current.includes(id) ? current : [...current, id]);
  }, [setReadIds]);
  const unreadCount = APP_NOTIFICATIONS.reduce((count, notification) => count + (isRead(notification.id) ? 0 : 1), 0);
  const value = React.useMemo(() => ({ unreadCount, isRead, markRead }), [isRead, markRead, unreadCount]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = React.useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used inside NotificationProvider");
  return context;
}
