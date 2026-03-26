import { useCallback } from "react";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets"; // ДОДАНО

import { useGameLayout } from "@/context/LayoutSnapshotProvider";
import type { BoardAxis } from "./gameBoardModel";
import {
  commitShift,
  findEmpty,
  isWinningGrid,
  makeDefaultGrid,
} from "./gameBoardModel";

export type BoardTileDescriptor = {
  id: number;
  label: string;
};

const STATIC_TILES: readonly BoardTileDescriptor[] = Array.from(
  { length: 15 },
  (_, index) => {
    const id = index + 1;
    return { id, label: String(id) };
  },
);

export type UseGameBoardControllerResult = {
  tiles: readonly BoardTileDescriptor[];

  gridSV: ReturnType<typeof useSharedValue<number[]>>;
  emptyRow: ReturnType<typeof useSharedValue<number>>;
  emptyCol: ReturnType<typeof useSharedValue<number>>;

  dragActive: ReturnType<typeof useSharedValue<number>>;
  dragAxis: ReturnType<typeof useSharedValue<number>>;
  dragStartRow: ReturnType<typeof useSharedValue<number>>;
  dragStartCol: ReturnType<typeof useSharedValue<number>>;
  dragOffsetPx: ReturnType<typeof useSharedValue<number>>;

  animT: ReturnType<typeof useSharedValue<number>>;
  animMovedIdsSV: ReturnType<typeof useSharedValue<number[]>>;
  animAxisSV: ReturnType<typeof useSharedValue<BoardAxis>>;
  animDirSV: ReturnType<typeof useSharedValue<1 | -1>>;

  onTapCell: (row: number, col: number) => void;
  onCommitShift: (axis: BoardAxis, steps: number) => void;

  // Explicit reset-path for future RESTART / NEW GAME.
  resetBoard: (nextGrid: number[]) => void;
};

type UseGameBoardControllerParams = {
  mode: "classic" | "limitTime";
  bootGrid?: number[];
  onWin?: () => void;
};

const resolveBootGrid = (bootGrid?: number[]) => {
  if (!bootGrid || bootGrid.length !== 16) {
    return makeDefaultGrid();
  }
  return bootGrid.slice();
};

export function useGameBoardController({
  mode,
  bootGrid,
  onWin,
}: UseGameBoardControllerParams): UseGameBoardControllerResult {
  const stepPx = useGameLayout(mode).board.step;
  const resolvedBootGrid = resolveBootGrid(bootGrid);
  const bootEmpty = findEmpty(resolvedBootGrid);

  const gridSV = useSharedValue<number[]>(resolvedBootGrid);
  const emptyRow = useSharedValue(bootEmpty.row);
  const emptyCol = useSharedValue(bootEmpty.col);

  const dragActive = useSharedValue(0);
  const dragAxis = useSharedValue(0);
  const dragStartRow = useSharedValue(-1);
  const dragStartCol = useSharedValue(-1);
  const dragOffsetPx = useSharedValue(0);

  const animT = useSharedValue(1);
  const animMovedIdsSV = useSharedValue<number[]>([]);
  const animAxisSV = useSharedValue<BoardAxis>("x");
  const animDirSV = useSharedValue<1 | -1>(1);

  const resetDragPreview = useCallback(() => {
    "worklet";
    dragActive.value = 0;
    dragAxis.value = 0;
    dragStartRow.value = -1;
    dragStartCol.value = -1;
    dragOffsetPx.value = 0;
  }, [dragActive, dragAxis, dragStartRow, dragStartCol, dragOffsetPx]);

  const resetBoard = useCallback(
    (nextGrid: number[]) => {
      "worklet";

      const safeGrid =
        nextGrid.length === 16 ? nextGrid.slice() : makeDefaultGrid();
      const nextEmpty = findEmpty(safeGrid);

      resetDragPreview();

      gridSV.value = safeGrid;
      emptyRow.value = nextEmpty.row;
      emptyCol.value = nextEmpty.col;

      animMovedIdsSV.value = [];
      animAxisSV.value = "x";
      animDirSV.value = 1;
      animT.value = 1;
    },
    [
      resetDragPreview,
      gridSV,
      emptyRow,
      emptyCol,
      animMovedIdsSV,
      animAxisSV,
      animDirSV,
      animT,
    ],
  );

  const applyShift = useCallback(
    (axis: BoardAxis, steps: number, progress: number) => {
      "worklet";

      if (steps === 0) {
        resetDragPreview();
        return;
      }

      const res = commitShift(
        gridSV.value,
        { row: emptyRow.value, col: emptyCol.value },
        axis,
        steps,
      );

      if (!res) {
        resetDragPreview();
        return;
      }

      const clampedProgress = Math.max(0, Math.min(1, progress));
      const isWin = isWinningGrid(res.nextGrid); // ДОДАНО

      resetDragPreview();
      gridSV.value = res.nextGrid;
      animMovedIdsSV.value = res.movedIds;
      animAxisSV.value = axis;
      animDirSV.value = res.dir;

      const newEmpty = findEmpty(res.nextGrid);
      emptyRow.value = newEmpty.row;
      emptyCol.value = newEmpty.col;

      animT.value = clampedProgress;
      // ОНОВЛЕНО: додаємо callback для withTiming та scheduleOnRN
      animT.value = withTiming(
        1,
        { duration: 150 * (1 - clampedProgress) },
        (finished) => {
          if (finished && isWin && onWin) {
            scheduleOnRN(onWin);
          }
        },
      );
    },
    [
      animT,
      gridSV,
      emptyRow,
      emptyCol,
      animMovedIdsSV,
      animAxisSV,
      animDirSV,
      resetDragPreview,
      onWin, // ДОДАНО
    ],
  );

  const onTapCell = useCallback(
    (row: number, col: number) => {
      "worklet";

      if (row !== emptyRow.value && col !== emptyCol.value) return;
      if (row === emptyRow.value && col === emptyCol.value) return;

      let axis: BoardAxis;
      let steps: number;

      if (row === emptyRow.value) {
        axis = "x";
        steps = emptyCol.value - col;
      } else {
        axis = "y";
        steps = emptyRow.value - row;
      }

      applyShift(axis, steps, 0);
    },
    [applyShift, emptyRow, emptyCol],
  );

  const onCommitShift = useCallback(
    (axis: BoardAxis, steps: number) => {
      "worklet";

      const currentOffset = Math.abs(dragOffsetPx.value);
      const progress = stepPx > 0 ? currentOffset / stepPx : 0;
      applyShift(axis, steps, progress);
    },
    [applyShift, dragOffsetPx, stepPx],
  );

  return {
    tiles: STATIC_TILES,
    gridSV,
    emptyRow,
    emptyCol,
    dragActive,
    dragAxis,
    dragStartRow,
    dragStartCol,
    dragOffsetPx,
    animT,
    animMovedIdsSV,
    animAxisSV,
    animDirSV,
    onTapCell,
    onCommitShift,
    resetBoard,
  };
}
