import { useMemo } from "react";
import type { Frame, HitRect } from "./StatisticModal.types";

function getStatisticLayoutMetrics(
  frame: Frame,
  S: number,
  snap: (v: number) => number,
) {
  const titleTop = snap(18 * S);
  const titleHeight = snap(30 * S);
  const titleToContentGap = snap(12 * S);
  const horizontalInset = snap(16 * S);
  const buttonsTopGap = snap(20 * S);
  const buttonsGap = snap(18 * S);
  const bottomInset = snap(18 * S);
  const innerRadius = snap(10 * S);
  const shaderOutset = snap(10 * S);

  const innerWidth = Math.max(0, frame.width - horizontalInset * 2);
  const maxButtonSize = Math.max(0, (innerWidth - buttonsGap) / 2);
  const buttonSize = snap(Math.min(56 * S, maxButtonSize));

  return {
    titleTop,
    titleHeight,
    titleToContentGap,
    horizontalInset,
    buttonsTopGap,
    buttonsGap,
    bottomInset,
    buttonSize,
    innerRadius,
    shaderOutset,
  };
}

export function getStatisticInitialContentHeight(
  frame: Frame,
  S: number,
  snap: (v: number) => number,
) {
  const metrics = getStatisticLayoutMetrics(frame, S, snap);

  const chromeHeight =
    metrics.titleTop +
    metrics.titleHeight +
    metrics.titleToContentGap +
    metrics.buttonsTopGap +
    metrics.buttonSize +
    metrics.bottomInset;

  return Math.max(0, frame.height - chromeHeight);
}

export function useStatisticLayout(
  frame: Frame,
  S: number,
  snap: (v: number) => number,
  contentHeight: number,
) {
  return useMemo(() => {
    const metrics = getStatisticLayoutMetrics(frame, S, snap);
    const innerX = metrics.horizontalInset;
    const innerY =
      metrics.titleTop + metrics.titleHeight + metrics.titleToContentGap;
    const innerWidth = Math.max(0, frame.width - metrics.horizontalInset * 2);
    const innerHeight = Math.max(0, contentHeight);
    const buttonsY = innerY + innerHeight + metrics.buttonsTopGap;
    const buttonsRowWidth = metrics.buttonSize * 2 + metrics.buttonsGap;
    const buttonsX = innerX + (innerWidth - buttonsRowWidth) / 2;

    const resetButtonRect: HitRect = {
      x: buttonsX,
      y: buttonsY,
      width: metrics.buttonSize,
      height: metrics.buttonSize,
    };

    const backButtonRect: HitRect = {
      x: buttonsX + metrics.buttonSize + metrics.buttonsGap,
      y: buttonsY,
      width: metrics.buttonSize,
      height: metrics.buttonSize,
    };

    const shaderRect = {
      x: innerX - metrics.shaderOutset / 2,
      y: innerY - metrics.shaderOutset / 2,
      width: innerWidth + metrics.shaderOutset,
      height: innerHeight + metrics.shaderOutset,
    };

    const totalHeight = buttonsY + metrics.buttonSize + metrics.bottomInset;

    return {
      titleTop: metrics.titleTop,
      innerX,
      innerY,
      innerWidth,
      innerHeight,
      innerRadius: metrics.innerRadius,
      shaderRect,
      shaderRadius: metrics.innerRadius + metrics.shaderOutset / 2,
      resetButtonRect,
      backButtonRect,
      totalHeight,
    };
  }, [frame, S, snap, contentHeight]);
}
