# Канонічний план перебудови ігрового екрана

## Нова ціль

`GameScreen` має стати не екраном із RN-блоків, між якими вставлено Skia, а **єдиною сценою гри**:

- один full-screen `Canvas`
- одна система scene metrics
- один координатний простір
- окремі overlay-шари для input та accessibility
- дошка, таймер, header, logo, buttons, mode badge — усе як частини однієї сцени

---

# 1. Що саме змінюємо концептуально

## Поточна схема

Зараз екран гри побудований як RN layout stack:

- `GameScreen`
- `GameScreenShell`
- усередині нього вставляються:
  - `AppGameHeader`
  - timer placeholder
  - `GameBoardView`
  - buttons placeholder
  - CTA placeholder

Це вже не відповідає цільовій архітектурі.

## Нова схема

Має бути так:

- `GameScreen` — orchestration screen
- `GameSceneCanvas` — **єдиний full-screen Canvas**
- `useGameSceneMetrics` — **єдине джерело геометрії сцени**
- `BoardGestureOverlay` — overlay тільки над зоною дошки
- `GameSceneOverlay` — overlay для header / buttons / mode badge / a11y
- `useGameSessionController` — режим гри, таймер, win / lose, restart

---

# 2. Головний принцип: одна сцена, але не одна логіка

Не можна змішувати всю архітектуру в один файл. Має бути три окремі рівні.

## A. Session layer

Відповідає за:

- `mode`
- `initialSeconds`
- countdown
- `ended`
- `restart`
- `win / lose transition`

Це не логіка дошки, а **логіка сесії гри**.

---

## B. Board core

Лишається окремо:

- `useGameBoardController.ts`
- `gameBoardModel.ts`
- `boardGeometry.ts`

Це ядро дошки. Його не треба змішувати з timer / header / buttons.

---

## C. Scene render layer

Відповідає за:

- full-screen `Canvas`
- усі Skia skin-компоненти
- розкладку scene frame-ів
- композицію сцени

Саме тут житимуть:

- header skin
- logo skin
- timer skin
- board skin + tiles
- button skins
- mode badge skin

---

# 3. Що змінюємо у файловій структурі

## `GameScreenShell` втрачає роль канону

`GameScreenShell.tsx` у поточному вигляді більше не є канонічною основою ігрового екрана.

Не обов’язково видаляти файл одразу, але **архітектурно він більше не фундамент**.

Зараз він мислить слотами:

- timer slot
- board slot
- buttons slot
- cta slot

Нова система має мислити frame-ами сцени:

- `headerFrame`
- `logoFrame`
- `soundFrame`
- `timerFrame`
- `boardFrame`
- `homeButtonFrame`
- `restartButtonFrame`
- `modeBadgeFrame`

---

## Нові канонічні файли

### `src/ui/gameScene/useGameSceneMetrics.ts`

Єдине джерело truth для геометрії сцени.

Має повертати:

- `screenW`
- `screenH`
- `safeFrame`
- `safeInsets`
- `headerFrame`
- `logoFrame`
- `soundFrame`
- `timerFrame`
- `boardFrame`
- `homeButtonFrame`
- `restartButtonFrame`
- `modeBadgeFrame`

Цей хук **обов’язково** має бути safe-area-aware та реактивним до зміни розмірів вікна.

---

### `src/ui/gameScene/GameSceneCanvas.tsx`

Full-screen canvas, який рендерить всю сцену.

Він **не керує логікою гри**. Він лише приймає:

- `frames`
- `mode`
- `timeLeftMsSV` / `progressSV`
- `board render props`
- `fonts`
- `press states`
- `sound state`
- інші готові scene props

---

### `src/ui/gameScene/GameSceneOverlay.tsx`

RN overlay для натискань поза дошкою та для accessibility.

Має покривати:

- sound
- home
- restart
- mode badge, якщо він натискальний

Ключове правило:
**Skia малює, overlay приймає input і несе accessibility.**

---

### `src/ui/gameScene/useGameSessionController.ts`

Окремий session hook, який:

- читає `mode`
- створює timer logic
- дає `timeLeftMsSV`
- дає `progressSV`
- дає `isGameOver`
- дає `handleWin`
- дає `handleRestart`

---

# 4. Як перебудувати дошку під одну сцену

Зараз `GameBoardView.tsx` — це композиційний вузол, який:

- створює `Canvas`
- монтує `BoardSkin`
- монтує `BoardTileNode`
- монтує `BoardGestureOverlay`

Для нової архітектури його треба **розщепити на дві частини**.

## Було

`GameBoardView = Canvas + board render + gesture overlay`

## Має стати

### `GameBoardSceneLayer.tsx`

Повертає **тільки Skia scene nodes**, без власного `Canvas`.

Тобто:

- `BoardSkin`
- tile nodes
- усе, що малює дошку

Цей layer рендериться всередині `GameSceneCanvas`.

---

### `BoardGestureOverlay.tsx`

Лишається окремим RN overlay, але вже позиціонується по `boardFrame`.

Overlay живе поверх full-screen scene, а не всередині окремого mini-canvas.

---

## Що це дає

- один Canvas на весь екран
- поточна сильна архітектура drag / tap не ламається
- input по дошці лишається керованим окремо
- scene стає канонічною

---

# 5. Новий потік даних

## Вхід у гру

`NewGameScreen` має передавати не лише `mode`, а нормальний session config.

Наприклад:

- `mode: "classic"`
- або
- `mode: "limitTime", initialSeconds: 120`

---

## `GameScreen`

`GameScreen` збирає все докупи:

- читає route params
- створює `sessionController`
- створює `boardController`
- створює `sceneMetrics`
- перевіряє `fontsReady`
- передає все в `GameSceneCanvas`
- монтує overlays
- обробляє `onWin`
- обробляє `onTimeout`
- обробляє `restart`

---

## `GameSceneCanvas`

Малює:

- background
- header frame
- logo
- sound button skin
- timer skin
- board layer
- home button skin
- restart button skin
- mode badge skin

---

## Overlays

### `BoardGestureOverlay`

Працює тільки над `boardFrame`.

### `GameSceneOverlay`

Працює тільки для screen controls:

- sound
- home
- restart
- mode badge

---

# 6. Таймер: де саме він має жити

Таймер **не належить дошці**.

Він має жити в `useGameSessionController`.

## Чому

Бо таймер належить:

- не `board model`
- а `game mode / session rules`

## Що саме має видавати таймер

Джерело істини — **числове значення у `SharedValue<number>`**, а не React state у верхньому дереві екрана.

Session layer має давати:

- `timeLeftMsSV`
- `progressSV`
- `remainingSeconds`, якщо потрібно для побічної логіки
- `isExpired`

### Важливе правило

Не можна дозволяти таймеру щосекунди викликати React re-render усього `GameScreen` або `GameSceneCanvas`.

Текст таймера (`MM:SS`) має або:

- виводитися з derived значення локально в timer layer,
- або ізольовано оновлювати тільки timer subtree,

але не змушувати перебудовувати всю сцену.

---

## Поведінка режимів

### `classic`

- timer hidden
- countdown inactive

### `limitTime`

- timer visible
- countdown active from first frame of game screen
- на `0` → `LoseScreen`

---

# 7. Accessibility

Skia малює пікселі, але не створює нативні accessibility-елементи сама по собі.

Тому всі інтерактивні screen controls, які намальовані в Skia, повинні мати RN overlay-елементи поверх них.

## Обов’язкові правила

Для прозорих RN overlay-блоків треба додавати:

- `accessible={true}`
- `accessibilityRole="button"`
- `accessibilityLabel="..."`

А де доречно — ще й `accessibilityState`.

Це стосується щонайменше:

- кнопки звуку
- кнопки Home
- кнопки Restart
- mode badge, якщо він натискальний

---

# 8. Safe Area та реактивні метрики

Оскільки `GameSceneCanvas` займає весь екран, `useGameSceneMetrics` **обов’язково** має враховувати системні відступи.

Потрібно використовувати:

- `useSafeAreaInsets()`
- `useSafeAreaFrame()`

Усі ключові frame-и сцени мають рахуватись від safe-area-aware frame, а не від голого `Dimensions.get("window")`.

Це особливо важливо для:

- header
- logo
- timer
- нижніх кнопок
- mode badge
- позиції дошки

---

# 9. Шрифти та текст у Skia

Текст у Skia не дорівнює звичайному RN `<Text />`.

`GameSceneCanvas` не повинен входити в бойовий text rendering, доки шрифти не готові.

## Правила

- логіка завантаження шрифтів має відпрацювати **до** рендеру scene text
- `fontsReady` має блокувати нестабільний рендер сцени з текстом
- не можна допускати layout shift або мигання через пізнє завантаження шрифтів

Якщо в проєкті вже є `FontProvider.tsx`, він має залишатися джерелом готовності шрифтів.

---

# 10. Shader-first policy

Для ігрового екрана декоративні ефекти глибини не будуються через:

- blur
- mask filters
- live shadow effects

Натомість використовуються:

- runtime shaders
- texture-based effects
- gradient / light shaders
- інші дешевші shader-driven прийоми

## Практичне правило

У hot path ігрового екрана заборонено додавати нові декоративні ефекти через:

- `Blur`
- `Mask`
- `MaskFilter`
- важкі live shadow-ефекти

без окремого явного обґрунтування.

## Додаткові правила

- `Skia.RuntimeEffect.Make()` виконується один раз на рівні модуля
- skin-компоненти не повинні містити бойову логіку гри
- canvas сцени не повинен залежати від частих React re-render там, де можна використати `SharedValue` / `DerivedValue`

---

# 11. Якою має бути нова структура компонентів

Орієнтовно так:

```text
GameScreen
 ├─ useGameSessionController(...)
 ├─ useGameBoardController(...)
 ├─ useGameSceneMetrics(...)
 ├─ <View style={{ flex: 1 }}>
 │   ├─ <GameSceneCanvas ... />
 │   ├─ <BoardGestureOverlay boardFrame=... />
 │   └─ <GameSceneOverlay ... />
```

А всередині `GameSceneCanvas`:

```text
Canvas
 ├─ BackgroundLayer
 ├─ HeaderLayer
 │   ├─ LogoSkin
 │   └─ SoundButtonSkin
 ├─ TimerLayer
 ├─ BoardLayer
 │   ├─ BoardSkin
 │   └─ BoardTileNodes
 ├─ ActionButtonsLayer
 │   ├─ HomeButtonSkin
 │   └─ RestartButtonSkin
 └─ ModeBadgeLayer
```

---

# 12. Що робити з `TimerSkin.tsx`

`TimerSkin.tsx` лишається корисним, але в новій архітектурі змінює статус.

## Було

Окремий компонент із власною внутрішньою логікою розмірів і margin.

## Має стати

Частиною scene system, яка отримує ззовні:

- `frame`
- `timeLeftMsSV` / `progressSV`
- `font`
- `shader params`

Тобто менше “сам розраховую layout”, більше “отримую готовий frame від scene metrics”.

Це також готує систему до майбутніх settings: settings змінює scene tokens, а не кожен skin окремо.

---

# 13. Що робити з header / logo / buttons / mode badge

Їх треба проектувати **не як окремі RN-компоненти**, а як scene elements.

Тобто не:

- `AppGameHeader` як RN-block

а:

- `GameHeaderLayer`
- `LogoSkin`
- `SoundButtonSkin`
- `HomeButtonSkin`
- `RestartButtonSkin`
- `ModeBadgeSkin`

Усі вони мають працювати в одному координатному просторі сцени.

---

# 14. Що з швидкодією

Головна умова така:

## Безпечний сценарій

- один full-screen canvas
- shader-driven skins
- без blur / mask / live shadow
- overlay input окремо
- board motion на shared values
- scene structure стабільна
- timer не провокує re-render усього екрана

## Поганий сценарій

- timer через React state кожну секунду перебудовує півекрана
- press state кнопок перерендерює canvas-дерево
- layout frame-и перераховуються хаотично
- skin-компоненти самі вирішують свої розміри
- логіка дошки змішується з логікою сцени
- safe area та resize обробляються запізно або фрагментарно

Оце треба не допустити.

---

# 15. Найкращий порядок впровадження

## Крок 1

Створити `useGameSceneMetrics()` і зафіксувати всі frame-и нового екрана.

Одразу закласти:

- `useSafeAreaInsets()`
- `useSafeAreaFrame()`
- реакцію на resize / split-screen / orientation changes

Без цього далі рухатися не варто.

---

## Крок 2

Створити `GameSceneCanvas.tsx` з full-screen canvas, але поки без повного переносу всіх елементів.

На цьому кроці вже мають існувати frame-и для:

- background
- header
- timer
- board
- action buttons
- mode badge

---

## Крок 3

Розщепити `GameBoardView` на:

- `GameBoardSceneLayer`
- `BoardGestureOverlay`

Це ключовий крок.

---

## Крок 4

Перенести дошку в `GameSceneCanvas`.

Тобто дошка вже малюється як частина повної сцени.

---

## Крок 5

Перенести `TimerSkin` у сцену.

Не як placeholder, а як реальний scene element, який живе від `SharedValue` і не провокує загальний React re-render.

---

## Крок 6

Додати `GameSceneOverlay` для:

- sound
- home
- restart
- mode badge

На цьому ж кроці додати accessibility-властивості.

---

## Крок 7

Додати `useGameSessionController`:

- `classic / limitTime`
- countdown
- restart reset
- lose transition
- guard від подвійного завершення гри

---

## Крок 8

Переконатися, що scene text рендериться тільки після готовності шрифтів.

---

## Крок 9

Лише після цього вмикати settings, які будуть змінювати:

- timer duration
- theme tokens
- shader params
- layout / look variants

---

# 16. Підсумок

Цільова архітектура ігрового екрана має бути такою:

- **канонічний `GameScreen`**
- **один full-screen `GameSceneCanvas`**
- **одна scene metrics system**
- **дошка як scene layer, а не окремий mini-screen**
- **overlay input окремо**
- **overlay accessibility окремо**
- **session logic окремо**
- **shader-first policy як правило проєкту**
- **safe-area-aware та resize-aware метрики як обов’язкова частина сцени**

У цій логіці `GameScreenShell` у нинішньому вигляді вже не фундамент, а тимчасовий етап, який треба зняти з ролі канону.
