import { PanelSurface } from "@/ui/skia/PanelSurface";
import shaderSource from "@/ui/skia/shaders/frame.sksl";
import { SkiaIconButtonSkin } from "@/ui/skia/SkiaIconButtonSkin";
import { hexToShader } from "@/utils/color";
import { Group, RoundedRect, Shader, Skia } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { SceneProps } from "./StatisticModal.types";
import { useStatisticLayout } from "./useStatisticLayout";

const shader = Skia.RuntimeEffect.Make(shaderSource);

if (!shader) {
  console.error("Помилка компіляції шейдера tile_v2.sksl");
}

const INNER_COLOR = "#D5F7FF";

export function StatisticModalScene({ frame, S, snap, contentHeight }: SceneProps) {
  const layout = useStatisticLayout(frame, S, snap, contentHeight);

  const uniforms = useMemo(() => {
    return {
      u_canvasSize: [layout.shaderRect.width, layout.shaderRect.height],
      u_borderColor: hexToShader(INNER_COLOR),
      u_bgColor: hexToShader(INNER_COLOR),
      u_cornerRadiusPct: 0.1,
      u_aspectRatio: layout.shaderRect.width / layout.shaderRect.height,
    };
  }, [layout.shaderRect.height, layout.shaderRect.width]);

  if (!shader) return null;

  return (
    <Group transform={[{ translateX: frame.x }, { translateY: frame.y }]}>
      <PanelSurface
        rect={{
          x: 0,
          y: 0,
          width: frame.width,
          height: layout.totalHeight,
        }}
      />

      <RoundedRect
        x={layout.shaderRect.x}
        y={layout.shaderRect.y}
        width={layout.shaderRect.width}
        height={layout.shaderRect.height}
        r={layout.shaderRadius}
        color="rgba(143, 40, 40, 0.2)"
      >
        <Shader source={shader} uniforms={uniforms} />
      </RoundedRect>

      <RoundedRect
        x={layout.innerX}
        y={layout.innerY}
        width={layout.innerWidth}
        height={layout.innerHeight}
        r={layout.innerRadius}
        color={INNER_COLOR}
      />

      <SkiaIconButtonSkin rect={layout.resetButtonRect} pressed={false} other />
      <SkiaIconButtonSkin rect={layout.backButtonRect} pressed={false} />
    </Group>
  );
}
