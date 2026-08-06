# Персонализация и motion

## Принцип

Персонализация конфигурирует приложение, не меняя его структурную идентичность. Пользователь может управлять визуальной интенсивностью, плотностью и порядком блоков, но компоненты сохраняют банковскую семантику и доступность.

Источник истины — `personalizationSchema`. Defaults позволяют открывать cookie из предыдущей версии: Zod добавляет новые поля и отбрасывает полностью невалидное значение.

## Категории

### Тема и цвет

- light/dark;
- accent palette;
- background style и intensity;
- ambient glow;
- изменяемое название банка.

Сетка фона остаётся частью базовой визуальной системы даже при отключении цветного background.

### Glass

- blur on/off и radius;
- opacity, saturation и contrast;
- border opacity и shadow intensity;
- noise layer;
- mobile bottom fade opacity.

Отключение blur не должно ухудшать контраст текста. CSS обязан подставлять более плотную поверхность.

### Интерфейс

- `interfaceScale` и density;
- radius scale;
- compact card mode и card display style;
- balance visibility;
- touch target size и focus contrast.

Scale применяется через CSS variable, а responsive breakpoints остаются viewport-based. Это предотвращает неожиданный переход desktop layout в mobile только из-за масштаба.

### Motion

- глобальное включение;
- множитель скорости;
- route, panel, modal и micro easing;
- route perspective;
- dock magnification и touch momentum.

Все длительности делятся на `motionSpeed`: меньшее значение делает переход медленнее. `prefers-reduced-motion` имеет приоритет над декоративной анимацией.

## Theme ripple

Ripple рисуется отдельным fixed-элементом поверх UI. Тема применяется примерно на 70% expansion, когда круг уже перекрыл viewport, после чего overlay плавно исчезает.

Lifecycle хранится в refs:

- активная Web Animation отменяется перед новым toggle;
- pending timer очищается;
- overlay удаляется при unmount;
- requested theme резервируется сразу для корректного двойного переключения.

Cleanup должен быть mount-scoped. Если привязать его к state темы, React отменит ripple в момент `applyTheme` и оборвёт финальный fade.

## Порядок элементов

Настраиваются:

- основная и дополнительная навигация;
- быстрые действия;
- dashboard sections;
- topbar items.

`normalizeOrder` сохраняет известный пользовательский порядок, удаляет устаревшие id и дописывает новые элементы. Поэтому добавление функции в следующем релизе не требует сброса cookie.

Layout editor использует Motion `Reorder.Group`. Плавающая панель имеет собственные x/y offsets и после drag примагничивается к ближайшему краю. Порядок сохраняется сразу; отдельной кнопки «Применить» нет.

## Добавление настройки

1. Добавьте поле с ограничениями и default в `personalizationSchema`.
2. Добавьте control в подходящую категорию settings.
3. Спроецируйте значение в data attribute, CSS variable или конкретный component contract.
4. Обеспечьте безопасный fallback для выключенного эффекта.
5. Проверьте hard reload со старой и новой cookie.
6. Добавьте строку во все locale, если control имеет новый текст.

## Что не следует хранить

В personalization cookie нельзя помещать платёжные данные, access token, секрет, документ пользователя или произвольный CSS/HTML. Название бренда ограничивается схемой; цвет выбирается из registry, а не вставляется как неподтверждённая строка.
