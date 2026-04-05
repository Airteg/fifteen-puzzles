import { useMemo } from "react";
import type { Frame, HitRect } from "./StatisticModal.types";

export function useStatisticLayout(
  frame: Frame,
  S: number,
  snap: (v: number) => number,
  contentHeight: number, // 🔥 ВАЖЛИВО: висота списку з overlay
) {
  return useMemo(() => {
    // =========================================================
    // 1. ВІДСТУПИ ТА БАЗОВІ РОЗМІРИ
    // =========================================================

    const paddingTop = snap(24 * S);
    const paddingBottom = snap(20 * S);

    const gapAfterTitle = snap(20 * S);

    const gapBeforeButtons = snap(20 * S);
    const gapBetweenButtons = snap(130 * S);

    const buttonHeight = snap(52 * S);

    // =========================================================
    // 2. ВНУТРІШНІЙ БЛОК (через SkiaButtonSkin)
    // =========================================================

    const innerInset = snap(16 * S);

    const innerX = innerInset;
    const innerY = paddingTop + gapAfterTitle;

    const innerWidth = frame.width - innerInset * 2;

    // 🔥 Висота внутрішнього блоку = висота списку
    const innerHeight = contentHeight;

    const innerRadius = snap(10 * S);

    // =========================================================
    // 3. КНОПКИ
    // =========================================================

    const buttonsStartY = innerY + innerHeight + gapBeforeButtons;

    const buttonWidth = innerWidth / 3;
    const buttonX = innerX;

    const resetButtonRect: HitRect = {
      x: buttonX,
      y: buttonsStartY,
      width: buttonWidth,
      height: buttonHeight,
    };

    const backButtonRect: HitRect = {
      x: buttonX + buttonHeight + gapBetweenButtons,
      y: buttonsStartY,
      width: buttonWidth,
      height: buttonHeight,
    };

    // =========================================================
    // 4. ОБЧИСЛЕННЯ ВИСОТИ ВСІЄЇ МОДАЛКИ
    // =========================================================

    const totalHeight =
      paddingTop +
      gapAfterTitle +
      innerHeight +
      gapBeforeButtons +
      buttonHeight * 2 +
      paddingBottom;

    return {
      // внутрішній блок
      innerX,
      innerY,
      innerWidth,
      innerHeight,
      innerRadius,

      // кнопки
      resetButtonRect,
      backButtonRect,

      // загальна висота PanelSurface
      totalHeight,
    };
  }, [frame.width, frame.height, S, snap, contentHeight]);
}
