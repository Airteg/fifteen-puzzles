import React, { useMemo } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import type { SharedValue } from "react-native-reanimated";
import { useSharedValue } from "react-native-reanimated";

import type { BoardMetrics } from "@/ui/game/boardGeometry";

type Props = {
  m: BoardMetrics;
  pad: number;
  canvasSize: number;

  lockAbs: number;
  lockRatio?: number;

  emptyRow: SharedValue<number>;
  emptyCol: SharedValue<number>;

  dragActive: SharedValue<number>;
  dragAxis: SharedValue<number>;
  dragStartRow: SharedValue<number>;
  dragStartCol: SharedValue<number>;
  dragOffsetPx: SharedValue<number>;

  onCommitShift: (axis: "x" | "y", steps: number) => void;
  onTapCell: (row: number, col: number) => void;
};

export function BoardGestureOverlay(props: Props) {
  const {
    m,
    pad,
    canvasSize,
    lockAbs,
    emptyRow: emptyRowSV,
    emptyCol: emptyColSV,
    dragActive: dragActiveSV,
    dragAxis: dragAxisSV,
    dragStartRow: dragStartRowSV,
    dragStartCol: dragStartColSV,
    dragOffsetPx,
    onCommitShift,
    onTapCell,
  } = props;

  const dragStepsSV = useSharedValue(0);

  const gesture = useMemo(() => {
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

    // Фізичний ліміт зсуву — завжди рівно 1 клітинка (m.step)
    const clampOffsetPx = (offsetPx: number, distToEmpty: number) => {
      "worklet";
      if (distToEmpty === 0) return 0;

      const sign = distToEmpty > 0 ? 1 : -1;
      const maxAllowed = sign * m.step;

      if (distToEmpty > 0) return Math.max(0, Math.min(offsetPx, maxAllowed));
      if (distToEmpty < 0) return Math.min(0, Math.max(offsetPx, maxAllowed));
      return 0;
    };

    // Чи протягнули ми достатньо, щоб зробити хід?
    const calcCommitSteps = (offsetPx: number, distToEmpty: number) => {
      "worklet";
      const progress = Math.abs(offsetPx) / m.step;
      return progress > 0.4 ? distToEmpty : 0;
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
      })
      .onUpdate((ev) => {
        "worklet";
        if (dragActiveSV.value !== 1) return;

        const tx = ev.translationX;
        const ty = ev.translationY;
        const sR = dragStartRowSV.value;
        const sC = dragStartColSV.value;

        // РОЗУМНИЙ AXIS LOCK (Без подвійного порогу)
        if (dragAxisSV.value === 0) {
          let allowedAxis: "x" | "y" | "none" = "none";
          if (sR === emptyRowSV.value && sC !== emptyColSV.value)
            allowedAxis = "x";
          else if (sC === emptyColSV.value && sR !== emptyRowSV.value)
            allowedAxis = "y";

          if (allowedAxis === "none") return;

          // Pan вже активний, просто перевіряємо домінуючий вектор
          if (allowedAxis === "x" && Math.abs(tx) >= Math.abs(ty))
            dragAxisSV.value = 1;
          else if (allowedAxis === "y" && Math.abs(ty) >= Math.abs(tx))
            dragAxisSV.value = 2;

          if (dragAxisSV.value === 0) return;
        }

        // РУХ І ЗВ'ЯЗУВАННЯ
        if (dragAxisSV.value === 1) {
          const dist = emptyColSV.value - sC;
          dragOffsetPx.value = clampOffsetPx(tx, dist);
          dragStepsSV.value = calcCommitSteps(dragOffsetPx.value, dist);
        } else if (dragAxisSV.value === 2) {
          const dist = emptyRowSV.value - sR;
          dragOffsetPx.value = clampOffsetPx(ty, dist);
          dragStepsSV.value = calcCommitSteps(dragOffsetPx.value, dist);
        }
      })
      .onEnd(() => {
        "worklet";
        const axis =
          dragAxisSV.value === 1 ? "x" : dragAxisSV.value === 2 ? "y" : null;
        const steps = dragStepsSV.value;

        if (axis && steps !== 0) {
          onCommitShift(axis, steps);
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
      onTapCell(row, col);
    });

    return Gesture.Exclusive(pan, tap);
  }, [
    m,
    pad,
    lockAbs,
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
