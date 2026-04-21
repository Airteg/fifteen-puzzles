Так. Нижче даю **коротку AI-специфікацію** у стилі проектних документів, але вже як **план зміни поточної структури**, а не просто опис нової.

---

# AI Feature Specification — Game Result Flow Refactor

## 1. Мета

Перебудувати поточний flow завершення гри в **один канонічний template-based result flow**.

Замість поточної змішаної структури, де:

- `GameResultScreen` розгалужує рендер між `VideoResultScene` і `WinRecordScene`,
- а в navigation ще залишаються legacy `WinScreen` / `LoseScreen`,
  потрібно перейти до одного result-модуля з чітким split:
- `GameResultScreen` = orchestrator
- `GameResultScene` = тільки Skia-візуал
- `GameResultOverlay` = тільки RN/native overlay
- `resultPresentation` = presentation-config на базі `reason`

---

## 2. Що вважати каноном після рефакторингу

Канонічний result-flow має виглядати так:

`NewGameScreen -> GameScreen -> GameResultScreen -> GameResultScene + GameResultOverlay`

`GameScreen.tsx` і далі залишається єдиним місцем, де:

- визначається завершення гри,
- формується `reason`,
- викликається `navigation.replace("GameResult", resultParams)`

`GameResultScreen.tsx` і далі залишається єдиним route для завершення гри, але більше **не рендерить різні scene-компоненти під різні кейси**.
Він має збирати один template з presentation-config.

---

## 3. Нова цільова структура

```text
src/screens/components/GameResult/
  index.ts
  result.types.ts
  resultLogic.ts
  resultPresentation.ts
  useGameResultLayout.ts
  GameResultScene.tsx
  GameResultOverlay.tsx
  assets/
    videoCatalog.ts
```

---

## 4. Що треба змінити у поточній структурі

### 4.1. Зберегти

Зберегти як основу:

- `src/screens/GameResultScreen.tsx`
- `src/screens/components/GameResult/result.types.ts`
- `src/screens/components/GameResult/resultLogic.ts`

### 4.2. Додати

Створити нові файли:

- `resultPresentation.ts`
- `useGameResultLayout.ts`
- `GameResultScene.tsx`
- `GameResultOverlay.tsx`
- `assets/videoCatalog.ts`

### 4.3. Прибрати з активного flow

Прибрати з бойового result-flow:

- `src/screens/components/GameResult/VideoResultScene.tsx`
- `src/screens/components/GameResult/WinRecordScene.tsx`

Тобто:

- не використовувати їх у `GameResultScreen.tsx`
- не вважати їх каноном
- після завершення рефакторингу або видалити, або винести з бойової структури як legacy/archive

### 4.4. Прибрати legacy routes

З `RootNavigator.tsx` прибрати routes:

- `Win`
- `Lose`

Бо зараз реальний active flow уже йде через `GameResult`, а `WinScreen` / `LoseScreen` лишаються лише як історичні залишки в navigator.

### 4.5. Прибрати legacy screens

Після переведення всього result-flow на template прибрати:

- `src/screens/WinScreen.tsx`
- `src/screens/LoseScreen.tsx`

Причина:

- вони не беруть участі в поточному бойовому flow,
- їхня навігаційна логіка застаріла,
- вони не відповідають актуальній моделі `Game({ mode })`.

### 4.6. Синхронізувати route types

Після видалення legacy routes синхронізувати navigation types:

- прибрати legacy route contracts для `Win` / `Lose`, якщо вони ще присутні,
- залишити канонічний route `GameResult` з payload:
  - `reason`
  - `durationMs`
  - `moves`
  - `startedAt`
  - `mode`

---

## 5. Новий розподіл відповідальностей

### `resultLogic.ts`

Відповідає тільки за:

- domain decision: який `reason` отримано

Не відповідає за:

- відео
- layout
- кнопки
- scene composition

### `resultPresentation.ts`

Відповідає тільки за:

- presentation-config для кожного `reason`

Тут має визначатися:

- який video asset/pool використати
- який `videoVariant`
- який `accentVariant`
- яка primary button action
- який label кнопки

### `useGameResultLayout.ts`

Єдине джерело локальної геометрії для:

- `GameResultScene`
- `GameResultOverlay`

Має рахувати:

- `videoFrame`
- `accentFrame`
- `buttonFrame`
- допоміжні text/meta rects при потребі

Локальний derived layout у цьому місці дозволений, бо він базується на canonical frame + `S/snap` і не створює окремого screen-level layout builder.

### `GameResultScene.tsx`

Тільки Skia:

- frame для відео
- accent surface
- primary button surface
- background / chrome

### `GameResultOverlay.tsx`

Тільки RN/native:

- `VideoView`
- `Pressable` для primary button
- додаткові overlay-елементи за потреби

Це відповідає проектному канону:
**Skia малює surface, RN дає interaction/native layer**.

---

## 6. Канонічний template result-екрана

Після рефакторингу template має складатися з трьох зон:

### 6.1. `videoFrame`

Обов’язкова зона.
Всередині неї overlay кладе `VideoView`, а scene малює зовнішній Skia-frame.

### 6.2. `accentSlot`

Опційна зона під відео.
Має існувати в layout-contract, але може:

- містити animation/decor block,
- або бути візуально порожньою.

### 6.3. `primaryActionButton`

Єдина нижня кнопка.
На цьому етапі шаблон закладається **під одну Skia-кнопку**, а не під одну/дві.

---

## 7. Канонічний button policy

Поточний template result-екрана закладається **тільки під одну primary button**.

Друга кнопка (`Restart`) зараз **не закладається в геометрію шаблону**.

Причина:

- це ускладнює scene,
- ускладнює overlay hit-zones,
- створює зайву варіативність layout без затвердженого UX-рішення.

Отже поточний канон:

- одна кнопка внизу,
- для різних result-кейсів змінюється лише її роль.

### Поточний action contract:

- `normal_win` -> `NEW GAME`
- `time_loss` -> `NEW GAME`
- `record_win` -> `HOME`

Це має жити в `resultPresentation.ts`, а не в `GameResultScene.tsx`.

---

## 8. Канонічний video policy

Усі result-кейси, включно з `record_win`, тепер мають підтримуватися через MP4/video-driven flow.

Тобто:

- `normal_win` -> random video із win-pool
- `time_loss` -> random video із lose-pool
- `record_win` -> prepared record video (single asset або pool)

Через це окремий `WinRecordScene.tsx` як спеціальний тип scene більше не потрібен.

---

## 9. Канонічний presentation contract

`result.types.ts` потрібно розширити так, щоб у модулі були не тільки domain types, а й presentation types.

Мають бути введені такі контракти:

### `ResultVideoVariant`

- `tall`
- `square`

### `ResultAccentVariant`

- `none`
- `win`
- `lose`
- `record`

### `ResultPrimaryActionKind`

- `new_game`
- `home`

### `GameResultPresentation`

Має містити:

- `title`
- `video`
- `accent`
- `primaryAction`

---

## 10. Що оновити в документації

Після завершення рефакторингу оновити:

- `AI_RULES.md` — якщо змінюється канон result-flow
- `AI_INDEX.md`
- `ARCHITECTURE.md`

Це потрібно, бо зараз документація ще частково розходиться з реальним кодом: у navigator і архітектурних описах ще видно legacy `Win` / `Lose`, тоді як реальний бойовий flow уже центрується навколо `GameResult`.

---

## 11. Підсумковий план дій

### Крок 1

Зберегти:

- `GameResultScreen.tsx`
- `result.types.ts`
- `resultLogic.ts`

### Крок 2

Додати:

- `resultPresentation.ts`
- `useGameResultLayout.ts`
- `GameResultScene.tsx`
- `GameResultOverlay.tsx`
- `assets/videoCatalog.ts`

### Крок 3

Переписати `GameResultScreen.tsx` так, щоб він:

- більше не switch-ререндерив `VideoResultScene` / `WinRecordScene`
- а збирав один template через `presentation + layout`

### Крок 4

Вивести з активного flow:

- `VideoResultScene.tsx`
- `WinRecordScene.tsx`

### Крок 5

Прибрати з navigation:

- `Win`
- `Lose`

### Крок 6

Видалити або заархівувати:

- `WinScreen.tsx`
- `LoseScreen.tsx`

### Крок 7

Синхронізувати route types під єдиний `GameResult`

### Крок 8

Оновити:

- `AI_INDEX.md`
- `ARCHITECTURE.md`
- за потреби `AI_RULES.md`

---

# Короткий фінальний канон

Після рефакторингу в проекті має бути не “екран виграшу / екран програшу / екран рекорду”, а:

**єдиний `GameResult` template flow**, де:

- `reason` визначає `resultLogic`
- `presentation` визначає `resultPresentation`
- `layout` визначає `useGameResultLayout`
- Skia-візуал живе в `GameResultScene`
- native/video/pressables живуть у `GameResultOverlay`

Якщо хочеш, наступним повідомленням я можу зробити ще й **дуже короткий prompt для нового чату**, щоб ти дав його ШІ перед реалізацією цього рефакторингу.
