import {
  useLayoutDevice,
  useLayoutRenderHelpers,
} from "@/context/LayoutSnapshotProvider";
import { useMemo } from "react";
import type { ResultVideoVariant } from "./result.types";

export type GameResultFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type GameResultLayout = {
  screenW: number;
  screenH: number;
  videoFrame: GameResultFrame;
  accentFrame: GameResultFrame;
  primaryButtonFrame: GameResultFrame;
  videoRadius: number;
  accentRadius: number;
  buttonRadius: number;
};

export function useGameResultLayout(
  videoVariant: ResultVideoVariant,
): GameResultLayout {
  const { screenW, screenH, safeTop, safeBottom } = useLayoutDevice();
  const { S, snap } = useLayoutRenderHelpers();

  return useMemo(() => {
    const sideInset = snap(20 * S);
    const maxContentW = snap(360 * S);
    const contentW = Math.max(
      snap(240 * S),
      Math.min(screenW - sideInset * 2, maxContentW),
    );
    const contentX = snap((screenW - contentW) / 2);

    const buttonH = snap(58 * S);
    const buttonBottomGap = snap(32 * S);
    const buttonY = snap(screenH - safeBottom - buttonBottomGap - buttonH);

    const accentH = snap(74 * S);
    const accentToButtonGap = snap(18 * S);
    const accentY = snap(buttonY - accentToButtonGap - accentH);

    const topLimit = snap(safeTop + 32 * S);
    const videoToAccentGap = snap(18 * S);
    const maxVideoH = Math.max(
      snap(150 * S),
      accentY - videoToAccentGap - topLimit,
    );

    const targetAspect = videoVariant === "tall" ? 9 / 16 : 1;
    const maxVideoW = videoVariant === "tall" ? snap(270 * S) : contentW;

    let videoW = Math.min(contentW, maxVideoW, maxVideoH * targetAspect);
    let videoH = videoW / targetAspect;

    if (videoH > maxVideoH) {
      videoH = maxVideoH;
      videoW = videoH * targetAspect;
    }

    videoW = snap(videoW);
    videoH = snap(videoH);

    const videoFrame = {
      x: snap((screenW - videoW) / 2),
      y: snap(accentY - videoToAccentGap - videoH),
      width: videoW,
      height: videoH,
    };

    return {
      screenW,
      screenH,
      videoFrame,
      accentFrame: {
        x: contentX,
        y: accentY,
        width: contentW,
        height: accentH,
      },
      primaryButtonFrame: {
        x: contentX,
        y: buttonY,
        width: contentW,
        height: buttonH,
      },
      videoRadius: snap(16 * S),
      accentRadius: snap(12 * S),
      buttonRadius: snap(8 * S),
    };
  }, [S, safeBottom, safeTop, screenH, screenW, snap, videoVariant]);
}
