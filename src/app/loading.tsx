import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return <div className="min-h-screen bg-background p-5 lg:pl-[268px]"><div className="mx-auto max-w-[1400px] space-y-5"><Skeleton className="h-12 w-64" /><div className="grid gap-4 xl:grid-cols-[1.6fr_.8fr]"><Skeleton className="h-[360px]" /><Skeleton className="h-[360px]" /></div><div className="grid gap-4 lg:grid-cols-2"><Skeleton className="h-80" /><Skeleton className="h-80" /></div></div></div>;
}
