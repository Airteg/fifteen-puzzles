import type { SkFont } from "@shopify/react-native-skia";
import { Canvas, Group } from "@shopify/react-native-skia";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";

import { useSharedValue, withTiming } from "react-native-reanimated";
import {
  BoardAxis,
  commitShift,
  findEmpty,
  makeDefaultGrid,
  tilesFromGrid,
} from "./gameBoardModel";

import { useLayoutMetrics } from "@/context/LayoutMetricsProvider";

import { makeBoardMetrics } from "@/ui/game/boardGeometry";
import { GameMetrics } from "@/ui/game/gameMetrics";
import { BoardSkin } from "@/ui/skia/BoardSkin";

import { BoardGestureOverlay } from "./BoardGestureOverlay";
import { BoardTileNode } from "./BoardTileNode";

type Props = {
  tileFont: SkFont | null;
};

export function GameBoardView({ tileFont }: Props) {
  const lm = useLayoutMetrics();
  const S = lm.S;
  const snap = lm.snap;

  if (!tileFont) return null;

  const m = useMemo(
    () =>
      makeBoardMetrics({
        S,
        snap,
        size: GameMetrics.board.size,
        inset: GameMetrics.board.inset,
        tile: GameMetrics.board.tile,
        gap: GameMetrics.board.gap,
      }),
    [S, snap],
  );

  const pad = snap(14 * S);
  const canvasSize = m.boardSize + pad * 2;

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
  const [animAxis, setAnimAxis] = useState<"x" | "y">("x");
  const [animDir, setAnimDir] = useState<1 | -1>(1);

  const onTapCell = useCallback(
    (row: number, col: number) => {
      // 1. Перевіряємо, чи знаходиться тапнута плитка в тому ж рядку або стовпці, що й пуста
      if (row !== empty.row && col !== empty.col) return;

      // 2. Не реагуємо на клік по самій пустій клітинці
      if (row === empty.row && col === empty.col) return;

      let axis: BoardAxis;
      let steps: number;

      // 3. Рахуємо точну кількість плиток (steps), яку треба зсунути (від 1 до 3)
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

  return (
    <View
      style={{
        width: canvasSize,
        height: canvasSize,
        alignSelf: "center",
        position: "relative",
      }}
    >
      <Canvas style={{ width: canvasSize, height: canvasSize }}>
        <Group transform={[{ translateX: pad }, { translateY: pad }]}>
          <BoardSkin
            rect={{ x: 0, y: 0, width: m.boardSize, height: m.boardSize }}
            radius={snap(16 * S)}
            blurA={snap(4 * S)}
            blurB={snap(8 * S)}
            S={S}
            snap={snap}
          />

          {tiles.map((t) => (
            <BoardTileNode
              key={t.id}
              m={m}
              S={S}
              snap={snap}
              tile={t}
              font={tileFont}
              emptyRow={emptyRow}
              emptyCol={emptyCol}
              dragActive={dragActive}
              dragAxis={dragAxis}
              dragSteps={dragSteps}
              dragLine={dragLine}
              animT={animT}
              animAxis={animAxis}
              animDir={animDir}
              animMoved={animMovedIds.includes(t.id)}
            />
          ))}
        </Group>
      </Canvas>

      <BoardGestureOverlay
        m={m}
        pad={pad}
        canvasSize={canvasSize}
        lockAbs={snap(2 * S)}
        lockRatio={1.2}
        emptyRow={emptyRow}
        emptyCol={emptyCol}
        dragActive={dragActive}
        dragAxis={dragAxis}
        dragSteps={dragSteps}
        dragLine={dragLine}
        onTapCell={onTapCell}
        onCommitShift={onCommitShift}
      />
    </View>
  );
}
