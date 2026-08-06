import { Plane, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const goals = [
  { title: "Путешествие", current: "168 000 ₽", target: "240 000 ₽", progress: 70, icon: Plane },
  { title: "Финансовая подушка", current: "310 000 ₽", target: "500 000 ₽", progress: 62, icon: ShieldCheck },
];

export function SavingsGoals() {
  return <Card><CardHeader><p className="text-xs text-muted-foreground">Накопления</p><CardTitle>Цели без лишнего шума</CardTitle></CardHeader><CardContent className="grid gap-4 pt-2 md:grid-cols-2">{goals.map(({ title, current, target, progress, icon: Icon }) => <div key={title} className="rounded-2xl border bg-background/30 p-4"><div className="mb-4 flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-primary/12 text-primary"><Icon className="size-4" /></span><div className="min-w-0"><p className="truncate text-sm font-medium">{title}</p><p className="text-xs text-muted-foreground">{current} из {target}</p></div><span className="ml-auto font-mono text-xs">{progress}%</span></div><Progress value={progress} /></div>)}</CardContent></Card>;
}
