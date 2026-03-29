import type { BoardLayout } from "@/layout/types";
import type { SkFont } from "@shopify/react-native-skia";
import { Group } from "@shopify/react-native-skia";
import React, { memo } from "react";
import type { SharedValue } from "react-native-reanimated";
import { useDerivedValue } from "react-native-reanimated";

import { TileSkin } from "@/ui/skia/TileSkin";
import type { BoardAxis } from "./gameBoardModel";

export type BoardTileNodeProps = {
  m: BoardLayout;
  tileId: number;
  label: string;
  font: SkFont;

  S: number;
  snap: (v: number) => number;

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
  tileTintColor: [number, number, number, number];
};

export const BoardTileNode = memo(function BoardTileNode(
  props: BoardTileNodeProps,
) {
  const {
    m,
    tileId,
    label,
    font,
    S,
    snap,
    gridSV,
    emptyRow,
    emptyCol,
    dragActive,
    dragAxis,
    dragStartRow,
    dragStartCol,
    dragOffsetPx,
    animT,
    animAxisSV,
    animDirSV,
    animMovedIdsSV,
    tileTintColor,
  } = props;

  const step = m.step;
  const inset = m.inset;

  const transform = useDerivedValue(() => {
    const idx = gridSV.value.indexOf(tileId);
    if (idx === -1) return [{ translateX: 0 }, { translateY: 0 }];

    const row = Math.floor(idx / 4);
    const col = idx % 4;

    let dx = inset + col * step;
    let dy = inset + row * step;

    if (dragActive.value === 1) {
      const offsetPx = dragOffsetPx.value;
      if (offsetPx !== 0) {
        if (dragAxis.value === 1) {
          if (row === dragStartRow.value && row === emptyRow.value) {
            const sC = dragStartCol.value;
            const eC = emptyCol.value;
            if (sC < eC && col >= sC && col <= eC - 1) dx += offsetPx;
            else if (sC > eC && col >= eC + 1 && col <= sC) dx += offsetPx;
          }
        } else if (dragAxis.value === 2) {
          if (col === dragStartCol.value && col === emptyCol.value) {
            const sR = dragStartRow.value;
            const eR = emptyRow.value;

            // ВИПРАВЛЕНО: row >= sR замість row >= eR
            if (sR < eR && row >= sR && row <= eR - 1) dy += offsetPx;
            else if (sR > eR && row >= eR + 1 && row <= sR) dy += offsetPx;
          }
        }
      }
    }

    if (animMovedIdsSV.value.includes(tileId)) {
      const back = (1 - animT.value) * step;
      if (animAxisSV.value === "x") dx += -animDirSV.value * back;
      else dy += -animDirSV.value * back;
    }

    return [{ translateX: dx }, { translateY: dy }];
  }, [step, inset, tileId]);

  return (
    <Group transform={transform}>
      <TileSkin
        rect={{ x: 0, y: 0, width: m.tile, height: m.tile }}
        label={label}
        font={font}
        S={S}
        snap={snap}
        tintColor={tileTintColor}
        textColor="#1C2833"
      />
    </Group>
  );
});
