# Lumen Bank — карта реализации

Документ фиксирует фактически реализованные подсистемы и их владельцев в исходном коде. Архитектурные решения подробно описаны в [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

## Статус

| Область | Состояние | Основные файлы |
| --- | --- | --- |
| App Router и persistent shell | Готово | `src/app`, `src/components/layout` |
| Dashboard и карты | Готово | `src/components/dashboard`, `src/components/cards` |
| Переводы | Готово как интерактивный прототип | `src/components/transfers` |
| Пополнения | Готово как интерактивный прототип | `src/components/top-up` |
| Оплата услуг | Готово как интерактивный прототип | `src/components/payments` |
| Динамические операции | Готово | `src/lib/operations.ts`, `src/components/operations` |
| История и аналитика | Готово | `src/components/history`, `src/components/analytics` |
| Профиль и уведомления | Готово | `src/components/profile`, `src/components/notifications` |
| Пользовательские настройки | Готово | `src/components/settings`, `src/lib/personalization.ts` |
| Layout editor | Готово | `src/components/layout/layout-editor-overlay.tsx` |
| Light/dark ripple | Готово | `src/components/providers/theme-provider.tsx` |
| Локализация | 10 locale | `src/i18n`, `.github/LOCALIZATION.md` |
| Юридический центр | Готово | `src/lib/legal.ts`, `src/components/legal` |
| Build-time лицензии | Готово | `scripts/generate-licenses.mjs` |
| Реальный банковский backend | Вне scope прототипа | требуется отдельная server architecture |

## Маршруты

### Основные категории

- `/` — баланс, карты, быстрые действия и сводка;
- `/payments` — каталог и форма оплаты;
- `/cards` — карты и индивидуальные controls;
- `/history` — история с фильтрами;
- `/analytics` — финансовая аналитика;
- `/services` — расширенный каталог сервисов.

### Дополнительные сервисы

- `/savings`;
- `/bonuses`;
- `/subscriptions`;
- `/family`;
- `/support`.

### Динамические сценарии

- `/transfers/[slug]`;
- `/top-up/[slug]`;
- `/payments/[slug]`;
- `/operations/[slug]`;
- `/notifications/[id]`;
- `/settings/legal/[slug]`.

### Учётная запись и настройки

- `/profile`, `/profile/personal`, `/profile/contacts`, `/profile/documents`;
- `/settings` и пользовательские категории;
- `/settings/developer` и вложенные `layout`, `motion`, `system`, `theme`;
- `/settings/legal`, `/settings/licenses`, `/settings/about`.

### Публичная часть

- `/bank` — презентационный лендинг.

## Контракты данных

- `src/lib/schemas.ts` — формы и настройки учётной записи;
- `src/lib/operations.ts` — единая операция и её статусы;
- `src/lib/personalization.ts` — внешний вид, motion, layout и developer controls;
- `src/lib/cookies.ts` — hydration-safe browser persistence;
- `src/types/index.ts` — общие display-типы.

Zod является runtime-границей. UI не должен доверять JSON cookie или route data без проверки.

## Дизайн-система

- `src/app/globals.css` — semantic tokens, glass/glow layers, responsive rules;
- `src/components/ui` — Radix-backed primitives;
- `src/components/providers/personalization-provider.tsx` — публикация runtime variables;
- `src/lib/motion.ts` — easing registry;
- `src/components/providers/theme-provider.tsx` — theme state и circle transition.

## Персистентность

Все изменяемые пользователем demo-настройки сохраняются локально. Операции разделены на индекс и отдельные cookie, чтобы история не упиралась в размер одной записи. Подробности: [`docs/OPERATIONS.md`](./docs/OPERATIONS.md).

## Проверка релиза

1. `bun install --frozen-lockfile`.
2. `bun run check`.
3. `bun run build`.
4. Проверка SPA-переходов и прямого reload динамических URL.
5. Проверка desktop, tablet и mobile в обеих темах.
6. Проверка keyboard, wheel, touch и reduced motion.
7. `git diff --check` и просмотр staged scope.

Полный инженерный checklist: [`docs/DEVELOPMENT.md`](./docs/DEVELOPMENT.md).
