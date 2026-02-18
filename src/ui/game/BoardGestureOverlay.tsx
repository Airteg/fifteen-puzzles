import React, { useMemo, useRef } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import type { BoardMetrics } from "@/ui/game/boardGeometry";
import { axisLock, constrainToAxis, snapSteps } from "@/ui/game/boardGeometry";

type Props = {
  m: BoardMetrics;
  pad: number; // translateX/Y(pad) у Canvas
  canvasSize: number;

  lockAbs: number; // px
  lockRatio?: number;

  onDrag?: (e: {
    phase: "start" | "move" | "end";
    x: number; // board-local
    y: number; // board-local
    tx: number;
    ty: number;
    axis: "x" | "y" | null;
    steps: number;
  }) => void;
};

export function BoardGestureOverlay({
  m,
  pad,
  canvasSize,
  lockAbs,
  lockRatio = 1.2,
  onDrag,
}: Props) {
  const state = useRef({ axis: null as "x" | "y" | null });

  const pan = useMemo(() => {
    return Gesture.Pan()
      .runOnJS(true) // 🔥 ключ: усе в JS thread, без worklet сюрпризів
      .minDistance(lockAbs)
      .onBegin((ev) => {
        state.current.axis = null;

        const x = ev.x - pad;
        const y = ev.y - pad;

        // guard: якщо тап поза бордом — ігноруємо (щоб не ловити дивні координати)
        if (x < 0 || y < 0 || x > m.boardSize || y > m.boardSize) return;

        onDrag?.({ phase: "start", x, y, tx: 0, ty: 0, axis: null, steps: 0 });
      })
      .onUpdate((ev) => {
        const x = ev.x - pad;
        const y = ev.y - pad;
        if (x < 0 || y < 0 || x > m.boardSize || y > m.boardSize) return;

        const txRaw = ev.translationX;
        const tyRaw = ev.translationY;

        const axis =
          state.current.axis ?? axisLock(txRaw, tyRaw, lockRatio, lockAbs);

        if (state.current.axis == null && axis != null) {
          state.current.axis = axis;
        }

        const locked = axis
          ? constrainToAxis(axis, txRaw, tyRaw)
          : { tx: txRaw, ty: tyRaw };
        const translation = axis === "y" ? locked.ty : locked.tx;
        const steps = axis ? snapSteps(translation, m.step) : 0;

        onDrag?.({
          phase: "move",
          x,
          y,
          tx: locked.tx,
          ty: locked.ty,
          axis,
          steps,
        });
      })
      .onEnd((ev) => {
        const x = ev.x - pad;
        const y = ev.y - pad;

        // end може прийти вже “ззовні” — але це ок, просто clamp
        const cx = Math.max(0, Math.min(m.boardSize, x));
        const cy = Math.max(0, Math.min(m.boardSize, y));

        const axis = state.current.axis;
        const locked = axis
          ? constrainToAxis(axis, ev.translationX, ev.translationY)
          : { tx: ev.translationX, ty: ev.translationY };

        const translation = axis === "y" ? locked.ty : locked.tx;
        const steps = axis ? snapSteps(translation, m.step) : 0;

        onDrag?.({
          phase: "end",
          x: cx,
          y: cy,
          tx: locked.tx,
          ty: locked.ty,
          axis,
          steps,
        });

        state.current.axis = null;
      });
  }, [lockAbs, lockRatio, m.boardSize, m.step, onDrag, pad]);

  return (
    <GestureDetector gesture={pan}>
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
