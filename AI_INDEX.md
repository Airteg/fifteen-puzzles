# AI Code Index

Цей файл — актуальна карта навігації по кодовій базі **Fifteen Puzzles**.
Він описує, які файли зараз є канонічними, які системи за що відповідають, і в якому порядку їх варто читати під час аналізу або дебагу.

---

## 1. Точка входу та root-провайдери

### `App.tsx`
- кореневий вхід у застосунок
- монтує:
  - `GestureHandlerRootView`
  - `SafeAreaProvider`
  - `LayoutSnapshotProvider`
  - `FontProvider`
  - `AppShell`

### `src/context/AppShell.tsx`
- запускає `GameStateProvider`
- чекає на готовність шрифтів і гідрацію storage
- ховає splash screen тільки після готовності застосунку
- монтує `NavigationContainer` + `RootNavigator`

### `src/context/FontProvider.tsx`
- завантажує RN-шрифти через `expo-font`
- створює Skia fonts через `useFont(...)`
- читає масштаб через `useLayoutRenderHelpers()`
- канонічне джерело Skia-font cache

### `src/context/GameStateProvider.tsx`
- канонічний глобальний стан застосунку поза hot path рендеру дошки
- тримає:
  - `settings`
  - `statistics`
  - `gameState`
  - runtime countdown state (`countdownMs`, `isCountdownActive`)
- відповідає за hydration / persistence через AsyncStorage

---

## 2. Канонічний layout

### Головний центр layout-системи

### `src/context/LayoutSnapshotProvider.tsx`
- канонічний провайдер layout snapshot
- читає `useWindowDimensions()` і safe area insets
- будує централізований `AppLayoutSnapshot`
- надає хуки:
  - `useAppLayoutSnapshot()`
  - `useGameLayout(mode)`
  - `useSettingsLayout()`
  - `useShellLayout()`
  - `useLayoutTokens()`
  - `useLayoutDevice()`
  - `useLayoutRenderHelpers()`

### `src/layout/createAppLayoutSnapshot.ts`
- головний builder layout snapshot
- рахує:
  - `device`
  - `tokens`
  - `screens.game.classic`
  - `screens.game.limitTime`
  - `screens.settings`
  - `screens.shell`
- тут зараз формується канонічна геометрія ігрового екрана

### `src/layout/types.ts`
- типи snapshot-системи:
  - `Frame`
  - `BoardLayout`
  - `GameScreenLayout`
  - `AppLayoutSnapshot`

### Важливо
- `LayoutMetricsProvider.tsx` ще існує в дереві, але **не є канонічним root-layout провайдером**
- для нових рішень потрібно спиратися саме на `LayoutSnapshotProvider` + `createAppLayoutSnapshot.ts`

---

## 3. Навігація та екрани

### `src/navigation/RootNavigator.tsx`
- канонічна маршрутизація застосунку
- основні екрани:
  - `Home`
  - `Settings`
  - `About`
  - `Support`
  - `NewGame`
  - `Game`
  - `Win`
  - `Lose`
- `Statistic` зараз відкривається як `transparentModal`

### Основні екрани
- `src/screens/HomeScreen.tsx` — головне меню
- `src/screens/NewGameScreen.tsx` — вибір режиму (`classic` / `limitTime`)
- `src/screens/GameScreen.tsx` — канонічний orchestration layer ігрового рантайму
- `src/screens/SettingsScreen.tsx` — екран налаштувань і керування модалками
- `src/screens/StatisticScreen.tsx` — статистика (поки RN modal style)
- `src/screens/WinScreen.tsx` — екран перемоги
- `src/screens/LoseScreen.tsx` — екран поразки
- `src/screens/AboutScreen.tsx` — sandbox / тестовий екран
- `src/screens/SupportScreen.tsx` — простий support placeholder

---

## 4. Канонічний game runtime

### `src/screens/GameScreen.tsx`
Це **поточний головний orchestration layer** ігрового процесу.

Він:
- читає режим гри з route params
- бере scene metrics через `useGameSceneMetrics(...)`
- бере шрифти через `useSkiaFonts()`
- бере settings / countdown API через `useGameState()`
- створює `bootGrid` через `shuffleTiles()`
- створює контролер дошки через `useGameBoardController(...)`
- керує countdown timer для режиму `limitTime`
- вирішує navigation flow:
  - `Win`
  - `Lose`
- рендерить:
  - `GameSceneCanvas`
  - `BoardGestureOverlay`

### `src/ui/game/useGameSceneMetrics.ts`
- тонкий адаптер між `LayoutSnapshotProvider` і `GameScreen`
- повертає готові frame-и сцени:
  - `headerFrame`
  - `timerFrame`
  - `boardFrame`
  - `buttonsBlockFrame`
  - `modePanelFrame`

### `src/ui/game/GameSceneCanvas.tsx`
- канонічний composition layer усієї Skia-сцени гри
- малює:
  - background
  - `GameHeader`
  - `TimerSkin` (якщо режим з таймером)
  - `GameBoardSceneLayer`
  - `IconButtonSkin` для HOME / RESTART
  - `SkiaButtonSkin` для режимної кнопки (`CLASSIC` / `LIMIT TIME`)
- поверх Canvas монтує RN `Pressable` hit-zones для HOME / RESTART

### `src/ui/game/GameBoardSceneLayer.tsx`
- відповідає тільки за Skia-частину дошки
- малює `BoardSkin`
- монтує всі `BoardTileNode`
- не містить gesture logic

### `src/ui/game/useGameBoardController.ts`
- канонічний controller дошки
- джерело істини для runtime board-state у hot path
- тримає:
  - `gridSV`
  - `emptyRow`
  - `emptyCol`
  - drag shared values
  - finish-animation shared values
- обробляє:
  - `onTapCell(...)`
  - `onCommitShift(...)`
  - `resetBoard(...)`
- викликає `onWin` через `scheduleOnRN(...)` після завершення анімації

### `src/ui/game/BoardGestureOverlay.tsx`
- канонічний gesture layer дошки
- обробляє tap / pan arbitration
- визначає дозволену вісь руху
- тримає drag-preview offset
- на `onEnd` або комітить хід, або скидає preview

### `src/ui/game/BoardTileNode.tsx`
- UI-side вузол конкретної плитки
- читає позицію плитки з `gridSV`
- додає drag-preview через `dragOffsetPx`
- додає finish-анімацію через:
  - `animT`
  - `animMovedIdsSV`
  - `animAxisSV`
  - `animDirSV`

### `src/ui/game/gameBoardModel.ts`
- чиста модель гри без UI-залежностей
- ключові функції:
  - `findEmpty(...)`
  - `commitShift(...)`
  - `isWinningGrid(...)`
  - `makeDefaultGrid()`

### `src/ui/game/gameEngine/shuffleTiles.ts`
- генератор стартової сітки
- **зараз тимчасово повертає майже виграшну debug-конфігурацію**:
  - `[1..14, 0, 15]`
- це важливо враховувати під час тестування Win / Restart / Timer flow

---

## 5. Канонічні дані гри та persistence

### `src/storage/appStorage.types.ts`
- канонічні типи persistence-рівня:
  - `GameSettings`
  - `GameState`
  - `Statistics`
  - `GameResult`
  - `AppStorageData`
- містить `DEFAULT_LIMIT_TIME_MS = 120000`
- містить `DEFAULT_APP_STORAGE`

### `src/storage/appStorage.ts`
- канонічний persistence layer для AsyncStorage
- виконує:
  - `loadAppStorage()`
  - `saveAppStorage(...)`
- нормалізує `bestGames`
- зливає прочитані дані з defaults

### `src/storage/storageKeys.ts`
- канонічний storage key:
  - `fifteen_puzzles_app_data_v1`

### Важливо
- `GameStateProvider` відповідає за hydration / persistence всього app-data
- countdown timer зараз живе як runtime-state у `GameStateProvider`, але сам interval і навігаційна логіка живуть у `GameScreen.tsx`

---

## 6. Settings flow і модалки

### `src/screens/SettingsScreen.tsx`
- orchestration layer settings-екрана
- керує:
  - `activeModal`
  - `modalOpacity`
  - open/close animation lock
- рендерить `ScreenShell`, `PanelZone` і `SettingsModalHost`

### `src/screens/components/SettingsModalHost.tsx`
- канонічний host модалок налаштувань
- малює один Canvas поверх екрана
- містить backdrop + Skia-сцени модалок
- поверх Canvas монтує RN `Pressable` overlays для hit-zones

### Sound modal
- `src/screens/components/SoundModal.tsx`
  - `SoundModalScene` — Skia-візуал модалки
  - `SoundModalOverlay` — RN hit-zones і зміна `settings.isSoundEnabled`

### Skin modal
- `src/screens/components/SkinModal/SkinModalScene.tsx`
  - Skia-сцена палітри та preview
- `src/screens/components/SkinModal/SkinModalOverlay.tsx`
  - RN hit-zones для вибору кольорів
- `src/screens/components/SkinModal/useSkinLayout.ts`
  - канонічна геометрія Skin modal
- `src/screens/components/SkinModal/SkinModal.types.ts`
  - типи і normalize helper

### `src/theme/themePalette.ts`
- канонічна палітра selectable кольорів для skin/settings flow

---

## 7. Skia rendering surfaces

### Ключові surface / skin файли
- `src/ui/skia/BoardSkin.tsx` — shader-backed дошка
- `src/ui/skia/TileSkin.tsx` — shader-backed плитка
- `src/ui/skia/TimerSkin.tsx` — shader-backed таймер
- `src/ui/skia/GameHeader.tsx` — header для GameScreen
- `src/ui/skia/IconButtonSkin.tsx` — HOME / RESTART кнопки у грі
- `src/ui/skia/SkiaButtonSkin.tsx` — текстові кнопки / mode panel
- `src/ui/skia/SkiaButtonSound.tsx` — sound toggle icons у модалці
- `src/ui/skia/PanelSurface.tsx` — фоновий panel surface для меню
- `src/ui/skia/LogoSkin.tsx` / `LogoSurface.tsx` / `LogoFrameSkin.tsx` — logo surfaces
- `src/ui/skia/SmileySkin.tsx` — смайлик для анімацій

### Шейдери
- `src/ui/skia/shaders/board_v1.sksl`
- `src/ui/skia/shaders/tile_v2.sksl`
- `src/ui/skia/shaders/timer.sksl`
- `src/ui/skia/shaders/button.sksl`

### Shader infrastructure
- `metro.config.js`
- `tools/skslTransformer.js`
- `declarations.d.ts`

### Важливо
- `Skia.RuntimeEffect.Make(...)` компілюється на рівні модуля
- tint для shader-компонентів приходить через `hexToShader(...)`

---

## 8. Загальні UI-shell вузли

### `src/ui/shell/ScreenShell.tsx`
- канонічний shell для Home / NewGame / Settings та подібних screen-екранів
- використовує `AppHeader`
- будує вертикальний rhythm через scale-aware gaps

### `src/ui/PanelZone.tsx`
- канонічний panel-контейнер з кнопками меню
- малює `PanelSurface` і `SkiaButtonSkin` / `SkiaIconButtonSkin`
- поверх Skia використовує RN `Pressable` hit-zones

### `src/ui/T.tsx`
- текстовий wrapper для RN Text
- підключає `Typography` + scale з layout helper

### `src/theme/typography.ts`
- токени для RN text typography
- Mariupol для RN UI
- Krona One для button / header styles

---

## 9. Допоміжні утиліти

### `src/utils/color.ts`
- `hexToShader(...)`
- перетворює HEX у `[r, g, b, a]` для shader uniforms

### `src/utils/splash.ts`
- helpers для керування splash flow

### `src/ui/pixel.ts`
- `snap(...)`
- `snapRect(...)`
- низькорівневі pixel helpers

---

## 10. Що зараз НЕ вважати канонічним

Ці файли можуть існувати, але не повинні бути першим джерелом істини під час нових рішень:

- `src/context/LayoutMetricsProvider.tsx`
  - історичний layout provider
  - не root-канон після переходу на snapshot layout

- `src/ui/shell/GameScreenShell.tsx`
  - історичний shell для GameScreen
  - поточний бойовий GameScreen працює через `GameSceneCanvas.tsx`

- `src/ui/skia/BoardSkin1.tsx`
- `src/ui/skia/TileSkin1.tsx`
  - альтернативні / старі варіанти skin-компонентів

- `src/screens/AboutScreen.tsx`
  - sandbox / debug playground

- `src/test/RnghSmoke.tsx`
  - окремий smoke test для gesture-handler

---

## 11. Порядок читання при дебазі

### Якщо проблема в layout
1. `LayoutSnapshotProvider.tsx`
2. `createAppLayoutSnapshot.ts`
3. `useGameSceneMetrics.ts` або `useSettingsLayout()`-споживач

### Якщо проблема в грі / русі плиток
1. `GameScreen.tsx`
2. `BoardGestureOverlay.tsx`
3. `useGameBoardController.ts`
4. `BoardTileNode.tsx`
5. `gameBoardModel.ts`

### Якщо проблема в Skia-сцені гри
1. `GameSceneCanvas.tsx`
2. `GameBoardSceneLayer.tsx`
3. відповідний skin (`BoardSkin`, `TileSkin`, `TimerSkin`, `GameHeader`)

### Якщо проблема в settings-модалках
1. `SettingsScreen.tsx`
2. `SettingsModalHost.tsx`
3. `SoundModal.tsx` або `SkinModal/*`
4. `themePalette.ts`

---

## 12. Короткий канон для ШІ

- layout-канон = `LayoutSnapshotProvider` + `createAppLayoutSnapshot.ts`
- game hot path = shared values у `useGameBoardController.ts`
- scene composition = `GameSceneCanvas.tsx`
- gesture layer = `BoardGestureOverlay.tsx`
- persisted app state = `GameStateProvider.tsx` + `storage/appStorage.ts`
- settings UI = `SettingsScreen.tsx` + `SettingsModalHost.tsx`
- shader tint/colors = `settings` + `themePalette` + `hexToShader(...)`
