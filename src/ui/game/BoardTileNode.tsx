import type { SkFont } from "@shopify/react-native-skia";
import { Group } from "@shopify/react-native-skia";
import React, { memo } from "react";
import type { SharedValue } from "react-native-reanimated";
import { useDerivedValue } from "react-native-reanimated";

import type { BoardMetrics } from "@/ui/game/boardGeometry";
import { cellRect } from "@/ui/game/boardGeometry";
import { TileSkin } from "@/ui/skia/TileSkin";

import type { BoardAxis } from "./gameBoardModel";

export type BoardTileNodeProps = {
  m: BoardMetrics;
  S: number;
  snap: (v: number) => number;

  tileId: number;
  label: string;
  row: number;
  col: number;
  font: SkFont;

  emptyRow: SharedValue<number>;
  emptyCol: SharedValue<number>;
  dragActive: SharedValue<number>;
  dragAxis: SharedValue<number>;
  dragStartRow: SharedValue<number>;
  dragStartCol: SharedValue<number>;
  dragOffsetPx: SharedValue<number>;

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
    tileId,
    label,
    row,
    col,
    font,
    emptyRow,
    emptyCol,
    dragActive,
    dragOffsetPx,
    dragAxis,
    dragStartRow,
    dragStartCol,
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
      const offsetPx = dragOffsetPx.value;

      if (offsetPx !== 0) {
        if (dragAxis.value === 1) {
          // Рух по осі X
          if (row === dragStartRow.value && row === emptyRow.value) {
            const sC = dragStartCol.value;
            const eC = emptyCol.value;
            if (sC < eC) {
              // Блок рухається вправо (до empty)
              if (col >= sC && col <= eC - 1) dx = offsetPx;
            } else if (sC > eC) {
              // Блок рухається вліво (до empty)
              if (col >= eC + 1 && col <= sC) dx = offsetPx;
            }
          }
        } else if (dragAxis.value === 2) {
          // Рух по осі Y
          if (col === dragStartCol.value && col === emptyCol.value) {
            const sR = dragStartRow.value;
            const eR = emptyRow.value;
            if (sR < eR) {
              // Блок рухається вниз
              if (row >= sR && row <= eR - 1) dy = offsetPx;
            } else if (sR > eR) {
              // Блок рухається вгору
              if (row >= eR + 1 && row <= sR) dy = offsetPx;
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
        rect={cellRect(m, row, col)}
        label={label}
        font={font}
        S={S}
        snap={snap}
        baseColor={[0.88, 0.92, 0.95, 1.0]}
        textColor="#1C2833"
      />
    </Group>
  );
});
