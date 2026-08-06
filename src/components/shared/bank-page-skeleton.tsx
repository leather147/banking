import { Skeleton } from "@/components/ui/skeleton";

export function BankPageSkeleton() {
  return (
    <div aria-label="Загрузка раздела" role="status" className="space-y-5">
      <div className="space-y-3"><Skeleton className="h-3 w-36" /><Skeleton className="h-9 w-64" /><Skeleton className="h-4 w-full max-w-xl" /></div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4"><Skeleton className="h-16" /><Skeleton className="h-16" /><Skeleton className="h-16" /><Skeleton className="h-16" /></div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]"><Skeleton className="h-[520px]" /><div className="space-y-4"><Skeleton className="h-64" /><Skeleton className="h-48" /></div></div>
      <span className="sr-only">Контент загружается</span>
    </div>
  );
}
