import type { Transaction } from "@/types";

export const transactions: Transaction[] = [
  { id: "tx-101", title: "Перевод от Анны", subtitle: "СБП · +7 999 •• 42", amount: 24500, category: "Переводы", date: "2026-08-05", status: "Выполнено" },
  { id: "tx-102", title: "ВкусВилл", subtitle: "Продукты", amount: -3280, category: "Супермаркеты", date: "2026-08-05", status: "Выполнено" },
  { id: "tx-103", title: "Яндекс Go", subtitle: "Поездка", amount: -890, category: "Транспорт", date: "2026-08-05", status: "Выполнено" },
  { id: "tx-104", title: "Music", subtitle: "Ежемесячная подписка", amount: -299, category: "Подписки", date: "2026-08-04", status: "Выполнено" },
  { id: "tx-105", title: "Кофемания", subtitle: "Рестораны и кафе", amount: -1540, category: "Рестораны", date: "2026-08-04", status: "Выполнено" },
  { id: "tx-106", title: "Зарплата", subtitle: "ООО Северный свет", amount: 210000, category: "Зарплата", date: "2026-08-01", status: "Выполнено" },
  { id: "tx-107", title: "Перевод Илье", subtitle: "По номеру телефона", amount: -7000, category: "Переводы", date: "2026-07-31", status: "В обработке" },
  { id: "tx-108", title: "Metro", subtitle: "Продукты", amount: -5860, category: "Супермаркеты", date: "2026-07-30", status: "Выполнено" },
  { id: "tx-109", title: "Перевод на карту", subtitle: "Банк получателя отклонил перевод", amount: -18500, category: "Переводы", date: "2026-07-29", status: "Отклонено" },
];

export const cashflowData = [
  { month: "Мар", income: 185, expense: 118 },
  { month: "Апр", income: 210, expense: 132 },
  { month: "Май", income: 198, expense: 126 },
  { month: "Июн", income: 245, expense: 149 },
  { month: "Июл", income: 226, expense: 138 },
  { month: "Авг", income: 258, expense: 96 },
];

export const balanceTrend = [
  { day: "30 июл", value: 462 },
  { day: "31 июл", value: 448 },
  { day: "1 авг", value: 646 },
  { day: "2 авг", value: 620 },
  { day: "3 авг", value: 676 },
  { day: "4 авг", value: 662 },
  { day: "5 авг", value: 728 },
];

export const categoryData = [
  { name: "Покупки", value: 34200, color: "var(--chart-1)" },
  { name: "Переводы", value: 24800, color: "var(--chart-2)" },
  { name: "Транспорт", value: 12600, color: "var(--chart-3)" },
  { name: "Подписки", value: 7900, color: "var(--chart-4)" },
];
