import { THEME_PALETTE } from "@/theme/themePalette";
import { useMemo } from "react";
import type { Frame, HitRect } from "./SkinModal.types";

export function useSkinLayout(
  frame: Frame,
  S: number,
  snap: (v: number) => number,
) {
  return useMemo(() => {
    // Вертикальна позиція заголовка модалки.
    const titleY = snap(42 * S);

    // Внутрішній відступ контейнера від країв модалки.
    const innerInset = snap(16 * S);
    // Верхня межа внутрішнього контенту під заголовком.
    const innerY = snap(60 * S);
    // Робоча ширина внутрішнього контейнера.
    const innerW = frame.width - innerInset * 2;
    // Робоча висота внутрішнього контейнера.
    const innerH = frame.height - innerY - innerInset;
    // Радіус заокруглення внутрішнього контейнера.
    const innerR = snap(8 * S);

    // X-координата лівої колонки з вибором кольору плиток.
    const leftColX = innerInset + snap(10 * S);
    // Y-координата лівої колонки з вибором кольору плиток.
    const leftColY = innerY + snap(12 * S);
    // Розмір одного квадрата-перемикача кольору плитки.
    const tileSwatchSize = snap(26 * S);
    // Відстань між квадратами-перемикачами кольору плитки.
    const tileSwatchGap = snap(8 * S);

    // Хіт-зони для палітри кольорів плиток.
    const tileRects: (HitRect & { color: string })[] = THEME_PALETTE.tile.map(
      (color, index) => ({
        color,
        x: leftColX,
        y: leftColY + index * (tileSwatchSize + tileSwatchGap),
        width: tileSwatchSize,
        height: tileSwatchSize,
      }),
    );

    // X-координата блоку прев'ю праворуч від палітри плиток.
    const previewX = leftColX + tileSwatchSize + snap(18 * S);
    // Y-координата блоку прев'ю.
    const previewY = innerY + snap(16 * S);
    // Ширина блоку прев'ю з урахуванням правого відступу.
    const previewW = innerW - (previewX - innerInset) - snap(12 * S);
    // Висота блоку прев'ю.
    const previewH = snap(176 * S);
    // Радіус заокруглення блоку прев'ю.
    const previewR = snap(18 * S);

    // Внутрішній відступ контенту всередині прев'ю.
    const previewInset = snap(12 * S);
    // Розмір однієї демонстраційної плитки у прев'ю.
    const previewTileSize = snap(46 * S);
    // Проміжок між демонстраційними плитками у прев'ю.
    const previewTileGap = snap(3 * S);

    // Хіт-зони та позиції плиток у демонстраційному прев'ю.
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

    // Розмір одного перемикача кольору дошки.
    const boardPaletteSize = snap(42 * S);
    // Відстань між перемикачами кольору дошки.
    const boardPaletteGap = snap(12 * S);
    // Y-координата палітри кольорів дошки під прев'ю.
    const boardPaletteY = previewY + previewH + snap(20 * S);

    // Повна ширина ряду з усіма опціями кольору дошки.
    const totalBoardPaletteW =
      THEME_PALETTE.board.length * boardPaletteSize +
      (THEME_PALETTE.board.length - 1) * boardPaletteGap;

    // X-координата старту палітри дошки, центрована відносно прев'ю.
    const boardPaletteX =
      previewX + Math.max(0, (previewW - totalBoardPaletteW) / 2);

    // Хіт-зони для палітри кольорів дошки.
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
