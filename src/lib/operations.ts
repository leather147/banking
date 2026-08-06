"use client";

import type { Route } from "next";
import { useMemo } from "react";
import { z } from "zod";
import { getCookie, setCookie, useCookieState } from "@/lib/cookies";
import { transactions } from "@/lib/data";
import type { Transaction, TransactionCategory } from "@/types";

export const operationKindSchema = z.enum(["transfer", "top-up", "payment"]);
export const operationStatusSchema = z.enum(["completed", "processing", "failed"]);
export const operationSchema = z.object({
  slug: z.string().min(3),
  kind: operationKindSchema,
  title: z.string(),
  subtitle: z.string(),
  amount: z.number(),
  fee: z.number(),
  status: operationStatusSchema,
  createdAt: z.string(),
  source: z.string(),
  recipient: z.string(),
  rejectionReason: z.string().optional(),
  scheduledAt: z.string().optional(),
  currency: z.string().default("RUB"),
  exchangeRate: z.number().positive().optional(),
  legalReference: z.string().optional(),
  details: z.record(z.string(), z.string()),
});

export const operationArraySchema = z.array(operationSchema);
const operationIndexSchema = z.array(z.string());
export type OperationKind = z.infer<typeof operationKindSchema>;
export type OperationStatus = z.infer<typeof operationStatusSchema>;
export type OperationRecord = z.infer<typeof operationSchema>;
export type OperationInput = z.input<typeof operationSchema>;
export const OPERATIONS_COOKIE = "lumen-operation-index";
const OPERATION_COOKIE_PREFIX = "lumen-operation-";

const kindRoute: Record<OperationKind, string> = { transfer: "transfers", "top-up": "top-up", payment: "payments" };
const kindCategory: Record<OperationKind, TransactionCategory> = { transfer: "Переводы", "top-up": "Переводы", payment: "Подписки" };

export const defaultOperations: OperationRecord[] = transactions.map((transaction) => ({
  slug: transaction.id,
  kind: transaction.category === "Переводы" ? "transfer" : "payment",
  title: transaction.title,
  subtitle: transaction.subtitle,
  amount: transaction.amount,
  fee: 0,
  status: transaction.status === "Выполнено" ? "completed" : transaction.status === "Отклонено" ? "failed" : "processing",
  createdAt: `${transaction.date}T12:00:00.000Z`,
  source: transaction.amount > 0 ? "Внешнее поступление" : "Основная карта •• 0932",
  recipient: transaction.title,
  rejectionReason: transaction.status === "Отклонено" ? "Банк получателя отклонил операцию: реквизиты недоступны для зачисления." : undefined,
  currency: "RUB",
  legalReference: "Правила дистанционного банковского обслуживания, раздел 5",
  details: { Категория: transaction.category, Описание: transaction.subtitle },
}));

export function generateOperationSlug(kind: OperationKind) {
  const time = Date.now().toString(36);
  const random = globalThis.crypto?.randomUUID?.().replaceAll("-", "").slice(0, 7) ?? Math.random().toString(36).slice(2, 9);
  return `${kind}-${time}-${random}`;
}

export function createOperationPath(kind: OperationKind, slug = generateOperationSlug(kind)) {
  return `/${kindRoute[kind]}/${slug}` as Route;
}

export function operationDetailsPath(slug: string) {
  return `/operations/${slug}` as Route;
}

export function readStoredOperations() {
  const rawIndex = getCookie(OPERATIONS_COOKIE);
  if (!rawIndex) return defaultOperations;
  try {
    const index = operationIndexSchema.safeParse(JSON.parse(rawIndex));
    if (!index.success) return defaultOperations;
    // The index stays small; every operation gets its own cookie so one large
    // history payload cannot invalidate all recent receipts at the 4 KB limit.
    const stored = index.data.flatMap((slug) => {
      const rawOperation = getCookie(`${OPERATION_COOKIE_PREFIX}${slug}`);
      if (!rawOperation) return [];
      try {
        const parsed = operationSchema.safeParse(JSON.parse(rawOperation));
        return parsed.success ? [parsed.data] : [];
      } catch {
        return [];
      }
    });
    const storedSlugs = new Set(stored.map((operation) => operation.slug));
    // Fixtures remain visible behind user-created records, but a matching slug
    // is never duplicated. This keeps the demo useful after partial cookie loss.
    return [...stored, ...defaultOperations.filter((operation) => !storedSlugs.has(operation.slug))];
  } catch {
    return defaultOperations;
  }
}

export function saveOperation(input: OperationInput) {
  const operation = operationSchema.parse(input);
  setCookie(`${OPERATION_COOKIE_PREFIX}${operation.slug}`, operation);
  const rawIndex = getCookie(OPERATIONS_COOKIE);
  let current: string[] = [];
  if (rawIndex) {
    try {
      const parsed = operationIndexSchema.safeParse(JSON.parse(rawIndex));
      if (parsed.success) current = parsed.data;
    } catch {
      current = [];
    }
  }
  setCookie(OPERATIONS_COOKIE, [operation.slug, ...current.filter((slug) => slug !== operation.slug)].slice(0, 24));
  return operation;
}

export function findOperation(slug: string, operations = readStoredOperations()) {
  return operations.find((operation) => operation.slug === slug);
}

export function useOperations() {
  const [index, setIndex, hydrated] = useCookieState(OPERATIONS_COOKIE, operationIndexSchema, []);
  const operations = useMemo(() => {
    if (!hydrated || index.length === 0) return defaultOperations;
    return readStoredOperations();
  }, [hydrated, index]);
  return [operations, setIndex, hydrated] as const;
}

export function operationToTransaction(operation: OperationRecord): Transaction {
  const storedCategory = operation.details["Категория"];
  return {
    id: operation.slug,
    title: operation.title,
    subtitle: operation.subtitle,
    amount: operation.amount,
    category: storedCategory ? storedCategory as TransactionCategory : kindCategory[operation.kind],
    date: operation.createdAt.slice(0, 10),
    status: operation.status === "completed" ? "Выполнено" : operation.status === "failed" ? "Отклонено" : "В обработке",
  };
}

export function operationKindLabel(kind: OperationKind) {
  return kind === "transfer" ? "Перевод" : kind === "top-up" ? "Пополнение" : "Платёж";
}
