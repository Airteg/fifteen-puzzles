# AI Code Index

Цей файл містить швидку карту навігації по кодовій базі.
Він допомагає ШІ знаходити головні системи проекту "Fifteen Puzzles".

## 🧠 Game Logic (Ігрова логіка)

- **Глобальний стан гри (Збереження та Статистика):** `src/context/GameStateProvider.tsx`
- **Математика дошки, координати та індексація:** `src/ui/game/boardGeometry.ts`
- **Основна логіка ходу (`commitShift`):** наразі реалізована всередині `src/ui/game/GameBoardView.tsx`

## 🧩 Game Data Model (Модель ігрових даних)

- **Представлення стану дошки:** масив `array[16]`, зберігається у `src/ui/game/GameBoardView.tsx`
- `0` = пуста клітинка
- `1..15` = ідентифікатори (ID) плиток

## 🎨 Rendering (Рендеринг)

- **Головний рендерер дошки (Canvas та цикл малювання плиток):** `src/ui/game/GameBoardView.tsx`
- **Візуальна частина плиток (кольори, тіні, текст):** `src/ui/skia/TileSkin.tsx`
- **Візуальна частина фону дошки:** `src/ui/skia/BoardSkin.tsx`
- **Кастомні кнопки Skia:** `src/ui/skia/SkiaButtonSkin.tsx`
- **Графіка хедера:** `src/ui/skia/LogoSurface.tsx` / `src/ui/skia/AppHeaderSurface.tsx`
- **Векторна графіка (Смайлики):** `src/ui/skia/SmileySkin.tsx`

## 🌈 Shader System (Система шейдерів)

- **Шейдери освітлення та ефектів плиток:** `src/ui/skia/shaders/tile.sksl`
- **Компілюються через нативні інструменти:** `metro.config.js` та `tools/skslTransformer.js`
- **Ініціалізація шейдерів:** виконується глобально через `Skia.RuntimeEffect.Make()` для максимальної продуктивності.

## 🖐 Gestures (Жести та анімації)

- **Розпізнавання свайпів (Pan/Swipe) та блокування осі:** `src/ui/game/BoardGestureOverlay.tsx`
- **Виконання анімацій (Reanimated):** `src/ui/game/GameBoardView.tsx`
- **Сюжетні анімації меню (Хореографія):** `src/ui/animation/HomeAnimation.tsx`, `src/ui/animation/NewGameAnimation.tsx`
-

## 📐 Layout (Система верстки)

- **Pixel-Perfect масштабування (`S`, `snap`):** `src/context/LayoutMetricsProvider.tsx`
- **Константи ігрових метрик (розміри, відступи):** `src/ui/game/gameMetrics.ts`
- **Токени типографіки (шрифти Mariupol, Krona):** `src/theme/typography.ts`

## 📱 Screens (Екрани)

- **Головний екран (Home Screen):** `src/screens/HomeScreen.tsx`
- **Ігровий екран (Game Screen):** `src/screens/GameScreen.tsx`
- **Екран налаштувань (Settings Screen):** `src/screens/SettingsScreen.tsx`
- **Тестовий стенд (UI Sandbox):** `src/screens/AboutScreen.tsx`

## 🏗 Infrastructure (Інфраструктура)

- **Завантаження шрифтів та кеш шрифтів Skia:** `src/context/FontProvider.tsx`
- **Ініціалізація додатку та Splash Screen:** `src/context/AppShell.tsx`
- **Маршрутизація (Routing):** `src/navigation/RootNavigator.tsx`
- **Кастомна конфігурація Metro (для підтримки шейдерів):** `metro.config.js` / `tools/skslTransformer.js`
