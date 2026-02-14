import React from "react";
import { RoundedRect } from "@shopify/react-native-skia";
import type { Rect } from "../pixel";

type Props = {
  rect: Rect;
};

export function PanelSurface({ rect }: Props) {
  const r = 8;
  // Fill
  const fill = "#71D4EB";

  // Inset shadow: inset 0px 4px 4px rgba(0,0,0,0.25)
  // Approximate by drawing an inner stroke near top edge
  // We'll refine later with proper inner shadow mask if needed.
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

      {/* Inset top shade */}
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
