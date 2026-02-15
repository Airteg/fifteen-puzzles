import type { SkFont } from "@shopify/react-native-skia";
import { Group, RoundedRect, Shadow, Text } from "@shopify/react-native-skia";
import React from "react";
import type { Rect } from "../pixel";

type Props = {
  rect: Rect;
  title: string;
  font: SkFont;
  pressed?: boolean;
};

export function SkiaButtonSkin({ rect, title, font, pressed = false }: Props) {
  const r = 8;
  const borderW = 3;

  const fillDefault = "#D5F7FF";
  const fillPressed = "#FAFF3F";
  const fill = pressed ? fillPressed : fillDefault;

  const textColor = "#216169";

  const m = font.measureText(title);
  const textX = rect.x + (rect.width - m.width) / 2;
  const textY =
    rect.y +
    rect.height / 2 +
    m.height / 2 -
    (m.height - font.getSize()) * 0.15;

  return (
    <Group>
      <RoundedRect
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        r={r}
        color={fill}
      >
        <Shadow dx={0} dy={0} blur={10} color="rgba(0,0,0,0.25)" />
      </RoundedRect>
      <RoundedRect
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        r={r}
        color={fill}
      />
      <RoundedRect
        x={rect.x + borderW / 2}
        y={rect.y + borderW / 2}
        width={rect.width - borderW}
        height={rect.height - borderW}
        r={r}
        color={fillDefault}
        style="stroke"
        strokeWidth={borderW}
        strokeJoin="round"
        strokeCap="round"
      />
      <RoundedRect
        x={rect.x + borderW}
        y={rect.y + borderW}
        width={rect.width - borderW * 2}
        height={rect.height - borderW * 2}
        r={r - 1}
        color="rgba(0,0,0,0.20)"
        style="stroke"
        strokeWidth={10}
        strokeJoin="round"
        strokeCap="round"
      />
      <Text x={textX} y={textY} text={title} font={font} color={textColor} />
    </Group>
  );
}
