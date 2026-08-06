"use client";

import Link from "next/link";
import { AlertTriangle, CheckCircle2, Download, MessageCircleQuestion } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/components/providers/i18n-provider";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { PageHeading } from "@/components/shared/page-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { findLegalDocument } from "@/lib/legal";
import { getLegalContent } from "@/lib/legal-content";

export function LegalDocumentScreen({ slug }: { slug: string }) {
  const { t } = useI18n();
  const { settings } = usePersonalization();
  const document = findLegalDocument(slug);
  if (!document) return <Card className="p-6"><p className="font-bold">{t("legal.notFound", "Документ не найден")}</p></Card>;
  const Icon = document.icon;
  const sections = getLegalContent(slug);
  function downloadDocument() {
    const title = t(document!.titleKey);
    const body = sections.map((section) => `${section.title}\n${section.paragraphs.join("\n\n")}${section.clauses?.length ? `\n\n${section.clauses.map((clause) => `• ${clause}`).join("\n")}` : ""}`).join("\n\n");
    const blob = new Blob([`${title}\nРедакция: ${document!.updated}\n\n${body}\n\nДемонстрационный материал. Не является публичной офертой.`], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = window.document.createElement("a");
    anchor.href = url;
    anchor.download = `${slug}-${document!.updated.replaceAll(".", "-")}.txt`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
    toast.success(t("legal.download.ready", "Демо-копия подготовлена"));
  }
  return <>
    <PageHeading eyebrow={t("legal.document.eyebrow", "Юридический документ")} title={t(document.titleKey)} description={t(document.summaryKey)} actions={<Button variant="outline" onClick={downloadDocument}><Download />{t("legal.download", "Скачать")}</Button>} />
    <Card className="mb-4 overflow-hidden"><CardHeader className="border-b bg-secondary/25"><div className="flex items-start gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary"><Icon className="size-5" /></span><div><CardTitle>{t(document.titleKey)}</CardTitle><p className="mt-1 font-mono text-[10px] text-muted-foreground">{t("legal.updated", "Обновлено")} · {document.updated} · v1.0</p></div></div></CardHeader><CardContent className="space-y-8 pt-6">{sections.map((section) => <section key={section.title}><h2 className="text-lg font-bold">{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-2 text-sm leading-7 text-muted-foreground">{paragraph.replaceAll("Lumen Bank", settings.brandName)}</p>)}{section.clauses?.length ? <ul className="mt-4 grid gap-2 sm:grid-cols-2">{section.clauses.map((clause) => <li key={clause} className="rounded-xl border bg-background/38 p-3 text-xs leading-5"><CheckCircle2 className="mr-2 inline size-3.5 text-primary" />{clause}</li>)}</ul> : null}</section>)}<div className="rounded-2xl border border-primary/15 bg-primary/6 p-4"><p className="flex items-center gap-2 text-sm font-bold"><AlertTriangle className="size-4 text-primary" />{t("legal.demo.title", "Демонстрационный материал")}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{t("legal.demo.description", "Страница создана для демонстрации интерфейса. Она не подтверждает наличие банковской лицензии и не заменяет официальный договор.")}</p></div></CardContent></Card>
    <div className="grid gap-3 sm:grid-cols-2"><Link href="/settings/legal" className="flex min-h-16 items-center gap-3 rounded-2xl border bg-card p-4 outline-none transition-colors hover:bg-secondary/45 focus-visible:ring-2 focus-visible:ring-ring"><CheckCircle2 className="size-5 text-primary" /><span className="font-bold">{t("legal.allDocuments", "Все документы")}</span></Link><Link href="/support" className="flex min-h-16 items-center gap-3 rounded-2xl border bg-card p-4 outline-none transition-colors hover:bg-secondary/45 focus-visible:ring-2 focus-visible:ring-ring"><MessageCircleQuestion className="size-5 text-primary" /><span className="font-bold">{t("legal.question", "Задать вопрос")}</span></Link></div>
  </>;
}
