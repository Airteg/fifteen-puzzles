import { useMemo } from "react";
import type { Frame } from "./StatisticModal.types";

const OUTER_BG = "#71D4EB";
const INNER_FRAME_BG = "#D5F7FF";
const INNER_BORDER_BG = "#D5F7FF";
const TITLE_COLOR = "#216169";
const SUBTITLE_COLOR = "#000000";

// Словник базових токенів модалки
function getStatisticLayoutMetrics(
  frame: Frame,
  S: number,
  snap: (v: number) => number,
) {
  // =========================
  // OUTER FRAME
  // =========================
  const outer = {
    r: snap(frame.width * 0.021),
    x: 0,
    y: 0,
    w: snap(frame.width),
    h: snap(frame.width * 1.4),
    c: OUTER_BG,
  };

  // TITLE
  const fontSizeTitle = outer.w * 0.0825;
  const title = {
    fontSize: fontSizeTitle,
    lineHeight: fontSizeTitle * 0.97,
    baselineY: fontSizeTitle * 1.7,
    c: TITLE_COLOR,
  };
  // INNER FRAME
  const innerFrameMargin = outer.w * 0.04;
  const innerFrame = {
    x: innerFrameMargin,
    y: innerFrameMargin * 5,
    w: outer.w - 2 * innerFrameMargin,
    h: outer.h - innerFrameMargin * 6,
    r: outer.w * 0.021,
    c: INNER_FRAME_BG,
  };
  // SUBTITLE
  const fontSizeSubtitle = outer.w * 0.051;
  const subtitle = {
    fontSize: fontSizeSubtitle,
    lineHeight: fontSizeSubtitle * 0.95,
    baselineY: innerFrameMargin * 5 + 2 * fontSizeSubtitle,
    c: SUBTITLE_COLOR,
  };
  // INNER BORDER
  const innerBorder = {
    x: innerFrameMargin * 2,
    y: subtitle.baselineY + fontSizeSubtitle,
    w: innerFrame.w - innerFrameMargin * 2,
    h: innerFrame.h - innerFrameMargin * 5,
    r: outer.w * 0.021,
    c: INNER_BORDER_BG,
  };
  const sizeButton = outer.w * 0.144;

  // RECT FOR LIST
  const listRect = {
    x: innerBorder.x,
    y: innerBorder.y,
    w: innerBorder.w,
    h: innerBorder.h - sizeButton - 50,
    r: outer.w * 0.021,
    c: INNER_BORDER_BG,
  };

  // BUTTON
  const button = {
    size: sizeButton,
    y: outer.h - sizeButton - 50,
    x: (outer.w - sizeButton * 3) / 2,
  };

  return {
    outer,
    title,
    innerFrame,
    subtitle,
    innerBorder,
    listRect,
    button,
  };
}

// єдине джерело готової геометрії для Scene + Overlay
export function useStatisticLayout(
  frame: Frame,
  S: number,
  snap: (v: number) => number,
) {
  return useMemo(() => {
    const {
      title,
      subtitle,
      outer,
      innerFrame,
      innerBorder,
      button,
      listRect,
    } = getStatisticLayoutMetrics(frame, S, snap);

    return {
      title,
      subtitle,
      outer,
      innerFrame,
      innerBorder,
      button,
      listRect,
    };
  }, [frame, S, snap]);
}
