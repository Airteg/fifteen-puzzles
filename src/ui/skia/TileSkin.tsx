import type { Rect } from "@/ui/pixel";
import {
  Group,
  LinearGradient,
  RoundedRect,
  Shadow,
  Text,
  vec,
  type SkFont,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";

type Props = {
  rect: Rect;
  label?: string;
  font?: SkFont | null;
  textColor?: string;

  // Масштаб (S) + snap з LayoutMetricsProvider — єдине джерело округлення
  S: number;
  snap: (v: number) => number;
};

function gradientPoints(rect: Rect, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  const dx = Math.cos(a);
  const dy = -Math.sin(a);

  const cx = rect.x + rect.width / 2;
  const cy = rect.y + rect.height / 2;

  const half = Math.max(rect.width, rect.height) * 0.75;
  return {
    start: vec(cx - dx * half, cy - dy * half),
    end: vec(cx + dx * half, cy + dy * half),
  };
}

export function TileSkin({
  rect,
  label,
  font,
  textColor = "#000",
  S,
  snap,
}: Props) {
  // Figma insets (rect уже в scaled px, тож беремо від нього)
  const inset2 = snap(rect.width * 0.0017); // 0.17%
  const inset3 = snap(rect.width * 0.0118); // 1.18%

  // Figma shadows
  const dx = snap(2 * S);
  const dy = snap(2 * S);
  const blur = snap(4 * S);

  // стартовий radius
  const r = snap(8 * S);

  const rect2 = useMemo(
    () => ({
      x: rect.x + inset2,
      y: rect.y + inset2,
      width: rect.width - inset2 * 2,
      height: rect.height - inset2 * 2,
    }),
    [rect, inset2],
  );

  const rect3 = useMemo(
    () => ({
      x: rect.x + inset3,
      y: rect.y + inset3,
      width: rect.width - inset3 * 2,
      height: rect.height - inset3 * 2,
    }),
    [rect, inset3],
  );

  const g2 = useMemo(() => gradientPoints(rect2, 25), [rect2]);
  const g3 = useMemo(() => gradientPoints(rect3, 25), [rect3]);

  // Текст по центру
  const textLayout = useMemo(() => {
    if (!label || !font) return null;

    const maxW = rect.width * 0.72;
    const maxH = rect.height * 0.55;

    const metrics = font.measureText(label);
    const w = metrics.width;

    const m = font.getMetrics();
    const h = m.descent - m.ascent;

    const scale = Math.min(1, maxW / Math.max(1, w), maxH / Math.max(1, h));

    const cx = rect.x + rect.width / 2;
    const cy = rect.y + rect.height / 2;

    const x = cx - (w * scale) / 2;
    const y = cy - (m.ascent * scale) / 2;

    return { x, y, scale };
  }, [label, font, rect]);

  return (
    <>
      {/* z=1 base dark */}
      <RoundedRect
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        r={r}
        color="#595959"
      >
        <Shadow dx={dx} dy={-dy} blur={blur} color="rgba(255,255,255,0.5)" />
        <Shadow dx={-dx} dy={dy} blur={blur} color="rgba(0,0,0,0.5)" />
      </RoundedRect>

      {/* z=2 white_blue */}
      <RoundedRect
        x={rect2.x}
        y={rect2.y}
        width={rect2.width}
        height={rect2.height}
        r={Math.max(0, r - inset2)}
      >
        <LinearGradient
          start={g2.start}
          end={g2.end}
          colors={["#A4B3BD", "#EEF1F3", "#FFFFFF"]}
          positions={[0.181, 0.7223, 0.8383]}
        />
      </RoundedRect>

      {/* z=3 white_grey */}
      <RoundedRect
        x={rect3.x}
        y={rect3.y}
        width={rect3.width}
        height={rect3.height}
        r={Math.max(0, r - inset3)}
      >
        <LinearGradient
          start={g3.start}
          end={g3.end}
          colors={["#FDFDFD", "#F4F4F4", "#DCDCDC", "#D0D0D0"]}
          positions={[0.017, 0.3068, 0.7801, 0.9829]}
        />
      </RoundedRect>

      {/* label */}
      {label && font && textLayout ? (
        <Group transform={[{ scale: textLayout.scale }]}>
          <Text
            x={textLayout.x / textLayout.scale}
            y={textLayout.y / textLayout.scale}
            text={label}
            font={font}
            color={textColor}
          />
        </Group>
      ) : null}
    </>
  );
}
