"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCookieState } from "@/lib/cookies";
import { contactsSchema, documentsSchema, personalSchema, type ContactsValues, type DocumentsValues, type PersonalValues } from "@/lib/schemas";

const personalDefaults: PersonalValues = { firstName: "Алексей", lastName: "Лебедев", birthDate: "1992-06-14", city: "Москва" };
const contactsDefaults: ContactsValues = { email: "alexey@lumen.demo", phone: "+7 999 210-18-42", telegram: "@alexey_l" };
const documentsDefaults: DocumentsValues = { passport: "4512 670842", issuedBy: "ГУ МВД России по г. Москве", issueDate: "2018-07-20" };

export function ProfileForm({ section }: { section: "personal" | "contacts" | "documents" }) {
  if (section === "contacts") return <ContactsForm />;
  if (section === "documents") return <DocumentsForm />;
  return <PersonalForm />;
}

function PersonalForm() {
  const [saved, setSaved, hydrated] = useCookieState("lumen-profile-personal", personalSchema, personalDefaults);
  const form = useForm<PersonalValues>({ resolver: zodResolver(personalSchema), defaultValues: personalDefaults });
  React.useEffect(() => { if (hydrated) form.reset(saved); }, [form, hydrated, saved]);
  return <ProfileCard title="Личные данные" description="Используются только внутри этой демонстрации."><form onSubmit={form.handleSubmit((values) => { setSaved(values); toast.success("Личные данные сохранены в cookie"); })} className="grid gap-4 sm:grid-cols-2"><Field label="Имя" error={form.formState.errors.firstName?.message}><Input {...form.register("firstName")} /></Field><Field label="Фамилия" error={form.formState.errors.lastName?.message}><Input {...form.register("lastName")} /></Field><Field label="Дата рождения" error={form.formState.errors.birthDate?.message}><Input type="date" {...form.register("birthDate")} /></Field><Field label="Город" error={form.formState.errors.city?.message}><Input {...form.register("city")} /></Field><Save /></form></ProfileCard>;
}

function ContactsForm() {
  const [saved, setSaved, hydrated] = useCookieState("lumen-profile-contacts", contactsSchema, contactsDefaults);
  const form = useForm<ContactsValues>({ resolver: zodResolver(contactsSchema), defaultValues: contactsDefaults });
  React.useEffect(() => { if (hydrated) form.reset(saved); }, [form, hydrated, saved]);
  return <ProfileCard title="Контакты" description="На эти контакты приходили бы банковские уведомления."><form onSubmit={form.handleSubmit((values) => { setSaved(values); toast.success("Контакты сохранены в cookie"); })} className="space-y-4"><Field label="Email" error={form.formState.errors.email?.message}><Input type="email" {...form.register("email")} /></Field><Field label="Телефон" error={form.formState.errors.phone?.message}><Input inputMode="tel" {...form.register("phone")} /></Field><Field label="Telegram" error={form.formState.errors.telegram?.message}><Input {...form.register("telegram")} /></Field><Save /></form></ProfileCard>;
}

function DocumentsForm() {
  const [saved, setSaved, hydrated] = useCookieState("lumen-profile-documents", documentsSchema, documentsDefaults);
  const form = useForm<DocumentsValues>({ resolver: zodResolver(documentsSchema), defaultValues: documentsDefaults });
  React.useEffect(() => { if (hydrated) form.reset(saved); }, [form, hydrated, saved]);
  return <ProfileCard title="Документы" description="Демонстрационные значения. Не вводите реальные паспортные данные."><form onSubmit={form.handleSubmit((values) => { setSaved(values); toast.success("Данные документа сохранены в cookie"); })} className="space-y-4"><Field label="Серия и номер" error={form.formState.errors.passport?.message}><Input inputMode="numeric" {...form.register("passport")} /></Field><Field label="Кем выдан" error={form.formState.errors.issuedBy?.message}><Input {...form.register("issuedBy")} /></Field><Field label="Дата выдачи" error={form.formState.errors.issueDate?.message}><Input type="date" {...form.register("issueDate")} /></Field><Save /></form></ProfileCard>;
}

function ProfileCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <Card><CardHeader><CardTitle>{title}</CardTitle><p className="text-sm text-muted-foreground">{description}</p></CardHeader><CardContent>{children}</CardContent></Card>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  const id = React.useId();
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label>{React.isValidElement(children) ? React.cloneElement(children as React.ReactElement<{ id?: string }>, { id }) : children}{error ? <p className="text-xs text-destructive">{error}</p> : null}</div>;
}

function Save() { return <div className="pt-2 sm:col-span-2"><Button type="submit">Сохранить изменения</Button></div>; }
