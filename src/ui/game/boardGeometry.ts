export type BoardMetrics = {
  // scaled + snapped
  boardSize: number;
  inset: number;
  tile: number;
  gap: number;

  // derived
  step: number; // tile + gap
};

export type Cell = { row: number; col: number };
export type Point = { x: number; y: number };

export function makeBoardMetrics(params: {
  S: number;
  snap: (v: number) => number;
  size: number; // design board size, e.g. 276
  inset: number; // design inset, e.g. 12
  tile: number; // design tile, e.g. 60  (тільки для довідки, ми перераховуємо)
  gap: number; // design gap, e.g. 4
}): BoardMetrics {
  const { S, snap } = params;

  const inset = snap(params.inset * S);
  const gap = snap(params.gap * S);

  // Канонічний boardSize: через size (layout)
  const boardSize = snap(params.size * S);

  // tile перераховуємо так, щоб інваріант завжди був точний
  const tile = (boardSize - inset * 2 - gap * 3) / 4;

  return { boardSize, inset, tile, gap, step: tile + gap };
}

export function cellOrigin(m: BoardMetrics, row: number, col: number): Point {
  return {
    x: m.inset + col * m.step,
    y: m.inset + row * m.step,
  };
}

export function cellCenter(m: BoardMetrics, row: number, col: number): Point {
  const o = cellOrigin(m, row, col);
  return {
    x: o.x + m.tile / 2,
    y: o.y + m.tile / 2,
  };
}

export function cellRect(m: BoardMetrics, row: number, col: number) {
  const o = cellOrigin(m, row, col);
  return { x: o.x, y: o.y, width: m.tile, height: m.tile };
}

export function clampCell(cell: Cell): Cell {
  return {
    row: Math.max(0, Math.min(3, cell.row)),
    col: Math.max(0, Math.min(3, cell.col)),
  };
}

/**
 * Перетворює point (в board-local координатах!) у cell.
 * Використовує tile+gap крок, тобто потрапляння між плитками теж дасть найближчу cell.
 */
export function pointToCell(m: BoardMetrics, p: Point): Cell {
  const localX = p.x - m.inset;
  const localY = p.y - m.inset;

  const col = Math.floor(localX / m.step);
  const row = Math.floor(localY / m.step);

  return clampCell({ row, col });
}

/**
 * Axis lock для drag:
 * - якщо dx значно більше dy -> "x"
 * - якщо dy значно більше dx -> "y"
 * - інакше null (ще не визначились)
 */
export function axisLock(
  dx: number,
  dy: number,
  thresholdRatio = 1.2,
  thresholdAbs = 2, // px, мінімальний рух щоб лочити
): "x" | "y" | null {
  const adx = Math.abs(dx);
  const ady = Math.abs(dy);

  if (adx < thresholdAbs && ady < thresholdAbs) return null;
  if (adx >= ady * thresholdRatio) return "x";
  if (ady >= adx * thresholdRatio) return "y";
  return null;
}

/**
 * Перекладає drag translation у кількість кроків (multi-step shift).
 * Напр: translation=1.7*step => steps=2
 */
export function snapSteps(translation: number, step: number): number {
  if (step <= 0) return 0;
  return Math.round(translation / step);
}

/**
 * Обмеження руху по осі: повертає (tx,ty) де один з компонентів 0
 */
export function constrainToAxis(axis: "x" | "y", tx: number, ty: number) {
  return axis === "x" ? { tx, ty: 0 } : { tx: 0, ty };
}
