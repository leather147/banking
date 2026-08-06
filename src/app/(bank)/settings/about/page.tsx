import { Boxes, Cpu, Landmark, ShieldCheck } from "lucide-react";
import { PageHeading } from "@/components/shared/page-heading";
import { PersonalizedBankText } from "@/components/shared/personalized-bank-text";
import { SettingsShell } from "@/components/settings/settings-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const facts = [
  { icon: Landmark, label: "Приложение", value: <PersonalizedBankText after=" Banking Web App" /> },
  { icon: Cpu, label: "Платформа", value: "Next.js 16 · React 19 · TypeScript" },
  { icon: Boxes, label: "UI-система", value: "Radix UI · Tailwind CSS · Motion" },
  { icon: ShieldCheck, label: "Данные демо", value: "Хранятся локально в cookie браузера" },
];

export default function AboutPage() {
  return <><PageHeading title="О приложении" description="Техническая информация о демонстрационной банковской оболочке." /><SettingsShell><Card><CardHeader><CardTitle>Сведения о сборке</CardTitle><p className="text-sm text-muted-foreground">Интерфейс реализован как App Router web app с навигацией без полной перезагрузки.</p></CardHeader><CardContent className="divide-y pt-1">{facts.map(({ icon: Icon, label, value }) => <div key={label} className="flex items-center gap-3 py-4"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary"><Icon className="size-4 text-primary" /></span><span className="min-w-0"><span className="block text-xs text-muted-foreground">{label}</span><span className="block text-sm font-medium">{value}</span></span></div>)}</CardContent></Card></SettingsShell></>;
}
