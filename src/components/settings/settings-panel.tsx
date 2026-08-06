"use client";

import * as React from "react";
import {
  Check,
  Accessibility,
  BellRing,
  Laptop2,
  MonitorSmartphone,
  Moon,
  RotateCcw,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Sun,
  TabletSmartphone,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { DEVICE_SETTINGS_DEFAULTS, NOTIFICATION_SETTINGS_DEFAULTS, PRIVACY_SETTINGS_DEFAULTS, SECURITY_SETTINGS_DEFAULTS } from "@/lib/app-settings";
import { useCookieState } from "@/lib/cookies";
import type { PersonalizationSettings } from "@/lib/personalization";
import { preferenceSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type SettingSection = "appearance" | "accessibility" | "security" | "notifications" | "privacy" | "devices";

const defaults: Record<Exclude<SettingSection, "appearance" | "accessibility">, Record<string, boolean | string | number>> = {
  security: SECURITY_SETTINGS_DEFAULTS,
  notifications: NOTIFICATION_SETTINGS_DEFAULTS,
  privacy: PRIVACY_SETTINGS_DEFAULTS,
  devices: DEVICE_SETTINGS_DEFAULTS,
};

const toggleConfig: Record<Exclude<SettingSection, "appearance" | "accessibility" | "devices">, { key: string; title: string; description: string }[]> = {
  security: [
    { key: "biometrics", title: "Вход по биометрии", description: "Использовать Face ID или отпечаток" },
    { key: "quickLogin", title: "Быстрый вход", description: "Не запрашивать пароль на доверенном устройстве" },
    { key: "operationConfirm", title: "Подтверждение операций", description: "Показывать итоговый экран перед отправкой" },
    { key: "suspiciousLogin", title: "Необычные входы", description: "Сообщать о новых устройствах и регионах" },
  ],
  notifications: [
    { key: "push", title: "Push-уведомления", description: "Основной канал на этом устройстве" },
    { key: "email", title: "Email", description: "Выписки и важные документы" },
    { key: "sms", title: "SMS", description: "Резервные уведомления" },
    { key: "transactions", title: "Операции", description: "Списания, поступления и переводы" },
    { key: "security", title: "Безопасность", description: "Входы и изменение настроек" },
    { key: "offers", title: "Предложения", description: "Персональные продукты и скидки" },
  ],
  privacy: [
    { key: "analytics", title: "Аналитические cookie", description: "Помогают улучшать интерфейс демо" },
    { key: "personalization", title: "Персонализация", description: "Показывать релевантные категории и подсказки" },
    { key: "marketing", title: "Маркетинговые cookie", description: "Использовать данные для предложений" },
    { key: "location", title: "Доступ к геопозиции", description: "Подсказывать ближайшие банкоматы" },
  ],
};

const titles: Record<Exclude<SettingSection, "appearance" | "accessibility">, { title: string; description: string }> = {
  security: { title: "Безопасность", description: "Настройки входа и подтверждения операций применяются на этом устройстве." },
  notifications: { title: "Уведомления", description: "Выберите активные каналы и типы событий." },
  privacy: { title: "Приватность", description: "Управляйте необязательными cookie и персонализацией." },
  devices: { title: "Устройства", description: "Просмотрите доверенные сеансы учётной записи." },
};

export function SettingsPanel({ section }: { section: SettingSection }) {
  if (section === "appearance") return <AppearancePanel />;
  if (section === "accessibility") return <AccessibilityPanel />;
  return <PersistentSettingsPanel section={section} />;
}

function PersistentSettingsPanel({ section }: { section: Exclude<SettingSection, "appearance" | "accessibility"> }) {
  const [values, setValues] = useCookieState(`lumen-settings-${section}`, preferenceSchema, defaults[section]);
  const setValue = (key: string, value: boolean | string | number) => {
    setValues((current) => ({ ...current, [key]: value }));
    toast.success("Настройка сохранена на этом устройстве");
  };
  const setMany = (next: Record<string, boolean | string | number>) => {
    setValues((current) => ({ ...current, ...next }));
    toast.success("Настройки устройств обновлены");
  };

  if (section === "devices") return <DevicesPanel values={values} setValue={setValue} setMany={setMany} />;
  const panel = (
    <Card>
      <CardHeader>
        <CardTitle>{titles[section].title}</CardTitle>
        <p className="text-sm text-muted-foreground">{titles[section].description}</p>
      </CardHeader>
      <CardContent className="divide-y pt-1">
        {toggleConfig[section].map(({ key, title, description }) => (
          <ToggleRow key={key} title={title} description={description} checked={Boolean(values[key])} onCheckedChange={(checked) => setValue(key, checked)} />
        ))}
      </CardContent>
    </Card>
  );
  return section === "notifications" ? <div className="space-y-4">{panel}<NotificationPopupSettings /></div> : panel;
}

function NotificationPopupSettings() {
  const { settings, setSetting } = usePersonalization();
  const positions = [
    { id: "top-right", label: "Сверху справа" },
    { id: "top-center", label: "Сверху по центру" },
    { id: "bottom-right", label: "Снизу справа" },
    { id: "bottom-center", label: "Снизу по центру" },
  ] as const;
  return <Card><CardHeader><CardTitle className="flex items-center gap-2"><BellRing className="size-5 text-primary" />Всплывающие уведомления</CardTitle><p className="text-sm text-muted-foreground">Popup учитывает выбранную тему и располагается ниже верхней панели.</p></CardHeader><CardContent className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"><Select value={settings.toastPosition} onValueChange={(value) => setSetting("toastPosition", value as typeof settings.toastPosition)}><SelectTrigger aria-label="Положение уведомлений"><SelectValue /></SelectTrigger><SelectContent>{positions.map((position) => <SelectItem key={position.id} value={position.id}>{position.label}</SelectItem>)}</SelectContent></Select><Button type="button" variant="secondary" onClick={() => toast.success("Тестовое уведомление", { description: "Позиция, glass и цвет соответствуют вашим настройкам." })}>Протестировать</Button></CardContent></Card>;
}

function AppearancePanel() {
  const { theme, setTheme } = useTheme();
  const { settings, setSetting, resetPersonalization } = usePersonalization();
  const commit = () => toast.success("Персонализация сохранена");

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <CardHeader className="relative border-b border-primary/10">
          <div aria-hidden="true" className="absolute -right-8 -top-12 size-36 rounded-full bg-primary/14 blur-3xl" />
          <CardTitle className="relative flex items-center gap-2"><Sparkles className="size-5 text-primary" />Персонализация</CardTitle>
          <p className="relative text-sm text-muted-foreground">Изменения применяются мгновенно и хранятся только в cookie этого браузера.</p>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          <section>
            <h3 className="mb-3 text-sm font-medium">Тема</h3>
            <div className="grid grid-cols-2 gap-3">
              {(["light", "dark"] as const).map((item) => {
                const Icon = item === "light" ? Sun : Moon;
                return (
                  <button key={item} type="button" onClick={(event) => setTheme(item, { x: event.clientX, y: event.clientY })} className={cn("glass-panel relative flex min-h-28 flex-col justify-between rounded-2xl border bg-background/45 p-4 text-left outline-none transition-[border-color,background-color,box-shadow] hover:border-primary/30 hover:bg-secondary/35 focus-visible:ring-2 focus-visible:ring-ring", theme === item && "border-primary bg-primary/8 shadow-[0_0_32px_-18px_var(--glow-lime)]")}>
                    <Icon className="size-5" />
                    <span className="text-sm font-medium">{item === "light" ? "Светлая" : "Тёмная"}</span>
                    {theme === item ? <Check className="absolute right-3 top-3 size-4 text-primary" /> : null}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-medium">Плотность</h3>
            <div className="grid grid-cols-2 gap-2">
              {([{ id: "comfortable", label: "Комфортная" }, { id: "compact", label: "Компактная" }] as const).map((item) => (
                <Button key={item.id} variant={settings.density === item.id ? "default" : "outline"} onClick={() => { setSetting("density", item.id); commit(); }}>{item.label}</Button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-medium">Карты и баланс</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border bg-background/30 p-4"><PersonalizationToggle setting="balanceHidden" title="Скрывать баланс" description="Суммы заменяются точками на главной и в картах" settings={settings} setSetting={setSetting} /></div>
              <div className="rounded-2xl border bg-background/30 p-4"><label className="mb-2 block text-sm font-medium">Стиль карточки на главной</label><Select value={settings.cardDisplayStyle} onValueChange={(value) => setSetting("cardDisplayStyle", value as typeof settings.cardDisplayStyle)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="compact">Компактный</SelectItem><SelectItem value="classic">Классический</SelectItem><SelectItem value="cinematic">Кинематографичный</SelectItem></SelectContent></Select></div>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-2">
            <SettingSlider label="Размер интерфейса" description="Единый коэффициент масштаба всех экранов" value={settings.interfaceScale} min={0.85} max={1.15} step={0.01} formatted={`${Math.round(settings.interfaceScale * 100)}%`} onChange={(value) => setSetting("interfaceScale", value)} onCommit={commit} />
            <SettingSlider label="Скругление элементов" description="Радиусы вычисляются по общей формуле" value={settings.radiusScale} min={0.75} max={1.35} step={0.05} formatted={`${Math.round(settings.radiusScale * 100)}%`} onChange={(value) => setSetting("radiusScale", value)} onCommit={commit} />
            <SettingSlider label="Размытие glass-панелей" description="Интенсивность backdrop blur" value={settings.glassBlurAmount} min={6} max={40} step={1} formatted={`${settings.glassBlurAmount}px`} onChange={(value) => setSetting("glassBlurAmount", value)} onCommit={commit} disabled={!settings.glassBlur} />
            <SettingSlider label="Плотность стекла" description="Прозрачность поверхностей без смены бренда" value={settings.glassOpacity} min={45} max={96} step={1} formatted={`${settings.glassOpacity}%`} onChange={(value) => setSetting("glassOpacity", value)} onCommit={commit} />
            <SettingSlider label="Насыщенность стекла" description="Сочность цвета за полупрозрачными панелями" value={settings.glassSaturation} min={80} max={190} step={1} formatted={`${settings.glassSaturation}%`} onChange={(value) => setSetting("glassSaturation", value)} onCommit={commit} disabled={!settings.glassBlur} />
            <SettingSlider label="Контраст стекла" description="Разделение фона и содержимого панели" value={settings.glassContrast} min={90} max={125} step={1} formatted={`${settings.glassContrast}%`} onChange={(value) => setSetting("glassContrast", value)} onCommit={commit} disabled={!settings.glassBlur} />
            <SettingSlider label="Стеклянная кромка" description="Интенсивность световой границы" value={settings.glassBorderOpacity} min={4} max={28} step={1} formatted={`${settings.glassBorderOpacity}%`} onChange={(value) => setSetting("glassBorderOpacity", value)} onCommit={commit} />
            <SettingSlider label="Объём glass-тени" description="Глубина мягкой цветной тени под панелями" value={settings.glassShadowIntensity} min={0} max={100} step={1} formatted={`${settings.glassShadowIntensity}%`} onChange={(value) => setSetting("glassShadowIntensity", value)} onCommit={commit} />
            <SettingSlider label="Нижний градиент" description="Подложка под мобильным меню и уведомлениями" value={settings.bottomFadeOpacity} min={0} max={90} step={1} formatted={`${settings.bottomFadeOpacity}%`} onChange={(value) => setSetting("bottomFadeOpacity", value)} onCommit={commit} />
            <SettingSlider label="Скорость анимаций" description="Меньший коэффициент делает все переходы заметно медленнее" value={settings.motionSpeed} min={0.25} max={1.8} step={0.05} formatted={`${settings.motionSpeed.toFixed(2)}×`} onChange={(value) => setSetting("motionSpeed", value)} onCommit={commit} disabled={!settings.animations} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><SlidersHorizontal className="size-5 text-primary" />Поведение интерфейса</CardTitle></CardHeader>
        <CardContent className="divide-y pt-1">
          <PersonalizationToggle setting="animations" title="Плавные анимации" description="Переходы страниц и микровзаимодействия" settings={settings} setSetting={setSetting} />
          <PersonalizationToggle setting="glassBlur" title="Размытие в приложении" description="Glass-эффект панелей и нижнего градиента" settings={settings} setSetting={setSetting} />
          <PersonalizationToggle setting="glassNoise" title="Микротекстура стекла" description="Тонкая текстура сохраняет глубину на однотонном фоне" settings={settings} setSetting={setSetting} />
          <PersonalizationToggle setting="ambientGlow" title="Фоновое свечение" description="Мягкие цветовые glow-облака за интерфейсом" settings={settings} setSetting={setSetting} />
          <PersonalizationToggle setting="hoverHints" title="Контекстные подсказки" description="Краткая информация при наведении на действия" settings={settings} setSetting={setSetting} />
          <PersonalizationToggle setting="skeletonShimmer" title="Shimmer у skeleton" description="Блик вместо спокойной пульсации при загрузке" settings={settings} setSetting={setSetting} />
          <PersonalizationToggle setting="compactCards" title="Компактное содержимое" description="Меньше вертикальных отступов внутри карточек" settings={settings} setSetting={setSetting} />
          <PersonalizationToggle setting="strongerFocus" title="Усиленный focus" description="Заметнее подсвечивать элементы при работе с клавиатуры" settings={settings} setSetting={setSetting} />
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full" onClick={() => { resetPersonalization(); toast.success("Настройки персонализации сброшены"); }}><RotateCcw />Вернуть настройки по умолчанию</Button>
    </div>
  );
}

function AccessibilityPanel() {
  const { settings, setSetting } = usePersonalization();
  return <div className="space-y-4">
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Accessibility className="size-5 text-primary" />Доступность</CardTitle><p className="text-sm text-muted-foreground">Настройки применяются мгновенно ко всему приложению и сохраняются на этом устройстве.</p></CardHeader>
      <CardContent className="divide-y pt-1">
        <PersonalizationToggle setting="strongerFocus" title="Усиленный focus" description="Контрастное кольцо при навигации с клавиатуры" settings={settings} setSetting={setSetting} />
        <PersonalizationToggle setting="highContrast" title="Повышенный контраст" description="Ярче границы и вторичный текст без смены палитры" settings={settings} setSetting={setSetting} />
        <PersonalizationToggle setting="largeTouchTargets" title="Увеличенные touch-зоны" description="Минимальная высота интерактивных элементов — 44 px" settings={settings} setSetting={setSetting} />
        <PersonalizationToggle setting="animations" title="Анимации интерфейса" description="Отключите, если движение отвлекает" settings={settings} setSetting={setSetting} />
        <PersonalizationToggle setting="hoverHints" title="Контекстные подсказки" description="Показывать краткое объяснение доступных действий" settings={settings} setSetting={setSetting} />
        <PersonalizationToggle setting="tabNavigation" title="Навигация клавишей Tab" description="Включает последовательный обход интерактивных элементов" settings={settings} setSetting={setSetting} />
        <PersonalizationToggle setting="focusWrap" title="Циклический фокус в окнах" description="После последнего элемента фокус возвращается к первому" settings={settings} setSetting={setSetting} />
        <PersonalizationToggle setting="skipLinks" title="Ссылка «К содержимому»" description="Быстрый переход мимо меню для клавиатуры и скринридера" settings={settings} setSetting={setSetting} />
        <PersonalizationToggle setting="announceChanges" title="Озвучивать изменения" description="Сообщать о сохранении настроек и изменении состояния" settings={settings} setSetting={setSetting} />
      </CardContent>
    </Card>
    <Card><CardContent className="pt-5"><SettingSlider label="Размер интерфейса" description="Масштаб текста, панелей и контролов" value={settings.interfaceScale} min={0.85} max={1.15} step={0.01} formatted={`${Math.round(settings.interfaceScale * 100)}%`} onChange={(value) => setSetting("interfaceScale", value)} onCommit={() => toast.success("Масштаб сохранён")} /></CardContent></Card>
  </div>;
}

function SettingSlider({ label, description, value, min, max, step, formatted, onChange, onCommit, disabled }: { label: string; description: string; value: number; min: number; max: number; step: number; formatted: string; onChange: (value: number) => void; onCommit: () => void; disabled?: boolean }) {
  return (
    <div className={cn("rounded-2xl border bg-background/30 p-4 transition-opacity", disabled && "opacity-45")}>
      <div className="mb-4 flex items-start justify-between gap-4"><div><p className="text-sm font-medium">{label}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p></div><span className="shrink-0 rounded-lg bg-secondary px-2 py-1 font-mono text-xs">{formatted}</span></div>
      <Slider aria-label={label} value={[value]} min={min} max={max} step={step} disabled={disabled} onValueChange={([next]) => onChange(next)} onValueCommit={onCommit} />
    </div>
  );
}

function PersonalizationToggle<K extends keyof PersonalizationSettings>({ setting, title, description, settings, setSetting }: { setting: K; title: string; description: string; settings: PersonalizationSettings; setSetting: <T extends keyof PersonalizationSettings>(key: T, value: PersonalizationSettings[T]) => void }) {
  const checked = Boolean(settings[setting]);
  return <ToggleRow title={title} description={description} checked={checked} onCheckedChange={(next) => { setSetting(setting, next as PersonalizationSettings[K]); toast.success("Настройка применена"); }} />;
}

function DevicesPanel({ values, setValue, setMany }: { values: Record<string, boolean | string | number>; setValue: (key: string, value: boolean | string | number) => void; setMany: (next: Record<string, boolean | string | number>) => void }) {
  const devices = [
    { key: "current", name: "Windows · Codex Browser", meta: "Москва · Сейчас", icon: MonitorSmartphone, current: true, active: true },
    { key: "iphoneActive", name: "iPhone 17 Pro", meta: "Москва · 2 часа назад", icon: Smartphone, active: Boolean(values.iphoneActive) },
    { key: "ipadActive", name: "iPad Air", meta: "Санкт-Петербург · 29 июля", icon: TabletSmartphone, active: Boolean(values.ipadActive) },
  ].filter((device) => device.active);
  const otherSessions = devices.filter((device) => !device.current);

  return <div className="space-y-4">
    <Card>
      <CardHeader><CardTitle>Устройства</CardTitle><p className="text-sm text-muted-foreground">Активные доверенные сеансы. Завершённые устройства сразу исчезают из списка.</p></CardHeader>
      <CardContent className="divide-y pt-1">
        {devices.map(({ key, name, meta, icon: Icon, current }) => <div key={key} className="flex items-center gap-3 py-4"><span className="grid size-10 place-items-center rounded-xl bg-secondary"><Icon className="size-4" /></span><div className="min-w-0 flex-1"><p className="text-sm font-medium">{name}</p><p className="text-xs text-muted-foreground">{meta}</p></div>{current ? <span className="text-xs text-primary">Текущее</span> : <Button size="sm" variant="ghost" onClick={() => setValue(key, false)}>Завершить</Button>}</div>)}
        {otherSessions.length === 0 ? <div className="py-8 text-center text-sm text-muted-foreground">Других активных сеансов нет.</div> : null}
      </CardContent>
    </Card>
    <Card><CardContent className="pt-5"><ToggleRow title="Запоминать доверенные устройства" description="Сокращает количество повторных подтверждений" checked={Boolean(values.rememberDevices)} onCheckedChange={(checked) => setValue("rememberDevices", checked)} /></CardContent></Card>
    <Button variant="outline" className="w-full" disabled={otherSessions.length === 0} onClick={() => setMany({ iphoneActive: false, ipadActive: false })}><Laptop2 />Завершить все остальные сеансы</Button>
    {otherSessions.length === 0 ? <Button variant="ghost" className="w-full" onClick={() => setMany({ iphoneActive: true, ipadActive: true })}>Восстановить демо-сеансы</Button> : null}
  </div>;
}

function ToggleRow({ title, description, checked, onCheckedChange }: { title: string; description: string; checked: boolean; onCheckedChange: (checked: boolean) => void }) {
  return <div className="flex items-center gap-4 py-4"><div className="min-w-0 flex-1"><p className="text-sm font-medium">{title}</p><p className="mt-0.5 text-xs leading-5 text-muted-foreground">{description}</p></div><Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={title} /></div>;
}
