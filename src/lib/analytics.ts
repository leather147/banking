import type { OperationRecord } from "@/lib/operations";

export type AnalyticsCategory = {
  name: string;
  value: number;
  share: number;
};

export type AnalyticsMonth = {
  key: string;
  label: string;
  income: number;
  expense: number;
};

export type AccountAnalytics = {
  income: number;
  expense: number;
  netCashflow: number;
  fees: number;
  averageDailyExpense: number;
  medianExpense: number;
  projectedBalance30d: number;
  savingsRate: number;
  healthScore: number;
  expenseChange: number;
  pendingAmount: number;
  rejectedCount: number;
  recurringCount: number;
  anomalyCount: number;
  categories: AnalyticsCategory[];
  months: AnalyticsMonth[];
};

const DAY_MS = 86_400_000;
const OPERATION_KIND_LABELS: Record<OperationRecord["kind"], string> = {
  transfer: "Переводы",
  payment: "Платежи и услуги",
  "top-up": "Пополнения",
};

function sum(values: readonly number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function median(values: readonly number[]) {
  if (values.length === 0) return 0;
  const sorted = values.toSorted((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function percentChange(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function monthKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function shiftUtcMonth(date: Date, delta: number) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + delta, 1));
}

/**
 * Produces deterministic, presentation-independent account analytics. Keeping
 * this module free of React and browser state lets the same calculations power
 * exports, tests and a future native client without drifting formulas.
 */
export function generateAccountAnalytics(operations: readonly OperationRecord[], currentBalance: number): AccountAnalytics {
  const validDates = operations.map((operation) => new Date(operation.createdAt)).filter((date) => !Number.isNaN(date.getTime()));
  const referenceDate = validDates.length ? new Date(Math.max(...validDates.map((date) => date.getTime()))) : new Date();
  const completed = operations.filter((operation) => operation.status === "completed");
  const incomeOperations = completed.filter((operation) => operation.amount > 0);
  const expenseOperations = completed.filter((operation) => operation.amount < 0);
  const expenseValues = expenseOperations.map((operation) => Math.abs(operation.amount));
  const income = sum(incomeOperations.map((operation) => operation.amount));
  const expense = sum(expenseValues);
  const netCashflow = income - expense;
  const fees = sum(completed.map((operation) => operation.fee));
  const oldestDate = validDates.length ? Math.min(...validDates.map((date) => date.getTime())) : referenceDate.getTime();
  const observedDays = Math.max(1, Math.ceil((referenceDate.getTime() - oldestDate) / DAY_MS) + 1);
  const averageDailyExpense = expense / observedDays;
  const medianExpense = median(expenseValues);
  const projectedBalance30d = currentBalance + (netCashflow / observedDays) * 30;
  const savingsRate = income > 0 ? (netCashflow / income) * 100 : 0;

  const latestWindowStart = referenceDate.getTime() - 30 * DAY_MS;
  const previousWindowStart = latestWindowStart - 30 * DAY_MS;
  const latestExpense = sum(expenseOperations.filter((operation) => new Date(operation.createdAt).getTime() >= latestWindowStart).map((operation) => Math.abs(operation.amount)));
  const previousExpense = sum(expenseOperations.filter((operation) => {
    const timestamp = new Date(operation.createdAt).getTime();
    return timestamp >= previousWindowStart && timestamp < latestWindowStart;
  }).map((operation) => Math.abs(operation.amount)));
  const expenseChange = percentChange(latestExpense, previousExpense);

  const categoryTotals = new Map<string, number>();
  for (const operation of expenseOperations) {
    const category = operation.details["Категория"] ?? OPERATION_KIND_LABELS[operation.kind];
    categoryTotals.set(category, (categoryTotals.get(category) ?? 0) + Math.abs(operation.amount));
  }
  const categories = [...categoryTotals]
    .map(([name, value]) => ({ name, value, share: expense > 0 ? (value / expense) * 100 : 0 }))
    .toSorted((a, b) => b.value - a.value);

  const recurringKeys = new Map<string, number>();
  for (const operation of expenseOperations) {
    const key = `${operation.title.toLocaleLowerCase("ru-RU")}:${Math.round(Math.abs(operation.amount) / 50) * 50}`;
    recurringKeys.set(key, (recurringKeys.get(key) ?? 0) + 1);
  }
  const recurringCount = [...recurringKeys.values()].filter((count) => count > 1).length;
  const anomalyThreshold = medianExpense > 0 ? medianExpense * 2.5 : Number.POSITIVE_INFINITY;
  const anomalyCount = expenseValues.filter((value) => value > anomalyThreshold).length;

  const months = Array.from({ length: 6 }, (_, index) => shiftUtcMonth(referenceDate, index - 5)).map((date) => {
    const key = monthKey(date);
    const entries = completed.filter((operation) => monthKey(new Date(operation.createdAt)) === key);
    return {
      key,
      label: date.toLocaleDateString("ru-RU", { month: "short", timeZone: "UTC" }).replace(".", ""),
      income: sum(entries.filter((operation) => operation.amount > 0).map((operation) => operation.amount)),
      expense: sum(entries.filter((operation) => operation.amount < 0).map((operation) => Math.abs(operation.amount))),
    };
  });

  const healthScore = Math.round(clamp(52 + clamp(savingsRate, -30, 45) * 0.7 - Math.max(0, expenseChange) * 0.12 - anomalyCount * 3 - fees / 2_000, 0, 100));

  return {
    income,
    expense,
    netCashflow,
    fees,
    averageDailyExpense,
    medianExpense,
    projectedBalance30d,
    savingsRate,
    healthScore,
    expenseChange,
    pendingAmount: sum(operations.filter((operation) => operation.status === "processing").map((operation) => Math.abs(operation.amount))),
    rejectedCount: operations.filter((operation) => operation.status === "failed").length,
    recurringCount,
    anomalyCount,
    categories,
    months,
  };
}
