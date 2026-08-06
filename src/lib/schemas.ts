import { z } from "zod";

export const personalSchema = z.object({
  firstName: z.string().min(2, "Введите имя"),
  lastName: z.string().min(2, "Введите фамилию"),
  birthDate: z.string().min(1, "Укажите дату рождения"),
  city: z.string().min(2, "Укажите город"),
});

export const contactsSchema = z.object({
  email: z.email("Введите корректный email"),
  phone: z.string().min(10, "Введите номер телефона"),
  telegram: z.string().optional(),
});

export const documentsSchema = z.object({
  passport: z.string().regex(/^\d{4}\s?\d{6}$/, "Формат: 0000 000000"),
  issuedBy: z.string().min(5, "Укажите кем выдан документ"),
  issueDate: z.string().min(1, "Укажите дату выдачи"),
});

export const preferenceSchema = z.record(z.string(), z.union([z.boolean(), z.string(), z.number()]));

export const singleCardControlSchema = z.object({
  frozen: z.boolean(),
  online: z.boolean(),
  contactless: z.boolean(),
  international: z.boolean(),
  cashWithdrawal: z.boolean(),
  magneticStripe: z.boolean(),
  subscriptions: z.boolean(),
  transferReceive: z.boolean(),
  dailyLimit: z.number().min(1000).max(1000000),
  cashLimit: z.number().min(0).max(500000),
  cardName: z.string().min(2).max(24),
  style: z.enum(["prism", "aurora", "graphite"]),
});

export const cardControlsSchema = z.record(z.string(), singleCardControlSchema);
export const cardControlSchema = singleCardControlSchema;

export type PersonalValues = z.infer<typeof personalSchema>;
export type ContactsValues = z.infer<typeof contactsSchema>;
export type DocumentsValues = z.infer<typeof documentsSchema>;
