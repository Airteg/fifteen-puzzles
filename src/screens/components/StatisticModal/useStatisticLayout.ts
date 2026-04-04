import { useMemo } from "react";
import type { Frame, HitRect } from "./StatisticModal.types";

export function useStatisticLayout(
  frame: Frame,
  S: number,
  snap: (v: number) => number,
  rowCount: number,
) {
  return useMemo(() => {
    const titleY = snap(42 * S);

    const innerInset = snap(16 * S);
    const innerY = snap(60 * S);
    const innerW = frame.width - innerInset * 2;
    const innerH = frame.height - innerY - innerInset;
    const innerR = snap(10 * S);

    const sectionTitleY = innerY + snap(32 * S);

    const summaryX = innerInset + snap(18 * S);
    const summaryY = innerY + snap(54 * S);
    const summaryW = innerW - snap(36 * S);
    const summaryH = snap(74 * S);
    const summaryR = snap(10 * S);

    const summaryLabelX = summaryX + snap(16 * S);
    const summaryValueColX = summaryX + summaryW - snap(92 * S);
    const summaryRow1Y = summaryY + snap(26 * S);
    const summaryRow2Y = summaryY + snap(52 * S);

    const listX = innerInset + snap(18 * S);
    const listY = summaryY + summaryH + snap(18 * S);
    const listW = innerW - snap(36 * S);

    const rowH = snap(28 * S);
    const rowGap = snap(6 * S);
    const listHeaderH = snap(24 * S);
    const listHeaderGap = snap(8 * S);

    const rowsTop = listY + listHeaderH + listHeaderGap;
    const rowsH =
      rowCount > 0 ? rowCount * rowH + Math.max(0, rowCount - 1) * rowGap : 0;

    const rankColW = snap(28 * S);
    const timeColW = snap(84 * S);
    const movesColW = snap(64 * S);
    const dateColW = snap(86 * S);

    const rankColX = listX;
    const timeColX = rankColX + rankColW + snap(10 * S);
    const movesColX = timeColX + timeColW + snap(10 * S);
    const dateColX = listX + listW - dateColW;

    const buttonsGap = snap(14 * S);
    const buttonH = snap(52 * S);
    const resetButtonY = rowsTop + rowsH + snap(22 * S);
    const backButtonY = resetButtonY + buttonH + buttonsGap;
    const buttonX = listX;
    const buttonW = listW;
    const buttonR = snap(12 * S);

    const rows: HitRect[] = Array.from({ length: rowCount }, (_, index) => ({
      x: listX,
      y: rowsTop + index * (rowH + rowGap),
      width: listW,
      height: rowH,
    }));

    const resetButtonRect: HitRect = {
      x: buttonX,
      y: resetButtonY,
      width: buttonW,
      height: buttonH,
    };

    const backButtonRect: HitRect = {
      x: buttonX,
      y: backButtonY,
      width: buttonW,
      height: buttonH,
    };

    return {
      titleY,

      innerInset,
      innerY,
      innerW,
      innerH,
      innerR,

      sectionTitleY,

      summaryX,
      summaryY,
      summaryW,
      summaryH,
      summaryR,
      summaryLabelX,
      summaryValueColX,
      summaryRow1Y,
      summaryRow2Y,

      listX,
      listY,
      listW,
      listHeaderH,
      listHeaderGap,
      rowH,
      rowGap,
      rowsTop,
      rowsH,

      rankColX,
      timeColX,
      movesColX,
      dateColX,
      rankColW,
      timeColW,
      movesColW,
      dateColW,

      buttonR,
      resetButtonRect,
      backButtonRect,

      rows,
    };
  }, [frame.width, frame.height, S, snap, rowCount]);
}
