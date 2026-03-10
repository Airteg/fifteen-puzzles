# 📌 Стан Проекту (Project State)

## 1. Overview (Огляд проекту)

**Назва:** Fifteen Puzzles (гра "П'ятнадцять пазлів")

**Опис:**  
Мобільна гра з кастомним рендером на базі Skia. Поточна версія реалізує класичну механіку "п'ятнашок" з числовими плитками. У майбутньому запланована заміна чисел на фрагменти зображення (камера / галерея).

**Мова розробки та документації:** Українська.

---

## 2. Tech Stack (Стек технологій)

- **ОС розробника:** Windows 11
- **Пакетний менеджер:** pnpm
- **Фреймворк:** React Native + Expo
- **Навігація:** `@react-navigation/native-stack`
- **Графіка:** `@shopify/react-native-skia`
- **Анімації та жести:** `react-native-reanimated`, `react-native-gesture-handler`
- **Шейдери:** `.sksl`, `.glsl` через налаштований `metro.config.js`

---

## 3. Architecture (Архітектура)

Проект поділено на кілька окремих систем:

- `src/context/`
  - глобальні провайдери
  - `LayoutMetricsProvider`
  - `FontProvider`
  - `GameStateProvider`

- `src/navigation/`
  - маршрутизація екранів

- `src/ui/game/`
  - ядро ігрової дошки
  - gesture layer
  - controller
  - геометрія та модель руху плиток

- `src/ui/skia/`
  - візуальні Skia-компоненти
  - дошка, плитки, кнопки, графічні примітиви, шейдери

- `src/theme/`
  - типографіка
  - візуальні токени

---

## 4. Rendering Model (Модель рендерингу)

### Основний принцип

React Native відповідає за:

- layout
- структуру екрана
- контейнеризацію

Skia відповідає за:

- дошку
- плитки
- тіні
- візуальні ефекти
- графічний рендер гри

### Головне правило

Під час drag React не повинен бути джерелом позицій плиток і не повинен керувати їхнім рухом через re-render.

### Поточний рендеринговий ланцюг

Gesture → Reanimated shared values → Skia transform/update

### Практично це означає

- `GameBoardView.tsx` компонує дошку
- `BoardTileNode.tsx` читає позиції плиток із shared values
- `BoardGestureOverlay.tsx` обробляє tap/pan і оновлює drag-preview / commit
- `useGameBoardController.ts` є канонічним контролером стану дошки

---

## 5. Canonical Board State (Канонічний стан дошки)

### Джерело істини

Канонічний стан дошки зберігається у shared values в `useGameBoardController.ts`:

- `gridSV`
- `emptyRow`
- `emptyCol`

### Формат стану

- дошка = масив із 16 елементів
- `0` = пуста клітинка
- `1..15` = ID плиток

### Важливий принцип

React state не є джерелом істини для позиції плиток у hot path.

---

## 6. Data Flow (Потік даних)

### Tap

Користувач натискає на клітинку  
↓  
`BoardGestureOverlay` визначає `row/col`  
↓  
`onTapCell(...)` у `useGameBoardController.ts`  
↓  
controller обчислює `axis` і `steps`  
↓  
`applyShift(...)` оновлює `gridSV`, `emptyRow`, `emptyCol`, animation shared values  
↓  
`BoardTileNode` перемальовується через shared values

### Drag

Користувач починає панорамний жест  
↓  
`BoardGestureOverlay` визначає стартову клітинку  
↓  
overlay визначає дозволену вісь руху  
↓  
overlay оновлює `dragActive`, `dragAxis`, `dragStartRow`, `dragStartCol`, `dragOffsetPx`  
↓  
`BoardTileNode` показує drag-preview  
↓  
при `onEnd` overlay викликає `onCommitShift(axis, steps)`  
↓  
controller виконує `applyShift(...)`  
↓  
Skia виконує finish-анімацію через `animT`

---

## 7. Game Model (Модель гри)

- **Дошка:** сітка 4x4
- **Плитки:** 15 плиток + 1 пуста клітинка
- **Модель руху:** дозволено рухати одну плитку або групу плиток у межах одного рядка / стовпця в бік пустої клітинки
- **Commit logic:** реалізована в `gameBoardModel.ts` через `commitShift(...)`
- **Empty cell tracking:** через `findEmpty(...)`

### Семантика `steps`

У controller `steps` означає **відстань стартової плитки до пустої клітинки**, тобто довжину групи, яка має зміститися.

Це важливо:

- tap і drag повинні використовувати однакову семантику `steps`
- `steps` не означає "на скільки клітинок фізично протягнули палець"

---

## 8. Component Responsibilities (Відповідальність компонентів)

### `GameBoardView.tsx`

- композиційний вузол
- створює board metrics
- викликає `useGameBoardController`
- рендерить `Canvas`
- монтує `BoardTileNode`
- монтує `BoardGestureOverlay`

### `useGameBoardController.ts`

- канонічний контролер дошки
- створює shared values стану
- зберігає `gridSV`, `emptyRow`, `emptyCol`
- зберігає drag shared values
- зберігає finish-animation shared values
- обробляє `onTapCell`
- обробляє `onCommitShift`
- виконує `applyShift(...)`

### `BoardGestureOverlay.tsx`

- gesture layer поверх canvas
- hit area дошки
- tap vs pan arbitration
- axis lock
- drag-preview policy
- commit / no-commit рішення на `onEnd`

### `BoardTileNode.tsx`

- UI-side вузол окремої плитки
- читає поточну позицію плитки з `gridSV`
- додає preview-зміщення через `dragOffsetPx`
- додає finish-анімацію через:
  - `animT`
  - `animMovedIdsSV`
  - `animAxisSV`
  - `animDirSV`

### `boardGeometry.ts`

- математика дошки
- метрики
- координати клітинок
- step / inset / gap
- перетворення індексів у фізичні координати

### `gameBoardModel.ts`

- чиста модель гри
- правила зсуву
- формування нового стану дошки
- без UI-залежностей

---

## 9. Drag Policy (Політика drag)

Поточна архітектурна політика drag така:

- стартова плитка визначає, яку групу плиток буде рухати commit
- drag-preview візуально рухає групу лише на **один крок**
- commit відбувається лише якщо жест пройшов достатній прогрес
- після commit controller синхронно оновлює shared values і запускає finish-анімацію

### Чому це важливо

Preview і final commit повинні жити за однією математикою.  
Не можна дозволяти preview на 2–3 клітинки, якщо commit-модель рухає групу лише на один крок у сторону empty.

---

## 10. Layout System (Система верстки)

- Усі габарити мають спиратися на `LayoutMetricsProvider`
- Базова формула: `snap(value * S)`
- `S` = screen scale factor
- Мета:
  - pixel-perfect верстка
  - стабільна геометрія на різних екранах
  - однакова візуальна пропорція UI

---

## 11. Shader System (Система шейдерів)

- Шейдери розташовані в `src/ui/skia/shaders/`
- Використовуються для світла, матеріалу, тіней і глибини плиток
- Компіляція проходить через кастомний `metro.config.js`
- `Skia.RuntimeEffect.Make()` повинен виконуватися один раз на рівні модуля, а не під час рендеру

---

## 12. Performance Rules (Правила продуктивності)

- Не допускати React re-render у hot path drag
- Не переносити бойову логіку руху плиток назад у React state
- Обробка жестів повинна жити в Reanimated/worklet pipeline
- Skia використовується для всього візуального рендеру гри
- Не використовувати RN shadow / borderRadius / animated wrappers для ігрових плиток замість Skia-підходу
- Математика drag, preview і finish-анімації повинна бути узгодженою між overlay, controller і tile-node

---

## 13. Current Status (Поточний статус)

- [x] Налаштовано базову інфраструктуру проєкту
- [x] Підключено Skia, Reanimated, Gesture Handler
- [x] Реалізовано pixel-perfect layout через `LayoutMetricsProvider`
- [x] Реалізовано канонічний board controller на shared values
- [x] Прибрано React із hot path позиціонування плиток
- [x] Реалізовано tap logic
- [x] Реалізовано drag-preview і finish-анімацію
- [x] Рендер плиток переведено на UI-first модель через `BoardTileNode`
- [x] Підготовлено основу для майбутньої заміни цифр на image tiles

### Поточна зона роботи

- стабілізація UX drag
- перевірка на реальному пристрої
- подальша поліровка gesture thresholds тільки малими змінами

---

## 14. Current Work Session (Поточна робоча сесія)

Коли починається новий чат по проекту, потрібно передавати:

- **Задача:** що саме робимо в цій сесії
- **Файли в роботі:** які файли є канонічними для цього етапу
- **Проблема / контекст:** на чому зупинилися раніше
- **Поточна стабільна база:** яка версія вважається безпечною для продовження

---

## 15. Roadmap (Плани на майбутнє)

- image tiles замість цифр
- інтеграція з камерою
- інтеграція з галереєю
- нові візуальні теми / скіни плиток
- поліровка звуку, ефектів і реакцій UI
- подальше посилення drag UX без втрати UI-first архітектури
