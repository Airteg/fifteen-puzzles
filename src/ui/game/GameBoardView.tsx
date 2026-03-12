import { useLayoutMetrics } from "@/context/LayoutMetricsProvider";
import { makeBoardMetrics } from "@/ui/game/boardGeometry";
import { GameMetrics } from "@/ui/game/gameMetrics";
import { BoardSkin } from "@/ui/skia/BoardSkin";
import type { SkFont } from "@shopify/react-native-skia";
import { Canvas, Group } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import { View } from "react-native";
import { BoardGestureOverlay } from "./BoardGestureOverlay";
import { BoardTileNode } from "./BoardTileNode";
import { useGameBoardController } from "./useGameBoardController";

type Props = {
  tileFont: SkFont | null;
  bootGrid?: number[];
  onWin?: () => void; // ДОДАНО: проп для перемоги
};

export function GameBoardView({ tileFont, bootGrid, onWin }: Props) {
  // ДОДАНО: отримуємо onWin
  const lm = useLayoutMetrics();
  const S = lm.S;
  const snap = lm.snap;

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

  const pad = snap(30 * S);
  const canvasSize = m.boardSize + pad * 2;

  const {
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
  } = useGameBoardController({
    stepPx: m.step,
    bootGrid,
    onWin, // ДОДАНО: передаємо у контролер
  });

  if (!tileFont) return null;

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
            S={S}
            snap={snap}
          />

          {tiles.map((t) => (
            <BoardTileNode
              key={t.id}
              m={m}
              S={S}
              snap={snap}
              tileId={t.id}
              label={t.label}
              font={tileFont}
              gridSV={gridSV}
              emptyRow={emptyRow}
              emptyCol={emptyCol}
              dragActive={dragActive}
              dragAxis={dragAxis}
              dragStartRow={dragStartRow}
              dragStartCol={dragStartCol}
              dragOffsetPx={dragOffsetPx}
              animT={animT}
              animAxisSV={animAxisSV}
              animDirSV={animDirSV}
              animMovedIdsSV={animMovedIdsSV}
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
        dragStartRow={dragStartRow}
        dragStartCol={dragStartCol}
        dragOffsetPx={dragOffsetPx}
        onTapCell={onTapCell}
        onCommitShift={onCommitShift}
      />
    </View>
  );
}
