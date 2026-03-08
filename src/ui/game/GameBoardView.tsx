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
  const {
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
  } = useGameBoardController();

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
              tileId={t.id}
              label={t.label}
              row={t.row}
              col={t.col}
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
        dragOffsetPx={dragOffsetPx}
        onTapCell={onTapCell}
        onCommitShift={onCommitShift}
      />
    </View>
  );
}
