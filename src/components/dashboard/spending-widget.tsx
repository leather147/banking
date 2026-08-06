import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const categories = [
  { name: "Супермаркеты", value: 34200, percent: 71, color: "bg-chart-1" },
  { name: "Переводы", value: 24800, percent: 52, color: "bg-chart-2" },
  { name: "Транспорт", value: 12600, percent: 26, color: "bg-chart-3" },
];

export function SpendingWidget() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between"><div><p className="text-xs text-muted-foreground">Август</p><CardTitle className="mt-1">Расходы по категориям</CardTitle></div><Link href="/analytics" className="rounded-lg p-2 text-muted-foreground outline-none hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"><ArrowUpRight className="size-4" /><span className="sr-only">Открыть аналитику</span></Link></CardHeader>
      <CardContent className="space-y-5 pt-3">
        {categories.map((category) => <div key={category.name}><div className="mb-2 flex items-center justify-between text-sm"><span>{category.name}</span><span className="font-mono text-xs text-muted-foreground">{category.value.toLocaleString("ru-RU")} ₽</span></div><Progress value={category.percent} indicatorClassName={category.color} /></div>)}
      </CardContent>
    </Card>
  );
}
