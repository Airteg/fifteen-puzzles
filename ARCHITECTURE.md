# Архітектура проекту Fifteen Puzzles

Цей файл описує **поточну** архітектуру проекту.
Його задача — зафіксувати реальний канон коду: де знаходяться джерела істини, як розділені layout / runtime / rendering / persistence, і які патерни в проекті вже вважаються бойовими.

---

## 1. Огляд проекту

**Fifteen Puzzles** — мобільна гра на React Native + Expo з кастомним візуальним рендером через **Skia**.

Поточний стан проекту:

- є робочий navigation flow з окремим transparent modal route для статистики
- root stack уже побудований через `App.tsx` -> `AppShell.tsx`
- splash screen ховається тільки після готовності шрифтів і hydration storage
- `soundManager.prime()` викликається на старті застосунку
- screen-level layout централізований у snapshot-системі
- внутрішній layout складних вузлів допускається локально, але тільки як похідний від канонічного frame + `S/snap`
- бойова дошка працює через shared values
- tap / drag логіка винесена в окремий RN gesture layer
- `limitTime` має countdown flow, session guards і навігацію на `LoseScreen`
- `recordWin(...)` / `recordLoss()` уже пишуть статистику і `bestGames`
- Settings має окремий modal host для `sound` і `skin`
- Statistic flow уже реалізований як окремий screen з split `Scene / Overlay`
- storage schema містить `gameState`, але активне відновлення сесії у `GameScreen` зараз не підключене

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

Проект розбитий на такі основні підсистеми:

### 3.1. App bootstrap і app infrastructure

- `App.tsx`
- `src/context/AppShell.tsx`
- `src/context/FontProvider.tsx`
- `src/context/GameStateProvider.tsx`
- `src/context/LayoutSnapshotProvider.tsx`
- `src/utils/splash.ts`
- `src/utils/soundManager.ts`

### 3.2. Layout system

- `src/layout/createAppLayoutSnapshot.ts`
- `src/layout/types.ts`
- layout hooks з `LayoutSnapshotProvider.tsx`

### 3.3. Navigation

- `src/navigation/RootNavigator.tsx`
- `src/types/types.ts`

### 3.4. Game runtime

- `src/screens/GameScreen.tsx`
- `src/ui/game/*`
- `src/ui/skia/*` для бойового рендеру

### 3.5. Settings flow

- `src/screens/SettingsScreen.tsx`
- `src/screens/components/SettingsModalHost.tsx`
- `src/screens/components/SoundModal.tsx`
- `src/screens/components/SkinModal/*`

### 3.6. Statistic flow

- `src/screens/StatisticScreen.tsx`
- `src/screens/components/StatisticModal/*`

### 3.7. Persistence

- `src/storage/appStorage.ts`
- `src/storage/appStorage.types.ts`
- `src/storage/storageKeys.ts`

---

## 4. Root composition застосунку

Коренева композиція виглядає так:

`GestureHandlerRootView`
-> `SafeAreaProvider`
-> `LayoutSnapshotProvider`
-> `FontProvider`
-> `AppShell`
-> `GameStateProvider`
-> `NavigationContainer`
-> `RootNavigator`

### Що це означає практично

- gesture-handler доступний глобально
- safe area відома до побудови layout snapshot
- scale-aware layout доступний до побудови Skia fonts
- `AppShell.tsx` гарантує `ensureSplashPrevented()` і `soundManager.prime()`
- splash screen ховається тільки коли готові:
  - RN fonts
  - Skia fonts
  - hydration storage state
- navigation монтується тільки після цього

---

## 5. Канонічні джерела істини

### 5.1. Screen-level layout

Канонічне джерело screen-level геометрії:

- `LayoutSnapshotProvider`
- `createAppLayoutSnapshot.ts`

Тут рахується:

- геометрія game screens
- базові settings modal frames
- shell gaps
- загальні layout tokens

### 5.2. Component-local derived layout

Локальна геометрія всередині складних вузлів **дозволена**, якщо вона:

- похідна від already canonical frame
- похідна від `S` і `snap`
- не створює альтернативного screen-level layout builder
- є єдиним локальним джерелом істини для конкретного вузла

Поточні приклади:

- `useSkinLayout.ts`
- `useStatisticLayout.ts`
- `useSoundLayout(...)` всередині `SoundModal.tsx`
- локальна geometry/measurement логіка в `PanelZone.tsx`

### 5.3. Гарячий стан дошки

Канонічне джерело runtime board-state:

- shared values у `useGameBoardController.ts`

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
- `movesSV`

### 5.4. Persisted app state

Канонічне джерело persisted application state:

- `GameStateProvider.tsx`
- `storage/appStorage.ts`
- `storage/appStorage.types.ts`

### 5.5. Theme / skin colors

Канонічне джерело selectable colors:

- `settings` у `GameStateProvider`
- `THEME_PALETTE` у `src/theme/themePalette.ts`

---

## 6. Layout architecture

### 6.1. Поточна модель layout

Проект зараз живе у **гібридній layout-моделі**:

- глобальний snapshot відповідає за screen-level frames і tokens
- самодостатні компоненти можуть мати локальний sublayout, похідний від цих frames

Це важлива зміна канону: локальний sublayout більше не вважається порушенням сам по собі.

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

- `headerToAnimationGap`
- `animationToTitleGap`
- `titleToContentGap`
- `footerBottomGap`

### 6.3. Канонічні layout hooks

- `useGameLayout(mode)`
- `useSettingsLayout()`
- `useShellLayout()`
- `useLayoutTokens()`
- `useLayoutDevice()`
- `useLayoutRenderHelpers()`

### 6.4. Що дозволено локально

Дозволено локально рахувати:

- внутрішні inset-и модалки
- позиції локальних кнопок всередині модалки
- локальні text/image slots
- pressed rects у self-contained компонентах
- panel height через `onLayout`

Не можна локально будувати:

- альтернативний game screen layout
- альтернативний settings modal frame
- друге незалежне джерело layout tokens

### 6.5. Що більше не є каноном

`LayoutMetricsProvider.tsx` ще існує у дереві, але root-app спирається не на нього.

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
- `Statistic` не має route params

---

## 8. Architecture of non-game screens

### 8.1. ScreenShell family

`ScreenShell.tsx` — canonical shell для:

- `HomeScreen`
- `NewGameScreen`
- `SettingsScreen`

Він відповідає за:

- background
- header через `AppHeader`
- animation slot
- title slot
- content slot
- footer positioning

### 8.2. PanelZone

`PanelZone.tsx` — canonical container кнопок меню.

Патерн такий:

- `Canvas` малює `PanelSurface` і skins кнопок
- RN `Pressable` дають hit-zones
- `onLayout` міряє panel і button rects
- geometry снапиться на піксель
- `pressedId` живе локально у React state
- звук кліку йде через `soundManager`

Це канонічний pattern проекту:

**Skia малює пікселі, RN дає взаємодію.**

### 8.3. Support screen

`SupportScreen.tsx` зараз не входить у family `ScreenShell`.

Це окремий простий RN screen з:

- `TextInput`
- кнопкою `Send`
- кнопкою `GoBack`

Його не слід брати як стилістичний канон для інших screen-flow.

---

## 9. Канонічна архітектура GameScreen

### 9.1. Поточний orchestration layer

Головний orchestration layer гри — `src/screens/GameScreen.tsx`.

Він:

- читає режим гри з route params
- дістає scene metrics через `useGameSceneMetrics(...)`
- читає шрифти через `useSkiaFonts()`
- читає settings / countdown API через `useGameState()`
- створює `bootGrid` через `shuffleTiles()`
- створює controller дошки через `useGameBoardController(...)`
- тримає session guards через refs
- запускає і зупиняє countdown interval
- викликає `recordWin(...)` / `recordLoss()`
- вирішує navigation на `Win` / `Lose`

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

Pipeline виглядає так:

`GameScreen`
-> `GameSceneCanvas`
-> `GameBoardSceneLayer`
-> `BoardTileNode`
-> `TileSkin`

---

## 10. Канонічний board state і game model

### 10.1. Формат дошки

- дошка = масив із 16 елементів
- `0` = empty cell
- `1..15` = id плиток

### 10.2. Контролер дошки

`useGameBoardController.ts` — canonical runtime-controller.

Його задачі:

- ініціалізувати board state
- обробляти tap logic
- обробляти drag commit
- оновлювати empty position
- керувати finish-animation state
- скидати preview state
- інкрементувати `movesSV`
- викликати `onMoveCommitted(...)`
- детектити win через `isWinningGrid(...)`

### 10.3. Чиста модель гри

`gameBoardModel.ts` — pure model layer.

Ключові функції:

- `findEmpty(grid)`
- `commitShift(grid, empty, axis, steps)`
- `isWinningGrid(grid)`
- `makeDefaultGrid()`

### 10.4. Семантика `steps`

У поточній моделі `steps` — це напрямлений зсув від стартової плитки до empty cell:

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

---

## 12. Animation handoff і win flow

Після коміту controller:

- одразу оновлює `gridSV`
- одразу оновлює `emptyRow` / `emptyCol`
- формує `MoveCommitEvent`
- одразу викликає `onMoveCommitted(...)` через `scheduleOnRN(...)`
- запускає finish-анімацію через `animT = withTiming(...)`

Якщо нова сітка виграшна:

- controller не навігує напряму
- він викликає `onWin(sessionId)` через `scheduleOnRN(...)`
- це відбувається після завершення анімації

Отже navigation decision живе в `GameScreen.tsx`, а не в model-layer.

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

Сам `setInterval(...)` зараз знаходиться у `GameScreen.tsx`.

Тобто:

- provider дає API і app-level runtime state
- `GameScreen` вирішує, коли стартує / зупиняється countdown
- `GameScreen` вирішує, коли перейти на `LoseScreen`

### 13.3. Session guards

`GameScreen.tsx` також тримає session-level refs:

- `sessionIdRef`
- `didResolveGameRef`
- `didPersistGameResultRef`
- `hasPendingWinRef`
- `sessionStartedAtMsRef`
- `sessionStartedAtIsoRef`

Це захищає flow від подвійних win/loss side effects.

### 13.4. Режими

- `classic` — таймер не тікає
- `limitTime` — запускається countdown від `settings.limitTimeMs`

---

## 14. Statistic architecture

### 14.1. Де живе statistic flow

`StatisticScreen.tsx` — окремий transparent modal screen, а не частина `SettingsModalHost`.

Він:

- малює backdrop в Canvas
- читає `bestGames`, `statistics`, `resetStatistics()` з `GameStateProvider`
- формує top-10 items через `useMemo(...)`
- тримає `contentHeight`
- тримає transient `pressedButton`
- дає зовнішні RN hit-zones для закриття modal route

### 14.2. Split Scene / Overlay pattern

Statistic modal уже побудований через явний split:

- `StatisticModalScene.tsx` = тільки Skia-візуал
- `StatisticModalOverlay.tsx` = тільки RN interaction layer
- `useStatisticLayout.ts` = локальний derived layout

### 14.3. Button interaction policy

Для statistic modal pressed state працює так:

- `Overlay` ловить `onPressIn` / `onPressOut`
- `StatisticScreen` тримає `pressedButton`
- `Scene` передає `pressed` у `SkiaIconButtonSkin`

Тобто pressed-state є **interaction state**, а не layout state.

### 14.4. Що вже реалізовано

- список до 10 найкращих ігор
- сортування за `durationMs`, потім `moves`
- scrollable list
- reset statistics button
- back button
- окремі `Scene / Overlay`

---

## 15. Settings architecture

### 15.1. SettingsScreen

`SettingsScreen.tsx`:

- тримає `activeModal`
- тримає `modalOpacity` як reanimated shared value
- блокує повторне відкриття під час анімації
- рендерить `ScreenShell` + `PanelZone`
- для `statistic` робить navigation на окремий route

### 15.2. SettingsModalHost

`SettingsModalHost.tsx` — окремий композиційний вузол поверх settings screen.

Він:

- малює backdrop у Canvas
- малює тільки `sound` і `skin` modal scenes у Canvas
- керує opacity через derived values
- поверх цього дає RN `Pressable` hit-zones

### 15.3. Modal decomposition

Поточні модальні пари:

- `SoundModalScene` / `SoundModalOverlay`
- `SkinModalScene` / `SkinModalOverlay`
- `StatisticModalScene` / `StatisticModalOverlay`

Але тільки перші дві пари живуть усередині `SettingsModalHost`.

---

## 16. Persistence architecture

### 16.1. Storage schema

`AppStorageData` містить:

- `settings`
- `statistics`
- `gameState`
- `bestGames`

### 16.2. Hydration flow

`GameStateProvider` при старті:

1. читає AsyncStorage через `loadAppStorage()`
2. зливає дані з defaults
3. виставляє `isHydrated = true`
4. тільки після цього `AppShell` дозволяє ховати splash

### 16.3. Save flow

Після hydration кожна зміна `data` тригерить `saveAppStorage(data)`.

### 16.4. Domain actions

Provider має:

- `saveGame(...)`
- `clearGame()`
- `updateSettings(...)`
- `updateStatistics(...)`
- `resetStatistics()`
- `recordWin(...)`
- `recordLoss()`

### 16.5. Best games pipeline

`appStorage.ts` додатково відповідає за:

- `normalizeBestGames(...)`
- `insertBestGame(...)`
- legacy fallback з `playedAt` -> `startedAt`
- обмеження top-10 результатів

### 16.6. Важлива межа

`gameState` уже є в schema і provider API, але поточний `GameScreen.tsx` не відновлює persisted board-state і не викликає `saveGame(...)` як бойовий resume-flow.

Тому **наявність поля у storage не означає активну feature готовності**.

---

## 17. Skia / shader architecture

### 17.1. Ключовий принцип

Skia відповідає за бойовий візуальний рендер.
RN відповідає за структуру, hit-zones і orchestration.

### 17.2. Shader-backed surfaces

Ключові поточні shader-backed вузли:

- `BoardSkin.tsx`
- `TileSkin.tsx`
- `TimerSkin.tsx`
- `SkiaButtonSkin.tsx`
- `SkiaButtonSound.tsx`
- `SkiaIconButtonSkin.tsx`
- `DBorder.tsx`
- frame-chrome statistic modal через `DBorder.tsx` і `SkiaIconButtonSkin.tsx`

### 17.3. `frame.sksl` як канонічна рамка

`src/ui/skia/shaders/frame.sksl` зараз є канонічним шейдером для frame/button chrome.

Він використовується в:

- `SkiaButtonSkin.tsx`
- `SkiaButtonSound.tsx`
- `SkiaIconButtonSkin.tsx`
- `DBorder.tsx`

Statistic modal спирається на цей shader опосередковано через `DBorder.tsx` і `SkiaIconButtonSkin.tsx`.

### 17.4. Інші шейдери

- `board_v1.sksl` -> `BoardSkin`
- `tile_v2.sksl` -> `TileSkin`, `IconButtonSkin`
- `timer.sksl` -> `TimerSkin`

### 17.5. Не все Skia повинно бути shader-backed

`PanelSurface.tsx` зараз не використовує custom shader.

Він побудований через:

- `RoundedRect`
- `Shadow`

І це теж вважається нормальним бойовим рішенням, якщо компонент не потребує окремого SKSL.

### 17.6. Shader compilation rule

`Skia.RuntimeEffect.Make(...)` виконується на рівні модуля, а не всередині рендера.

---

## 18. Файли, які існують, але не повинні вводити в оману

У проекті ще є кілька історичних або допоміжних файлів:

### Не-root layout

- `src/context/LayoutMetricsProvider.tsx`

### Не-канонічний game shell

- `src/ui/shell/GameScreenShell.tsx`

### Альтернативні / старі surface-и

- `src/ui/skia/BoardSkin1.tsx`
- `src/ui/skia/TileSkin1.tsx`

### Sandbox / test / debug

- `src/screens/AboutScreen.tsx`
- `src/ui/skia/Test.tsx`
- `src/test/RnghSmoke.tsx`

### Не поточний shader canon

- `src/ui/skia/shaders/button.sksl`

Він існує в дереві, але поточний button/frame chrome спирається на `frame.sksl`.

---

## 19. Поточний стан реалізації

### Уже реалізовано

- root provider stack
- централізований layout snapshot
- локальні sublayout hooks для складних modal-компонентів
- font loading + splash gating
- sound priming на старті
- basic navigation flow
- game scene через єдиний Canvas
- board runtime на shared values
- tap / drag pipeline
- finish-анімація після коміту
- win / loss flow з session guards
- countdown flow для `limitTime`
- Settings модалки з `Scene / Overlay`
- Statistic modal як окремий transparent route
- AsyncStorage persistence для settings / statistics / best games

### Частково готово або ще полірується

- бойова shuffle-логіка
- реальний resume-flow через `gameState`
- підтримка `SupportScreen` як завершеного UX flow
- уніфікація стилю всіх screen-flow
- завершений sound integration по всьому app flow

---

## 20. Короткий канон для майбутніх змін

### Якщо зміна про layout

дивитися:

1. `LayoutSnapshotProvider.tsx`
2. `createAppLayoutSnapshot.ts`
3. конкретний screen consumer
4. локальний sublayout hook, якщо проблема всередині self-contained modal/component

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
4. відповідний shader, якщо surface frame-like або tile-like

### Якщо зміна про settings

дивитися:

1. `SettingsScreen.tsx`
2. `SettingsModalHost.tsx`
3. відповідну modal scene/overlay пару

### Якщо зміна про statistics

дивитися:

1. `StatisticScreen.tsx`
2. `StatisticModalScene.tsx`
3. `StatisticModalOverlay.tsx`
4. `useStatisticLayout.ts`
5. `GameStateProvider.tsx`

---

## 21. Підсумок

Поточна архітектура проекту тримається на п’яти опорах:

1. **централізований screen-level layout snapshot**
2. **локальний derived sublayout для self-contained вузлів**
3. **hot path дошки на shared values**
4. **Skia як основний renderer, RN як interaction layer**
5. **provider-based persistence для settings / statistics / best games**

Саме навколо цього треба будувати подальші зміни, не повертаючи геометрію або runtime board-state назад у розпорошені локальні джерела істини і не змішуючи interaction-state з layout-state.
