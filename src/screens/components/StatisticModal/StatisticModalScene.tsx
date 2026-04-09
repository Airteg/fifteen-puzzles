import { DBorder } from "@/ui/skia/DBorder";
import { SkiaIconButtonSkin } from "@/ui/skia/SkiaIconButtonSkin";
import shaderSource from "@/ui/skia/shaders/frame.sksl";
import { logLayout } from "@/utils/debugLayout";
import {
  Group,
  RoundedRect,
  Shadow,
  Skia,
  Text,
  useFont,
} from "@shopify/react-native-skia";
import React from "react";
import type { SceneProps } from "./StatisticModal.types";
import { useStatisticLayout } from "./useStatisticLayout";

const shader = Skia.RuntimeEffect.Make(shaderSource);

if (!shader) {
  console.error("Помилка компіляції шейдера frame.sksl");
}
const MARIUPOL_BOLD_TTF = require("../../../../assets/fonts/Mariupol-Bold.ttf");
const MARIUPOL_MEDIUM_TTF = require("../../../../assets/fonts/Mariupol-Medium.ttf");

export function StatisticModalScene({
  frame,
  S,
  snap,
}: SceneProps) {
  const { title, subtitle, outer, innerFrame, innerBorder, button } =
    useStatisticLayout(frame, S, snap);
  console.log("---");

  const titleFont = useFont(MARIUPOL_BOLD_TTF, title.fontSize);
  const titleText = "STATISTIC";
  const titleWidth = titleFont?.measureText(titleText)?.width ?? 0;
  const subtitleFont = useFont(MARIUPOL_MEDIUM_TTF, subtitle.fontSize);
  const subtitleText = "YOUR LAST 10 GAMES:";
  const subtitleWidth = subtitleFont?.measureText(subtitleText)?.width ?? 0;

  const titleX = titleFont ? (frame.width - titleWidth) / 2 : 0;
  const subtitleX = subtitleFont
    ? innerFrame.x + (innerFrame.w - subtitleWidth) / 2
    : innerFrame.x;

  if (!shader) return null;
  logLayout("frame", frame);

  return (
    <Group transform={[{ translateX: frame.x }, { translateY: frame.y }]}>
      <RoundedRect
        x={outer.x}
        y={outer.y}
        width={outer.w}
        height={outer.h}
        r={outer.r}
        color={outer.c}
      />

      {titleFont && (
        // "STATISTIC"
        <Text
          x={titleX}
          y={title.baselineY}
          text={titleText}
          font={titleFont}
          color={title.c}
        />
      )}

      <RoundedRect
        x={innerFrame.x}
        y={innerFrame.y}
        width={innerFrame.w}
        height={innerFrame.h}
        r={innerFrame.r}
        color={innerFrame.c}
      >
        <Shadow inner dx={0} dy={4} blur={8} color="rgba(0, 0, 0, 0.5)" />
      </RoundedRect>

      {subtitleFont && (
        <>
          {/* "YOUR LAST 10 GAMES:" */}
          <Text
            x={subtitleX}
            y={subtitle.baselineY}
            text={subtitleText}
            font={subtitleFont}
            color={subtitle.c}
          />
        </>
      )}

      <DBorder
        rect={{
          x: innerBorder.x,
          y: innerBorder.y,
          width: innerBorder.w,
          height: innerBorder.h,
        }}
        radius={innerBorder.r}
        color="#D5F7FF"
        // color="#D5F7FF30"
      />

      <SkiaIconButtonSkin
        rect={{
          x: button.x,
          y: button.y,
          width: button.size,
          height: button.size,
        }}
        pressed={false}
        other
      />
      <SkiaIconButtonSkin
        rect={{
          x: button.x + button.size * 2,
          y: button.y,
          width: button.size,
          height: button.size,
        }}
        pressed={false}
      />
    </Group>
  );
}
