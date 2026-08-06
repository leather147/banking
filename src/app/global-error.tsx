"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <html lang="ru"><body><main className="grid min-h-screen place-items-center bg-[#111] p-5 text-white"><div className="max-w-md text-center"><AlertTriangle className="mx-auto size-10 text-orange-400" /><h1 className="mt-5 text-2xl font-semibold">Интерфейс не загрузился</h1><p className="mt-2 text-sm text-white/60">Попробуйте повторить загрузку. Данные демо-профиля останутся в cookie.</p><button onClick={reset} className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#c8ff3d] px-5 text-sm font-medium text-black"><RotateCcw className="size-4" />Повторить</button></div></main></body></html>;
}
