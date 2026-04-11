import { RoundedRect, Shadow } from "@shopify/react-native-skia";
import React from "react";
import type { Rect } from "../pixel";

type Props = {
  rect: Rect;
};

export function PanelSurface({ rect }: Props) {
  const r = 8;
  const fill = "#71D4EB";
  return (
    <RoundedRect
      x={rect.x}
      y={rect.y}
      width={rect.width}
      height={rect.height}
      r={r}
      color={fill}
    >
      <Shadow inner dx={0} dy={4} blur={8} color="rgba(0, 0, 0, 0.5)" />
    </RoundedRect>
  );
}
