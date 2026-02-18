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

  // Уже snapped зовні (або теж можна тут робити)
  radius: number;
  blurA: number; // біла (менша) тінь
  blurB: number; // чорна (більша) тінь

  // Додаємо єдине джерело масштабу/округлення
  S: number;
  snap: (v: number) => number;
};

export function BoardSkin({ rect, radius, blurA, blurB, S, snap }: Props) {
  // З SVG (design):
  // filter0: dx=4 dy=-4 blur ~3.35, white 0.5
  // filter1: dx=-4 dy=4 blur=7, black 0.4
  //
  // Важливо: dx/dy і інсети мають масштабуватись через S+snap
  const dx = snap(4 * S);
  const dy = snap(4 * S);

  const inset = snap(3 * S); // було +3 / -6

  // Зменшення радіуса для внутрішнього шару (було -2)
  const innerRadius = Math.max(0, radius - snap(2 * S));

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
        <Shadow dx={-dx} dy={dy} blur={blurB} color="rgba(0,0,0,0.4)" />
        <Shadow dx={dx} dy={-dy} blur={blurA} color="rgba(255,255,255,0.5)" />
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

      {/* paint1 (inner) */}
      <RoundedRect
        x={rect.x + inset}
        y={rect.y + inset}
        width={rect.width - inset * 2}
        height={rect.height - inset * 2}
        r={innerRadius}
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
