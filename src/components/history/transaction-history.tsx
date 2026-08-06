"use client";

import * as React from "react";
import { CalendarDays, Download, Filter, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransactionRow } from "@/components/shared/transaction-row";
import { operationDetailsPath, operationToTransaction, useOperations } from "@/lib/operations";

export function TransactionHistory() {
  const [operations, , hydrated] = useOperations();
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const [advancedOpen, setAdvancedOpen] = React.useState(false);
  const [period, setPeriod] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [category, setCategory] = React.useState("all");
  const [sort, setSort] = React.useState("newest");
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");
  const deferredQuery = React.useDeferredValue(query);
  const visible = React.useMemo(() => {
    const latest = Math.max(...operations.map((operation) => new Date(operation.createdAt).getTime()));
    const periodDays = period === "7" ? 7 : period === "30" ? 30 : period === "90" ? 90 : null;
    return operations.filter((operation) => {
    const transaction = operationToTransaction(operation);
    const matchesQuery = `${transaction.title} ${transaction.subtitle} ${transaction.category} ${operation.slug}`.toLowerCase().includes(deferredQuery.toLowerCase());
    const matchesFilter = filter === "all" || (filter === "income" ? transaction.amount > 0 : transaction.amount < 0);
    const matchesStatus = status === "all" || operation.status === status;
    const matchesCategory = category === "all" || operation.kind === category;
    const created = new Date(operation.createdAt).getTime();
    const matchesPeriod = periodDays === null || created >= latest - periodDays * 86_400_000;
    const matchesFrom = !fromDate || operation.createdAt.slice(0, 10) >= fromDate;
    const matchesTo = !toDate || operation.createdAt.slice(0, 10) <= toDate;
    return matchesQuery && matchesFilter && matchesStatus && matchesCategory && matchesPeriod && matchesFrom && matchesTo;
  }).sort((a, b) => sort === "oldest" ? a.createdAt.localeCompare(b.createdAt) : sort === "amount-high" ? Math.abs(b.amount) - Math.abs(a.amount) : sort === "amount-low" ? Math.abs(a.amount) - Math.abs(b.amount) : b.createdAt.localeCompare(a.createdAt));
  }, [category, deferredQuery, filter, fromDate, operations, period, sort, status, toDate]);
  const grouped = Object.groupBy(visible, (operation) => operation.createdAt.slice(0, 10));

  return (
    <div className="space-y-4">
      <Card className="p-3 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-10" placeholder="Название, категория, получатель или ID" /></div>
          <Tabs value={filter} onValueChange={setFilter}><TabsList className="w-full lg:w-auto"><TabsTrigger className="flex-1 lg:flex-none" value="all">Все</TabsTrigger><TabsTrigger className="flex-1 lg:flex-none" value="income">Поступления</TabsTrigger><TabsTrigger className="flex-1 lg:flex-none" value="expense">Расходы</TabsTrigger></TabsList></Tabs>
          <Select value={period} onValueChange={setPeriod}><SelectTrigger className="w-full lg:w-36" aria-label="Период операций"><CalendarDays className="size-4" /><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Весь период</SelectItem><SelectItem value="7">7 дней</SelectItem><SelectItem value="30">30 дней</SelectItem><SelectItem value="90">90 дней</SelectItem></SelectContent></Select>
          <Button variant={advancedOpen ? "secondary" : "outline"} aria-expanded={advancedOpen} onClick={() => setAdvancedOpen((value) => !value)}><Filter />Фильтры</Button>
        </div>
        <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${advancedOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}><div className="min-h-0 overflow-hidden"><div className="grid gap-3 border-t pt-4 sm:grid-cols-2 xl:grid-cols-5"><Select value={status} onValueChange={setStatus}><SelectTrigger aria-label="Статус операции"><SelectValue placeholder="Статус" /></SelectTrigger><SelectContent><SelectItem value="all">Все статусы</SelectItem><SelectItem value="completed">Выполнено</SelectItem><SelectItem value="processing">В обработке</SelectItem><SelectItem value="failed">Отклонено</SelectItem></SelectContent></Select><Select value={category} onValueChange={setCategory}><SelectTrigger aria-label="Тип операции"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Все типы</SelectItem><SelectItem value="transfer">Переводы</SelectItem><SelectItem value="top-up">Пополнения</SelectItem><SelectItem value="payment">Платежи</SelectItem></SelectContent></Select><Input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} aria-label="Дата начала" /><Input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} aria-label="Дата окончания" /><Select value={sort} onValueChange={setSort}><SelectTrigger aria-label="Сортировка"><SlidersHorizontal className="size-4" /><SelectValue /></SelectTrigger><SelectContent><SelectItem value="newest">Сначала новые</SelectItem><SelectItem value="oldest">Сначала старые</SelectItem><SelectItem value="amount-high">Сумма: по убыванию</SelectItem><SelectItem value="amount-low">Сумма: по возрастанию</SelectItem></SelectContent></Select></div><Button variant="ghost" size="sm" className="mt-3" onClick={() => { setPeriod("all"); setStatus("all"); setCategory("all"); setSort("newest"); setFromDate(""); setToDate(""); }}><RotateCcw />Сбросить фильтры</Button></div></div>
      </Card>
      <Card>
        <CardContent className="p-4 sm:p-6">
          {!hydrated ? <div className="space-y-4">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-16 w-full rounded-xl" />)}</div> : visible.length === 0 ? (
            <div className="grid min-h-64 place-items-center text-center"><div><Search className="mx-auto mb-3 size-7 text-muted-foreground" /><h2 className="font-medium">Ничего не найдено</h2><p className="mt-1 text-sm text-muted-foreground">Измените запрос или выбранный фильтр.</p></div></div>
          ) : (
            <div className="space-y-6">
              {Object.entries(grouped).map(([date, items]) => items ? (
                <section key={date}>
                  <div className="mb-2 flex items-center justify-between"><h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{new Date(`${date}T12:00:00`).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}</h2><span className="font-mono text-[10px] text-muted-foreground">{items.length} операции</span></div>
                  <div className="divide-y rounded-xl border bg-background/25 px-3 sm:px-4">
                    {items.map((operation) => <Link key={operation.slug} href={operationDetailsPath(operation.slug)} className="block rounded-xl outline-none transition-colors hover:bg-secondary/35 focus-visible:ring-2 focus-visible:ring-ring"><TransactionRow transaction={operationToTransaction(operation)} /></Link>)}
                  </div>
                </section>
              ) : null)}
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-center"><Button variant="ghost" onClick={() => toast.success("Демо-выписка сформирована")}><Download />Скачать выписку</Button></div>
    </div>
  );
}
