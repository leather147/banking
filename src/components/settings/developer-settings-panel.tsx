"use client";

import * as React from "react";
import { Blend, Braces, CalendarClock, ExternalLink, Gauge, GitBranch, GripVertical, Grid2X2, Layers3, MonitorCog, Move3D, Palette, RotateCcw, Save, Sparkles } from "lucide-react";
import { Reorder } from "motion/react";
import { toast } from "sonner";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { MOTION_EASINGS } from "@/lib/motion";
import {
  ACCENT_PALETTES,
  DEFAULT_DASHBOARD_ORDER,
  DEFAULT_NAVIGATION_ORDER,
  DEFAULT_SECONDARY_NAVIGATION_ORDER,
  DEFAULT_QUICK_ACTION_ORDER,
  DEFAULT_TOPBAR_ORDER,
  normalizeOrder,
  type DashboardItemId,
  type EasingPreset,
  type NavigationItemId,
  type QuickActionItemId,
  type SecondaryNavigationItemId,
  type TopbarItemId,
} from "@/lib/personalization";

export type DeveloperSection = "theme" | "layout" | "motion" | "system";

const labels: Record<string, string> = {
  home: "Главная", payments: "Платежи", cards: "Карты", history: "История", analytics: "Аналитика", services: "Сервисы",
  transfer: "Перевод", "top-up": "Пополнение", payment: "Оплата",
  pulse: "Финансовый пульс", spending: "Расходы", upcoming: "Предстоящие", goals: "Цели",
  savings: "Накопления", bonuses: "Бонусы", subscriptions: "Подписки", family: "Семейный банк", support: "Поддержка",
  search: "Поиск", shortcuts: "Статус и курсы", notifications: "Уведомления", profile: "Профиль",
};

export function DeveloperSettingsPanel({ section }: { section: DeveloperSection }) {
  if (section === "theme") return <ThemeDeveloperPanel />;
  if (section === "layout") return <LayoutDeveloperPanel />;
  if (section === "motion") return <MotionDeveloperPanel />;
  return <SystemDeveloperPanel />;
}

function ThemeDeveloperPanel() {
  const { settings, setSetting } = usePersonalization();
  const [brandName, setBrandName] = React.useState(settings.brandName);

  function saveName() {
    const next = brandName.trim();
    if (next.length < 2) return toast.error("Название должно содержать минимум 2 символа");
    setSetting("brandName", next);
    toast.success("Название приложения обновлено");
  }

  return <div className="space-y-4">
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Palette className="size-5 text-primary" />Тема и идентичность</CardTitle><p className="text-sm text-muted-foreground">Акцент перестраивает glow, графики и фон, сохраняя характер интерфейса.</p></CardHeader>
      <CardContent className="space-y-7">
        <div><label htmlFor="brand-name" className="mb-2 block text-sm font-medium">Название банка</label><div className="flex gap-2"><Input id="brand-name" value={brandName} maxLength={24} onChange={(event) => setBrandName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") saveName(); }} /><Button onClick={saveName} aria-label="Сохранить название"><Save /></Button></div><p className="mt-2 text-xs text-muted-foreground">Единое имя меняется в логотипе, картах, чеках, предложениях, лендинге и заголовке вкладки.</p></div>
        <div><p className="mb-3 text-sm font-medium">Цвет темы</p><div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">{Object.entries(ACCENT_PALETTES).map(([id, palette]) => <button key={id} type="button" onClick={() => setSetting("accentColor", id as keyof typeof ACCENT_PALETTES)} className="glass-panel flex items-center gap-2 rounded-xl border p-3 text-left text-xs outline-none transition-[border-color,background-color,box-shadow] hover:bg-secondary/45 hover:shadow-[0_0_22px_-18px_currentColor] focus-visible:ring-2 focus-visible:ring-ring" style={{ borderColor: settings.accentColor === id ? palette.primary : undefined }}><span className="size-4 shrink-0 rounded-full shadow-[0_0_16px_currentColor]" style={{ background: palette.primary, color: palette.primary }} /><span className="truncate">{palette.label}</span></button>)}</div></div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Blend className="size-5 text-primary" />Фон приложения</CardTitle><p className="text-sm text-muted-foreground">Сетка остаётся всегда; отключаются только цветные слои и градиенты.</p></CardHeader>
      <CardContent className="space-y-6">
        <Toggle title="Цветной фон" description="Glow-слои, градиенты и световые пятна" checked={settings.backgroundEnabled} onChange={(value) => setSetting("backgroundEnabled", value)} />
        <div><p className="mb-2 text-sm font-medium">Композиция</p><Select value={settings.backgroundStyle} onValueChange={(value) => setSetting("backgroundStyle", value as typeof settings.backgroundStyle)} disabled={!settings.backgroundEnabled}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{[{id:"aurora",label:"Аврора"},{id:"halo",label:"Ореол"},{id:"prism",label:"Призма"},{id:"quiet",label:"Спокойный"}].map((item) => <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>)}</SelectContent></Select></div>
        <SliderRow label="Интенсивность фона" value={settings.backgroundIntensity} min={0.15} max={1.2} step={0.05} formatted={`${Math.round(settings.backgroundIntensity * 100)}%`} onChange={(value) => setSetting("backgroundIntensity", value)} disabled={!settings.backgroundEnabled} />
      </CardContent>
    </Card>
  </div>;
}

function LayoutDeveloperPanel() {
  const { settings, setSetting } = usePersonalization();
  return <div className="space-y-4">
    <Card className="overflow-hidden border-primary/30 bg-primary/6"><CardHeader><CardTitle className="flex items-center gap-2"><Move3D className="size-5 text-primary" />Интерактивная компоновка</CardTitle><p className="text-sm text-muted-foreground">Открывает плавающий контроллер. Перетаскивайте элементы за рукоятку — изменения сразу отражаются в приложении.</p></CardHeader><CardContent><Toggle title="Режим редактирования" description="Контроллер магнитится к краям и не закрывает верхнюю и нижнюю навигацию" checked={settings.layoutEditMode} onChange={(value) => setSetting("layoutEditMode", value)} /></CardContent></Card>
    <OrderEditor icon={Grid2X2} title="Основная навигация" description="Первые пять пунктов формируют мобильный dock." values={normalizeOrder(settings.navigationOrder, DEFAULT_NAVIGATION_ORDER)} onChange={(value) => setSetting("navigationOrder", value as NavigationItemId[])} />
    <OrderEditor icon={Grid2X2} title="Дополнительное меню" description="Эти пункты видны в боковой панели, а на узком экране — плитками на главной." values={normalizeOrder(settings.secondaryNavigationOrder, DEFAULT_SECONDARY_NAVIGATION_ORDER)} onChange={(value) => setSetting("secondaryNavigationOrder", value as SecondaryNavigationItemId[])} />
    <OrderEditor icon={Sparkles} title="Быстрые действия" description="Порядок четырёх кнопок на главной." values={normalizeOrder(settings.quickActionOrder, DEFAULT_QUICK_ACTION_ORDER)} onChange={(value) => setSetting("quickActionOrder", value as QuickActionItemId[])} />
    <OrderEditor icon={Layers3} title="Блоки главной" description="Порядок информационных секций после баланса." values={normalizeOrder(settings.dashboardOrder, DEFAULT_DASHBOARD_ORDER)} onChange={(value) => setSetting("dashboardOrder", value as DashboardItemId[])} />
    <OrderEditor icon={MonitorCog} title="Верхняя строка" description="При нехватке места второстепенные элементы скрываются автоматически." values={normalizeOrder(settings.topbarOrder, DEFAULT_TOPBAR_ORDER)} onChange={(value) => setSetting("topbarOrder", value as TopbarItemId[])} />
  </div>;
}

function MotionDeveloperPanel() {
  const { settings, setSetting } = usePersonalization();
  const categories = [
    { key: "easingRoute", label: "Переходы экранов", description: "Иерархическое погружение между маршрутами" },
    { key: "easingPanel", label: "Панели и карточки", description: "Раскрытие и перестройка поверхностей" },
    { key: "easingModal", label: "Диалоги и меню", description: "Окна поверх текущего контекста" },
    { key: "easingMicro", label: "Микровзаимодействия", description: "Hover, кнопки и активные индикаторы" },
  ] as const;
  return <Card><CardHeader><CardTitle className="flex items-center gap-2"><Gauge className="size-5 text-primary" />Motion-система</CardTitle><p className="text-sm text-muted-foreground">Все профили имеют мягкое завершение; скорость масштабирует длительность приложения целиком.</p></CardHeader><CardContent className="space-y-6">
    <SliderRow label="Скорость анимаций" value={settings.motionSpeed} min={0.25} max={1.8} step={0.05} formatted={`${settings.motionSpeed.toFixed(2)}×`} onChange={(value) => setSetting("motionSpeed", value)} />
    <SliderRow label="Глубина перспективы" value={settings.routePerspective} min={0} max={80} step={2} formatted={`${settings.routePerspective}px`} onChange={(value) => setSetting("routePerspective", value)} />
    <div className="grid gap-4 xl:grid-cols-2">{categories.map((category) => <div key={category.key} className="rounded-2xl border bg-background/35 p-4"><p className="text-sm font-medium">{category.label}</p><p className="mb-3 mt-1 text-xs leading-5 text-muted-foreground">{category.description}</p><Select value={settings[category.key]} onValueChange={(value) => setSetting(category.key, value as EasingPreset)}>{<SelectTrigger><SelectValue /></SelectTrigger>}<SelectContent>{Object.entries(MOTION_EASINGS).map(([id, preset]) => <SelectItem key={id} value={id}>{preset.label}</SelectItem>)}</SelectContent></Select></div>)}</div>
  </CardContent></Card>;
}

function SystemDeveloperPanel() {
  const { settings, setSetting, resetPersonalization } = usePersonalization();
  return <div className="space-y-4"><Card className="border-primary/25"><CardHeader><CardTitle className="flex items-center gap-2"><CalendarClock className="size-5 text-primary" />Дата, время и тестовые карты</CardTitle><p className="text-sm text-muted-foreground">Операции используют эти значения. Конфигурация хранится в cookie и подходит для демонстрации разных состояний.</p></CardHeader><CardContent className="space-y-5"><Toggle title="Использовать системные дату и время" description="При выключении применяется заданный ниже момент" checked={settings.useSystemDateTime} onChange={(value) => setSetting("useSystemDateTime", value)} /><div className="grid gap-3 sm:grid-cols-2"><div><label htmlFor="developer-date" className="mb-2 block text-sm font-medium">Тестовая дата</label><Input id="developer-date" type="date" value={settings.demoDate} disabled={settings.useSystemDateTime} onChange={(event) => setSetting("demoDate", event.target.value)} /></div><div><label htmlFor="developer-time" className="mb-2 block text-sm font-medium">Тестовое время</label><Input id="developer-time" type="time" value={settings.demoTime} disabled={settings.useSystemDateTime} onChange={(event) => setSetting("demoTime", event.target.value)} /></div></div><SliderRow label="Количество демо-карт" value={settings.demoCardCount} min={1} max={3} step={1} formatted={`${settings.demoCardCount}`} onChange={(value) => setSetting("demoCardCount", Math.round(value))} /></CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2"><Braces className="size-5 text-primary" />Поведение среды</CardTitle><p className="text-sm text-muted-foreground">Экспериментальные параметры интерфейса без изменения банковских сценариев.</p></CardHeader><CardContent className="divide-y pt-1"><Toggle title="Инерционный touch-scroll" description="Нативное продолжение прокрутки после жеста" checked={settings.touchMomentum} onChange={(value) => setSetting("touchMomentum", value)} /><Toggle title="Подъём элементов dock" description="Небольшое масштабирование при наведении указателя" checked={settings.dockMagnification} onChange={(value) => setSetting("dockMagnification", value)} /><Toggle title="Shimmer skeleton" description="Движущийся блик у загружаемых блоков" checked={settings.skeletonShimmer} onChange={(value) => setSetting("skeletonShimmer", value)} /></CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2"><GitBranch className="size-5 text-primary" />Репозиторий проекта</CardTitle><p className="text-sm text-muted-foreground">Исходный код, задачи и pull request для новых переводов интерфейса.</p></CardHeader><CardContent><a href="https://github.com/leather147/banking" target="_blank" rel="noreferrer" className="glass-panel flex items-center gap-3 rounded-2xl border bg-background/35 p-4 outline-none transition-[border-color,background-color] hover:border-primary/30 hover:bg-secondary/35 focus-visible:ring-2 focus-visible:ring-ring"><GitBranch className="size-5 text-primary" /><span className="min-w-0 flex-1"><span className="block font-semibold">leather147/banking</span><span className="block truncate font-mono text-[10px] text-muted-foreground">github.com/leather147/banking</span></span><ExternalLink className="size-4 text-muted-foreground" /></a></CardContent></Card><Button variant="outline" className="w-full" onClick={() => { resetPersonalization(); toast.success("Настройки разработчика сброшены"); }}><RotateCcw />Сбросить конфигурацию интерфейса</Button></div>;
}

function OrderEditor({ icon: Icon, title, description, values, onChange }: { icon: typeof Grid2X2; title: string; description: string; values: string[]; onChange: (values: string[]) => void }) {
  return <Card><CardHeader><CardTitle className="flex items-center gap-2"><Icon className="size-5 text-primary" />{title}</CardTitle><p className="text-sm text-muted-foreground">{description}</p></CardHeader><CardContent><Reorder.Group axis="y" values={values} onReorder={onChange} className="space-y-2">{values.map((value, index) => <Reorder.Item key={value} value={value} className="flex min-w-0 cursor-grab touch-none items-center gap-3 rounded-xl border bg-background/55 p-2.5 active:cursor-grabbing"><GripVertical className="size-4 shrink-0 text-muted-foreground" /><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-secondary font-mono text-xs">{index + 1}</span><span className="min-w-0 flex-1 truncate text-sm font-medium">{labels[value] ?? value}</span><span className="text-[10px] text-muted-foreground">Перетащить</span></Reorder.Item>)}</Reorder.Group></CardContent></Card>;
}

function Toggle({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <div className="flex items-center gap-4 py-4"><div className="min-w-0 flex-1"><p className="text-sm font-medium">{title}</p><p className="mt-0.5 text-xs leading-5 text-muted-foreground">{description}</p></div><Switch checked={checked} onCheckedChange={onChange} aria-label={title} /></div>;
}

function SliderRow({ label, value, min, max, step, formatted, onChange, disabled }: { label: string; value: number; min: number; max: number; step: number; formatted: string; onChange: (value: number) => void; disabled?: boolean }) {
  return <div className={disabled ? "opacity-45" : undefined}><div className="mb-3 flex items-center justify-between gap-3"><span className="text-sm font-medium">{label}</span><span className="rounded-lg bg-secondary px-2 py-1 font-mono text-xs">{formatted}</span></div><Slider value={[value]} min={min} max={max} step={step} disabled={disabled} aria-label={label} onValueChange={([next]) => onChange(next)} /></div>;
}
