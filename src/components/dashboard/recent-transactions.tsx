"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionRow } from "@/components/shared/transaction-row";
import { operationDetailsPath, operationToTransaction, useOperations } from "@/lib/operations";

export function RecentTransactions() {
  const [operations, , hydrated] = useOperations();
  const recent = operations.slice(0, 6);
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between"><div><p className="text-xs text-muted-foreground">Последняя активность</p><CardTitle className="mt-1">История операций</CardTitle></div><Link href="/history" className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground">Все операции<ArrowUpRight className="size-3" /></Link></CardHeader>
      <CardContent className="divide-y pt-1">
        {!hydrated ? Array.from({ length: 4 }, (_, index) => <div key={index} className="flex items-center gap-3 py-3.5"><Skeleton className="size-10 rounded-xl" /><div className="flex-1 space-y-2"><Skeleton className="h-3 w-36" /><Skeleton className="h-2.5 w-52" /></div><Skeleton className="h-4 w-20" /></div>) : recent.map((operation) => (
          <Link key={operation.slug} href={operationDetailsPath(operation.slug)} className="block rounded-xl px-1 outline-none transition-colors hover:bg-secondary/35 focus-visible:ring-2 focus-visible:ring-ring">
            <TransactionRow transaction={operationToTransaction(operation)} />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
