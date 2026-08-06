# Архитектура Lumen Bank

Этот документ описывает границы приложения и решения, которые важно сохранить при развитии прототипа.

## Цели архитектуры

1. Общая банковская оболочка не должна размонтироваться при переходе между основными разделами.
2. Все пользовательские настройки должны восстанавливаться после reload без внешней базы данных.
3. Сложные интерактивные сценарии остаются client-side, а route/layout-композиция следует App Router.
4. Дизайн настраивается централизованно и не размножает условные классы по каждому компоненту.
5. Демонстрационные данные никогда не должны выглядеть как подтверждение реальной банковской операции.

## Слои

### App Router

`src/app` отвечает только за URL, layout, metadata, loading/error boundaries и подключение экранов.

- `(bank)` — постоянный shell авторизованной части;
- `(public)` — публичная витрина без sidebar;
- `[slug]` — адресуемые операции, уведомления и юридические документы;
- `loading.tsx` — fallback при hard reload и незагруженном сегменте.

Route-файлы должны оставаться небольшими. Состояние формы, фильтры и визуальная логика принадлежат компонентам соответствующей области.

### Providers

`src/components/providers` формирует клиентский runtime:

- `ThemeProvider` управляет light/dark и ripple lifecycle;
- `PersonalizationProvider` публикует настройки через `data-*` и CSS variables;
- `I18nProvider` загружает выбранные словари;
- `NotificationProvider` хранит демонстрационное состояние чтения;
- `RouteTransition` определяет направление перехода по глубине маршрута;
- `AppToaster` связывает Sonner с выбранной позицией.

Provider не должен содержать бизнес-разметку экрана. Его задача — предоставить стабильный контракт потомкам.

### Domain libraries

`src/lib` содержит схемы и операции над данными:

- `operations.ts` — нормализованная операция, slug, маршруты и хранение;
- `personalization.ts` — schema, defaults, допустимые порядки и palette registry;
- `cookies.ts` — внешний cookie-store для React;
- `cards.ts`, `notifications.ts`, `legal.ts`, `secondary-services.ts` — данные и узкие helpers;
- `schemas.ts` — контракты форм;
- `motion.ts` — единый набор easing presets.

Компоненты не должны повторять схему доменной сущности локальными interface, если тип уже выводится из Zod.

### Components

- `ui/` — маленькие доступные primitives без банковской семантики;
- `layout/` — persistent shell, navigation и global overlays;
- `dashboard/`, `payments/`, `transfers/`, `top-up/`, `operations/` — функциональные области;
- `settings/` — управление runtime-конфигурацией;
- `shared/` — переиспользуемые банковские представления, но не generic UI.

## Rendering и hydration

Root layout читает начальные значения на сервере и передаёт их providers. После hydration `useCookieState` подписывается на локальное событие изменения cookie через `useSyncExternalStore`.

Сентинел server snapshot нужен по двум причинам:

- HTML первого клиентского render совпадает с server output;
- отсутствие cookie отличается от состояния «браузер ещё не прочитан».

Нельзя читать `document.cookie`, `window`, media query или размер viewport во время server render. Такая логика запускается в effect либо обработчике события.

## Навигация

Внутренние переходы выполняются через `next/link` или `router.push`. Динамический slug является частью URL, поэтому экран можно обновить или открыть напрямую. `(bank)/layout.tsx` сохраняет app shell, а route transition анимирует только содержимое текущего сегмента.

Для новой глубокой страницы:

1. создайте route segment;
2. добавьте contextual back button, если это не основная категория;
3. обеспечьте skeleton для hard reload;
4. не дублируйте sidebar/topbar внутри page;
5. проверьте прямой URL и переход из приложения.

## Дизайн runtime

Personalization превращается в атрибуты и variables на `document.documentElement`. CSS использует их как публичный контракт:

```text
settings cookie
      ↓ Zod
PersonalizationProvider
      ↓
html[data-glass][data-density] + --glass-blur / --motion-speed / --primary
      ↓
globals.css и component classes
```

Это позволяет менять glow, blur и accent без каскада React rerenders. Новый визуальный параметр должен иметь:

1. поле и default в `personalizationSchema`;
2. элемент управления в настройках;
3. runtime-проекцию в provider;
4. CSS-потребителя;
5. безопасное поведение для старой cookie.

## Производительность

- Тяжёлые locale загружаются динамически.
- Лицензионные документы разделены на индекс и отдельные JSON.
- История операций не сериализуется одной большой cookie.
- Декоративные слои используют transform/opacity и не участвуют в layout.
- Responsive layout предпочитает grid/flex и CSS, а не постоянное измерение JavaScript.

## Ошибки и восстановление

`global-error.tsx` фиксирует ошибку в консоли разработчика и предоставляет reset. Невалидная cookie не ломает приложение: Zod возвращает default. Отсутствующая операция показывает безопасный not-found/empty state, а не создаёт фиктивный успешный результат.

## Границы демонстрационного проекта

Текущая архитектура не реализует аутентификацию, серверное подтверждение платежей, идемпотентность, fraud detection, audit trail или защищённое хранение. При подключении backend cookie-based demo state следует заменить server-authoritative API и моделью сессии.
