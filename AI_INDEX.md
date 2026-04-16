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
- викликає `ensureSplashPrevented()`
- викликає `soundManager.prime()`
- чекає на готовність шрифтів і hydration storage
- ховає splash screen тільки після готовності застосунку
- монтує `NavigationContainer` + `RootNavigator`

### `src/context/FontProvider.tsx`

- завантажує RN fonts через `expo-font`
- створює Skia fonts через `useFont(...)`
- читає масштаб через `useLayoutRenderHelpers()`
- канонічне джерело Skia-font cache

### `src/context/GameStateProvider.tsx`

- канонічний глобальний state поза hot path дошки
- тримає:
  - `settings`
  - `statistics`
  - `bestGames`
  - `gameState`
  - runtime countdown state (`countdownMs`, `isCountdownActive`)
- відповідає за hydration / persistence через AsyncStorage

### `src/utils/splash.ts`

- helpers для splash lifecycle

### `src/utils/soundManager.ts`

- централізований sound helper
- використовується в app bootstrap і `PanelZone`

---

## 2. Канонічний layout

### Головний центр screen-level layout

### `src/context/LayoutSnapshotProvider.tsx`

- канонічний provider layout snapshot
- читає `useWindowDimensions()` і safe area insets
- будує централізований `AppLayoutSnapshot`
- надає hooks:
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

### `src/layout/types.ts`

- типи snapshot-системи:
  - `Frame`
  - `BoardLayout`
  - `GameScreenLayout`
  - `AppLayoutSnapshot`

### Важлива межа

- snapshot є каноном для screen-level frames і tokens
- self-contained компоненти можуть мати локальний derived layout, якщо він базується на canonical frame + `S/snap`

### Поточні локальні layout вузли

- `src/screens/components/SkinModal/useSkinLayout.ts`
- `src/screens/components/StatisticModal/useStatisticLayout.ts`
- `useSoundLayout(...)` у `src/screens/components/SoundModal.tsx`
- локальна geometry/measurement логіка в `src/ui/PanelZone.tsx`

### Не брати як root layout canon

- `src/context/LayoutMetricsProvider.tsx`

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
- `Statistic` відкривається як `transparentModal`

### Основні екрани

- `src/screens/HomeScreen.tsx` — головне меню через `ScreenShell` + `PanelZone`
- `src/screens/NewGameScreen.tsx` — вибір режиму (`classic` / `limitTime`)
- `src/screens/GameScreen.tsx` — канонічний orchestration layer бойового runtime
- `src/screens/SettingsScreen.tsx` — settings screen + modal orchestration
- `src/screens/StatisticScreen.tsx` — окремий transparent modal screen зі split `Scene / Overlay`
- `src/screens/WinScreen.tsx` — екран перемоги
- `src/screens/LoseScreen.tsx` — екран поразки
- `src/screens/AboutScreen.tsx` — sandbox / debug playground
- `src/screens/SupportScreen.tsx` — окремий простий RN support-form flow

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
- тримає session guards для win/loss side effects
- викликає `recordWin(...)` / `recordLoss()`
- рендерить:
  - `GameSceneCanvas`
  - `BoardGestureOverlay`

### `src/ui/game/useGameSceneMetrics.ts`

- thin adapter між `LayoutSnapshotProvider` і `GameScreen`
- повертає готові frame-и сцени:
  - `headerFrame`
  - `timerFrame`
  - `boardFrame`
  - `buttonsBlockFrame`
  - `modePanelFrame`

### `src/ui/game/GameSceneCanvas.tsx`

- канонічний composition layer всієї Skia-сцени гри
- малює:
  - background
  - `GameHeader`
  - `TimerSkin` (якщо режим з таймером)
  - `GameBoardSceneLayer`
  - `IconButtonSkin` для HOME / RESTART
  - `SkiaButtonSkin` для режимної панелі
- поверх Canvas монтує RN `Pressable` hit-zones для HOME / RESTART

### `src/ui/game/GameBoardSceneLayer.tsx`

- відповідає тільки за Skia-частину дошки
- малює `BoardSkin`
- монтує всі `BoardTileNode`
- не містить gesture logic

### `src/ui/game/useGameBoardController.ts`

- канонічний controller дошки
- джерело істини для runtime board-state в hot path
- тримає:
  - `gridSV`
  - `emptyRow`
  - `emptyCol`
  - drag shared values
  - finish-animation shared values
  - `movesSV`
- обробляє:
  - `onTapCell(...)`
  - `onCommitShift(...)`
  - `resetBoard(...)`
- викликає `onMoveCommitted(...)`
- викликає `onWin(...)` через `scheduleOnRN(...)` після анімації

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
  - `normalizeBestGames(...)`
  - `insertBestGame(...)`
- нормалізує `bestGames`
- зливає прочитані дані з defaults

### `src/storage/storageKeys.ts`

- канонічний storage key:
  - `fifteen_puzzles_app_data_v1`

### Важливо

- `GameStateProvider` відповідає за hydration / persistence всього app-data
- `bestGames` уже активно використовується статистикою
- поле `gameState` існує в schema і provider API, але поточний runtime не відновлює з нього ігрову сесію автоматично

---

## 6. Settings і Statistic flow

### `src/screens/SettingsScreen.tsx`

- orchestration layer settings-екрана
- керує:
  - `activeModal`
  - `modalOpacity`
  - animation lock
- рендерить `ScreenShell`, `PanelZone` і `SettingsModalHost`
- для `statistic` робить navigation на окремий route

### `src/screens/components/SettingsModalHost.tsx`

- канонічний host settings-модалок
- малює один Canvas поверх екрана
- містить backdrop + Skia-сцени **тільки** для `sound` і `skin`
- поверх Canvas монтує RN `Pressable` overlays для hit-zones

### `src/screens/components/SoundModal.tsx`

- `SoundModalScene` — Skia-візуал модалки
- `SoundModalOverlay` — RN hit-zones і зміна `settings.isSoundEnabled`
- містить локальний `useSoundLayout(...)`

### `src/screens/components/SkinModal/*`

- `SkinModalScene.tsx` — Skia-сцена палітри та preview
- `SkinModalOverlay.tsx` — RN hit-zones для вибору кольорів
- `useSkinLayout.ts` — канонічний derived layout Skin modal
- `SkinModal.types.ts` — типи і normalize helper

### `src/screens/StatisticScreen.tsx`

- окремий transparent modal screen
- малює backdrop і modal scene в Canvas
- тримає backdrop hit-zones через RN `Pressable`
- читає `bestGames`, `statistics`, `resetStatistics()`
- тримає transient `pressedButton`

### `src/screens/components/StatisticModal/*`

- `StatisticModalScene.tsx` — Skia chrome + list container + icon buttons
- `StatisticModalOverlay.tsx` — RN scroll і hit-zones
- `useStatisticLayout.ts` — derived layout statistic modal
- `StatisticModal.types.ts` — типи modal flow
- `components/StRow.tsx` — RN row renderer для таблиці результатів

### `src/theme/themePalette.ts`

- канонічна палітра selectable кольорів для skin/settings flow

---

## 7. Skia rendering surfaces

### Ключові surface / skin файли

- `src/ui/skia/BoardSkin.tsx` — shader-backed дошка
- `src/ui/skia/TileSkin.tsx` — shader-backed плитка
- `src/ui/skia/TimerSkin.tsx` — shader-backed таймер
- `src/ui/skia/GameHeader.tsx` — header для GameScreen
- `src/ui/skia/IconButtonSkin.tsx` — HOME / RESTART / sound icon surfaces
- `src/ui/skia/SkiaButtonSkin.tsx` — текстові frame-кнопки
- `src/ui/skia/SkiaButtonSound.tsx` — square sound buttons у модалці
- `src/ui/skia/SkiaIconButtonSkin.tsx` — icon-only frame buttons
- `src/ui/skia/DBorder.tsx` — frame-style border surface
- `src/ui/skia/PanelSurface.tsx` — panel background surface на `RoundedRect` + `Shadow`

### Канонічні шейдери

- `src/ui/skia/shaders/board_v1.sksl`
- `src/ui/skia/shaders/tile_v2.sksl`
- `src/ui/skia/shaders/timer.sksl`
- `src/ui/skia/shaders/frame.sksl`

### `frame.sksl` зараз використовують

- `SkiaButtonSkin.tsx`
- `SkiaButtonSound.tsx`
- `SkiaIconButtonSkin.tsx`
- `DBorder.tsx`

Statistic modal використовує цей frame-chrome опосередковано через `DBorder.tsx` і `SkiaIconButtonSkin.tsx`.

### Shader infrastructure

- `metro.config.js`
- `tools/skslTransformer.js`
- `declarations.d.ts`

### Важливо

- `Skia.RuntimeEffect.Make(...)` компілюється на рівні модуля
- tint для shader-компонентів приходить через `hexToShader(...)`
- файл `button.sksl` присутній у дереві, але поточний button/frame chrome спирається не на нього, а на `frame.sksl`

---

## 8. Загальні UI-shell вузли

### `src/ui/shell/ScreenShell.tsx`

- canonical shell для Home / NewGame / Settings
- використовує `AppHeader`
- будує вертикальний rhythm через scale-aware gaps

### `src/ui/PanelZone.tsx`

- canonical panel-контейнер з кнопками меню
- малює `PanelSurface` і `SkiaButtonSkin` / `SkiaIconButtonSkin`
- міряє panel height і button rects через `onLayout`
- тримає локальний `pressedId`
- поверх Skia використовує RN `Pressable` hit-zones

### `src/ui/T.tsx`

- текстовий wrapper для RN Text
- підключає `Typography` + scale з layout helper

### `src/ui/header/AppHeader.tsx`

- canonical header для shell-екранів

---

## 9. Допоміжні утиліти

### `src/utils/color.ts`

- `hexToShader(...)`
- перетворює HEX у `[r, g, b, a]` для shader uniforms

### `src/utils/splash.ts`

- helpers для керування splash flow

### `src/utils/soundManager.ts`

- програвання UI sounds
- `prime()` на старті app shell

### `src/ui/pixel.ts`

- `snapRect(...)`
- низькорівневі pixel helpers

---

## 10. Що зараз НЕ вважати канонічним

Ці файли можуть існувати, але не повинні бути першим джерелом істини:

- `src/context/LayoutMetricsProvider.tsx`
  - історичний layout provider

- `src/ui/shell/GameScreenShell.tsx`
  - історичний shell для GameScreen

- `src/ui/skia/BoardSkin1.tsx`
- `src/ui/skia/TileSkin1.tsx`
  - альтернативні / старі варіанти skin-компонентів

- `src/ui/skia/Test.tsx`
  - локальний shader/test sandbox

- `src/screens/AboutScreen.tsx`
  - sandbox / debug playground

- `src/ui/skia/shaders/button.sksl`
  - не поточний канон для frame/button chrome

---

## 11. Порядок читання при дебазі

### Якщо проблема в layout

1. `LayoutSnapshotProvider.tsx`
2. `createAppLayoutSnapshot.ts`
3. конкретний screen consumer
4. локальний sublayout hook, якщо проблема всередині modal/component

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

### Якщо проблема в statistic flow

1. `StatisticScreen.tsx`
2. `StatisticModalScene.tsx`
3. `StatisticModalOverlay.tsx`
4. `useStatisticLayout.ts`
5. `GameStateProvider.tsx`

### Якщо проблема в frame/button chrome

1. `SkiaButtonSkin.tsx`
2. `SkiaButtonSound.tsx`
3. `SkiaIconButtonSkin.tsx`
4. `DBorder.tsx`
5. `shaders/frame.sksl`

---

## 12. Короткий канон для ШІ

- screen-level layout canon = `LayoutSnapshotProvider` + `createAppLayoutSnapshot.ts`
- local sublayout дозволений тільки як похідний від canonical frame + `S/snap`
- game hot path = shared values у `useGameBoardController.ts`
- scene composition = `GameSceneCanvas.tsx`
- gesture layer = `BoardGestureOverlay.tsx`
- persisted app state = `GameStateProvider.tsx` + `storage/appStorage.ts`
- settings UI = `SettingsScreen.tsx` + `SettingsModalHost.tsx`
- statistic UI = `StatisticScreen.tsx` + `StatisticModal/*`
- frame/button chrome = `frame.sksl` + `SkiaButtonSkin` / `SkiaButtonSound` / `SkiaIconButtonSkin` / `DBorder`
- interaction hit-zones = RN `Pressable` поверх Skia scenes
