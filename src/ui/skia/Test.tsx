import { Group, Rect, Shader, Skia } from "@shopify/react-native-skia";
import React, { useMemo } from "react";

import { hexToShader } from "@/utils/color";
import tileShaderSource from "./shaders/test/roundedRectangle.sksl";

const tileEffect = Skia.RuntimeEffect.Make(tileShaderSource);

if (!tileEffect) {
  console.error("Помилка компіляції шейдера tile_v2.sksl");
}

export function Test({ w, h }: { w: number; h: number }) {
  const OuterShadow = w < 20 || h < 20 ? Math.min(w, h) * 0.5 : 20;
  const rect = {
    x: 0 + OuterShadow / 2,
    y: 0 + OuterShadow / 2,
    w: w - OuterShadow * 2,
    h: h - OuterShadow * 2,
  };

  console.log("========Test========");
  console.log("OuterShadow", OuterShadow);
  console.log("canvas", w, "X", h);
  console.log("rect", rect);
  console.log("======End Test======");

  // ТУТ НАША БРОНЯ ВІД БАГІВ: використовуємо префікс u_
  const uniforms = useMemo(() => {
    return {
      u_canvasSize: [w, h],
      u_figureSize: [rect.w, rect.h],
      u_tint: hexToShader("#ffffff"),
    };
  }, [w, h, rect.w, rect.h]);

  if (!tileEffect) return null;

  return (
    <Group>
      <Rect
        x={0}
        y={0}
        width={w}
        height={h}
        style={"stroke"}
        color="transparent"
        strokeWidth={0}
      ></Rect>
      <Group>
        <Group>
          <Rect x={0} y={0} width={w} height={h} color="#000000ff">
            <Shader source={tileEffect} uniforms={uniforms} />
          </Rect>
        </Group>
      </Group>
    </Group>
  );
}
