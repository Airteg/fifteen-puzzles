# Архітектура проекту Fifteen Puzzles

Цей файл описує **поточну** архітектуру проекту.
Його мета — дати ШІ та розробнику єдине узгоджене розуміння того, як зараз влаштований застосунок, які джерела істини є канонічними, і де проходять межі між layout, runtime state, rendering та persistence.

---

## 1. Огляд проекту

**Fifteen Puzzles** — мобільна гра на React Native + Expo з кастомним рендером через **Skia**.

Поточний стан проекту:

- уже є робочий navigation flow
- є окрема layout snapshot система
- ігрова дошка працює через shared values
- drag / tap логіка винесена в окремий gesture layer
- є Settings flow з окремими Skia-сценами модалок
- є persistence для settings / statistics / game data через AsyncStorage
- режим `limitTime` вже має countdown flow і перехід на `LoseScreen`

Проектна документація ведеться **українською мовою**.

---

## 2. Технологічна база

Поточний стек:

- **Expo** `~54.0.33`
- **React Native** `0.81.5`
- **React** `19.1.0`
- **@shopify/react-native-skia** `^2.4.18`
- **react-native-reanimated** `~4.1.1`
- **react-native-gesture-handler** `~2.28.0`
- **react-native-worklets** `0.5.1`
- **@react-navigation/native-stack** `^7.12.0`
- **@react-native-async-storage/async-storage** `^2.2.0`

Шейдери підключаються через кастомний Metro transformer:

- `metro.config.js`
- `tools/skslTransformer.js`

---

## 3. Високорівнева структура системи

Проект поділено на кілька великих підсистем:

### 3.1. App bootstrap

- `App.tsx`
- `src/context/AppShell.tsx`
- `src/context/FontProvider.tsx`
- `src/context/GameStateProvider.tsx`
- `src/context/LayoutSnapshotProvider.tsx`

### 3.2. Layout system

- `src/layout/createAppLayoutSnapshot.ts`
- `src/layout/types.ts`
- layout hooks з `LayoutSnapshotProvider.tsx`

### 3.3. Navigation

- `src/navigation/RootNavigator.tsx`

### 3.4. Game runtime

- `src/screens/GameScreen.tsx`
- `src/ui/game/*`
- `src/ui/skia/*` для бойового рендеру

### 3.5. Settings flow

- `src/screens/SettingsScreen.tsx`
- `src/screens/components/SettingsModalHost.tsx`
- `src/screens/components/SoundModal.tsx`
- `src/screens/components/SkinModal/*`

### 3.6. Persistence

- `src/storage/appStorage.ts`
- `src/storage/appStorage.types.ts`
- `src/storage/storageKeys.ts`

---

## 4. Root composition застосунку

Коренева композиція виглядає так:

`GestureHandlerRootView`
→ `SafeAreaProvider`
→ `LayoutSnapshotProvider`
→ `FontProvider`
→ `AppShell`
→ `GameStateProvider`
→ `NavigationContainer`
→ `RootNavigator`

### Що це означає практично

- gesture-handler (обробник жестів) доступний глобально
- safe area (безпечна зона) відома до побудови layout snapshot (до переобчислення компонування)
- шрифти залежать від layout-scale (від коефіцієнта масштабування макету)
- splash screen ховається лише тоді, коли готові:
  - шрифти
  - hydration storage state (відновлення збереженого стану з диска в пам’ять)
- navigation запускається тільки після цього

---

## 5. Канонічні джерела істини

### 5.1. Layout

Канонічне джерело layout-даних:

- `LayoutSnapshotProvider`
- `createAppLayoutSnapshot.ts`

Тут рахується вся базова геометрія екранів.

### 5.2. Гарячий стан дошки

Канонічне джерело runtime-позицій (поточних позицій) плиток:

- shared values (спільні значення) у `useGameBoardController.ts`

Ключові shared values:

- `gridSV`
- `emptyRow`
- `emptyCol`
- `dragActive`
- `dragAxis`
- `dragStartRow`
- `dragStartCol`
- `dragOffsetPx`
- `animT`
- `animMovedIdsSV`
- `animAxisSV`
- `animDirSV`

### 5.3. Persisted app state (Збережений стан застосунку)

Канонічне джерело persisted application state:

- `GameStateProvider.tsx`
- `storage/appStorage.ts`
- `storage/appStorage.types.ts`

### 5.4. Theme / skin colors

Канонічне джерело selectable colors:

- `settings` у `GameStateProvider`
- `THEME_PALETTE` у `src/theme/themePalette.ts`

---

## 6. Layout architecture

### 6.1. Чому layout централізований

Проект уже перейшов від локальних обчислень геометрії до snapshot-підходу.

Це означає:

- геометрія рахується централізовано
- screen-компоненти читають уже готові frame-и
- базові design-формули не повинні дублюватися по екранах

### 6.2. Що містить snapshot

`AppLayoutSnapshot` містить:

#### `device`

- `screenW`
- `screenH`
- `safeTop`
- `safeBottom`
- `designW`
- `designH`
- `scale`

#### `tokens`

- `sideMarginMin`
- `panelW`
- `buttonW`
- `buttonH`

#### `screens.game`

- `classic`
- `limitTime`

Кожен game layout містить:

- `headerFrame`
- `timerFrame`
- `boardFrame`
- `buttonsBlockFrame`
- `modePanelFrame`
- `board`
- `homeButtonFrame`
- `restartButtonFrame`

#### `screens.settings`

- `panelW`
- `buttonW`
- `buttonH`
- `modalDefaultFrame`
- `modalSoundFrame`

#### `screens.shell`

- rhythm-гепи для shell-екранів

### 6.3. Канонічні layout hooks

- `useGameLayout(mode)`
- `useSettingsLayout()`
- `useShellLayout()`
- `useLayoutTokens()`
- `useLayoutDevice()`
- `useLayoutRenderHelpers()`

### 6.4. Що більше не є каноном

`LayoutMetricsProvider.tsx` ще присутній у дереві, але root-app зараз спирається на `LayoutSnapshotProvider`, а не на нього.

---

## 7. Navigation architecture

`RootNavigator.tsx` містить один native-stack.

Основні screen routes:

- `Home`
- `Settings`
- `About`
- `Support`
- `NewGame`
- `Game`
- `Win`
- `Lose`

Окремо є modal group:

- `Statistic`
  - `presentation: "transparentModal"`
  - `animation: "fade"`

### Route params

- `Game` приймає `{ mode: "classic" | "limitTime" }`
- `Win` і `Lose` приймають `{ score: number }`

---

## 8. Architecture of non-game screens

### 8.1. ScreenShell family

Для звичайних screen-екранів використовується `ScreenShell.tsx`.

Він відповідає за:

- background
- заголовок через `AppHeader`
- animation slot
- title slot
- content slot
- footer positioning

### 8.2. PanelZone

`PanelZone.tsx` — стандартний контейнер кнопок меню.

Архітектурно він працює так:

- Canvas малює `PanelSurface` і кнопки
- RN `Pressable` дають hit-zones
- panel height визначається через onLayout
- geometry кнопок снапиться на піксель

Це важливий повторюваний патерн проекту:

**Skia малює пікселі, RN дає взаємодію.**

---

## 9. Канонічна архітектура GameScreen

### 9.1. Поточний центр бойового екрана

Головний бойовий orchestration layer зараз — це `src/screens/GameScreen.tsx`.

Він:

- визначає режим гри з route params
- дістає готові frame-и сцени через `useGameSceneMetrics(...)`
- читає шрифти через `useSkiaFonts()`
- читає налаштування / countdown state через `useGameState()`
- будує стартову сітку через `shuffleTiles()`
- створює controller дошки через `useGameBoardController(...)`
- тримає countdown interval для режиму `limitTime`
- вирішує navigation to `Win` / `Lose`

### 9.2. Game scene composition

Skia-сцена гри рендериться через `GameSceneCanvas.tsx`.

Вона містить:

- background rect
- `GameHeader`
- `TimerSkin` (опційно)
- `GameBoardSceneLayer`
- `IconButtonSkin` для HOME / RESTART
- `SkiaButtonSkin` для mode panel
- RN hit-zones поверх HOME / RESTART

### 9.3. Board rendering decomposition

Рендер дошки розбитий так:

#### `GameBoardSceneLayer.tsx`

- малює `BoardSkin`
- монтує `BoardTileNode` для всіх плиток

#### `BoardTileNode.tsx`

- читає позицію плитки з `gridSV`
- додає drag-preview
- додає finish-animation
- віддає `TileSkin`

Отже pipeline виглядає так:

`GameScreen`
→ `GameSceneCanvas`
→ `GameBoardSceneLayer`
→ `BoardTileNode`
→ `TileSkin`

---

## 10. Канонічний board state і game model

### 10.1. Формат дошки

- дошка = масив із 16 елементів
- `0` = empty cell
- `1..15` = id плиток

### 10.2. Контролер дошки

`useGameBoardController.ts` — канонічний runtime-controller.

Його задачі:

- ініціалізувати board state
- обробляти tap logic
- обробляти drag commit
- оновлювати empty position
- керувати finish-animation state
- скидати preview state
- детектити win через `isWinningGrid(...)`

### 10.3. Чиста модель гри

`gameBoardModel.ts` — pure model layer.

Ключові функції:

- `findEmpty(grid)`
- `commitShift(grid, empty, axis, steps)`
- `isWinningGrid(grid)`
- `makeDefaultGrid()`

### 10.4. Семантика `steps`

У поточній моделі `steps` — це не «довжина жесту в пікселях».

`steps` означає напрямлений зсув від стартової плитки до empty cell:

- для tap — controller рахує його напряму
- для drag — overlay спочатку визначає допустимий commit, а controller уже виконує зсув

---

## 11. Gesture architecture

### 11.1. Канонічний gesture layer

`BoardGestureOverlay.tsx` — окремий RN layer поверх ігрової дошки.

Він:

- сидить точно поверх `boardFrame`
- отримує board layout через `useGameLayout(mode)`
- використовує RNGH gesture pipeline
- не рендерить плитки сам

### 11.2. Що він робить

- визначає, чи дотик потрапив у межі дошки
- переводить локальні координати у `row/col`
- визначає, чи дозволений рух по `x` або `y`
- тримає drag-preview offset у shared values
- на `onEnd` викликає `onCommitShift(axis, steps)` або скидає drag

### 11.3. Preview policy

У поточній реалізації:

- preview рухається лише в межах одного кроку по вісі
- commit може пересунути всю групу плиток до empty cell
- finish-анімація добудовує рух через `animT`

Це важливо: preview і final move не є двома незалежними системами; вони мають бути математично узгодженими.

---

## 12. Animation handoff і win flow

Після коміту controller:

- одразу оновлює `gridSV`
- одразу оновлює `emptyRow` / `emptyCol`
- запускає finish-анімацію через `animT = withTiming(...)`

Якщо нова сітка — виграшна:

- `useGameBoardController.ts` не навігує сам напряму
- він викликає `onWin` через `scheduleOnRN(...)`
- це відбувається **після завершення анімації**

Отже navigation decision живе у `GameScreen.tsx`, а не в model-layer.

---

## 13. Timer architecture

### 13.1. Де живе countdown state

Runtime countdown state експонується з `GameStateProvider`:

- `countdownMs`
- `isCountdownActive`
- `startCountdown(...)`
- `setCountdownMs(...)`
- `stopCountdown()`
- `resetCountdown(...)`

### 13.2. Де живе timer loop

Сам interval loop зараз знаходиться у `GameScreen.tsx`.

Тобто:

- provider дає API і shared app state
- `GameScreen` вирішує, коли стартує / зупиняється countdown
- `GameScreen` вирішує, коли перейти на `LoseScreen`

### 13.3. Режими

- `classic` — таймер не тікає
- `limitTime` — запускається countdown від `settings.limitTimeMs`

### 13.4. Відображення таймера

Skia-візуал таймера робить `TimerSkin.tsx`.

---

## 14. Persistence architecture

### 14.1. Storage schema

`AppStorageData` містить:

- `settings`
- `statistics`
- `gameState`
- `bestGames`

### 14.2. Hydration flow

`GameStateProvider` при старті:

1. читає AsyncStorage через `loadAppStorage()`
2. зливає з defaults
3. виставляє `isHydrated = true`
4. тільки після цього `AppShell` дозволяє ховати splash

### 14.3. Save flow

Після hydration кожна зміна `data` тригерить `saveAppStorage(data)`.

### 14.4. Domain actions

Provider уже має domain helpers:

- `saveGame(...)`
- `clearGame()`
- `updateSettings(...)`
- `updateStatistics(...)`
- `recordWin(...)`
- `recordLoss()`

---

## 15. Settings architecture

### 15.1. SettingsScreen

`SettingsScreen.tsx` не малює модалки безпосередньо всередині кнопок.

Він:

- тримає `activeModal`
- тримає `modalOpacity` як reanimated shared value
- блокує повторне відкриття під час анімації
- передає layout frame-и у `SettingsModalHost`

### 15.2. SettingsModalHost

`SettingsModalHost.tsx` — окремий композиційний вузол поверх екрана.

Він:

- малює backdrop у Canvas
- малює Sound / Skin modal scenes у Canvas
- керує opacity через derived values
- поверх цього дає RN `Pressable` hit-zones

### 15.3. Split Scene / Overlay pattern

Для модалок використовується явний split:

- `Scene` = тільки Skia-візуал
- `Overlay` = тільки RN interaction layer

Цей патерн видно в:

- `SoundModalScene` / `SoundModalOverlay`
- `SkinModalScene` / `SkinModalOverlay`

Це хороший канон для майбутніх складних модалок.

---

## 16. Skia / shader architecture

### 16.1. Ключовий принцип

Skia відповідає за бойовий візуальний рендер.
RN відповідає за структуру, hit-zones і загальні оболонки.

### 16.2. Shader-backed components

Поточні ключові shader-backed surface-и:

- `BoardSkin.tsx`
- `TileSkin.tsx`
- `TimerSkin.tsx`
- `SkiaButtonSkin.tsx`

### 16.3. Shader compilation rule

`Skia.RuntimeEffect.Make(...)` виконується на рівні модуля, а не всередині рендера.

### 16.4. Tinting

Кольори з UI/state переводяться в shader uniforms через `hexToShader(...)`.

---

## 17. Файли, які існують, але не повинні вводити в оману

У проекті ще є кілька історичних або допоміжних файлів:

### Не-root layout

- `src/context/LayoutMetricsProvider.tsx`

### Не-канонічний game shell

- `src/ui/shell/GameScreenShell.tsx`

### Альтернативні / старі варіанти surface-ів

- `src/ui/skia/BoardSkin1.tsx`
- `src/ui/skia/TileSkin1.tsx`

### Sandbox / test

- `src/screens/AboutScreen.tsx`
- `src/test/RnghSmoke.tsx`

Під час нових архітектурних рішень не треба брати їх як перше джерело істини.

---

## 18. Поточний стан реалізації

### Уже реалізовано

- root provider stack
- централізований layout snapshot
- font loading + splash gating
- basic navigation flow
- game scene через єдиний Canvas
- board runtime на shared values
- tap / drag pipeline
- finish-анімація після коміту
- win detection
- countdown flow для `limitTime`
- Settings модалки з Scene/Overlay split
- AsyncStorage persistence для settings / statistics / game state / best games

### Частково готово або ще полірується

- drag UX tuning
- реальна shuffle-логіка (замість debug-grid)
- повноцінна статистика
- Support flow
- повна стилістична єдність усіх модалок та екранів
- завершений sound integration по всьому app flow

---

## 19. Короткий канон для майбутніх змін

Коли пропонується нова зміна, базовий порядок перевірки такий:

### Якщо зміна про layout

дивитися:

1. `LayoutSnapshotProvider.tsx`
2. `createAppLayoutSnapshot.ts`
3. конкретний screen consumer

### Якщо зміна про рух плиток

дивитися:

1. `BoardGestureOverlay.tsx`
2. `useGameBoardController.ts`
3. `BoardTileNode.tsx`
4. `gameBoardModel.ts`

### Якщо зміна про scene rendering

дивитися:

1. `GameSceneCanvas.tsx`
2. `GameBoardSceneLayer.tsx`
3. потрібний Skia skin

### Якщо зміна про settings

дивитися:

1. `SettingsScreen.tsx`
2. `SettingsModalHost.tsx`
3. відповідну modal scene/overlay пару

---

## 20. Підсумок

Поточна архітектура проекту тримається на чотирьох опорах:

1. **централізований layout snapshot**
2. **hot path дошки на shared values**
3. **Skia як основний бойовий renderer**
4. **RN overlays для interaction і screen orchestration**

Саме навколо цього треба будувати всі подальші зміни, не повертаючи геометрію або runtime board-state назад у розпорошені локальні обчислення чи React state hot path.
