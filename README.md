# Fifteen Puzzles

**Fifteen Puzzles** — це мобільна гра на **React Native + Expo** з кастомним рендером через **Skia**.
Проєкт сфокусований на точній геометрії, високій продуктивності під час drag, централізованому layout та чітко розділених ролях між React Native, Reanimated і Skia.

Поточна версія вже має:
- головне меню та навігацію між екранами
- два режими гри: `classic` і `limitTime`
- ігрову дошку на shared values
- Skia-рендер для дошки, плиток, таймера та кнопок
- settings flow з окремими Skia-модалками
- persistence для settings / statistics / game data через AsyncStorage

---

## 1. Технології

- **Expo** `~54.0.33`
- **React Native** `0.81.5`
- **React** `19.1.0`
- **@shopify/react-native-skia** `^2.4.18`
- **react-native-reanimated** `~4.1.1`
- **react-native-gesture-handler** `~2.28.0`
- **react-native-worklets** `0.5.1`
- **@react-navigation/native-stack** `^7.12.0`
- **@react-native-async-storage/async-storage** `^2.2.0`

Шейдери підключені через кастомний Metro transformer:
- `metro.config.js`
- `tools/skslTransformer.js`

---

## 2. Швидкий запуск

### Вимоги

- **Node.js** сумісної версії для Expo SDK 54
- **pnpm**
- **Android Studio** або **Xcode**
- налаштований native toolchain для Expo development build

### Встановлення

```bash
pnpm install
```

### Основні команди

```bash
pnpm start
pnpm dev
pnpm dev:all
pnpm android
pnpm ios
pnpm android:start
pnpm ios:start
pnpm web
pnpm lint
```

### Практичний dev-flow

1. Перший native build:

```bash
pnpm android
```

або

```bash
pnpm ios
```

2. Далі запуск Metro для dev client:

```bash
pnpm dev
```

3. Якщо треба одночасно зробити `adb reverse` і очистити кеш:

```bash
pnpm dev:all
```

---

## 3. Поточна структура проєкту

```text
src/
  context/        root providers, hydration, fonts, global app state
  layout/         layout snapshot builder + types
  navigation/     root navigator
  screens/        screen-level orchestration
  storage/        AsyncStorage persistence layer
  theme/          typography + selectable color palette
  ui/
    animation/    placeholder animations
    game/         board runtime, controller, gestures, scene composition
    header/       shell/header UI
    shell/        shared screen shells
    skia/         Skia skins, shaders, vector graphics
```

Ключові кореневі файли:
- `App.tsx`
- `src/context/AppShell.tsx`
- `src/navigation/RootNavigator.tsx`

---

## 4. Архітектурний принцип проєкту

### React Native відповідає за:
- структуру екрана
- навігацію
- hit-zones / accessibility overlays
- persistence / hydration / global app state

### Skia відповідає за:
- дошку
- плитки
- таймер
- кнопки ігрової сцени
- декоративні поверхні, тіні, шейдери та матеріали

### Reanimated / Shared Values відповідають за:
- гарячий runtime-stan дошки
- drag-preview
- finish-анімацію після commit
- gesture-adjacent pipeline без React re-render у hot path

---

## 5. Канонічні джерела істини

### Layout
Канонічний layout живе тут:
- `src/context/LayoutSnapshotProvider.tsx`
- `src/layout/createAppLayoutSnapshot.ts`
- `src/layout/types.ts`

Усі базові frame-розрахунки мають спиратися саме на `AppLayoutSnapshot`.

### Runtime board state
Канонічний гарячий стан дошки живе тут:
- `src/ui/game/useGameBoardController.ts`

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

### Persisted app state
Канонічний persistence layer:
- `src/context/GameStateProvider.tsx`
- `src/storage/appStorage.ts`
- `src/storage/appStorage.types.ts`
- `src/storage/storageKeys.ts`

---

## 6. Ігровий runtime: що читати в першу чергу

### 1) `src/screens/GameScreen.tsx`
Головний orchestration layer ігрового процесу.

Тут:
- вибирається режим `classic` / `limitTime`
- створюється `bootGrid`
- ініціалізується controller
- запускається countdown flow
- вирішуються переходи на `Win` / `Lose`
- монтуються `GameSceneCanvas` і `BoardGestureOverlay`

### 2) `src/ui/game/GameSceneCanvas.tsx`
Композиція всієї Skia-сцени гри.

### 3) `src/ui/game/GameBoardSceneLayer.tsx`
Skia-рівень самої дошки.

### 4) `src/ui/game/useGameBoardController.ts`
Канонічний controller дошки.

### 5) `src/ui/game/BoardGestureOverlay.tsx`
Gesture layer: tap / pan arbitration, axis lock, drag preview, commit.

### 6) `src/ui/game/BoardTileNode.tsx`
UI-side вузол окремої плитки, що читає позицію з shared values.

### 7) `src/ui/game/gameBoardModel.ts`
Чиста модель гри без UI-залежностей.

---

## 7. Flow гри

### Tap
`BoardGestureOverlay` → `onTapCell(...)` → `useGameBoardController.ts` → `commitShift(...)` → оновлення `gridSV` → `BoardTileNode` перемальовується через shared values.

### Drag
`BoardGestureOverlay` визначає стартову клітинку і вісь → оновлює preview через `dragOffsetPx` → на `onEnd` викликає `onCommitShift(...)` → controller комітить хід → запускається finish-анімація через `animT`.

### Countdown (`limitTime`)
`GameScreen.tsx` керує deadline-based countdown через `GameStateProvider`. Після досягнення нуля відбувається перехід на `LoseScreen`.

---

## 8. Settings architecture

Settings flow побудований окремо від game runtime.

Ключові файли:
- `src/screens/SettingsScreen.tsx`
- `src/screens/components/SettingsModalHost.tsx`
- `src/screens/components/SoundModal.tsx`
- `src/screens/components/SkinModal/*`

Поточний патерн:
- **Scene** малює Skia-пікселі
- **Overlay** дає RN hit-zones і взаємодію

Це та сама базова ідея, що й у game scene:
**Skia малює, RN взаємодіє.**

---

## 9. Persistence

Проєкт уже має persistence для:
- settings
- statistics
- gameState
- bestGames

Формат описано в:
- `src/storage/appStorage.types.ts`

Default values:
- sound увімкнений
- дефолтні кольори дошки й плиток задані в `DEFAULT_SETTINGS`
- `DEFAULT_LIMIT_TIME_MS = 120000`

---

## 10. Документація для ШІ та архітектурного аналізу

У репозиторії є службові файли, які треба читати разом:
- `AI_RULES.md`
- `AI_INDEX.md`
- `ARCHITECTURE.md`

Ролі документів:
- `AI_RULES.md` — проектний канон і правила рішень
- `AI_INDEX.md` — швидка карта файлів і точок входу
- `ARCHITECTURE.md` — детальний опис поточної архітектури

Якщо документація суперечить свіжому коду, пріоритет має **актуальний канонічний код**.

---

## 11. Поточний стан проєкту

Уже є:
- базовий bootstrap застосунку
- navigation flow
- shell-екрани
- game scene на Skia
- tap logic
- drag-preview і finish-анімація
- countdown для `limitTime`
- win / lose navigation flow
- sound / skin settings flow
- AsyncStorage persistence

Ще не завершено або тимчасово спрощено:
- частина екранів ще є placeholder-реалізаціями
- статистика ще не переведена в фінальний Skia-стиль
- `shuffleTiles.ts` зараз повертає **debug-grid**, а не справжнє випадкове solvable shuffle
- є legacy-файли, які залишились у дереві, але не повинні вважатися опорними для нових рішень

---

## 12. Важливі обмеження для нових змін

### Не ламати канон layout
Не дублювати базові frame-формули по екранах. Нові рішення мають спиратися на `LayoutSnapshotProvider`.

### Не повертати дошку в React state
Позиції плиток у hot path не повинні знову залежати від React re-render.

### Не переносити бойовий рендер зі Skia назад у RN Views
RN використовується для shell, overlays і взаємодії, але не для бойового рендеру дошки.

### Не змішувати layout і runtime-state
Layout snapshot — це стабільна геометрія. Drag, timer tick, animation state і press state не повинні жити в ньому.

---

## 13. Які файли вважати неканонічними або перехідними

Ці файли можуть бути корисні для історії чи окремих експериментів, але не повинні ставати базою нової архітектури без окремого рішення:
- `src/context/LayoutMetricsProvider.tsx`
- `src/ui/game/GameScreenShell.tsx`
- `src/ui/skia/BoardSkin1.tsx`
- `src/ui/skia/TileSkin1.tsx`
- `src/screens/AboutScreen.tsx` як sandbox

---

## 14. Рекомендований порядок читання коду для нового чату або нового розробника

1. `AI_RULES.md`
2. `AI_INDEX.md`
3. `ARCHITECTURE.md`
4. `App.tsx`
5. `src/context/AppShell.tsx`
6. `src/screens/GameScreen.tsx`
7. `src/ui/game/useGameBoardController.ts`
8. `src/ui/game/BoardGestureOverlay.tsx`
9. `src/ui/game/BoardTileNode.tsx`
10. `src/ui/game/gameBoardModel.ts`
11. `src/context/GameStateProvider.tsx`
12. `src/layout/createAppLayoutSnapshot.ts`

---

## 15. Плани розвитку

Найближчі стратегічні напрямки:
- стабілізація drag UX
- повернення справжнього solvable shuffle
- поліровка Win / Lose / Statistics UX
- розвиток sound system
- image tiles замість numeric tiles
- інтеграція з камерою та галереєю
- нові скіни та теми

---

## 16. Коротко

Fifteen Puzzles — це не просто 15-puzzle на React Native, а проєкт із чітким архітектурним фокусом:
- **Skia для пікселів**
- **Shared Values для hot path**
- **React Native для структури та взаємодії**
- **централізований layout snapshot**
- **мінімальна магія і одне джерело істини для кожного шару**

