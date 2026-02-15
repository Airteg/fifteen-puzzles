import React from "react";
import { RoundedRect } from "@shopify/react-native-skia";
import type { Rect } from "../pixel";

type Props = {
  rect: Rect;
};

export function PanelSurface({ rect }: Props) {
  const r = 8;
  const fill = "#71D4EB";
  return (
    <>
      <RoundedRect
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        r={r}
        color={fill}
      />
      <RoundedRect
        x={rect.x + 1}
        y={rect.y + 1}
        width={rect.width - 2}
        height={rect.height - 2}
        r={r - 1}
        color="rgba(0,0,0,0.12)"
        style="stroke"
        strokeWidth={6}
      />
    </>
  );
}
