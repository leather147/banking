"use client";

import NumberFlow from "@number-flow/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, Check, CheckCircle2, Clock3, Copy, FileCheck2, HelpCircle, Home, Landmark, MessageCircle, ReceiptText, RefreshCw, Scale, ShieldCheck, TimerReset, X } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { OperationReceiptActions } from "@/components/operations/operation-actions";
import { formatRubles } from "@/components/payments/flow-primitives";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { BankPageSkeleton } from "@/components/shared/bank-page-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOTION_EASINGS } from "@/lib/motion";
import { createOperationPath, findOperation, operationKindLabel, type OperationStatus, useOperations } from "@/lib/operations";
import { cn } from "@/lib/utils";

const statusConfig: Record<OperationStatus, { label: string; description: string; icon: typeof Check; hero: string; iconClass: string; badge: "success" | "secondary" | "destructive" }> = {
  completed: { label: "Операция выполнена", description: "Деньги отправлены и учтены в истории", icon: Check, hero: "glow-hero metric-glow border-primary/30", iconClass: "bg-primary text-primary-foreground shadow-[0_0_42px_-10px_var(--glow-lime)]", badge: "success" },
  processing: { label: "Операция обрабатывается", description: "Ожидаем подтверждение платёжной системы", icon: Clock3, hero: "border-foreground/12 bg-secondary/28", iconClass: "bg-secondary text-muted-foreground ring-1 ring-foreground/10", badge: "secondary" },
  failed: { label: "Операция отклонена", description: "Деньги не списаны или будут автоматически возвращены", icon: X, hero: "border-destructive/45 bg-destructive/7 shadow-[0_0_46px_-28px_var(--destructive)]", iconClass: "bg-destructive text-white shadow-[0_0_34px_-12px_var(--destructive)]", badge: "destructive" },
};

export function OperationDetails({ slug }: { slug: string }) {
  const router = useRouter();
  const [operations, , hydrated] = useOperations();
  const { settings } = usePersonalization();
  const operation = findOperation(slug, operations);

  if (!hydrated) return <BankPageSkeleton />;
  if (!operation) return <MissingOperation slug={slug} />;

  const status = statusConfig[operation.status];
  const StatusIcon = status.icon;
  const date = new Date(operation.createdAt).toLocaleString("ru-RU", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const scheduledDate = operation.scheduledAt ? new Date(operation.scheduledAt).toLocaleString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }) : null;
  const details = Object.entries(operation.details);

  return <div className="mx-auto max-w-5xl space-y-4">
    <motion.div initial={{ opacity: 0, y: 7, scale: 0.997 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.52 / settings.motionSpeed, ease: MOTION_EASINGS[settings.easingPanel].value }}>
      <Card className={cn("relative overflow-hidden", status.hero)}>
        <CardContent className="relative z-10 flex flex-col items-center px-5 py-9 text-center sm:px-10">
          <motion.span initial={{ scale: 0.94 }} animate={{ scale: 1 }} transition={{ duration: 0.58 / settings.motionSpeed, ease: MOTION_EASINGS[settings.easingPanel].value }} className={cn("grid size-16 place-items-center rounded-full", status.iconClass)}><StatusIcon className="size-7" /></motion.span>
          <Badge variant={status.badge} className="mt-5">{status.label}</Badge>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">{status.description}</p>
          <p className="mt-5 text-sm text-muted-foreground">{operationKindLabel(operation.kind)}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-[-0.04em] sm:text-3xl">{operation.title}</h1>
          <div className={cn("number-display mt-5 text-4xl font-bold tracking-[-0.05em] sm:text-5xl", operation.status === "failed" && "text-destructive", operation.status === "processing" && "text-foreground/72")}><NumberFlow value={operation.amount} format={{ style: "currency", currency: "RUB", maximumFractionDigits: 0 }} /></div>
          {operation.status === "failed" ? <p className="mt-2 text-sm font-semibold text-destructive">С баланса не списано</p> : null}
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{operation.slug}</p>
        </CardContent>
      </Card>
    </motion.div>

    {operation.status === "failed" ? <Card className="border-destructive/35 bg-destructive/6"><CardContent className="flex gap-3 p-4 sm:p-5"><AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" /><div><h2 className="font-bold text-destructive">Почему операция отклонена</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{operation.rejectionReason ?? "Платёжная система не смогла подтвердить реквизиты получателя."}</p><p className="mt-2 text-xs text-muted-foreground">Проверьте реквизиты, доступный лимит и повторите операцию. При повторном отказе обратитесь в поддержку с ID операции.</p></div></CardContent></Card> : null}

    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><ReceiptText className="size-4 text-primary" />Информация об операции</CardTitle></CardHeader>
        <CardContent className="divide-y pt-1">
          <DetailRow label="Статус" value={status.label} valueClass={operation.status === "failed" ? "text-destructive" : operation.status === "processing" ? "text-muted-foreground" : "text-primary"} />
          <DetailRow label="Дата и время" value={date} />
          {scheduledDate ? <DetailRow label="Дата исполнения" value={scheduledDate} /> : null}
          <DetailRow label="Откуда" value={operation.source} />
          <DetailRow label="Кому" value={operation.recipient} />
          <DetailRow label="Комиссия банка" value={formatRubles(operation.fee)} />
          {operation.exchangeRate ? <DetailRow label="Курс конвертации" value={`1 ${operation.currency} = ${operation.exchangeRate.toLocaleString("ru-RU")} ₽`} /> : null}
          {details.map(([label, value]) => <DetailRow key={label} label={label} value={value} />)}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card><CardHeader><CardTitle>Действия</CardTitle></CardHeader><CardContent className="grid gap-2">
          <Button onClick={() => router.push(createOperationPath(operation.kind))}><RefreshCw />Повторить</Button>
          <OperationReceiptActions operation={operation} statusLabel={status.label} date={date} bankName={settings.brandName} />
          <Button variant="ghost" onClick={() => toast("Чат поддержки открыт как демонстрационная панель")}><MessageCircle />Задать вопрос</Button>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-xs leading-5 text-muted-foreground"><ShieldCheck className="mb-2 size-4 text-primary" />В чеке и при отправке скрываются полные карточные реквизиты. Данные этой демо-операции хранятся только в cookie браузера.</CardContent></Card>
      </div>
    </div>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <InfoTile icon={TimerReset} title="Хронология" value={operation.status === "processing" ? "Ожидает ответа" : operation.status === "failed" ? "Остановлена банком" : "Подтверждена мгновенно"} description={scheduledDate ? `Запланировано на ${scheduledDate}` : "Создана и подписана в приложении"} />
      <InfoTile icon={FileCheck2} title="Документ" value={`Чек ${operation.slug.slice(-8).toUpperCase()}`} description="Доступен для скачивания и отправки" />
      <InfoTile icon={Landmark} title="Платёжная система" value={operation.currency === "RUB" ? "Внутренний контур · ₽" : `Конвертация · ${operation.currency}`} description="Маршрут выбран автоматически" />
      <InfoTile icon={HelpCircle} title="Поддержка" value="24/7 в приложении" description="Сообщите специалисту ID операции" />
    </div>

    <Card className="overflow-hidden">
      <CardHeader><CardTitle className="flex items-center gap-2"><Scale className="size-4 text-primary" />Юридическая информация об операции</CardTitle></CardHeader>
      <CardContent className="grid gap-4 text-sm leading-6 text-muted-foreground md:grid-cols-3">
        <LegalBlock title="Основание обработки">Операция обрабатывается по поручению пользователя в рамках правил дистанционного банковского обслуживания и применимых требований платёжной системы.</LegalBlock>
        <LegalBlock title="Сроки и возврат">Незавершённая операция может обрабатываться до трёх рабочих дней. При окончательном отказе зарезервированная сумма освобождается автоматически.</LegalBlock>
        <LegalBlock title="Оспаривание">Заявление можно подать через поддержку, указав ID и дату. Срок ответа зависит от типа операции и правил банка получателя.</LegalBlock>
        <div className="rounded-2xl border bg-background/35 p-4 md:col-span-3"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Применимый документ</p><p className="mt-2 font-semibold text-foreground">{operation.legalReference ?? "Правила дистанционного банковского обслуживания, разделы 4–7"}</p><p className="mt-1 text-xs">Этот экран демонстрирует интерфейс и не является банковской выпиской, платёжным поручением или подтверждением движения реальных денежных средств.</p><Button asChild variant="ghost" className="mt-2 h-auto p-0 text-primary"><Link href="/settings/legal">Открыть документы банка</Link></Button></div>
      </CardContent>
    </Card>

    <div className="flex flex-wrap justify-center gap-2"><Button asChild variant="ghost"><Link href="/"><Home />На главную</Link></Button><Button variant="ghost" onClick={() => { navigator.clipboard?.writeText(operation.slug); toast.success("ID операции скопирован"); }}><Copy />Скопировать ID</Button></div>
  </div>;
}

function DetailRow({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return <div className="flex items-start justify-between gap-5 py-3.5 text-sm"><span className="text-muted-foreground">{label}</span><span className={cn("max-w-[65%] text-right font-semibold", valueClass)}>{value}</span></div>;
}

function InfoTile({ icon: Icon, title, value, description }: { icon: typeof TimerReset; title: string; value: string; description: string }) {
  return <Card className="h-full"><CardContent className="p-4"><span className="grid size-9 place-items-center rounded-xl bg-primary/12 text-primary"><Icon className="size-4" /></span><p className="mt-4 text-xs text-muted-foreground">{title}</p><p className="mt-1 font-bold">{value}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p></CardContent></Card>;
}

function LegalBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border bg-background/30 p-4"><h3 className="font-bold text-foreground">{title}</h3><p className="mt-2 text-xs leading-5">{children}</p></section>;
}

function MissingOperation({ slug }: { slug: string }) {
  return <Card className="mx-auto max-w-xl"><CardContent className="grid min-h-96 place-items-center p-8 text-center"><div><CheckCircle2 className="mx-auto size-12 text-muted-foreground" /><h1 className="mt-5 text-xl font-semibold">Операция не найдена</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Запись с ID {slug} отсутствует в cookie этого браузера.</p><Button asChild className="mt-5"><Link href="/"><Home />На главную</Link></Button></div></CardContent></Card>;
}
