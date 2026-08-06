"use client";

import * as React from "react";
import { animate, motion, Reorder, useMotionValue } from "motion/react";
import { Check, GripVertical, LayoutDashboard, Move3D, Navigation, Sparkles, X } from "lucide-react";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { Button } from "@/components/ui/button";
import { DEFAULT_DASHBOARD_ORDER, DEFAULT_NAVIGATION_ORDER, DEFAULT_QUICK_ACTION_ORDER, normalizeOrder, type DashboardItemId, type NavigationItemId, type QuickActionItemId } from "@/lib/personalization";
import { cn } from "@/lib/utils";

type GroupId = "navigation" | "actions" | "dashboard";
const groupMeta = {
  navigation: { label: "Меню", icon: Navigation },
  actions: { label: "Действия", icon: Sparkles },
  dashboard: { label: "Главная", icon: LayoutDashboard },
} satisfies Record<GroupId, { label: string; icon: typeof Navigation }>;

const labels: Record<string, string> = {
  home: "Главная", payments: "Платежи", cards: "Карты", history: "История", analytics: "Аналитика", services: "Сервисы",
  transfer: "Перевести", "top-up": "Пополнить", payment: "Оплатить",
  pulse: "Финансовый пульс", spending: "Расходы", upcoming: "Предстоящие", goals: "Цели",
};

export function LayoutEditorOverlay() {
  const { settings, setSetting } = usePersonalization();
  const [group, setGroup] = React.useState<GroupId>("dashboard");
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  React.useEffect(() => {
    // The panel is fixed at left: 1rem; x is therefore an offset from that
    // anchor, not a viewport coordinate. Keep 1rem breathing room at both edges.
    const position = () => x.set(Math.max(0, window.innerWidth - Math.min(360, window.innerWidth - 32) - 32));
    position();
    window.addEventListener("resize", position);
    return () => window.removeEventListener("resize", position);
  }, [x]);

  if (!settings.layoutEditMode) return null;

  const values = group === "navigation"
    ? normalizeOrder(settings.navigationOrder, DEFAULT_NAVIGATION_ORDER)
    : group === "actions"
      ? normalizeOrder(settings.quickActionOrder, DEFAULT_QUICK_ACTION_ORDER)
      : normalizeOrder(settings.dashboardOrder, DEFAULT_DASHBOARD_ORDER);

  function reorder(next: string[]) {
    // Reorder.Group is deliberately shared between three schemas. Narrow only
    // at the persistence boundary after the active group determines the shape.
    if (group === "navigation") setSetting("navigationOrder", next as NavigationItemId[]);
    else if (group === "actions") setSetting("quickActionOrder", next as QuickActionItemId[]);
    else setSetting("dashboardOrder", next as DashboardItemId[]);
  }

  return <motion.aside
    aria-label="Редактор компоновки"
    drag
    dragMomentum={false}
    style={{ x, y }}
    onDragEnd={(_, info) => {
      const width = Math.min(360, window.innerWidth - 32);
      const targetX = info.point.x < window.innerWidth / 2 ? 0 : Math.max(0, window.innerWidth - width - 32);
      const targetY = Math.max(-20, Math.min(window.innerHeight - 280, y.get()));
      animate(x, targetX, { type: "spring", stiffness: 260, damping: 30 });
      animate(y, targetY, { type: "spring", stiffness: 260, damping: 30 });
    }}
    className="glass-panel fixed left-4 top-28 z-[70] w-[min(360px,calc(100vw-2rem))] cursor-grab overflow-hidden rounded-3xl border border-primary/30 bg-background/72 shadow-[0_24px_80px_-24px_rgba(0,0,0,.55),0_0_45px_-24px_var(--glow-lime)] backdrop-blur-2xl active:cursor-grabbing"
  >
    <div className="flex items-center gap-3 border-b border-primary/10 p-3"><span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Move3D className="size-4" /></span><div className="min-w-0 flex-1"><p className="text-sm font-bold">Компоновка</p><p className="text-[10px] text-muted-foreground">Перетащите панель к краю экрана</p></div><Button type="button" variant="ghost" size="icon-sm" onClick={() => setSetting("layoutEditMode", false)} aria-label="Закрыть редактор"><X /></Button></div>
    <div className="grid grid-cols-3 gap-1 p-2">{(Object.keys(groupMeta) as GroupId[]).map((id) => { const Icon = groupMeta[id].icon; return <button key={id} type="button" onPointerDown={(event) => event.stopPropagation()} onClick={() => setGroup(id)} className={cn("flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-[11px] font-bold transition-colors", group === id ? "bg-primary text-primary-foreground" : "bg-secondary/45 text-muted-foreground hover:text-foreground")}><Icon className="size-3.5" />{groupMeta[id].label}</button>; })}</div>
    <Reorder.Group axis="y" values={values} onReorder={reorder} className="max-h-[min(48vh,390px)] space-y-1.5 overflow-y-auto overscroll-contain p-3 pt-1" onPointerDown={(event) => event.stopPropagation()}>{values.map((value, index) => <Reorder.Item key={value} value={value} className="flex cursor-grab touch-none items-center gap-3 rounded-xl border bg-background/62 p-2.5 shadow-sm active:cursor-grabbing"><GripVertical className="size-4 text-primary" /><span className="grid size-6 place-items-center rounded-lg bg-secondary font-mono text-[10px]">{index + 1}</span><span className="min-w-0 flex-1 truncate text-xs font-bold">{labels[value] ?? value}</span><Check className="size-3.5 text-primary" /></Reorder.Item>)}</Reorder.Group>
    <p className="border-t border-primary/10 px-4 py-3 text-[10px] leading-4 text-muted-foreground">Порядок сохраняется мгновенно в cookie. Меню автоматически примагничивается к ближайшему краю.</p>
  </motion.aside>;
}
