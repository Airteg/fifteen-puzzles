import { useCallback, useEffect, useMemo, useState } from "react";
import { useSharedValue, withTiming } from "react-native-reanimated";

import type { BoardAxis, TileModel } from "./gameBoardModel";
import {
  commitShift,
  findEmpty,
  makeDefaultGrid,
  tilesFromGrid,
} from "./gameBoardModel";

export type UseGameBoardControllerResult = {
  grid: number[];
  empty: { row: number; col: number };
  tiles: TileModel[];

  emptyRow: ReturnType<typeof useSharedValue<number>>;
  emptyCol: ReturnType<typeof useSharedValue<number>>;

  dragActive: ReturnType<typeof useSharedValue<number>>;
  dragAxis: ReturnType<typeof useSharedValue<number>>;
  dragSteps: ReturnType<typeof useSharedValue<number>>;
  dragLine: ReturnType<typeof useSharedValue<number>>;

  animT: ReturnType<typeof useSharedValue<number>>;
  animMovedIds: number[];
  animAxis: BoardAxis;
  animDir: 1 | -1;

  onTapCell: (row: number, col: number) => void;
  onCommitShift: (axis: BoardAxis, steps: number) => void;
};

export function useGameBoardController(): UseGameBoardControllerResult {
  const [grid, setGrid] = useState<number[]>(() => makeDefaultGrid());
  const empty = useMemo(() => findEmpty(grid), [grid]);
  const tiles = useMemo(() => tilesFromGrid(grid), [grid]);

  const emptyRow = useSharedValue(empty.row);
  const emptyCol = useSharedValue(empty.col);

  const dragActive = useSharedValue(0);
  const dragAxis = useSharedValue(0);
  const dragSteps = useSharedValue(0);
  const dragLine = useSharedValue(-1);

  useEffect(() => {
    emptyRow.value = empty.row;
    emptyCol.value = empty.col;
  }, [empty.row, empty.col, emptyRow, emptyCol]);

  const animT = useSharedValue(1);
  const [animMovedIds, setAnimMovedIds] = useState<number[]>([]);
  const [animAxis, setAnimAxis] = useState<BoardAxis>("x");
  const [animDir, setAnimDir] = useState<1 | -1>(1);

  const onTapCell = useCallback(
    (row: number, col: number) => {
      if (row !== empty.row && col !== empty.col) return;
      if (row === empty.row && col === empty.col) return;

      let axis: BoardAxis;
      let steps: number;

      if (row === empty.row) {
        axis = "x";
        steps = empty.col - col;
      } else {
        axis = "y";
        steps = empty.row - row;
      }

      const res = commitShift(grid, empty, axis, steps);
      if (!res) return;

      setAnimMovedIds(res.movedIds);
      setAnimAxis(axis);
      setAnimDir(res.dir);

      animT.value = 0;
      setGrid(res.nextGrid);
      animT.value = withTiming(1, { duration: 140 });
    },
    [animT, empty, grid],
  );

  const onCommitShift = useCallback(
    (axis: BoardAxis, steps: number) => {
      const res = commitShift(grid, empty, axis, steps);
      if (!res) return;

      setAnimMovedIds(res.movedIds);
      setAnimAxis(axis);
      setAnimDir(res.dir);

      animT.value = 0;
      setGrid(res.nextGrid);
      animT.value = withTiming(1, { duration: 160 });
    },
    [animT, empty, grid],
  );

  return {
    grid,
    empty,
    tiles,

    emptyRow,
    emptyCol,

    dragActive,
    dragAxis,
    dragSteps,
    dragLine,

    animT,
    animMovedIds,
    animAxis,
    animDir,

    onTapCell,
    onCommitShift,
  };
}
