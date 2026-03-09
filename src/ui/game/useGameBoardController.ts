import { useCallback, useMemo, useState } from "react";
import { useSharedValue, withTiming } from "react-native-reanimated";

import type { BoardAxis, TileModel } from "./gameBoardModel";
import {
  commitShift,
  findEmpty,
  makeDefaultGrid,
  tilesFromGrid,
} from "./gameBoardModel";

export type UseGameBoardControllerResult = {
  tiles: TileModel[];

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
};

type UseGameBoardControllerParams = {
  stepPx: number;
};

export function useGameBoardController({
  stepPx,
}: UseGameBoardControllerParams): UseGameBoardControllerResult {
  const [grid, setGrid] = useState<number[]>(() => makeDefaultGrid());
  const tiles = useMemo(() => tilesFromGrid(grid), [grid]);

  // Усі ці значення тепер "живуть" в UI-потоці
  const gridSV = useSharedValue(grid);
  const emptyRow = useSharedValue(3);
  const emptyCol = useSharedValue(3);

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
    dragActive.value = 0;
    dragAxis.value = 0;
    dragStartRow.value = -1;
    dragStartCol.value = -1;
    dragOffsetPx.value = 0;
  }, [dragActive, dragAxis, dragStartRow, dragStartCol, dragOffsetPx]);

  const onTapCell = useCallback(
    (row: number, col: number) => {
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

      const res = commitShift(
        gridSV.value,
        { row: emptyRow.value, col: emptyCol.value },
        axis,
        steps,
      );
      if (!res) return;

      // 1. СИНХРОННО повідомляємо UI-потік про новий стан (жодних розривів з React)
      resetDragPreview();
      gridSV.value = res.nextGrid;
      animMovedIdsSV.value = res.movedIds;
      animAxisSV.value = axis;
      animDirSV.value = res.dir;

      const newEmpty = findEmpty(res.nextGrid);
      emptyRow.value = newEmpty.row;
      emptyCol.value = newEmpty.col;

      // 2. Запускаємо анімацію "з нуля"
      animT.value = 0;
      animT.value = withTiming(1, { duration: 150 });

      // 3. React оновлюється у фоні (ми від нього більше не залежимо візуально)
      setGrid(res.nextGrid);
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
    ],
  );

  const onCommitShift = useCallback(
    (axis: BoardAxis, steps: number) => {
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

      const currentOffset = Math.abs(dragOffsetPx.value);
      let progress = currentOffset / stepPx;
      progress = Math.max(0, Math.min(1, progress));

      // 1. СИНХРОННО повідомляємо UI-потік про новий стан
      resetDragPreview();
      gridSV.value = res.nextGrid;
      animMovedIdsSV.value = res.movedIds;
      animAxisSV.value = axis;
      animDirSV.value = res.dir;

      const newEmpty = findEmpty(res.nextGrid);
      emptyRow.value = newEmpty.row;
      emptyCol.value = newEmpty.col;

      // 2. Стартуємо анімацію з точки, де юзер відпустив палець
      animT.value = progress;
      animT.value = withTiming(1, { duration: 150 * (1 - progress) });

      // 3. React оновлюється у фоні
      setGrid(res.nextGrid);
    },
    [
      animT,
      dragOffsetPx,
      gridSV,
      emptyRow,
      emptyCol,
      animMovedIdsSV,
      animAxisSV,
      animDirSV,
      resetDragPreview,
      stepPx,
    ],
  );

  return {
    tiles,
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
  };
}
