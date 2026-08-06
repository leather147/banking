import { ArrowDownRight, ArrowUpRight, CalendarClock, CircleDollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";

const metrics = [
  { label: "Поступления", value: "+184 200 ₽", note: "+12% к июлю", icon: ArrowUpRight, accent: true },
  { label: "Расходы", value: "−96 480 ₽", note: "На 8 120 ₽ меньше", icon: ArrowDownRight },
  { label: "Свободно до 31 августа", value: "87 720 ₽", note: "3 366 ₽ в день", icon: CalendarClock },
];

export function FinancialPulse() {
  return <div className="grid gap-3 sm:grid-cols-3">{metrics.map(({ label, value, note, icon: Icon, accent }) => <Card key={label} className="flex min-w-0 items-center gap-3 p-4"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">{accent ? <CircleDollarSign className="size-4" /> : <Icon className="size-4" />}</span><span className="min-w-0"><span className="block truncate text-xs text-muted-foreground">{label}</span><span className="mt-0.5 block truncate text-base font-semibold">{value}</span><span className="mt-0.5 block truncate text-[10px] text-muted-foreground">{note}</span></span></Card>)}</div>;
}
