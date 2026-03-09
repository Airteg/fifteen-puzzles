import React, { useMemo } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import type { SharedValue } from "react-native-reanimated";
import { useSharedValue } from "react-native-reanimated";

import type { BoardMetrics } from "@/ui/game/boardGeometry";
import { axisLock, snapSteps } from "@/ui/game/boardGeometry";

export type DragEvent = {
  phase: "start" | "end";
  axis: "x" | "y" | null;
  steps: number;
  x: number; // finger x inside board (без pad)
  y: number; // finger y inside board (без pad)
};

type Props = {
  m: BoardMetrics;
  pad: number; // translate(pad,pad) у Canvas
  canvasSize: number;

  lockAbs: number;
  lockRatio?: number;

  // optional external shared state (для Skia preview шару)
  emptyRow?: SharedValue<number>;
  emptyCol?: SharedValue<number>;

  dragActive?: SharedValue<number>; // 0|1
  dragAxis?: SharedValue<number>; // 0 none, 1 x, 2 y
  dragSteps?: SharedValue<number>; // integer steps (clamped)
  dragLine?: SharedValue<number>; // row for x, col for y
  dragOffsetPx: SharedValue<number>; // піксельне зміщення для перетягнутих плиток (для плавнішої анімації, а не лише snapSteps * step)

  // optional JS callbacks (тільки onEnd / tap)
  onCommitShift?: (axis: "x" | "y", steps: number) => void;
  onTapCell?: (row: number, col: number) => void;

  // optional debug hook (start/end only)
  onDrag?: (e: DragEvent) => void;
};

export function BoardGestureOverlay(props: Props) {
  const {
    m,
    pad,
    canvasSize,
    lockAbs,
    lockRatio = 1.2,
    onCommitShift,
    onTapCell,
    onDrag,
    dragOffsetPx,
  } = props;

  // ---- provide internal shared values if not passed ----
  const emptyRowSV = props.emptyRow ?? useSharedValue(3);
  const emptyColSV = props.emptyCol ?? useSharedValue(3);

  const dragActiveSV = props.dragActive ?? useSharedValue(0);
  const dragAxisSV = props.dragAxis ?? useSharedValue(0);
  const dragStepsSV = props.dragSteps ?? useSharedValue(0);
  const dragLineSV = props.dragLine ?? useSharedValue(-1);

  const commit = onCommitShift ?? (() => {});
  const tapCell = onTapCell ?? (() => {});

  const gesture = useMemo(() => {
    // JS-local state (бо runOnJS(true))
    let startRow = -1;
    let startCol = -1;

    const resetDrag = () => {
      dragActiveSV.value = 0;
      dragAxisSV.value = 0;
      dragStepsSV.value = 0;
      dragLineSV.value = -1;
      dragOffsetPx.value = 0;
      startRow = -1;
      startCol = -1;
    };

    const inBoard = (x: number, y: number) =>
      x >= 0 && y >= 0 && x <= m.boardSize && y <= m.boardSize;

    const pointToCell = (x: number, y: number) => {
      const localX = x - m.inset;
      const localY = y - m.inset;

      let col = Math.floor(localX / m.step);
      let row = Math.floor(localY / m.step);

      if (col < 0) col = 0;
      if (col > 3) col = 3;
      if (row < 0) row = 0;
      if (row > 3) row = 3;

      return { row, col };
    };

    const clampSteps = (rawSteps: number, distToEmpty: number) => {
      if (distToEmpty === 0) return 0;

      if (distToEmpty > 0) {
        if (rawSteps < 0) return 0;
        return rawSteps > distToEmpty ? distToEmpty : rawSteps;
      }

      if (rawSteps > 0) return 0;
      return rawSteps < distToEmpty ? distToEmpty : rawSteps;
    };
    const clampOffsetPx = (offsetPx: number, distToEmpty: number) => {
      const minPx = Math.min(0, distToEmpty * m.step);
      const maxPx = Math.max(0, distToEmpty * m.step);

      if (offsetPx < minPx) return minPx;
      if (offsetPx > maxPx) return maxPx;
      return offsetPx;
    };
    const pan = Gesture.Pan()
      .runOnJS(true)
      .minDistance(lockAbs)
      .onBegin((ev) => {
        const x = ev.x - pad;
        const y = ev.y - pad;

        if (!inBoard(x, y)) {
          resetDrag();
          return;
        }

        const cell = pointToCell(x, y);
        startRow = cell.row;
        startCol = cell.col;

        dragActiveSV.value = 1;
        dragAxisSV.value = 0;
        dragStepsSV.value = 0;
        dragLineSV.value = -1;
        dragOffsetPx.value = 0;

        onDrag?.({ phase: "start", axis: null, steps: 0, x, y });
      })
      .onUpdate((ev) => {
        if (dragActiveSV.value !== 1) return;

        const x = ev.x - pad;
        const y = ev.y - pad;
        if (!inBoard(x, y)) return;

        const tx = ev.translationX;
        const ty = ev.translationY;

        let axis: "x" | "y" | null = null;
        if (dragAxisSV.value === 1) axis = "x";
        else if (dragAxisSV.value === 2) axis = "y";
        else axis = axisLock(tx, ty, lockRatio, lockAbs);

        if (!axis) return;

        if (dragAxisSV.value === 0) {
          dragAxisSV.value = axis === "x" ? 1 : 2;
          dragLineSV.value = axis === "x" ? startRow : startCol;
        }

        // allow drag only if empty is on the same line as the start cell
        if (axis === "x") {
          if (startRow !== emptyRowSV.value) {
            dragStepsSV.value = 0;
            dragOffsetPx.value = 0;
            return;
          }
          const dist = emptyColSV.value - startCol;
          const raw = snapSteps(tx, m.step);
          dragStepsSV.value = clampSteps(raw, dist);
          dragOffsetPx.value = clampOffsetPx(tx, dist);
        } else {
          if (startCol !== emptyColSV.value) {
            dragStepsSV.value = 0;
            dragOffsetPx.value = 0;
            return;
          }
          const dist = emptyRowSV.value - startRow;
          const raw = snapSteps(ty, m.step);
          dragStepsSV.value = clampSteps(raw, dist);
          dragOffsetPx.value = clampOffsetPx(ty, dist);
        }
      })
      .onEnd((ev) => {
        const axis =
          dragAxisSV.value === 1 ? "x" : dragAxisSV.value === 2 ? "y" : null;
        const steps = dragStepsSV.value;

        const x = ev.x - pad;
        const y = ev.y - pad;

        onDrag?.({ phase: "end", axis, steps, x, y });

        if (axis) {
          commit(axis, steps);
        } else {
          resetDrag();
        }
      })
      .onFinalize(() => {
        if (dragActiveSV.value === 1 && dragAxisSV.value === 0) {
          resetDrag();
        }
      });

    const tap = Gesture.Tap()
      .runOnJS(true)
      .onEnd((ev) => {
        const x = ev.x - pad;
        const y = ev.y - pad;
        if (!inBoard(x, y)) return;

        const { row, col } = pointToCell(x, y);
        tapCell(row, col);
      });

    return Gesture.Simultaneous(pan, tap);
  }, [
    m.boardSize,
    m.inset,
    m.step,
    pad,
    lockAbs,
    lockRatio,
    onDrag,
    commit,
    tapCell,
    emptyRowSV,
    emptyColSV,
    dragActiveSV,
    dragAxisSV,
    dragStepsSV,
    dragLineSV,
    dragOffsetPx,
  ]);

  return (
    <GestureDetector gesture={gesture}>
      <View
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: canvasSize,
          height: canvasSize,
        }}
      />
    </GestureDetector>
  );
}
