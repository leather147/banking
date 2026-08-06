import Link from "next/link";
import { ArrowUpRight, CalendarDays, Home, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const payments = [
  { title: "Домашний интернет", date: "9 августа", amount: "890 ₽", icon: Home },
  { title: "Мобильная связь", date: "12 августа", amount: "650 ₽", icon: Smartphone },
];

export function UpcomingPayments() {
  return <Card className="h-full"><CardHeader className="flex-row items-center justify-between"><div><p className="text-xs text-muted-foreground">Календарь</p><CardTitle className="mt-1">Предстоящие платежи</CardTitle></div><Link href="/payments" className="rounded-lg p-2 text-muted-foreground outline-none transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring"><ArrowUpRight className="size-4" /></Link></CardHeader><CardContent className="space-y-2 pt-2">{payments.map(({ title, date, amount, icon: Icon }) => <div key={title} className="flex items-center gap-3 rounded-xl bg-background/35 p-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary"><Icon className="size-4 text-primary" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{title}</span><span className="block text-xs text-muted-foreground">{date}</span></span><span className="text-sm font-medium">{amount}</span></div>)}<div className="flex items-center gap-2 pt-2 text-[11px] text-muted-foreground"><CalendarDays className="size-3.5 text-primary" />Автоплатежи можно изменить перед списанием</div></CardContent></Card>;
}
