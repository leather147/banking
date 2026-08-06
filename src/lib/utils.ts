import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);

export const formatCompactCurrency = (value: number) =>
  new Intl.NumberFormat("ru-RU", {
    notation: "compact",
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 1,
  }).format(value);
