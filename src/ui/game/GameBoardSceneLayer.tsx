import type { BoardLayout } from "@/layout/types";
import { BoardSkin } from "@/ui/skia/BoardSkin";
import type { SkFont } from "@shopify/react-native-skia";
import { Group } from "@shopify/react-native-skia";
import React from "react";
import type { SharedValue } from "react-native-reanimated";
import { BoardTileNode } from "./BoardTileNode";
import type { BoardAxis } from "./gameBoardModel";
import type { BoardTileDescriptor } from "./useGameBoardController";
import type { SceneFrame } from "./useGameSceneMetrics";

type Props = {
  boardFrame: SceneFrame;
  m: BoardLayout;
  S: number;
  snap: (v: number) => number;

  tileFont: SkFont;
  tiles: readonly BoardTileDescriptor[];
  gridSV: SharedValue<number[]>;
  emptyRow: SharedValue<number>;
  emptyCol: SharedValue<number>;
  dragActive: SharedValue<number>;
  dragAxis: SharedValue<number>;
  dragStartRow: SharedValue<number>;
  dragStartCol: SharedValue<number>;
  dragOffsetPx: SharedValue<number>;
  animT: SharedValue<number>;
  animAxisSV: SharedValue<BoardAxis>;
  animDirSV: SharedValue<1 | -1>;
  animMovedIdsSV: SharedValue<number[]>;
};

export function GameBoardSceneLayer(props: Props) {
  const { boardFrame, m, tileFont, tiles, S, snap, ...rest } = props;

  return (
    <Group
      transform={[{ translateX: boardFrame.x }, { translateY: boardFrame.y }]}
    >
      <BoardSkin
        rect={{ x: 0, y: 0, width: m.boardSize, height: m.boardSize }}
        S={S}
        snap={snap}
      />

      {tiles.map((t) => (
        <BoardTileNode
          key={t.id}
          m={m}
          tileId={t.id}
          label={t.label}
          font={tileFont}
          S={S}
          snap={snap}
          {...rest}
        />
      ))}
    </Group>
  );
}
