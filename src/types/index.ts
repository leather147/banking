export type TransactionCategory =
  | "Переводы"
  | "Супермаркеты"
  | "Транспорт"
  | "Подписки"
  | "Рестораны"
  | "Зарплата";

export type Transaction = {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  category: TransactionCategory;
  date: string;
  status: "Выполнено" | "В обработке" | "Отклонено";
};

export type Theme = "light" | "dark";
export type CookieValue = string | number | boolean;
