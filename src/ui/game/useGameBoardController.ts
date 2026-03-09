import { useCallback, useMemo, useState } from "react";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

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
  dragOffsetPx: ReturnType<typeof useSharedValue<number>>;

  animT: ReturnType<typeof useSharedValue<number>>;
  animMovedIds: number[];
  animAxis: BoardAxis;
  animDir: 1 | -1;

  onTapCell: (row: number, col: number) => void;
  onCommitShift: (axis: BoardAxis, steps: number) => void;
};
type UseGameBoardControllerParams = {
  stepPx: number;
};

export function useGameBoardController({
  stepPx,
}: UseGameBoardControllerParams): UseGameBoardControllerResult {
  const [grid, setGrid] = useState<number[]>(() => makeDefaultGrid());
  const empty = useMemo(() => findEmpty(grid), [grid]);
  const tiles = useMemo(() => tilesFromGrid(grid), [grid]);
  void stepPx;

  // Ініціалізація Shared Values для Reanimated
  const emptyRow = useSharedValue(empty.row);
  const emptyCol = useSharedValue(empty.col);

  const dragActive = useSharedValue(0);
  const dragAxis = useSharedValue(0);
  const dragSteps = useSharedValue(0);
  const dragLine = useSharedValue(-1);
  const dragOffsetPx = useSharedValue(0);

  const animT = useSharedValue(1);
  const [animMovedIds, setAnimMovedIds] = useState<number[]>([]);
  const [animAxis, setAnimAxis] = useState<BoardAxis>("x");
  const [animDir, setAnimDir] = useState<1 | -1>(1);

  const resetDragPreview = useCallback(() => {
    dragActive.value = 0;
    dragAxis.value = 0;
    dragSteps.value = 0;
    dragLine.value = -1;
    dragOffsetPx.value = 0;
  }, [dragActive, dragAxis, dragSteps, dragLine, dragOffsetPx]);

  const applyDragCommit = useCallback(
    (nextGrid: number[], newEmpty: { row: number; col: number }) => {
      // Для drag-коміту вимикаємо старий catch-up
      setAnimMovedIds([]);

      setGrid(nextGrid);
      emptyRow.value = newEmpty.row;
      emptyCol.value = newEmpty.col;

      resetDragPreview();
    },
    [emptyRow, emptyCol, resetDragPreview],
  );

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

      setAnimMovedIds([]);
      setGrid(res.nextGrid);

      const newEmpty = findEmpty(res.nextGrid);
      emptyRow.value = newEmpty.row;
      emptyCol.value = newEmpty.col;
    },
    [animT, empty, grid, emptyRow, emptyCol],
  );

  const onCommitShift = useCallback(
    (axis: BoardAxis, steps: number) => {
      if (steps === 0) {
        dragOffsetPx.value = withTiming(0, { duration: 120 }, (finished) => {
          if (finished) {
            scheduleOnRN(resetDragPreview);
          }
        });
        return;
      }

      const res = commitShift(grid, empty, axis, steps);
      if (!res) {
        dragOffsetPx.value = withTiming(0, { duration: 120 }, (finished) => {
          if (finished) {
            scheduleOnRN(resetDragPreview);
          }
        });
        return;
      }

      const targetPx = steps * stepPx;
      const nextGrid = res.nextGrid;
      const newEmpty = findEmpty(nextGrid);

      dragOffsetPx.value = withTiming(
        targetPx,
        { duration: 100 },
        (finished) => {
          if (finished) {
            scheduleOnRN(applyDragCommit, nextGrid, newEmpty);
          }
        },
      );
    },
    [applyDragCommit, dragOffsetPx, empty, grid, resetDragPreview, stepPx],
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
    dragOffsetPx,

    animT,
    animMovedIds,
    animAxis,
    animDir,

    onTapCell,
    onCommitShift,
  };
}
