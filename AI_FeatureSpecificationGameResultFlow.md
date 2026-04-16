# Специфікація фічі: `GameResult` flow

## 1. Призначення

`GameResult` — це **єдиний orchestration-flow завершення гри**, який обслуговує три сценарії:

- `normal_win` — гравець виграв, але не встановив новий рекорд
- `record_win` — гравець виграв і встановив новий рекорд
- `time_loss` — у режимі `limitTime` час вийшов

Ця модель замінює підхід з окремими канонічними `WinScreen` і `LoseScreen`. Вона краще відповідає поточному screen/component патерну проекту, де screen є тонким orchestrator, а feature-specific вузли живуть у `src/screens/components/...`

---

## 2. Файлова структура

```text
src/
└── screens/
    ├── GameResultScreen.tsx
    └── components/
        └── GameResult/
            ├── result.types.ts
            ├── resultAssets.ts
            ├── resultLogic.ts
            ├── VideoResultScene.tsx
            └── WinRecordScene.tsx
```

### Ролі файлів

#### `src/screens/GameResultScreen.tsx`

Головний екран-маршрутизатор.
Не містить складної власної верстки.
Отримує `route.params`, визначає потрібну сцену і рендерить її.

#### `src/screens/components/GameResult/result.types.ts`

Містить:

- `GameResultReason = "normal_win" | "record_win" | "time_loss"`
- типи route params для `GameResult`
- типи пропсів для сцен
- спільні типи metadata результату гри

#### `src/screens/components/GameResult/resultAssets.ts`

Статичний реєстр медіа-ресурсів:

- 5 ordinary win videos
- 5 lose videos
- 1 audio track для `record_win`
- metadata для ресурсів, якщо потрібна тривалість, id або label

#### `src/screens/components/GameResult/resultLogic.ts`

Містить чисту логіку:

- helper для визначення `GameResultReason`
- `useRandomVideo(kind: "win" | "lose")`
- при потребі — helper для вибору audio/video metadata

#### `src/screens/components/GameResult/VideoResultScene.tsx`

Сцена для:

- `normal_win`
- `time_loss`

Монтує fullscreen video-player, керує one-shot playback і UI-кнопками.

#### `src/screens/components/GameResult/WinRecordScene.tsx`

Сцена для `record_win`.

Монтує:

- Skia Canvas
- trophy image
- shader confetti layer
- timeline-driven animation
- окремий audio track

---

## 3. Route і navigation policy

### Новий канонічний route

У навігації вводиться новий route:

- `GameResult`

Поточні `Win` і `Lose` routes перестають бути канонічними для runtime-flow результатів гри. Вони можуть тимчасово залишатися в коді до міграції, але не повинні бути джерелом істини для нової фічі

### Канонічний navigation call

Після завершення гри викликається:

```ts
navigation.replace("GameResult", params);
```

Саме `replace`, а не `navigate`, щоб:

- не накопичувати старий `Game` route у стеку
- не створювати зайвий back-stack до завершеної сесії

---

## 4. Канонічний тип результату

```ts
type GameResultReason = "normal_win" | "record_win" | "time_loss";
```

### Правила визначення

#### `time_loss`

Якщо час у режимі `limitTime` вийшов:

- reason = `time_loss`

#### `record_win`

Якщо дошка зібрана і:

- `previousBestTime === 0`
  **або**
- `currentTime < previousBestTime`

то:

- reason = `record_win`

#### `normal_win`

Якщо дошка зібрана і:

- `previousBestTime > 0`
- `currentTime >= previousBestTime`

то:

- reason = `normal_win`

---

## 5. Ключове правило порядку дій

### Канонічний порядок у `GameScreen`

1. Визначити факт завершення гри
2. Зчитати **поточний previous bestTime**
3. Обчислити `reason`
4. Записати статистику через `recordWin(...)` або `recordLoss()`
5. Викликати `navigation.replace("GameResult", params)`

### Важлива причина

`recordWin(...)` уже змінює `statistics.bestTime` і `bestGames`, тому `reason` не можна визначати **після** persistence, інакше рішення буде базуватись не на попередньому рекорді, а вже на оновленому стані

---

## 6. Route params для `GameResult`

Канонічно `GameResultScreen` отримує через `route.params` усе потрібне для сцени, не змушуючи сцену самостійно відновлювати контекст завершеної сесії.

### Мінімально потрібні params

```ts
type GameResultRouteParams = {
  reason: GameResultReason;
  durationMs: number;
  moves: number;
  startedAt: string;
  mode: "classic" | "limitTime";
};
```

### Пояснення

- `reason` — визначає сценарій
- `durationMs` — фактичний результат гри
- `moves` — кількість ходів
- `startedAt` — час початку сесії
- `mode` — корисний для UI/analytics/debug

---

## 7. Алгоритм data flow

## Крок 1. Завершення гри в `GameScreen`

Коли:

- або дошка зібрана
- або в `limitTime` таймер дійшов до нуля

`GameScreen`:

- бере `previousBestTime`
- обчислює `reason`
- оновлює statistics
- робить `navigation.replace("GameResult", params)`

## Крок 2. Оркестрація в `GameResultScreen`

`GameResultScreen` отримує `route.params.reason` і виконує switch:

- `record_win` → `<WinRecordScene ... />`
- `normal_win` → `<VideoResultScene type="win" ... />`
- `time_loss` → `<VideoResultScene type="lose" ... />`

## Крок 3. Виконання сцени

Сама сцена:

- запускає media
- керує локальним UI-станом
- показує кнопки у визначений момент
- вирішує navigation actions типу Home / Restart

---

## 8. Канонічна поведінка `VideoResultScene`

`VideoResultScene` використовується для:

- ordinary win
- time loss

### Джерело медіа

- `type="win"` → випадкове відео з ordinary win registry
- `type="lose"` → випадкове відео з lose registry

### Playback policy

Канонічний режим:

- **one-shot playback**
- не loop

### UI policy

#### Для `normal_win`

- через **1 секунду** після відкриття екрану з’являється кнопка `Home`
- також може бути кнопка `Restart`, якщо ми її погодимо окремо

#### Для `time_loss`

- кнопки можуть з’являтися або одразу, або за окремим delay
- це треба зафіксувати окремим дрібним рішенням під UX
- але канонічно це все ще `VideoResultScene type="lose"`

### Layout policy

`VideoResultScene` не зобов’язана бути Skia-based.
Для цього сценарію asset-driven video playback вважається нормальним і канонічним рішенням.

---

## 9. Канонічна поведінка `WinRecordScene`

`WinRecordScene` — це окрема scene-like feature для `record_win`.

### Склад сцени

- fullscreen чорний фон
- проявлення кубка
- confetti layer
- окремий sound track
- кнопки керування після завершення або skip

### Візуальний pipeline

#### Кубок

- звичайний `png` asset
- не shader-backed за замовчуванням
- може мати fade-in / scale-in / glow, якщо буде потрібно

#### Confetti

- окремий shader-layer
- може бути обмежений через clip / rounded region
- не реалізовується через RN `View` particles

Це узгоджується з поточним Skia/shader каноном проекту, де scene-like rendering має жити у Skia, а RN відповідає за interaction та orchestration

### Timeline policy

Тривалість сцени визначається тривалістю sound track.

Тобто:

- audio = master timeline
- animation phases нормалізуються відносно `durationMs`

Для record-сцени це особливо важливо, бо вона довга і має режисуру, а не просто разовий кліп.

---

## 10. Media policy

## Video assets

У `resultAssets.ts` мають бути:

- 5 win videos
- 5 lose videos

Кожен asset реєструється статично через `require(...)`.

## Audio assets

У `resultAssets.ts` також реєструється:

- record win sound track

### Важливе технічне правило

Специфікація **не повинна припускати наявність бібліотек, яких ще немає в залежностях**.

Поточний проект має:

- `expo-audio`
- не має `expo-video` у залежностях

Отже канон формулюється так:

- audio layer використовує доступну audio infrastructure або окремо погоджену нову залежність
- video layer потребує або встановлення video library, або окремого погодженого рішення

---

## 11. Interaction policy

Для result-flow діє той самий загальний канон проекту:

- Skia / video малюють пікселі
- RN layer дає interaction
- локальний pressed/open/visible state живе поруч з orchestrator або scene host

Це узгоджується з загальним interaction pattern проекту та Scene/Overlay split для scene-like вузлів

### Практично

- `VideoResultScene` може мати RN overlay для кнопок
- `WinRecordScene` може мати RN overlay для кнопок Home / Restart / Skip

---

## 12. Відповідальність `GameResultScreen`

`GameResultScreen`:

- **не** вибирає випадкове відео сам
- **не** містить shader logic
- **не** містить media playback details
- **не** містить складного timeline code

Його роль:

- прочитати params
- вибрати правильну сцену
- передати їй потрібні props

Це відповідає поточному канону тонкого screen-orchestrator у проекті

---

## 13. Що НЕ є каноном

Не є каноном для цієї фічі:

- окремі нові бойові `WinScreen` і `LoseScreen` як головні runtime routes
- визначення `record_win` після оновлення statistics
- loop playback як стандартна поведінка `VideoResultScene`
- confetti через сотні RN `View`
- припущення, що `expo-video` уже є в проекті
- змішування всього win/lose/result flow в одному великому файлі

---

## 14. Канонічне підсумкове рішення

Ми приймаємо такий канон:

- результат гри обслуговує **єдиний route**: `GameResult`
- reason має 3 стани:
  - `normal_win`
  - `record_win`
  - `time_loss`

- `GameScreen` обчислює `reason` **до** persistence
- `GameResultScreen` є тонким orchestrator
- `VideoResultScene` використовується для ordinary win і time loss
- `WinRecordScene` — окрема Skia-driven сцена
- ordinary/lose відео відтворюються як **one-shot**
- record animation працює по audio-driven timeline
- confetti для record scene реалізується через shader layer, а не RN particle views

---

## 15. Що треба буде оновити після прийняття цього канону

Після затвердження цієї специфікації треба буде синхронізувати:

- `ARCHITECTURE.md`
- `AI_INDEX.md`
- `AI_RULES.md`

А також:

- `RootNavigator.tsx`
- `RootStackParamList`
- `GameScreen.tsx`
- поточні `WinScreen.tsx` / `LoseScreen.tsx`

бо зараз навігація ще канонічно спирається на `Win` і `Lose` routes

---

Ось покроковий технічний план реалізації цієї специфікації без коду.

## Етап 1. Підготувати новий navigation contract

Спочатку треба перевести навігацію з моделі `Win` / `Lose` на модель `GameResult`.

### Зміни

- додати новий route `GameResult` у `RootStackParamList`
- описати його params у новому `result.types.ts`
- підключити `GameResultScreen` у `RootNavigator`
- старі `Win` і `Lose` routes поки не видаляти одразу, а вивести з канонічного flow

### Результат етапу

Навігація вже знає про `GameResult`, але `GameScreen` ще може тимчасово ходити у старі екрани.

---

## Етап 2. Завести файловий каркас фічі

Створити порожні файли:

- `src/screens/GameResultScreen.tsx`
- `src/screens/components/GameResult/result.types.ts`
- `src/screens/components/GameResult/resultAssets.ts`
- `src/screens/components/GameResult/resultLogic.ts`
- `src/screens/components/GameResult/VideoResultScene.tsx`
- `src/screens/components/GameResult/WinRecordScene.tsx`

### Результат етапу

Є чистий скелет feature-area, який відповідає канону screen + screen-specific components.

---

## Етап 3. Формалізувати типи результату

У `result.types.ts` треба зафіксувати:

- `GameResultReason`
- route params для `GameResult`
- props для `VideoResultScene`
- props для `WinRecordScene`
- типи для video/audio asset entries

### Рішення, яке треба зафіксувати одразу

Я б радив у params передавати:

- `reason`
- `durationMs`
- `moves`
- `startedAt`
- `mode`

Цього достатньо для orchestration і UI.

### Результат етапу

Уся фіча отримує один чіткий type contract.

---

## Етап 4. Описати asset registry

У `resultAssets.ts` треба зробити статичний реєстр:

- 5 ordinary win videos
- 5 lose videos
- 1 record track
- `cup.png` як trophy asset

### Важливо

Поки не змішувати тут playback logic.
Це має бути саме **реєстр ресурсів**, а не сервіс.

### Результат етапу

Всі сцени беруть assets з одного місця.

---

## Етап 5. Винести чисту логіку вибору результату

У `resultLogic.ts` треба зробити дві незалежні речі.

### Перше

Чистий helper для визначення `GameResultReason` за:

- `didWin`
- `didTimeExpire`
- `currentDurationMs`
- `previousBestTime`

### Друге

Helper або hook для випадкового вибору відео:

- `useRandomVideo("win")`
- `useRandomVideo("lose")`

### Важливе правило

Логіка визначення `record_win` має працювати на **previousBestTime**, а не на вже оновленій статистиці.

### Результат етапу

`GameScreen` не містить розмазаної умовної логіки по всьому файлу.

---

## Етап 6. Перевести `GameScreen` на новий result-flow

Це ключовий етап.

### Що змінити

У `GameScreen.tsx`:

- перед записом статистики зчитувати `statistics.bestTime`
- обчислювати `reason`
- після `recordWin(...)` або `recordLoss()` викликати:
  - `navigation.replace("GameResult", params)`

### Окремо перевірити

- win flow після finish-анімації
- loss flow з countdown
- session guards, щоб не було подвійного переходу

### Результат етапу

Реальний runtime уже заходить у `GameResultScreen`.

---

## Етап 7. Зробити мінімальний `GameResultScreen`-оркестратор

На цьому кроці без красивого UI.

### Поведінка

`GameResultScreen`:

- читає `route.params.reason`
- рендерить:
  - `VideoResultScene type="win"`
  - або `VideoResultScene type="lose"`
  - або `WinRecordScene`

Поки можна навіть тимчасово дати прості заглушки всередині сцен.

### Результат етапу

Архітектурний роутинг уже живий.

---

## Етап 8. Реалізувати `VideoResultScene` у мінімальному бойовому вигляді

Спочатку не треба гнатися за всім одразу.

### Перший бойовий мінімум

- fullscreen container
- випадковий вибір win/lose video
- one-shot playback
- RN overlay для кнопок
- `Home`
- `Restart`

### UX-правила

- для `normal_win` кнопка `Home` з’являється через 1 секунду
- для `time_loss` правило появи кнопок краще одразу теж зафіксувати, а не залишати плаваючим

### Результат етапу

Ordinary win і loss уже працюють як продуктова фіча.

---

## Етап 9. Окремо підготувати media infrastructure

Тут потрібно прийняти технічне рішення щодо playback.

### Бо зараз у проекті

- є `expo-audio`
- немає підтвердженого video runtime у залежностях

### Тому на цьому етапі треба

- або додати і узгодити video library
- або тимчасово зробити `VideoResultScene` як каркас до встановлення залежності

### Результат етапу

Ти не застрягнеш на середині реалізації через невизначений media stack.

---

## Етап 10. Зробити `WinRecordScene` як окремий scene-пайплайн

Не намагатися одразу зробити фінальний шедевр.

### Правильний порядок

Спочатку:

- чорний фон
- trophy png fade-in
- простий placeholder для confetti layer
- запуск audio

Потім:

- timeline orchestration
- shader confetti
- фінальні кнопки

### Результат етапу

Record flow уже існує архітектурно, навіть якщо ще не поліруваний.

---

## Етап 11. Побудувати timeline для `WinRecordScene`

Тут варто мислити не “окремими анімаціями”, а фазами сцени.

### Наприклад

- фаза 1: чорний екран
- фаза 2: проявлення кубка
- фаза 3: старт confetti
- фаза 4: фінальний стабільний кадр
- фаза 5: показ кнопок / skip / finish UI

### Технічне правило

Audio = master timeline.

Тобто вся сцена має жити від:

- `durationMs`
- нормалізованого `t = 0..1`

### Результат етапу

Довга сцена стає керованою, а не хаотичною.

---

## Етап 12. Зробити shader confetti як окремий підшар

Не змішувати його одразу з усією сценою.

### Спочатку

- окремий shader prototype
- перевірка щільності, швидкості, кольорів
- перевірка clip area

### Потім

- інтеграція в `WinRecordScene`

### Результат етапу

Складний візуальний ефект розробляється ізольовано і не ламає сцену цілком.

---

## Етап 13. Додати кнопки і завершальний interaction layer

Коли сцени вже працюють, додається керування.

### Для `VideoResultScene`

- `Home`
- `Restart`

### Для `WinRecordScene`

- `Home`
- `Restart`
- можливо `Skip`, якщо ти цього захочеш

### За каноном проекту

- scene малює пікселі
- RN overlay дає натискання

### Результат етапу

Result-flow стає повністю завершеним з точки зору UX.

---

## Етап 14. Прибрати старий канон `WinScreen` / `LoseScreen`

Тільки після того, як новий flow уже реально працює.

### Що зробити

- відв’язати `GameScreen` від старих routes
- прибрати `Win` і `Lose` з root navigation
- або залишити тимчасово як legacy/debug, але не канон

### Результат етапу

У кодовій базі залишається один справжній result-flow.

---

## Етап 15. Оновити документацію

Після завершення архітектурної міграції треба синхронізувати:

- `ARCHITECTURE.md`
- `AI_INDEX.md`
- `AI_RULES.md`

### Що саме змінити

- замість `Win` / `Lose` описати `GameResult`
- додати нову feature-структуру
- зафіксувати orchestration і media policy

### Результат етапу

Документація не відстає від коду.

---

# Найправильніший порядок роботи без хаосу

Я б рекомендував іти саме так:

1. `GameResult` route + types
2. файловий каркас
3. `resultLogic`
4. перевід `GameScreen` на новий reason-flow
5. мінімальний `GameResultScreen`
6. мінімальний `VideoResultScene`
7. media stack
8. базовий `WinRecordScene`
9. timeline
10. shader confetti
11. кнопки
12. cleanup старих `Win/Lose` routes
13. документація

---

# Найважливіша практична порада

**Не починай із record-confetti.**
Починай із:

- route
- params
- reason
- `VideoResultScene`

Бо це дасть живий, перевіряємий flow дуже рано.
А `WinRecordScene` уже потім можна розвивати як окрему, красиву сцену.

---
