import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return <main className="app-grid grid min-h-screen place-items-center p-4"><Card className="metric-glow w-full max-w-lg p-8 text-center"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/15 text-primary"><Compass /></span><p className="mt-6 font-mono text-xs uppercase tracking-[.2em] text-primary">Ошибка 404</p><h1 className="mt-3 text-3xl font-semibold">Такого экрана нет</h1><p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">Возможно, адрес изменился. Вернитесь на главную страницу банка.</p><Button asChild className="mt-6"><Link href="/"><ArrowLeft />На главную</Link></Button></Card></main>;
}
