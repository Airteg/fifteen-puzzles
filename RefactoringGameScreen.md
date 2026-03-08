# Архітектура GameScreen

`GameScreen.tsx` збирає екран, `GameScreenShell.tsx` відповідає за layout, а `GameBoardView.tsx` містить основний Canvas + стан дошки + анімацію + інтеграцію з gesture overlay.

На цей момент картина така:

`GameScreen.tsx` — це вхідна точка екрана.
`GameScreenShell.tsx` — layout-рівень: збирає header, board-зону, нижні кнопки/панелі.
`GameBoardView.tsx` — найважчий вузол: тут, імовірно, одночасно живуть render, gesture-логіка, drag-preview, tile mapping, game state glue.
`BoardGestureOverlay.tsx` — окремий input-шар поверх Canvas: він не малює, а тільки інтерпретує pan/tap та віддає commit/tap назовні.
`boardGeometry.ts` — чистий math/geometry-модуль: метрики дошки, cell rect/origin/center, axis lock, snapSteps. Це хороший знак: геометрія не змішана з UI.
`gameMetrics.ts` — канонічні design-константи для дошки.
`LayoutMetricsProvider.tsx` — глобальний adaptive scaling layer: дає `S`, `snap()`, ширини панелей і кнопок. Тобто вся сцена повинна масштабуватись через нього.
`GameStateProvider.tsx` — persistence/state-рівень через AsyncStorage, але поки це виглядає як окремий application state, а не rendering state для drag/render loop.

### Що вже можна сказати про архітектуру

Тут проглядається нормальний поділ на 4 рівні:

1. **Screen composition**
   - `GameScreen.tsx`
   - `GameScreenShell.tsx`

2. **Adaptive layout system**
   - `LayoutMetricsProvider.tsx`
   - `gameMetrics.ts`

3. **Board rendering + board interaction**
   - `GameBoardView.tsx`
   - `BoardGestureOverlay.tsx`
   - `boardGeometry.ts`

4. **Persistent app/game state**
   - `GameStateProvider.tsx`

Це вже достатньо хороша база. Найважливіше: `BoardGestureOverlay` і `boardGeometry` винесені окремо, а значить файл `GameBoardView.tsx` потенційно можна ще далі “сушити”, а не тримати в ньому все підряд.

### Але де поки що головна невидимість

Щоб реально розібрати **архітектуру GameScreen**, а не лише її оболонку, мені ще бракує тих частин, через які проходить **render pipeline** і **scene composition**.

Найважливіше додати далі:

- `BoardSkin.tsx`
- `TileSkin.tsx`
- `FontProvider.tsx`

Бо саме вони покажуть:

- як Canvas-сцена реально збирається,
- чи є розділення між background / tiles / preview / overlays,
- чи не сидять зайві обчислення прямо в render,
- як передаються розміри в skia-компоненти,
- чи дотримується канонічна система масштабування.

### Що ще дуже бажано

- `AppGameHeader.tsx`
- файл з типами маршруту / screen params, якщо є
- якщо існує окремий модуль логіки на кшталт:
  - `gameLogic.ts`
  - `boardState.ts`
  - `shuffle.ts`
  - `moves.ts`
  - `solved.ts`

Бо зараз я бачу persistence-state, але ще не бачу чітко, **де живе доменна логіка гри**:

- перевірка допустимого ходу,
- multi-shift,
- shuffle,
- solved-state,
- move counter,
- timer orchestration.

### Попередній висновок по якості архітектури

Архітектура **не хаотична**, а вже має добрий напрямок:

- **layout** відділений,
- **geometry** відділена,
- **gesture layer** відділений,
- **persistent state** відділений.

Найімовірніше, головний ризик зараз не в `GameScreen.tsx`, а саме в тому, що **`GameBoardView.tsx` може бути “god-file”**, якщо в ньому сидять одночасно:

- mapping tiles,
- Skia scene,
- animation state,
- gesture integration,
- move commit logic,
- tap logic,
- solved detection.

Саме його нам далі треба буде розкласти по шарах.

---

### Як зараз виглядає архітектура

**1. Screen-рівень**

- `GameScreen.tsx` — точка входу екрана.
- `GameScreenShell.tsx` — композиція великих зон екрана: header, board area, нижні control-блоки.

Це правильний рівень: shell має знати **що стоїть на екрані**, але не повинен знати деталі drag/render/game math.

**2. Система масштабування**

- `LayoutMetricsProvider.tsx` — головне джерело адаптивних метрик: `S`, `snap`, ширини, висоти, safe layout-рішення.
- `gameMetrics.ts` — канонічні дизайн-розміри/константи гри.
- `FontProvider.tsx` — окремий шар для шрифтів, який спирається на `LayoutMetricsProvider` і будує Skia fonts уже через `S` та `snap`. Це дуже хороший знак: шрифти входять у ту саму scaling-систему, а не живуть окремо.

**3. Board interaction + geometry**

- `BoardGestureOverlay.tsx` — input-only шар поверх канваса.
- `boardGeometry.ts` — чиста математика дошки, координат, cell/grid logic.

Це один із найкращих моментів усієї архітектури: геометрія і жести не змішані з малюванням.

**4. Render-шар Skia**

- `BoardSkin.tsx` — окремий візуальний skin для самої дошки. Він отримує вже готовий `rect`, `radius`, blur-и, `S`, `snap` і просто малює. Тобто це **presentation-компонент без логіки гри**. Саме так і треба.
- `TileSkin.tsx` — окремий візуальний skin плитки. Тут уже є shader, текст, uniforms і GPU-рендер. Важливо, що `RuntimeEffect` компілюється один раз на модульному рівні, а uniforms мемоізуються. Це дуже правильний підхід для FPS.

**5. App/UI shell elements**

- `AppGameHeader.tsx` — окремий header-компонент, але він зараз більш “самостійний”, ніж хотілося б: сам вантажить png, сам вантажить skia-font, сам тримає `isMuted`, сам малює canvas. Тобто він уже не чисто dumb/presentational, а маленький self-contained widget.

**6. Persistence / app state**

- `GameStateProvider.tsx` — окремий application-state/persistence-рівень.

---

## Головна ідея поточної архітектури

**Shell → Metrics → Geometry/Input → Skia Presentation → Persistent State**

Це не хаос. Це вже схоже на систему.

---

## Де зараз, найімовірніше, вузьке місце

Найризикованіший файл у цій архітектурі майже напевно — **`GameBoardView.tsx`**.

Бо всі інші частини вже більш-менш розкладені:

- layout винесений,
- scaling винесений,
- geometry винесена,
- gesture overlay винесений,
- skins винесені,
- fonts винесені.

Отже, якщо десь і накопичується “god-object”, то саме в `GameBoardView.tsx`, бо там, скоріш за все, сходяться:

- render tree,
- tile mapping,
- drag state,
- active tile / preview tile,
- зв’язок з overlay,
- move commit,
- solved check,
- animation orchestration,
- можливо, derived layout for board.

Тобто архітектурно екран уже хороший, але **центр тяжіння системи, ймовірно, занадто сконцентрований в одному файлі**.

---

## Що в архітектурі вже добре

### 1. Масштабування проведене послідовно

`FontProvider`, `BoardSkin`, `TileSkin`, `AppGameHeader` працюють через `S` і `snap`. Це означає, що формується єдина система координат і розмірів, а не набір випадкових пікселів.

### 2. Skin-компоненти не перевантажені логікою

`BoardSkin` і `TileSkin` не вирішують, **яка плитка куди рухається**. Вони тільки малюють. Це правильна межа відповідальності.

### 3. Шейдерна частина оформлена грамотно

У `TileSkin` добре, що:

- runtime effect компілюється один раз,
- uniforms обгорнуті в `useMemo`,
- текст відокремлений від shader canvas,
- geometry плитки передається через props.

### 4. Font system уже схожа на сервіс

`FontProvider` — це хороший сервісний шар: UI і Canvas не повинні кожного разу самі знати, як саме піднімати шрифти.

---

## Що я б вважав слабшими місцями

### 1. `AppGameHeader.tsx` поки що стоїть трохи осторонь системи

Він не використовує `FontProvider`, а сам викликає `useFont`.
Тобто для board-сцени в тебе вже є централізований font layer, а header живе окремо.

Це не критична помилка, але це вже **архітектурний розсинхрон**:

- або всі skia-шрифти проходять через provider,
- або дозволяємо локальні isolated fonts тільки для truly local widget.

На практиці краще або:

- винести header-font у `FontProvider`,
- або чітко прийняти правило: `FontProvider` тільки для game canvas, а header автономний.

Зараз це посередині.

### 2. `AppGameHeader.tsx` змішує presentation і local feature state

`isMuted` живе прямо в header.

Це ок, якщо це чисто демо-перемикач UI.
Але якщо звук у грі реальний, то mute-state не повинен жити в header-компоненті. Його місце:

- або в audio/store layer,
- або в game UI controller/state.

Інакше header стає джерелом доменної поведінки.

### 3. `TileSkin.tsx` уже хороший, але це компонент “дорогого рендера”

Архітектурно він чистий, але саме він потенційно буде найчутливішим до:

- зайвих нових `rect` об’єктів на кожному render,
- зайвих `baseColor` масивів,
- нестабільних `label/font` props,
- повторного remount при drag.

Тобто проблема тут не в самому файлі, а в тому, **як `GameBoardView` його годує даними**.

---

**Моя поточна карта відповідальностей**

Я б сформулював так:

- **`GameScreen.tsx`** — вхідна точка екрану/маршруту (route/screen entry)
- **`GameScreenShell.tsx`** — композиція макету (layout composition)
- **`LayoutMetricsProvider.tsx`** — сервіс адаптивних метрик (adaptive metrics service)
- **`FontProvider.tsx`** — сервіс шрифтів для рендерингу Skia/тексту (font service for skia/text rendering)
- **`boardGeometry.ts`** — чиста математика (pure math)
- **`BoardGestureOverlay.tsx`** — інтерпретація сенсорних жестів (touch interpretation)
- **`BoardSkin.tsx`** — візуальне представлення дошки (board presentation)
- **`TileSkin.tsx`** — візуальне представлення плитки/клітинки (tile presentation)
- **`AppGameHeader.tsx`** — віджет заголовка (header widget)
- **`GameStateProvider.tsx`** — провайдер збереженого (персистентного) стану застосунку/гри (persisted app/game state)
- **`GameBoardView.tsx`** — оркестраційний шар між математикою, обробкою вводу, рендерингом і станом гри (orchestration layer між math, input, render і game state)

І саме останній пункт зараз найважливіший для подальшого розкладання.

---

## Який ідеальний стан архітектури я бачу далі

`GameBoardView.tsx` варто довести до ролі **scene orchestrator**, а не “файлу, де живе все”.

Тобто в ідеалі він має:

- взяти layout metrics,
- взяти board geometry,
- взяти current board state,
- взяти gestures,
- зібрати scene з `BoardSkin`, `TileLayer`, `DragPreviewLayer`, `EffectsLayer`,
- передати commit callbacks назовні.

А ось це краще тримати **не в ньому**:

- низькорівневу геометрію,
- shader-specific details,
- font loading,
- persistent storage,
- mute/audio logic,
- константи дизайну.

Частина цього вже винесена. Це добре.

---

**Архітектура в цілому правильна, але `GameBoardView.tsx` справді є центральним orchestration-файлом, у якому зійшлося забагато відповідальностей**.

## Що саме робить `GameBoardView.tsx`

У цьому файлі зараз одночасно живуть 6 ролей:

1. **Локальний state дошки**
   - `grid`
   - `empty`
   - `tiles`

2. **Доменна логіка переміщення**
   - `makeDefaultGrid`
   - `findEmpty`
   - `tilesFromGrid`
   - `commitShift`

3. **Анімаційний orchestration**
   - `animT`
   - `animMovedIds`
   - `animAxis`
   - `animDir`

4. **Drag-preview state через shared values**
   - `dragActive`
   - `dragAxis`
   - `dragSteps`
   - `dragLine`
   - `emptyRow`
   - `emptyCol`

5. **Scene composition**
   - `Canvas`
   - `BoardSkin`
   - map по `TileNode`
   - `BoardGestureOverlay`

6. **Input → state transition**
   - `onTapCell`
   - `onCommitShift`

Усе це прямо видно в одному файлі.

---

# Мій головний висновок

**`GameBoardView.tsx` не є хаотичним файлом, але він уже став “вузлом усього”.**
Тобто він ще не зламаний архітектурно, але вже стоїть на межі, після якої будь-яке нове ускладнення почне його “протухати”.

Інакше кажучи:

- зараз файл ще читається,
- логіка ще не розповзлася повністю,
- але наступні фічі типу shuffle / timer / solved / move counter / persistence / sound / win animation дуже швидко зроблять його перевантаженим.

---

# Що тут добре

## 1. Є хороший поділ між input, geometry і skin

`BoardGestureOverlay` не малює, а лише інтерпретує жести.
`BoardSkin` і `TileSkin` лише малюють.
`boardGeometry` винесена окремо.
Це правильний фундамент. `GameBoardView` використовує ці шари як orchestrator.

## 2. `TileNode` — правильна локальна ізоляція

Те, що окремий `TileNode` винесений через `memo`, — добре.
Особливо добре, що transform рахується через `useDerivedValue`, а не через React-state на кожен drag tick.

## 3. Анімація зроблена просто і зрозуміло

Після `commitShift`:

- визначаються `movedIds`,
- одразу оновлюється `grid`,
- анімація доганяє це через `animT`.

Це хороший підхід для sliding puzzle, бо візуально він працює як “state already committed, animation visually catches up”.

---

# Де головні архітектурні проблеми

## 1. Доменна логіка гри сидить прямо в view-файлі

Ось це найважливіше.

У `GameBoardView.tsx` зараз живуть:

- `makeDefaultGrid`
- `idx`
- `findEmpty`
- `tilesFromGrid`
- `commitShift`

Це вже не view-рівень. Це **board domain logic**.

Тобто файл, який має бути scene-orchestrator, зараз одночасно є ще й частиною game engine.

Це не страшно для демо-версії. Але для реального екрану гри це треба виносити.

Я б виніс у щось на кшталт:

- `gameBoardModel.ts`
  або
- `boardState.ts`
  або
- `gameEngine.ts`

Туди:

- `makeDefaultGrid`
- `findEmpty`
- `tilesFromGrid`
- `commitShift`
- пізніше `isSolved`
- `shuffleGrid`
- `canMove`
- `serializeGrid` / `deserializeGrid`

Тоді `GameBoardView` не вирішуватиме, **як рухаються плитки**, а лише використовуватиме готові правила.

---

## 2. `GameBoardView` змішує state model і scene composition

Файл одночасно:

- зберігає grid-state,
- керує анімацією,
- збирає Canvas tree.

Це означає, що він є і model-controller, і render-controller одразу.

Краще мати таку межу:

- **hook/model layer**
  - `useGameBoardState()`

- **scene layer**
  - `GameBoardView`

Тоді hook повертає:

- `tiles`
- `boardMetrics`
- `empty`
- `gesture shared values`
- `handlers`
- `animation state`

А `GameBoardView` просто збирає сцену.

---

## 3. `animMovedIds.includes(t.id)` — маленьке, але показове місце

У render map кожної плитки є:

`animMoved={animMovedIds.includes(t.id)}`

Для 15 плиток це дрібниця. Але архітектурно це маркер, що анімаційний state подається трохи “на льоту”, а не у вже підготовленому вигляді.

Краще:

- або `Set<number>` через `useMemo`,
- або derived map.

Не тому що зараз повільно, а тому що це робить намір яснішим.

---

## 4. Подвійність між React state і Shared Values вже починає ускладнювати картину

У тебе є:

- React `grid`
- React `animMovedIds`, `animAxis`, `animDir`
- Reanimated `emptyRow`, `emptyCol`, `dragActive`, `dragAxis`, `dragSteps`, `dragLine`, `animT`

Це нормально для такого типу сцени, але вже вимагає дисципліни.

Проблема не в самому факті подвійності, а в тому, що файл починає бути місцем синхронізації всіх цих шарів одразу.

Тобто `GameBoardView` уже не просто “view”, а “sync hub”.

---

# Що я вважаю дуже важливим спостереженням

## `TileNode` логічно хороший, але його краще винести в окремий файл

Зараз `TileNode` — внутрішній memo-компонент усередині `GameBoardView.tsx`.
Технічно це нормально. Але архітектурно це вже самостійний scene-node.

Він має:

- власні пропси,
- власну animation logic,
- власний derived transform,
- окрему роль у render tree.

Я б виніс його в:

- `GameBoardTileNode.tsx`
  або
- `BoardTileNode.tsx`

Причина не в “модності”, а в тому, що це вже окремий елемент сцени.

---

# Як я бачу правильний поділ після рефакторингу

## Варіант цільової структури

### 1. `gameBoardModel.ts`

Чиста логіка:

- `makeDefaultGrid`
- `findEmpty`
- `tilesFromGrid`
- `commitShift`
- `isSolved`
- `shuffleGrid`

### 2. `useGameBoardController.ts`

Hook orchestration:

- `grid`
- `tiles`
- `empty`
- `anim state`
- shared values
- `onTapCell`
- `onCommitShift`

### 3. `GameBoardView.tsx`

Тільки scene composition:

- outer container
- canvas
- board skin
- tile nodes
- overlay

### 4. `BoardTileNode.tsx`

Окрема плитка:

- `useDerivedValue`
- `TileSkin`
- visual transform logic

---

# Який зараз реальний статус файлу

Я б оцінив так:

### Архітектурно:

**7.5/10**

Чому не нижче:

- логіка не хаотична,
- ролі в цілому читаються,
- розділення зі skin/gesture/geometry уже є.

Чому не вище:

- view-файл уже містить domain logic,
- state orchestration і rendering сидять разом,
- він стане вузьким місцем при наступному рості.

---

# Що б я зробив першим?

Ось порядок, який дасть найбільшу користь.

## Крок 1

Винести з `GameBoardView.tsx` у окремий файл:

- `makeDefaultGrid`
- `idx`
- `findEmpty`
- `tilesFromGrid`
- `commitShift`

Це найважливіше.

## Крок 2

Винести `TileNode` в окремий файл.

## Крок 3

Створити hook типу `useGameBoardController`.

Тільки після цього вже думати про:

- solved-state
- shuffle
- persistence bridge
- move counter
- sound
- win animation

---

# Підсумок одним реченням

**`GameBoardView.tsx` зараз виконує роль хорошого scene orchestrator, але вже несе на собі зайву доменну логіку гри, і саме її треба винести першою, щоб файл не перетворився на god-file.**

Наступним кроком я б уже не просто аналізував, а дав тобі **конкретну цільову схему файлів і готовий план рефакторингу для `GameBoardView` без зміни поведінки**.
