import type { Rect } from "@/ui/pixel";
import { RoundedRect, Shadow } from "@shopify/react-native-skia";
import React from "react";

type Props = {
  rect: Rect;
};

export function AppHeaderSurface({ rect }: Props) {
  const r = 14; // якщо треба інший радіус — зробимо token
  const fill = "#71D4EB"; // тимчасово в стилі PanelSurface

  return (
    <>
      <RoundedRect
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        r={r}
        color={fill}
      >
        <Shadow dx={0} dy={2} blur={8} color="rgba(0,0,0,0.18)" />
      </RoundedRect>

      <RoundedRect
        x={rect.x + 1}
        y={rect.y + 1}
        width={rect.width - 2}
        height={rect.height - 2}
        r={r - 1}
        color="rgba(0,0,0,0.10)"
        style="stroke"
        strokeWidth={2}
      />
    </>
  );
}
