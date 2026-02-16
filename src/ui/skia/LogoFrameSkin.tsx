import type { Rect } from "@/ui/pixel";
import {
  Group,
  RoundedRect,
  rrect,
  Shadow,
  rect as skRect,
} from "@shopify/react-native-skia";
import React from "react";

type Props = {
  rect: Rect;
  radius: number;
  blur: number;
  borderW: number;
  fill: string; // #D5F7FF
};

export function LogoFrameSkin({ rect, radius, blur, borderW, fill }: Props) {
  const clip = rrect(
    skRect(rect.x, rect.y, rect.width, rect.height),
    radius,
    radius,
  );

  return (
    <>
      {/* Base + outer shadow */}
      <RoundedRect
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        r={radius}
        color={fill}
      >
        <Shadow dx={0} dy={0} blur={blur} color="rgba(0,0,0,0.25)" />
      </RoundedRect>

      {/* Inset shadow */}
      <Group clip={clip}>
        <RoundedRect
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height={rect.height}
          r={radius}
          color={fill}
        >
          <Shadow dx={0} dy={0} blur={blur} color="rgba(0,0,0,0.5)" inner />
        </RoundedRect>
      </Group>

      {/* Border 3px, same color as fill */}
      <RoundedRect
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        r={radius}
        color={fill}
        style="stroke"
        strokeWidth={borderW}
      />
    </>
  );
}
