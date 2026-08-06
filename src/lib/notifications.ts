import { z } from "zod";

export const readNotificationsSchema = z.array(z.string()).default([]);
export const READ_NOTIFICATIONS_COOKIE = "lumen-read-notifications";

export const APP_NOTIFICATIONS = [
  {
    id: "session-security",
    type: "security",
    title: "Безопасность аккаунта",
    summary: "Новых входов не обнаружено.",
    time: "Сейчас",
    body: "Мы завершили автоматическую проверку активных устройств, региона входа и последних действий. Подозрительных авторизаций и изменений реквизитов не обнаружено. Если вы не узнаёте какое-либо устройство, завершите его сеанс в разделе «Настройки → Устройства» и обновите параметры быстрого входа.",
  },
  {
    id: "fee-free-top-up",
    type: "offer",
    title: "Пополнение доступно без комиссии",
    summary: "До 300 000 ₽ с карты другого банка.",
    time: "Сегодня",
    body: "Пополняйте основной счёт с карты другого российского банка без комиссии со стороны нашего банка. Банк-эмитент может применять собственные условия. Перед подтверждением мы покажем итоговую сумму, лимит и источник пополнения.",
  },
  {
    id: "services-online",
    type: "system",
    title: "Операции выполняются штатно",
    summary: "Все банковские сервисы доступны.",
    time: "Вчера",
    body: "Переводы, платежи, пополнения, история и аналитика работают в штатном режиме. Регламентных работ в ближайшее время не запланировано. Статус ключевых сервисов также виден в расширенной верхней панели на широких экранах.",
  },
] as const;

export type AppNotification = (typeof APP_NOTIFICATIONS)[number];

export function getNotification(id: string) {
  return APP_NOTIFICATIONS.find((notification) => notification.id === id);
}
