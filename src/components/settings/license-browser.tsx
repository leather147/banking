"use client";

import * as React from "react";
import { BookOpenText, ExternalLink, LoaderCircle, PackageSearch, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type LicenseEntry = { name: string; version: string; license: string; direct: boolean; documentCount: number; detailPath: string };
type LicenseIndex = { generatedAt: string; packageCount: number; packages: LicenseEntry[] };
type LicenseDetail = LicenseEntry & { description: string; homepage: string | null; repository: string | null; author: string | null; documents: { name: string; content: string; truncated: boolean }[] };

export function LicenseBrowser() {
  const [index, setIndex] = React.useState<LicenseIndex | null>(null);
  const [error, setError] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const deferredQuery = React.useDeferredValue(query.trim().toLowerCase());
  const [selected, setSelected] = React.useState<LicenseDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = React.useState(false);
  const [visibleCount, setVisibleCount] = React.useState(80);

  React.useEffect(() => {
    const controller = new AbortController();
    const load = () => fetch("/generated/licenses/index.json", { signal: controller.signal }).then((response) => {
      if (!response.ok) throw new Error("License index unavailable");
      return response.json() as Promise<LicenseIndex>;
    }).then(setIndex).catch((reason) => { if (reason.name !== "AbortError") setError(true); });
    const idleWindow = window as Window & { requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    const idleId = idleWindow.requestIdleCallback?.(load, { timeout: 1200 });
    const timer = idleId === undefined ? window.setTimeout(load, 120) : undefined;
    return () => { controller.abort(); if (timer) window.clearTimeout(timer); if (idleId !== undefined) idleWindow.cancelIdleCallback?.(idleId); };
  }, []);

  const packages = React.useMemo(() => {
    if (!index) return [];
    if (!deferredQuery) return index.packages;
    return index.packages.filter((entry) => `${entry.name} ${entry.version} ${entry.license}`.toLowerCase().includes(deferredQuery));
  }, [deferredQuery, index]);

  async function openEntry(entry: LicenseEntry) {
    setLoadingDetail(true);
    try {
      const response = await fetch(entry.detailPath);
      if (!response.ok) throw new Error("License detail unavailable");
      setSelected(await response.json() as LicenseDetail);
    } catch {
      toast.error("Не удалось открыть документ лицензии");
    } finally {
      setLoadingDetail(false);
    }
  }

  return <><Card><CardHeader><CardTitle className="flex items-center gap-2"><BookOpenText className="size-5 text-primary" />Лицензионные соглашения</CardTitle><p className="text-sm text-muted-foreground">Индекс компилируется из установленного `node_modules` перед dev/build; полный текст загружается только при открытии пакета.</p></CardHeader><CardContent>
    <div className="relative mb-4"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Пакет, версия или лицензия" className="pl-9" /></div>
    {!index && !error ? <div className="grid min-h-48 place-items-center"><div className="text-center"><LoaderCircle className="mx-auto size-6 animate-spin text-primary" /><p className="mt-3 text-sm text-muted-foreground">Индекс загружается в фоне…</p></div></div> : null}
    {error ? <div className="grid min-h-48 place-items-center text-center"><div><PackageSearch className="mx-auto size-7 text-muted-foreground" /><p className="mt-3 text-sm font-medium">Индекс ещё не создан</p><p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">Запустите `bun run licenses` или production build. Генератор не блокирует интерфейс приложения.</p></div></div> : null}
    {index ? <><div className="mb-3 flex items-center justify-between text-xs text-muted-foreground"><span>{packages.length} из {index.packageCount} пакетов</span><span>JSON · lazy detail</span></div><div className="max-h-[62vh] space-y-1 overflow-y-auto overscroll-contain pr-1">{packages.slice(0, visibleCount).map((entry) => <button key={`${entry.name}@${entry.version}`} type="button" onClick={() => openEntry(entry)} className="flex w-full items-center gap-3 rounded-xl p-3 text-left outline-none transition-colors [content-visibility:auto] [contain-intrinsic-size:56px] hover:bg-secondary/65 focus-visible:ring-2 focus-visible:ring-ring"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary"><PackageSearch className="size-4 text-primary" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{entry.name}</span><span className="block text-xs text-muted-foreground">{entry.version} · {entry.license}</span></span>{entry.direct ? <Badge>direct</Badge> : null}<span className="text-[10px] text-muted-foreground">{entry.documentCount}</span></button>)}{visibleCount < packages.length ? <button type="button" onClick={() => setVisibleCount((count) => count + 80)} className="mt-2 w-full rounded-xl border border-dashed p-3 text-xs text-muted-foreground outline-none transition-colors hover:bg-secondary/55 focus-visible:ring-2 focus-visible:ring-ring">Показать ещё {Math.min(80, packages.length - visibleCount)}</button> : null}</div></> : null}
  </CardContent></Card>
  <Dialog open={Boolean(selected) || loadingDetail} onOpenChange={(open) => { if (!open) setSelected(null); }}><DialogContent className="max-h-[82vh] max-w-3xl overflow-hidden p-0"><DialogHeader className="border-b p-5 pr-12"><DialogTitle>{loadingDetail ? "Загрузка документа…" : selected?.name}</DialogTitle><DialogDescription>{selected ? `${selected.version} · ${selected.license}` : "Читаем оптимизированный JSON"}</DialogDescription></DialogHeader>{selected ? <div className="max-h-[65vh] overflow-y-auto overscroll-contain p-5"><p className="mb-4 text-sm leading-6 text-muted-foreground">{selected.description || "Описание не указано."}</p>{selected.homepage ? <a href={selected.homepage} target="_blank" rel="noreferrer" className="mb-4 inline-flex items-center gap-2 text-xs text-primary hover:underline">Страница проекта <ExternalLink className="size-3" /></a> : null}{selected.documents.length ? selected.documents.map((document) => <section key={document.name} className="mb-4"><h3 className="mb-2 text-sm font-medium">{document.name}</h3><pre className="whitespace-pre-wrap break-words rounded-xl border bg-background/55 p-4 font-mono text-[11px] leading-5 text-muted-foreground">{document.content}</pre>{document.truncated ? <p className="mt-2 text-xs text-muted-foreground">Документ сокращён до 500 KB.</p> : null}</section>) : <div className="rounded-xl border border-dashed p-5 text-sm text-muted-foreground">Файл лицензии не найден; декларация package.json: {selected.license}.</div>}</div> : <div className="grid min-h-48 place-items-center"><LoaderCircle className="size-6 animate-spin text-primary" /></div>}</DialogContent></Dialog>
  </>;
}
