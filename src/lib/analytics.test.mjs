import { describe, expect, test } from "bun:test";
import { generateAccountAnalytics } from "./analytics.ts";

const fixture = (overrides = {}) => ({
  slug: "operation-test",
  kind: "payment",
  title: "Покупка",
  subtitle: "Тест",
  amount: -1_000,
  fee: 0,
  status: "completed",
  createdAt: "2026-08-05T12:00:00.000Z",
  source: "Карта",
  recipient: "Магазин",
  currency: "RUB",
  details: { Категория: "Покупки" },
  ...overrides,
});

describe("generateAccountAnalytics", () => {
  test("counts only completed cashflow and keeps pending/rejected metadata", () => {
    const result = generateAccountAnalytics([
      fixture({ amount: 12_000 }),
      fixture({ slug: "expense", amount: -3_000, fee: 75 }),
      fixture({ slug: "pending", amount: -5_000, status: "processing" }),
      fixture({ slug: "failed", amount: -7_000, status: "failed", rejectionReason: "Отклонено" }),
    ], 100_000);

    expect(result.income).toBe(12_000);
    expect(result.expense).toBe(3_000);
    expect(result.netCashflow).toBe(9_000);
    expect(result.fees).toBe(75);
    expect(result.pendingAmount).toBe(5_000);
    expect(result.rejectedCount).toBe(1);
  });

  test("builds sorted category shares", () => {
    const result = generateAccountAnalytics([
      fixture({ slug: "food", amount: -4_000, details: { Категория: "Еда" } }),
      fixture({ slug: "taxi", amount: -1_000, details: { Категория: "Транспорт" } }),
    ], 20_000);

    expect(result.categories[0]).toMatchObject({ name: "Еда", value: 4_000, share: 80 });
    expect(result.categories[1]).toMatchObject({ name: "Транспорт", value: 1_000, share: 20 });
  });
});
