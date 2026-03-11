import type { Rect as UIRect } from "@/ui/pixel";
import {
  Group,
  Rect,
  Shader,
  Skia,
  Text,
  type SkFont,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import tileShaderSource from "./shaders/tile_v2.sksl";

const tileEffect = Skia.RuntimeEffect.Make(tileShaderSource);

if (!tileEffect) {
  console.error("Помилка компіляції шейдера tile_v2.sksl");
}

type Props = {
  rect: UIRect;
  label?: string;
  font?: SkFont | null;
  baseColor?: [number, number, number, number];
  textColor?: string;
  S: number;
  snap: (v: number) => number;
  tintColor?: [number, number, number, number];
};

export function TileSkin({
  rect,
  label,
  font,
  tintColor,
  textColor = "#216169",
  S,
  snap,
}: Props) {
  const SHADOW_MARGIN = snap(8 * S);

  const canvasW = rect.width + SHADOW_MARGIN * 2;
  const canvasH = rect.height + SHADOW_MARGIN * 2;

  // ТУТ НАША БРОНЯ ВІД БАГІВ: використовуємо префікс u_
  const uniforms = useMemo(() => {
    return {
      u_canvasSize: [canvasW, canvasH],
      u_tileSize: [rect.width, rect.height],
      u_tint: tintColor || [0.0, 0.0, 0.0, 0.0],
    };
  }, [canvasW, canvasH, rect.width, rect.height, tintColor]);

  const textLayout = useMemo(() => {
    if (!label || !font) return null;
    const m = font.measureText(label);
    const x = rect.width / 2 - m.width / 2;
    const y =
      rect.height / 2 + m.height / 2 - (m.height - font.getSize()) * 0.15;
    return { x, y };
  }, [label, font, rect.width, rect.height]);

  if (!tileEffect) return null;

  return (
    <Group transform={[{ translateX: rect.x }, { translateY: rect.y }]}>
      <Group
        transform={[
          { translateX: -SHADOW_MARGIN },
          { translateY: -SHADOW_MARGIN },
        ]}
      >
        <Rect x={0} y={0} width={canvasW} height={canvasH}>
          <Shader source={tileEffect} uniforms={uniforms} />
        </Rect>
      </Group>

      {label && font && textLayout && (
        <Text
          x={textLayout.x}
          y={textLayout.y}
          text={label}
          font={font}
          color={textColor}
        />
      )}
    </Group>
  );
}
