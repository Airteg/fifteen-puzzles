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
- persistence
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

У застосунку має бути одне джерело **screen-level** layout-даних:
`LayoutSnapshotProvider` / `AppLayoutSnapshot`.

Правила:

- screen-level layout рахується централізовано
- screens читають готові frame-и з snapshot
- глобальні tokens не дублюються
- layout не змішується з runtime-state

Не пропонуй:

- альтернативний `createAppLayoutSnapshot(...)` усередині screen-компонентів
- локальні `makeBoardMetrics(...)` у screens
- дублювання game/settings modal frames на рівні screens
- prop-drilling глобальних layout tokens через довгі дерева, якщо їх можна взяти з provider

---

## 5. Допустимий локальний sublayout

Локальний derived layout **дозволений**, якщо він:

- базується на canonical frame, отриманому зверху
- базується на `S` і `snap`
- є самодостатнім для одного вузла
- не створює друге незалежне джерело screen-level геометрії

Поточні canonical приклади:

- `useSkinLayout.ts`
- `useStatisticLayout.ts`
- `useSoundLayout(...)`
- локальна geometry/measurement логіка в `PanelZone.tsx`

Отже правило не таке: "ніякого локального layout".
Правило таке: "ніякого конкуруючого screen-level layout".

---

## 6. Layout != runtime-state

Layout snapshot містить тільки стабільну геометрію.

Не змішуй у ньому:

- tokens
- frames
- drag state
- timer ticking
- press state
- animation shared values
- scroll position
- modal open/close state

Transient UI state має жити поруч із вузлом, який ним керує.

Поточні нормальні приклади transient state:

- `pressedId` у `PanelZone.tsx`
- `pressedButton` у `StatisticScreen.tsx`
- `activeModal` у `SettingsScreen.tsx`
- `contentHeight` у `StatisticScreen.tsx`

---

## 7. Рендеринг і performance

- ігровий рендер виконується через Skia Canvas
- React Native використовується для layout, screen structure і hit-zones
- drag плиток не повинен залежати від React re-render
- жести повинні працювати через worklet / Reanimated pipeline
- `.sksl` шейдери мають компілюватися один раз на рівні модуля

Не пропонуй:

- RN-тіні для бойових ігрових елементів
- RN-анімації для плиток
- `Animated.createAnimatedComponent()` для Skia-компонентів
- перенесення ігрового рендеру зі Skia назад у RN Views

---

## 8. Канонічний interaction pattern

Для меню, модалок і frame-button вузлів канон такий:

- Skia малює surface
- RN `Pressable` дає hit-zone
- pressed state живе у React state поруч з orchestrator або overlay
- Skia skin отримує вже готовий `pressed` / `active` flag

Не роби interaction джерелом істини всередині Skia-компонента.

Поточні canonical приклади:

- `PanelZone.tsx`
- `SettingsModalHost.tsx` + `SoundModalOverlay`
- `StatisticScreen.tsx` + `StatisticModalOverlay.tsx`

---

## 9. Scene / Overlay split

Для складних модалок і scene-like вузлів використовуй явний split:

- `Scene` = тільки Skia-візуал
- `Overlay` = тільки RN interaction layer
- окремий local layout hook = геометрія, спільна для обох

Поточні canonical приклади:

- `SoundModalScene` / `SoundModalOverlay`
- `SkinModalScene` / `SkinModalOverlay`
- `StatisticModalScene` / `StatisticModalOverlay`

Якщо модалка живе окремим route, backdrop і зовнішні close-zones можуть належати screen-рівню, а не host-компоненту.

---

## 10. Ролі ключових вузлів

### `useGameBoardController.ts`

- канонічний controller дошки
- створює shared values
- обробляє `onTapCell(...)`
- обробляє `onCommitShift(...)`
- виконує shift і finish-анімацію
- формує `MoveCommitEvent`

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
- монтує interaction hit-zones
- не містить чисту game-model логіку

---

## 11. Drag / tap policy

- стартова плитка визначає групу руху
- `steps` = відстань стартової плитки до empty = розмір групи
- drag-preview рухає групу візуально лише на один крок
- commit виконується для всієї групи, якщо жест пройшов поріг
- preview, controller commit і finish-анімація повинні жити за однією математикою

Не пропонуй preview на 2-3 клітинки, якщо controller і finish-анімація працюють як однокроковий preview для групового коміту.

---

## 12. Shader policy

Поточний канон frame/button chrome:

- `frame.sksl`

Його споживають:

- `SkiaButtonSkin.tsx`
- `SkiaButtonSound.tsx`
- `SkiaIconButtonSkin.tsx`
- `DBorder.tsx`

Statistic modal використовує цей frame-chrome опосередковано через `DBorder.tsx` і `SkiaIconButtonSkin.tsx`.

Не вважай `button.sksl` поточним каноном тільки тому, що файл існує в дереві.

Також не змушуй кожен Skia surface бути shader-backed:

- `PanelSurface.tsx` на `RoundedRect` + `Shadow` теж є валідним бойовим патерном

---

## 13. Persistence policy

- `GameStateProvider.tsx` + `appStorage.ts` є каноном для persisted app state
- `bestGames` уже є бойовою feature
- `recordWin(...)` / `recordLoss()` є канонічними domain actions для статистики

Не роби припущення:

- що наявність `gameState` у schema означає готовий resume-flow
- що будь-яке поле storage уже використовується в runtime orchestration

Спочатку перевір фактичні consumer-и цього state.

---

## 14. Політика змін

Пропонуй мінімальні зміни, достатні для задачі.

Не роби без явної потреби:

- великий рефакторинг
- зміну архітектури
- нові залежності
- масове "покращення" несуміжного коду

Виняток:
якщо запит прямо стосується архітектури, централізації джерела істини або синхронізації документації з кодом.

---

## 15. Політика дебагу

Під час дебагу:

1. знайди канонічні файли
2. перевір джерело істини
3. визнач тип проблеми:
   - архітектура
   - локальна логіка
   - gesture / animation math
   - layout
   - shader surface
   - UX / tuning
4. пропонуй правки малими кроками
5. після кожного кроку зберігай робочу базу

Для drag-дебагу порядок:

1. `BoardGestureOverlay.tsx`
2. `useGameBoardController.ts`
3. `BoardTileNode.tsx`

Для modal/debug flow:

1. screen orchestrator
2. overlay
3. scene
4. local layout hook

---

## 16. Документація і канон

- документація проекту ведеться українською
- відповідай українською; англійську використовуй для коду, API і технічних термінів
- спирайся на канонічні файли, якщо вони новіші за документацію
- якщо рішення порушує цей файл, скажи про це прямо
- якщо канон змінено, онови `ARCHITECTURE.md`, `AI_INDEX.md` і `AI_RULES.md`

Найважливіше:

- не плутай layout-state з interaction-state
- не плутай storage schema з реально підключеною feature
- не плутай наявність файлу в дереві з його канонічністю
