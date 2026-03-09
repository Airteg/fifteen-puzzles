export type BoardAxis = "x" | "y";

export type BoardCell = {
  row: number;
  col: number;
};

export type TileModel = {
  id: number;
  label: string;
  row: number;
  col: number;
};

export type CommitShiftResult = {
  nextGrid: number[];
  movedIds: number[];
  dir: 1 | -1;
};

export function idx(row: number, col: number): number {
  return row * 4 + col;
}

export function makeDefaultGrid(): number[] {
  const g: number[] = [];
  for (let i = 1; i <= 15; i++) g.push(i);
  g.push(0);
  return g;
}

export function findEmpty(grid: number[]): BoardCell {
  const i = grid.indexOf(0);
  return { row: Math.floor(i / 4), col: i % 4 };
}

export function tilesFromGrid(grid: number[]): TileModel[] {
  const out: TileModel[] = [];

  for (let i = 0; i < 16; i++) {
    const v = grid[i];
    if (v === 0) continue;

    out.push({
      id: v,
      label: String(v),
      row: Math.floor(i / 4),
      col: i % 4,
    });
  }

  return out;
}

export function commitShift(
  grid: number[],
  empty: BoardCell,
  axis: BoardAxis,
  steps: number,
): CommitShiftResult | null {
  if (steps === 0) return null;

  const next = grid.slice();
  const movedIds: number[] = [];

  let er = empty.row;
  let ec = empty.col;

  const dir: 1 | -1 = steps > 0 ? 1 : -1;
  const count = Math.abs(steps);

  for (let k = 0; k < count; k++) {
    if (axis === "x") {
      const srcC = dir > 0 ? ec - 1 : ec + 1;
      if (srcC < 0 || srcC > 3) return null;

      const srcI = idx(er, srcC);
      const dstI = idx(er, ec);
      const tileId = next[srcI];
      if (tileId === 0) return null;

      next[dstI] = tileId;
      next[srcI] = 0;
      movedIds.push(tileId);

      ec = srcC;
    } else {
      const srcR = dir > 0 ? er - 1 : er + 1;
      if (srcR < 0 || srcR > 3) return null;

      const srcI = idx(srcR, ec);
      const dstI = idx(er, ec);
      const tileId = next[srcI];
      if (tileId === 0) return null;

      next[dstI] = tileId;
      next[srcI] = 0;
      movedIds.push(tileId);

      er = srcR;
    }
  }

  return { nextGrid: next, movedIds, dir };
}

export type MoveKind = "tap" | "drag";

export type MoveId = number;

export type ActiveMove = {
  moveId: MoveId;
  kind: MoveKind;

  axis: BoardAxis;
  lineIndex: number; // row для x, col для y

  // Межі рухомого блоку в цій лінії.
  // Для axis === "x" це start..end по col.
  // Для axis === "y" це start..end по row.
  rangeStart: number;
  rangeEnd: number;

  steps: number;
  offsetPx: number;
};

export type PendingCommit = {
  moveId: MoveId;
  nextGrid: number[];
};
