import type { Rect } from "@/ui/pixel";
import {
  LinearGradient,
  RoundedRect,
  Shadow,
  vec,
} from "@shopify/react-native-skia";
import React from "react";

type Props = {
  rect: Rect;
  radius: number;
  blurA: number; // для великої м'якої тіні
  blurB: number; // для другої
};

export function BoardSkin({ rect, radius, blurA, blurB }: Props) {
  // з SVG:
  // filter0: dx=4 dy=-4 blur~3.35 color white alpha 0.5
  // filter1: dx=-4 dy=4 blur=7 color black alpha 0.4
  // gradients paint0, paint1 аналогічні
  return (
    <>
      {/* Base */}
      <RoundedRect
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        r={radius}
        color="#B7B7B7"
      >
        <Shadow dx={-4} dy={4} blur={blurB} color="rgba(0,0,0,0.4)" />
        <Shadow dx={4} dy={-4} blur={blurA} color="rgba(255,255,255,0.5)" />
      </RoundedRect>

      {/* paint0 */}
      <RoundedRect
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        r={radius}
      >
        <LinearGradient
          start={vec(rect.x + rect.width * 0.22, rect.y + rect.height * 1.02)}
          end={vec(rect.x + rect.width * 0.78, rect.y - rect.height * 0.02)}
          colors={["#A4B3BD", "#EEF1F3", "#FFFFFF"]}
          positions={[0.17, 0.73, 0.85]}
        />
      </RoundedRect>

      {/* paint1 */}
      <RoundedRect
        x={rect.x + 3}
        y={rect.y + 3}
        width={rect.width - 6}
        height={rect.height - 6}
        r={Math.max(0, radius - 2)}
      >
        <LinearGradient
          start={vec(rect.x + rect.width * 0.22, rect.y + rect.height * 1.02)}
          end={vec(rect.x + rect.width * 0.78, rect.y - rect.height * 0.02)}
          colors={["#FDFDFD", "#F4F4F4", "#DCDCDC", "#D0D0D0"]}
          positions={[0.0, 0.3, 0.79, 1.0]}
        />
      </RoundedRect>
    </>
  );
}
