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
  grid: number[];
  empty: { row: number; col: number };
  tiles: TileModel[];

  emptyRow: ReturnType<typeof useSharedValue<number>>;
  emptyCol: ReturnType<typeof useSharedValue<number>>;

  dragActive: ReturnType<typeof useSharedValue<number>>;
  dragAxis: ReturnType<typeof useSharedValue<number>>;
  dragStartRow: ReturnType<typeof useSharedValue<number>>;
  dragStartCol: ReturnType<typeof useSharedValue<number>>;
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

  const emptyRow = useSharedValue(empty.row);
  const emptyCol = useSharedValue(empty.col);

  const dragActive = useSharedValue(0);
  const dragAxis = useSharedValue(0);
  const dragStartRow = useSharedValue(-1);
  const dragStartCol = useSharedValue(-1);
  const dragOffsetPx = useSharedValue(0);

  const animT = useSharedValue(1);
  const [animMovedIds, setAnimMovedIds] = useState<number[]>([]);
  const [animAxis, setAnimAxis] = useState<BoardAxis>("x");
  const [animDir, setAnimDir] = useState<1 | -1>(1);

  const resetDragPreview = useCallback(() => {
    dragActive.value = 0;
    dragAxis.value = 0;
    dragStartRow.value = -1;
    dragStartCol.value = -1;
    dragOffsetPx.value = 0;
  }, [dragActive, dragAxis, dragStartRow, dragStartCol, dragOffsetPx]);

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

      // Миттєво вимикаємо drag-шар
      resetDragPreview();

      // Комітимо новий стан гри у React
      setAnimMovedIds(res.movedIds);
      setAnimAxis(axis);
      setAnimDir(res.dir);
      setGrid(res.nextGrid);

      // Оновлюємо координати пустої клітинки
      const newEmpty = findEmpty(res.nextGrid);
      emptyRow.value = newEmpty.row;
      emptyCol.value = newEmpty.col;

      // Запускаємо анімацію "наздоганяння" з нуля
      animT.value = 0;
      animT.value = withTiming(1, { duration: 150 });
    },
    [animT, empty, grid, emptyRow, emptyCol, resetDragPreview],
  );

  const onCommitShift = useCallback(
    (axis: BoardAxis, steps: number) => {
      if (steps === 0) {
        resetDragPreview();
        return;
      }

      const res = commitShift(grid, empty, axis, steps);
      if (!res) {
        resetDragPreview();
        return;
      }

      // Вираховуємо, який відсоток шляху плитка вже пройшла за пальцем
      const currentOffset = Math.abs(dragOffsetPx.value);
      let progress = currentOffset / stepPx;
      progress = Math.max(0, Math.min(1, progress));

      // Миттєво вимикаємо drag-шар
      resetDragPreview();

      // Комітимо новий стан гри
      setAnimMovedIds(res.movedIds);
      setAnimAxis(axis);
      setAnimDir(res.dir);
      setGrid(res.nextGrid);

      // Оновлюємо порожню клітинку
      const newEmpty = findEmpty(res.nextGrid);
      emptyRow.value = newEmpty.row;
      emptyCol.value = newEmpty.col;

      // Геніальний трюк: стартуємо анімацію не з 0, а з точної позиції відпускання пальця!
      animT.value = progress;
      animT.value = withTiming(1, { duration: 150 * (1 - progress) });
    },
    [
      animT,
      dragOffsetPx,
      empty,
      grid,
      emptyRow,
      emptyCol,
      resetDragPreview,
      stepPx,
    ],
  );

  return {
    grid,
    empty,
    tiles,
    emptyRow,
    emptyCol,
    dragActive,
    dragAxis,
    dragStartRow,
    dragStartCol,
    dragOffsetPx,
    animT,
    animMovedIds,
    animAxis,
    animDir,
    onTapCell,
    onCommitShift,
  };
}
