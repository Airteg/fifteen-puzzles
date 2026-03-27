import type { Rect as UIRect } from "@/ui/pixel";
import { Group, Rect, Shader, Skia } from "@shopify/react-native-skia";
import React, { useMemo } from "react";

import boardShaderSource from "./shaders/board_v1.sksl";

const boardEffect = Skia.RuntimeEffect.Make(boardShaderSource);

if (!boardEffect) {
  console.error("Помилка компіляції шейдера board_v1.sksl");
}

type Props = {
  rect: UIRect;
  tintColor?: [number, number, number, number];
  S: number;
  snap: (v: number) => number;
};

export function BoardSkin({ rect, tintColor, S, snap }: Props) {
  // Для дошки з такою тінню відступ має бути трохи більшим, щоб тінь не обрізалась
  const SHADOW_MARGIN = snap(30 * S);
  const canvasW = rect.width + SHADOW_MARGIN * 2;
  const canvasH = rect.height + SHADOW_MARGIN * 2;

  // Радіус заокруглення дошки. Зазвичай він масштабується через S.
  const radius = snap(22 * S);

  const uniforms = useMemo(() => {
    return {
      u_canvasSize: [canvasW, canvasH],
      u_boardSize: [rect.width, rect.height],
      u_tint: tintColor || [0.0, 0.0, 0.0, 0.0],
      u_radius: radius,
      u_scale: S,
    };
  }, [canvasW, canvasH, rect.width, rect.height, tintColor, radius, S]);

  if (!boardEffect) return null;

  return (
    <>
      <Group transform={[{ translateX: rect.x }, { translateY: rect.y }]}>
        <Group
          transform={[
            { translateX: -SHADOW_MARGIN },
            { translateY: -SHADOW_MARGIN },
          ]}
        >
          <Rect x={0} y={0} width={canvasW} height={canvasH}>
            <Shader source={boardEffect} uniforms={uniforms} />
          </Rect>
        </Group>
      </Group>
    </>
  );
}
