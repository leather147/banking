"use client";

import Link from "next/link";
import * as React from "react";
import { Braces, CheckCircle2, Hammer } from "lucide-react";
import { toast } from "sonner";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const REQUIRED_TAPS = 7;

export function AboutBuildCard() {
  const { settings, setSetting } = usePersonalization();
  const taps = React.useRef(0);
  const resetTimer = React.useRef<number | null>(null);

  React.useEffect(() => () => {
    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
  }, []);

  function registerTap() {
    if (settings.developerMode) {
      toast.info("Режим разработчика уже включён");
      return;
    }
    taps.current += 1;
    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => { taps.current = 0; }, 2_500);
    const remaining = REQUIRED_TAPS - taps.current;
    if (remaining <= 0) {
      setSetting("developerMode", true);
      taps.current = 0;
      toast.success("Настройки разработчика разблокированы");
      return;
    }
    if (remaining <= 4) toast.message(`Ещё ${remaining} ${remaining === 1 ? "нажатие" : "нажатия"} до режима разработчика`);
  }

  return <Card className={settings.developerMode ? "border-primary/30 bg-primary/[0.045]" : undefined}>
    <CardHeader><CardTitle className="flex items-center gap-2"><Hammer className="size-5 text-primary" />Номер сборки</CardTitle><p className="text-sm text-muted-foreground">Многократное нажатие работает мышью, клавиатурой и касанием.</p></CardHeader>
    <CardContent>
      <button type="button" onClick={registerTap} className="flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-2xl border bg-background/45 px-4 text-left outline-none transition-[border-color,background-color] hover:border-primary/28 hover:bg-secondary/35 focus-visible:ring-2 focus-visible:ring-ring">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-primary">{settings.developerMode ? <CheckCircle2 className="size-4" /> : <Braces className="size-4" />}</span>
        <span className="min-w-0 flex-1"><span className="block text-sm font-bold">LUMEN-2026.08.06</span><span className="block font-mono text-[10px] text-muted-foreground">web · next-16 · release candidate</span></span>
      </button>
      {settings.developerMode ? <Button asChild variant="outline" className="mt-3 w-full"><Link href="/settings/developer">Открыть настройки разработчика</Link></Button> : <p className="mt-3 text-xs leading-5 text-muted-foreground">Расширенные параметры скрыты, пока режим разработчика не будет разблокирован.</p>}
    </CardContent>
  </Card>;
}
