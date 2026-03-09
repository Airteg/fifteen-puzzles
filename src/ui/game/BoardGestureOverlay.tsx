import React, { useMemo } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import type { SharedValue } from "react-native-reanimated";
import { runOnJS, useSharedValue } from "react-native-reanimated";

import type { BoardMetrics } from "@/ui/game/boardGeometry";
import { axisLock, snapSteps } from "@/ui/game/boardGeometry";

export type DragEvent = {
  phase: "start" | "end";
  axis: "x" | "y" | null;
  steps: number;
  x: number;
  y: number;
};

type Props = {
  m: BoardMetrics;
  pad: number;
  canvasSize: number;

  lockAbs: number;
  lockRatio?: number;

  emptyRow?: SharedValue<number>;
  emptyCol?: SharedValue<number>;

  dragActive?: SharedValue<number>;
  dragAxis?: SharedValue<number>;
  dragStartRow?: SharedValue<number>;
  dragStartCol?: SharedValue<number>;
  dragOffsetPx: SharedValue<number>;

  onCommitShift?: (axis: "x" | "y", steps: number) => void;
  onTapCell?: (row: number, col: number) => void;
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

  const emptyRowSV = props.emptyRow ?? useSharedValue(3);
  const emptyColSV = props.emptyCol ?? useSharedValue(3);

  const dragActiveSV = props.dragActive ?? useSharedValue(0);
  const dragAxisSV = props.dragAxis ?? useSharedValue(0);
  const dragStartRowSV = props.dragStartRow ?? useSharedValue(-1);
  const dragStartColSV = props.dragStartCol ?? useSharedValue(-1);

  const dragStepsSV = useSharedValue(0);

  const gesture = useMemo(() => {
    // Ворклет для скидання стану драгу в UI потоці
    const resetDrag = () => {
      "worklet";
      dragActiveSV.value = 0;
      dragAxisSV.value = 0;
      dragStartRowSV.value = -1;
      dragStartColSV.value = -1;
      dragOffsetPx.value = 0;
      dragStepsSV.value = 0;
    };

    const inBoard = (x: number, y: number) => {
      "worklet";
      return x >= 0 && y >= 0 && x <= m.boardSize && y <= m.boardSize;
    };

    const pointToCell = (x: number, y: number) => {
      "worklet";
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
      "worklet";
      if (distToEmpty === 0) return 0;
      if (distToEmpty > 0) {
        if (rawSteps < 0) return 0;
        return rawSteps > distToEmpty ? distToEmpty : rawSteps;
      }
      if (rawSteps > 0) return 0;
      return rawSteps < distToEmpty ? distToEmpty : rawSteps;
    };

    const clampOffsetPx = (offsetPx: number, distToEmpty: number) => {
      "worklet";
      const maxAllowed = distToEmpty * m.step;
      if (distToEmpty > 0) return Math.max(0, Math.min(offsetPx, maxAllowed));
      if (distToEmpty < 0) return Math.min(0, Math.max(offsetPx, maxAllowed));
      return 0;
    };

    const pan = Gesture.Pan()
      .minDistance(lockAbs)
      .onBegin((ev) => {
        "worklet";
        const x = ev.x - pad;
        const y = ev.y - pad;

        if (!inBoard(x, y)) {
          resetDrag();
          return;
        }

        const cell = pointToCell(x, y);
        dragActiveSV.value = 1;
        dragAxisSV.value = 0;
        dragStartRowSV.value = cell.row;
        dragStartColSV.value = cell.col;
        dragOffsetPx.value = 0;
        dragStepsSV.value = 0;

        if (onDrag) {
          runOnJS(onDrag)({ phase: "start", axis: null, steps: 0, x, y });
        }
      })
      .onUpdate((ev) => {
        "worklet";
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
        }

        const sR = dragStartRowSV.value;
        const sC = dragStartColSV.value;

        if (axis === "x") {
          if (sR !== emptyRowSV.value) {
            dragOffsetPx.value = 0;
            return;
          }
          const dist = emptyColSV.value - sC;
          dragStepsSV.value = clampSteps(snapSteps(tx, m.step), dist);
          dragOffsetPx.value = clampOffsetPx(tx, dist);
        } else {
          if (sC !== emptyColSV.value) {
            dragOffsetPx.value = 0;
            return;
          }
          const dist = emptyRowSV.value - sR;
          dragStepsSV.value = clampSteps(snapSteps(ty, m.step), dist);
          dragOffsetPx.value = clampOffsetPx(ty, dist);
        }
      })
      .onEnd((ev) => {
        "worklet";
        const axis =
          dragAxisSV.value === 1 ? "x" : dragAxisSV.value === 2 ? "y" : null;
        const steps = dragStepsSV.value;

        if (onDrag) {
          runOnJS(onDrag)({
            phase: "end",
            axis,
            steps,
            x: ev.x - pad,
            y: ev.y - pad,
          });
        }

        if (axis && steps !== 0 && onCommitShift) {
          runOnJS(onCommitShift)(axis, steps);
        } else {
          resetDrag();
        }
      })
      .onFinalize(() => {
        "worklet";
        if (dragActiveSV.value === 1 && dragAxisSV.value === 0) {
          resetDrag();
        }
      });

    const tap = Gesture.Tap().onEnd((ev) => {
      "worklet";
      const x = ev.x - pad;
      const y = ev.y - pad;
      if (!inBoard(x, y)) return;

      const { row, col } = pointToCell(x, y);
      if (onTapCell) {
        runOnJS(onTapCell)(row, col);
      }
    });

    return Gesture.Simultaneous(pan, tap);
  }, [
    m,
    pad,
    lockAbs,
    lockRatio,
    onDrag,
    onCommitShift,
    onTapCell,
    emptyRowSV,
    emptyColSV,
    dragActiveSV,
    dragAxisSV,
    dragStartRowSV,
    dragStartColSV,
    dragOffsetPx,
    dragStepsSV,
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
