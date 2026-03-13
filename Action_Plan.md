## Нове архітектурне рішення

### Нова ціль

`GameScreen` має стати не екраном із RN-блоків, між якими вставлено Skia, а **єдиною сценою гри**:

- один full-screen `Canvas`
- одна система scene metrics
- один координатний простір
- окремі overlay-шари для input
- дошка, таймер, header, logo, buttons, mode badge — усе як частини однієї сцени

---

# 1. Що саме змінюємо концептуально

## Поточна схема

Зараз у тебе:

- `GameScreen`
- `GameScreenShell`
- RN layout stack
- усередині нього вставляються:
- `AppGameHeader`
- timer placeholder
- `GameBoardView`
- buttons placeholder
- CTA placeholder

Це вже не підходить.

## Нова схема

Має бути так:

- `GameScreen` — orchestration screen
- `GameSceneCanvas` — **єдиний full-screen Canvas**
- `GameSceneMetrics` — **єдине джерело геометрії сцени**
- `BoardGestureOverlay` — overlay тільки над зоною дошки
- `ScreenHitOverlay` — overlay для header/buttons/mode badge
- `useGameSessionController` — режим гри, таймер, win/lose, restart

---

# 2. Головний принцип: одна сцена, але не одна логіка

Тут важливо не змішати все в один файл.

### Має бути 3 рівні

## A. Session layer

Відповідає за:

- `mode`
- `initialSeconds`
- countdown
- `ended`
- `restart`
- `win / lose transition`

Тобто це не дошка, а **режим сесії гри**.

---

## B. Board core

Лишаємо окремо:

- `useGameBoardController.ts`
- `gameBoardModel.ts`
- `boardGeometry.ts`

Це ядро дошки. Його не треба змішувати з timer/header/buttons.

---

## C. Scene render layer

Відповідає за:

- повний Canvas
- всі Skia skin components
- розкладку фреймів
- композицію сцени

Саме тут житимуть:

- header skin
- logo skin
- timer skin
- board skin + tiles
- button skins
- mode badge skin

---

# 3. Що я пропоную зробити з файлами

## Видалити роль `GameScreenShell`

`GameScreenShell.tsx` у нинішньому вигляді більше не потрібен.

Не обов’язково фізично одразу видаляти файл, але **архітектурно він має перестати бути канонічним**.

Бо він мислить так:

- timer slot
- board slot
- buttons slot
- cta slot

А треба мислити так:

- `headerFrame`
- `logoFrame`
- `soundFrame`
- `timerFrame`
- `boardFrame`
- `homeButtonFrame`
- `restartButtonFrame`
- `modeBadgeFrame`

---

## Створити нові канонічні файли

### `src/ui/gameScene/GameSceneMetrics.ts`

Один файл, який вираховує всі frame-и сцени.

Наприклад:

- `screenW`
- `screenH`
- `headerFrame`
- `logoFrame`
- `soundFrame`
- `timerFrame`
- `boardFrame`
- `homeButtonFrame`
- `restartButtonFrame`
- `modeBadgeFrame`

**Важливо (SafeArea та Реактивність):** Цей хук повинен обов'язково розраховувати координати з урахуванням системних відступів (`useSafeAreaInsets()`), щоб header не налізав на статус-бар чи "чубчик", а нижні кнопки — на системну навігацію. Також метрики мають бути реактивними: вони повинні перераховуватися при зміні розмірів вікна або зміні орієнтації пристрою. Це буде **єдине джерело layout truth** для ігрового екрану.

---

### `src/ui/gameScene/GameSceneCanvas.tsx`

Full-screen canvas, який рендерить усе.

Він не керує логікою гри. Він лише приймає:

- `frames`
- `mode`
- `timeText`
- `board controller props`
- `fonts`
- `press states`
- `sound state`
- інші готові дані

**Важливо (Завантаження шрифтів):** Canvas має рендеритися лише після того, як шрифти (наприклад, для таймера чи тексту на кнопках) повністю завантажені, щоб уникнути помилок Skia або "стрибків" інтерфейсу (layout shifts).

---

### `src/ui/gameScene/GameSceneOverlay.tsx`

RN overlay для натискань поза дошкою:

- sound
- home
- restart
- mode badge, якщо він натискальний

**Важливо (Доступність / a11y):** Оскільки Skia малює просто пікселі, ці прозорі RN-компоненти повинні мати `accessible={true}`, `accessibilityRole="button"` та відповідні `accessibilityLabel`, щоб елементи керування грою залишалися доступними для скрінрідерів (VoiceOver/TalkBack).

Skia малює, overlay приймає input.

---

### `src/ui/gameScene/useGameSessionController.ts`

Окремий session hook:

- читає `mode`
- створює timer logic
- дає `timeLeftMs`
- дає `timeText`
- дає `isGameOver`
- дає `handleWin`
- дає `handleRestart`

---

# 4. Як перебудувати дошку під одну сцену

Оце найважливіший момент.

Зараз `GameBoardView.tsx` — це композиційний вузол, який:

- створює `Canvas`
- монтує `BoardSkin`
- монтує `BoardTileNode`
- монтує `BoardGestureOverlay`

Для нової архітектури я б **розщепив його на дві частини**.

## Було

`GameBoardView = Canvas + board render + gesture overlay`

## Має стати

### `GameBoardSceneLayer.tsx`

Повертає **тільки Skia scene nodes**, без власного `Canvas`.

Тобто:

- `BoardSkin`
- tile nodes
- усе, що малює дошку

Він рендериться всередині `GameSceneCanvas`.

---

### `BoardGestureOverlay.tsx`

Лишається окремим RN overlay, але вже позиціонується по `boardFrame`.

Тобто overlay живе не всередині `GameBoardView`, а поверх full-screen scene. _Цей компонент також має враховувати базову доступність (a11y) для плиток, якщо це можливо._

---

## Що це дає

Ти отримуєш:

- один Canvas на весь екран
- поточну сильну архітектуру drag/tap не ламаєш
- input по дошці лишається керованим окремо
- scene стає канонічною

---

# 5. Новий потік даних

## Вхід у гру

`NewGameScreen` має передавати не лише `mode`, а вже нормальний session config.

Наприклад:

- `mode: "classic"`
- або
- `mode: "limitTime", initialSeconds: 120`

---

## `GameScreen`

`GameScreen` збирає все докупи:

- читає route params
- створює `sessionController`
- створює `board controller`
- створює `scene metrics`
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

Тільки над `boardFrame`.

### `GameSceneOverlay`

Тільки для screen controls.

---

# 6. Таймер: де саме він має жити

Таймер **не в дошці**.

Він має жити в `useGameSessionController`.

### Чому

Бо таймер належить:

- не board model
- а game mode/session rules

### Таймер дає:

- `remainingMs`
- `remainingSeconds`
- `timeText`
- `progress01` — якщо потім захочеш шейдерний progress effect
- `isExpired`

---

## Поведінка

### classic

- timer hidden
- countdown inactive

### limitTime

- timer visible
- countdown active from first frame of game screen
- на `0` → `LoseScreen`

---

# 7. Правила, які треба зафіксувати в AI rules

Ти прямо сказав, що це треба внести в правила. Я б додав такий блок.

## Нове правило рендерингу гри

### Shader-first policy

Для ігрового екрана декоративні ефекти глибини не будуються через:

- blur
- mask filters
- live shadow effects

Натомість використовуються:

- runtime shaders
- texture-based effects
- gradient/light shaders
- інші дешевші shader-driven прийоми

### Практичне правило

У hot path ігрового екрана заборонено додавати нові декоративні ефекти через:

- `Blur`
- `Mask`
- `MaskFilter`
- важкі live shadow-ефекти

без окремого явного обґрунтування.

### Додаткове правило

`Skia.RuntimeEffect.Make()` виконується один раз на рівні модуля.

### Додаткове правило

Skin-компоненти не повинні містити бойову логіку гри.

### Додаткове правило

Canvas сцени не повинен залежати від частих React re-render там, де можна використати shared values / derived values. Оновлення таймера щосекунди повинно відбуватися через `SharedValue`, щоб не викликати рендер React-дерева.

---

# 8. Якою має бути нова структура компонентів

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

# 9. Що робити з `TimerSkin.tsx`

Він уже корисний, але в новій архітектурі я б змінив його статус.

## Було

Окремий компонент з власною внутрішньою логікою розмірів і margin.

## Має стати

Частина scene system, яка отримує ззовні:

- `frame`
- `timeText`
- `font`
- `shader params`

Тобто менше “сам розраховую layout”, більше “отримую готовий frame від scene metrics”.

Це саме те, що потрібно для settings у майбутньому:
settings змінює scene tokens, а не кожен skin окремо.

---

# 10. Що робити з header / logo / buttons / mode badge

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

# 11. Що з швидкодією

При твоєму новому рішенні головна умова така:

## Безпечний сценарій

- один full-screen canvas
- shader-driven skins
- без blur/mask/live shadow
- overlay input окремо
- board motion на shared values
- scene structure стабільна
- враховано блокування рендеру до завантаження шрифтів

Оце виглядає добре.

## Поганий сценарій

- timer через React state кожну секунду перебудовує півекрана
- press state кнопок перерендерює canvas-дерево
- layout frame-и перераховуються хаотично
- skin-компоненти самі вирішують свої розміри
- логіка дошки змішується з логікою сцени

Оце треба не допустити.

---

# 12. Найкращий порядок впровадження

Ось порядок, який я вважаю канонічним.

## Крок 1

Створити `GameSceneMetrics.ts` і зафіксувати всі frame-и нового екрана **(з обов'язковим урахуванням SafeArea та реакцією на зміну розмірів екрана)**.

Без цього далі рухатися не варто.

---

## Крок 2

Створити `GameSceneCanvas.tsx` з full-screen canvas, але поки без повного переносу всіх елементів.

На цьому кроці вже має бути:

- background
- timer frame
- board frame
- button frames
- mode badge frame
- header frame

**(Також переконатися, що рендер блокується до моменту повного завантаження шрифтів у Skia).**

---

## Крок 3

Розщепити `GameBoardView` на:

- `GameBoardSceneLayer`
- `BoardGestureOverlay` (з базовою a11y розміткою)

Це ключовий крок.

---

## Крок 4

Перенести дошку в `GameSceneCanvas`.

Тобто дошка вже малюється як частина повної сцени.

---

## Крок 5

Перенести `TimerSkin` у сцену.

Не як placeholder, а як реальний scene element.

---

## Крок 6

Додати `GameSceneOverlay` (із обов'язковою a11y розміткою: `accessible`, `accessibilityRole`, `accessibilityLabel`) для:

- sound
- home
- restart
- mode badge

---

## Крок 7

Додати `useGameSessionController`:

- classic / limitTime
- countdown
- restart reset
- lose transition
- guard від подвійного завершення гри

---

## Крок 8

Лише після цього вмикати settings, які будуть змінювати:

- timer duration
- theme tokens
- shader params
- layout/look variants

---

# 13. Мій підсумок

Твоя нова цільова архітектура має бути такою:

- **канонічний `GameScreen**`
- **один full-screen `GameSceneCanvas**`
- **одна scene metrics system**
- **дошка як scene layer, а не окремий mini-screen**
- **overlay input окремо (з підтримкою a11y)**
- **session logic окремо**
- **shader-first policy як правило проекту**

І так, у цій логіці `GameScreenShell` у його нинішньому вигляді вже не фундамент, а тимчасовий етап, який треба зняти з ролі канону.
