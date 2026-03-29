import { useMemo } from "react";
import { THEME_PALETTE } from "@/theme/themePalette";
import type { Frame, HitRect } from "./SkinModal.types";

export function useSkinLayout(
  frame: Frame,
  S: number,
  snap: (v: number) => number,
) {
  return useMemo(() => {
    const titleY = snap(42 * S);

    const innerInset = snap(16 * S);
    const innerY = snap(60 * S);
    const innerW = frame.width - innerInset * 2;
    const innerH = frame.height - innerY - innerInset;
    const innerR = snap(8 * S);

    const leftColX = innerInset + snap(10 * S);
    const leftColY = innerY + snap(12 * S);
    const tileSwatchSize = snap(26 * S);
    const tileSwatchGap = snap(8 * S);

    const tileRects: (HitRect & { color: string })[] = THEME_PALETTE.tile.map(
      (color, index) => ({
        color,
        x: leftColX,
        y: leftColY + index * (tileSwatchSize + tileSwatchGap),
        width: tileSwatchSize,
        height: tileSwatchSize,
      }),
    );

    const previewX = leftColX + tileSwatchSize + snap(18 * S);
    const previewY = innerY + snap(16 * S);
    const previewW = innerW - (previewX - innerInset) - snap(12 * S);
    const previewH = snap(176 * S);
    const previewR = snap(18 * S);

    const previewInset = snap(12 * S);
    const previewTileSize = snap(46 * S);
    const previewTileGap = snap(3 * S);

    const previewTileRects: (HitRect & { label: string })[] = [
      {
        label: "1",
        x: previewX + previewInset,
        y: previewY + previewInset,
        width: previewTileSize,
        height: previewTileSize,
      },
      {
        label: "2",
        x: previewX + previewInset + previewTileSize + previewTileGap,
        y: previewY + previewInset,
        width: previewTileSize,
        height: previewTileSize,
      },
      {
        label: "3",
        x: previewX + previewInset + 2 * (previewTileSize + previewTileGap),
        y: previewY + previewInset,
        width: previewTileSize,
        height: previewTileSize,
      },
      {
        label: "4",
        x: previewX + previewInset,
        y: previewY + previewInset + previewTileSize + previewTileGap,
        width: previewTileSize,
        height: previewTileSize,
      },
      {
        label: "5",
        x: previewX + previewInset + previewTileSize + previewTileGap,
        y: previewY + previewInset + previewTileSize + previewTileGap,
        width: previewTileSize,
        height: previewTileSize,
      },
    ];

    const boardPaletteSize = snap(42 * S);
    const boardPaletteGap = snap(12 * S);
    const boardPaletteY = previewY + previewH + snap(20 * S);

    const totalBoardPaletteW =
      THEME_PALETTE.board.length * boardPaletteSize +
      (THEME_PALETTE.board.length - 1) * boardPaletteGap;

    const boardPaletteX =
      previewX + Math.max(0, (previewW - totalBoardPaletteW) / 2);

    const boardRects: (HitRect & { color: string })[] = THEME_PALETTE.board.map(
      (color, index) => ({
        color,
        x: boardPaletteX + index * (boardPaletteSize + boardPaletteGap),
        y: boardPaletteY,
        width: boardPaletteSize,
        height: boardPaletteSize,
      }),
    );

    return {
      titleY,
      innerInset,
      innerY,
      innerW,
      innerH,
      innerR,
      tileRects,
      previewX,
      previewY,
      previewW,
      previewH,
      previewR,
      previewTileRects,
      boardRects,
    };
  }, [frame.width, frame.height, S, snap]);
}
