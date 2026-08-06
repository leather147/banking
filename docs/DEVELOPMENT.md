# Разработка и проверка

## Окружение

- Bun 1.3+;
- Node-compatible среда, необходимая Next.js и build tooling;
- современный Chromium, Firefox или Safari для визуальной проверки;
- Git с включёнными Husky hooks.

```bash
bun install --frozen-lockfile
bun run dev
```

Next.js 16 может отличаться от предыдущих версий. Перед изменением framework API прочитайте соответствующий локальный документ в `node_modules/next/dist/docs` и соблюдайте [`AGENTS.md`](../AGENTS.md).

## Стиль кода

- TypeScript strict; не используйте `any`, если тип можно вывести или сузить.
- Domain schema определяется Zod и служит источником runtime validation и TypeScript type.
- Server Component остаётся server-side, пока ему действительно не нужны event handlers, browser API или React client hooks.
- Внутренняя навигация использует `Link`/`router`, а не `window.location`.
- Общий UI primitive не должен знать о конкретной операции или бренде.
- Responsive поведение сначала выражается CSS, а измерение viewport добавляется только для поведения, которое CSS не может выполнить.
- Hover меняет цвет, границу, glow или shadow, но не сдвигает layout.

## Комментарии

Комментарий нужен, когда код не объясняет:

- browser/framework lifecycle;
- ограничение формата или безопасности;
- синхронизацию server/client;
- причину ref, timer, sentinel или magic threshold;
- обратную совместимость persisted state;
- нетривиальный выбор производительности.

Не комментируйте очевидный JSX, название функции или простое присваивание. Комментарий должен объяснять «почему», invariant или отказ от более очевидного решения.

## Добавление экрана

1. Выберите route group и создайте `page.tsx`.
2. Вынесите интерактивный экран в функциональную область `src/components`.
3. Добавьте navigation entry только если это основная категория.
4. Для глубокого уровня используйте contextual back button.
5. Добавьте loading/empty/error state.
6. Проверьте прямое открытие URL и client navigation.
7. Добавьте локализацию и обновите документацию маршрутов.

## Добавление формы

1. Опишите schema в `src/lib/schemas.ts` или domain module.
2. Используйте React Hook Form и Zod resolver.
3. Примените маску только как представление; перед сохранением нормализуйте значение.
4. Покажите комиссию и источник до подтверждения.
5. Не создавайте успешную операцию до прохождения review.
6. Обеспечьте label, error message, keyboard и touch input.

## Проверки

```bash
bun run check
bun run build
```

`check` выполняет ESLint и `tsc --noEmit`. `build` дополнительно проверяет Next.js route graph и генерирует  JSON лицензий.

Перед merge визуально проверьте:

- dashboard, payments, transfer, top-up и operation receipt;
- settings overview, appearance, developer layout и licenses;
- light/dark ripple, включая быстрое двойное переключение;
- 390 px, tablet и 1440+ px;
- mouse wheel, trackpad, touch, keyboard и reduced motion;
- hard reload динамического slug;
- отсутствие ошибок в console и Next.js overlay.

## Лицензии

Каталог генерируется из установленного `node_modules`, поэтому изменение dependency требует `bun install` и `bun run licenses`. Не редактируйте `public/generated/licenses` вручную и не добавляйте его в Git.

## Локализация

Следуйте [`.github/LOCALIZATION.md`](../.github/LOCALIZATION.md). Новый текст считается готовым, когда ключ присутствует во всех слоях или имеет явно документированный fallback.

## Git workflow

1. Создайте тематическую ветку.
2. Не смешивайте случайные локальные файлы с изменением продукта.
3. Запустите check и build.
4. Просмотрите `git diff --check` и staged diff.
5. Используйте короткий commit subject в imperative form.
6. Push выполняйте явной веткой и проверяйте upstream.

## Production checklist

Прототип нельзя объявлять production-банком только после frontend deploy. Понадобятся как минимум:

- серверная аутентификация и управление сессиями;
- API с авторизацией на каждой операции;
- база данных, аудит, идемпотентность и reconciliation;
- rate limiting, CSRF/CSP, secret management и monitoring;
- threat model, penetration testing и dependency scanning;
- юридическая проверка текстов, consent и data retention;
- real-device accessibility и performance audit.
