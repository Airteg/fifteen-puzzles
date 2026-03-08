import type { SkFont } from "@shopify/react-native-skia";
import { Group } from "@shopify/react-native-skia";
import React, { memo } from "react";
import type { SharedValue } from "react-native-reanimated";
import { useDerivedValue } from "react-native-reanimated";

import type { BoardMetrics } from "@/ui/game/boardGeometry";
import { cellRect } from "@/ui/game/boardGeometry";
import { TileSkin } from "@/ui/skia/TileSkin";

import type { BoardAxis, TileModel } from "./gameBoardModel";

export type BoardTileNodeProps = {
  m: BoardMetrics;
  S: number;
  snap: (v: number) => number;

  tile: TileModel;
  font: SkFont;

  emptyRow: SharedValue<number>;
  emptyCol: SharedValue<number>;
  dragActive: SharedValue<number>;
  dragAxis: SharedValue<number>;
  dragSteps: SharedValue<number>;
  dragLine: SharedValue<number>;

  animT: SharedValue<number>;
  animAxis: BoardAxis;
  animDir: 1 | -1;
  animMoved: boolean;
};

export const BoardTileNode = memo(function BoardTileNode(
  props: BoardTileNodeProps,
) {
  const {
    m,
    S,
    snap,
    tile,
    font,
    emptyRow,
    emptyCol,
    dragActive,
    dragAxis,
    dragSteps,
    dragLine,
    animT,
    animAxis,
    animDir,
    animMoved,
  } = props;

  const step = m.step;

  const transform = useDerivedValue(() => {
    let dx = 0;
    let dy = 0;

    if (dragActive.value === 1) {
      const steps = dragSteps.value;

      if (steps !== 0) {
        if (dragAxis.value === 1) {
          if (tile.row === dragLine.value && tile.row === emptyRow.value) {
            const eC = emptyCol.value;
            if (steps > 0) {
              if (tile.col >= eC - steps && tile.col <= eC - 1) dx += step;
            } else {
              const k = -steps;
              if (tile.col >= eC + 1 && tile.col <= eC + k) dx -= step;
            }
          }
        } else if (dragAxis.value === 2) {
          if (tile.col === dragLine.value && tile.col === emptyCol.value) {
            const eR = emptyRow.value;
            if (steps > 0) {
              if (tile.row >= eR - steps && tile.row <= eR - 1) dy += step;
            } else {
              const k = -steps;
              if (tile.row >= eR + 1 && tile.row <= eR + k) dy -= step;
            }
          }
        }
      }
    }

    if (animMoved) {
      const back = (1 - animT.value) * step;
      if (animAxis === "x") dx += -animDir * back;
      else dy += -animDir * back;
    }

    return [{ translateX: dx }, { translateY: dy }];
  }, [animMoved, animAxis, animDir, step]);

  return (
    <Group transform={transform}>
      <TileSkin
        rect={cellRect(m, tile.row, tile.col)}
        label={tile.label}
        font={font}
        S={S}
        snap={snap}
        baseColor={[0.88, 0.92, 0.95, 1.0]}
        textColor="#1C2833"
      />
    </Group>
  );
});
