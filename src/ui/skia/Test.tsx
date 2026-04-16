import { Group, Rect, Shader, Skia } from "@shopify/react-native-skia";
import React, { useMemo } from "react";

import { hexToShader } from "@/utils/color";
import tileShaderSource from "./shaders/frame_v2.sksl";

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
      u_resolution: [w, h],
      u_figureSize: [w, h],
      u_borderColor: hexToShader("#D5F7FF"),
      u_bgColor: hexToShader("#FAFF3F"),
      u_cornerRadiusPct: 16,
      u_borderThickness: 12,
      u_aspectRatio: 1,
    };
  }, [w, h]);

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
          <Rect
            x={0}
            y={0}
            width={w}
            height={h}
            style={"stroke"}
            strokeWidth={1}
            color="#magenta"
          />
          <Rect x={0} y={0} width={w} height={h}>
            <Shader source={tileEffect} uniforms={uniforms} />
          </Rect>
        </Group>
      </Group>
    </Group>
  );
}
