# AI Code Index

Цей файл містить швидку карту навігації по кодовій базі.
Він допомагає ШІ швидко знаходити головні системи проекту "Fifteen Puzzles".

## 🧠 Game Logic (Ігрова логіка)

- **Канонічний контролер дошки:** `src/ui/game/useGameBoardController.ts`
  - тримає бойовий стан дошки в `gridSV`
  - тримає `emptyRow` / `emptyCol`
  - тримає drag shared values
  - виконує `applyShift(...)`
  - обробляє `onTapCell(...)` і `onCommitShift(...)`
- **Чиста модель гри:** `src/ui/game/gameBoardModel.ts`
  - `makeDefaultGrid(...)`
  - `findEmpty(...)`
  - `commitShift(...)`
- **Математика дошки, координати та індексація:** `src/ui/game/boardGeometry.ts`

## 🧩 Game Data Model (Модель ігрових даних)

- **Канонічний стан дошки:** масив `array[16]` у `gridSV`
- `0` = пуста клітинка
- `1..15` = ідентифікатори плиток
- **Список плиток для рендера:** статичний масив `STATIC_TILES` у `src/ui/game/useGameBoardController.ts`
  - використовується тільки для `id` та `label`
  - позиція плитки не береться з React state

## 🎨 Rendering (Рендеринг)

- **Композиція дошки та Canvas:** `src/ui/game/GameBoardView.tsx`
- **UI-side вузол окремої плитки:** `src/ui/game/BoardTileNode.tsx`
  - читає позицію плитки з `gridSV`
  - додає preview drag через `dragOffsetPx`
  - додає finish-анімацію через `animT`, `animMovedIdsSV`, `animAxisSV`, `animDirSV`
- **Візуальна частина плиток (кольори, тіні, текст):** `src/ui/skia/TileSkin.tsx`
- **Візуальна частина фону дошки:** `src/ui/skia/BoardSkin.tsx`
- **Кастомні кнопки Skia:** `src/ui/skia/SkiaButtonSkin.tsx`
- **Графіка хедера:** `src/ui/skia/LogoSurface.tsx` / `src/ui/skia/AppHeaderSurface.tsx`
- **Векторна графіка (смайлики):** `src/ui/skia/SmileySkin.tsx`

## 🖐 Gestures & Motion (Жести та рух плиток)

- **Gesture layer / hit area / axis lock / tap-vs-pan policy:** `src/ui/game/BoardGestureOverlay.tsx`
- **Commit та animation state:** `src/ui/game/useGameBoardController.ts`
- **Фактичний transform плиток у UI runtime:** `src/ui/game/BoardTileNode.tsx`

## 🌈 Shader System (Система шейдерів)

- **Шейдери освітлення та ефектів плиток:** `src/ui/skia/shaders/`
- **Компіляція шейдерів:** `metro.config.js` та `tools/skslTransformer.js`
- **Правило:** `Skia.RuntimeEffect.Make()` має виконуватись один раз на рівні модуля, а не під час рендеру

## 📐 Layout (Система верстки)

- **Pixel-perfect масштабування (`S`, `snap`):** `src/context/LayoutMetricsProvider.tsx`
- **Константи ігрових метрик:** `src/ui/game/gameMetrics.ts`
- **Токени типографіки:** `src/theme/typography.ts`

## 📱 Screens (Екрани)

- **Головний екран:** `src/screens/HomeScreen.tsx`
- **Ігровий екран:** `src/screens/GameScreen.tsx`
- **Екран налаштувань:** `src/screens/SettingsScreen.tsx`
- **Тестовий / sandbox екран:** `src/screens/AboutScreen.tsx`

## 🏗 Infrastructure (Інфраструктура)

- **Завантаження шрифтів і Skia font cache:** `src/context/FontProvider.tsx`
- **Ініціалізація застосунку та splash flow:** `src/context/AppShell.tsx`
- **Глобальний стан гри / збереження / статистика:** `src/context/GameStateProvider.tsx`
- **Маршрутизація:** `src/navigation/RootNavigator.tsx`
- **Кастомна конфігурація Metro:** `metro.config.js` / `tools/skslTransformer.js`

## ⚠️ Що вважати канонічним під час аналізу

- Для руху плиток джерело істини — **не React state**, а shared values у `useGameBoardController.ts`
- Для позиції плитки джерело істини — `gridSV` у `BoardTileNode.tsx`
- `GameBoardView.tsx` — це **композиційний вузол**, а не місце для бойової логіки дошки
- Якщо потрібно дебажити drag:
  1. спершу дивитися `BoardGestureOverlay.tsx`
  2. потім `useGameBoardController.ts`
  3. потім `BoardTileNode.tsx`
