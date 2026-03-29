# AI Rules — Fifteen Puzzles

Використовуй цей файл разом з:

- `ARCHITECTURE.md`
- `AI_INDEX.md`

## 1. Загальний канон

Пріоритети проекту:

- проста архітектура
- одне джерело істини для кожного типу даних
- детермінована логіка
- висока продуктивність
- мінімум прихованої магії

Обирай найпростіше рішення, яке не ламає канон.

---

## 2. Межі систем

Не змішуй без прямої причини:

- game logic
- rendering
- gesture / motion
- layout
- infrastructure

---

## 3. Канонічний стан дошки

- бойовий стан дошки живе у shared values
- `gridSV` — джерело істини для позицій плиток
- `emptyRow` / `emptyCol` — канонічне положення empty cell
- React state не є джерелом істини для плиток у hot path

Не повертай бойовий стан плиток у React state без явного архітектурного запиту.

---

## 4. Канонічний layout

У застосунку має бути одне джерело layout-даних:
`LayoutSnapshotProvider` / `AppLayoutSnapshot`.

Правила:

- layout рахується централізовано
- компоненти читають готову геометрію
- базова геометрія не передається довгими prop-chain
- layout не дублюється
- layout не змішується з runtime-state

Не пропонуй:

- локальні `snap(value * S)` у screens
- локальні `makeBoardMetrics(...)` у screens
- локальні frame-розрахунки в skins, modals, shells
- дублювання design-формул
- prop-drilling базової геометрії (`boardM`, `m`, `tile`, `step`, `panelW`, `buttonW`, `buttonH`, scene frames)

Дозволено:

- централізований layout builder на основі `useWindowDimensions`, `useSafeAreaInsets`, `PixelRatio.roundToNearestPixel`
- оновлення layout snapshot лише при зміні геометрії вікна / safe area

---

## 5. Layout ≠ runtime-state

Layout snapshot містить тільки стабільну геометрію.

Не змішуй у ньому:

- tokens
- frames
- drag state
- timer ticking
- press state
- animation shared values

Гаряча логіка руху лишається в Reanimated / SharedValue pipeline.

---

## 6. Рендеринг і performance

- ігровий рендер виконується через Skia Canvas
- React Native використовується для layout, screen structure і non-game оболонок
- drag плиток не повинен залежати від React re-render
- жести повинні працювати через worklet / Reanimated pipeline
- `.sksl` шейдери мають компілюватися один раз на рівні модуля

Не пропонуй:

- RN-тіні для ігрових елементів
- RN-анімації для плиток
- `Animated.createAnimatedComponent()` для Skia-компонентів
- перенесення ігрового рендеру зі Skia назад у RN Views

---

## 7. Ролі ключових вузлів

### `useGameBoardController.ts`

- канонічний контролер дошки
- створює shared values
- обробляє `onTapCell(...)`
- обробляє `onCommitShift(...)`
- виконує `applyShift(...)`
- тримає animation shared values

### `BoardGestureOverlay.tsx`

- tap / pan arbitration
- axis lock
- drag-preview
- commit / no-commit на `onEnd`

### `BoardTileNode.tsx`

- рендер конкретної плитки
- читає позицію з `gridSV`
- додає drag-preview
- додає finish-анімацію

### scene composition вузол

- збирає canvas-сцену
- монтує tile nodes
- монтує gesture overlay
- не містить бойову логіку дошки

---

## 8. Drag / tap policy

- стартова плитка визначає групу руху
- `steps` = відстань стартової плитки до empty = розмір групи
- drag-preview рухає групу візуально лише на один крок
- commit виконується для всієї групи, якщо жест пройшов поріг
- preview, controller commit і finish-анімація повинні жити за однією математикою

Не пропонуй preview на 2–3 клітинки, якщо controller і finish-анімація працюють як однокроковий зсув групи.

---

## 9. Політика змін

Пропонуй мінімальні зміни, достатні для задачі.

Не роби без явної потреби:

- великий рефакторинг
- зміну архітектури
- нові залежності
- масове “покращення” несуміжного коду

Виняток:
якщо запит прямо стосується архітектури або централізації джерела істини.

---

## 10. Політика дебагу

Під час дебагу:

1. знайди канонічні файли
2. перевір джерело істини
3. визнач тип проблеми:
   - архітектура
   - локальна логіка
   - gesture / animation math
   - UX / tuning
4. пропонуй правки малими кроками
5. після кожного кроку зберігай робочу базу

Для drag-дебагу порядок:

1. `BoardGestureOverlay.tsx`
2. `useGameBoardController.ts`
3. `BoardTileNode.tsx`

---

## 11. Документація і канон

- документація проекту ведеться українською
- відповідай українською; англійську використовуй для коду, API і технічних термінів
- спирайся на канонічні файли, якщо вони новіші за документацію
- якщо рішення порушує цей файл, скажи про це прямо
- якщо канон змінено, запропонуй оновити документацію
