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

export function StatisticModalScene({
  frame,
  S,
  snap,
  contentHeight, // 🔥 новий проп
}: SceneProps & { contentHeight: number }) {
  const layout = useStatisticLayout(frame, S, snap, (contentHeight = 300));
  // console.log("🚀 ~ layout:", layout);
  console.log("🚀 ~ layout:", layout);
  console.log(
    "🚀 ~ layout:\n" +
      JSON.stringify(
        layout,
        (k, v) => (typeof v === "number" ? Number(v.toFixed(1)) : v),
        2,
      ),
  );
  const uniforms = useMemo(() => {
    return {
      u_canvasSize: [0, 0],
      u_borderColor: hexToShader("#D5F7FF"),
      u_bgColor: hexToShader("#FAFF3F"),
      u_cornerRadiusPct: 0.1,
      u_aspectRatio: 4.75866206896,
    };
  }, []);

  if (!shader) return null;

  return (
    <Group transform={[{ translateX: frame.x }, { translateY: frame.y }]}>
      {/* ===================================================== */}
      {/* 1. PANEL SURFACE (висота динамічна!) */}
      {/* ===================================================== */}

      <PanelSurface
        rect={{
          x: 0,
          y: 0,
          width: frame.width,
          height: layout.totalHeight, // 🔥 залежить від списку
        }}
      />

      {/* ===================================================== */}
      {/* 2. SKIA BUTTON (як контейнер) */}
      {/* ===================================================== */}

      {/* <SkiaButtonSkin
        rect={{
          x: layout.innerX,
          y: layout.innerY,
          width: layout.innerWidth,
          height: layout.innerHeight,
        }}
        title="" // ❗ без тексту — тільки фон
        font={{} as any} // 🔥 тимчасово (потім приберемо або зробимо optional)
      /> */}
      <Group
        transform={[
          { translateX: layout.innerX },
          { translateY: layout.innerY },
        ]}
      >
        <RoundedRect
          x={0}
          y={0}
          width={layout.innerWidth + 15}
          height={layout.innerHeight + 15}
          r={snap(10 * S)}
          color="rgba(143, 40, 40, 0.2)"
        >
          <Shader source={shader} uniforms={uniforms} />
        </RoundedRect>
      </Group>

      {/* ===================================================== */}
      {/* 3. ВНУТРІШНІЙ СВІТЛИЙ БЛОК */}
      {/* ===================================================== */}

      {/* <RoundedRect
        x={layout.innerX}
        y={layout.innerY}
        width={layout.innerWidth}
        height={layout.innerHeight}
        r={layout.innerRadius}
        color={INNER_COLOR}
      /> */}

      {/* ===================================================== */}
      {/* 4. КНОПКИ */}
      {/* ===================================================== */}

      <Group>
        <SkiaIconButtonSkin
          rect={layout.resetButtonRect}
          pressed={false}
          other={true} // 🔥 твій новий варіант
        />

        <SkiaIconButtonSkin rect={layout.backButtonRect} pressed={false} />
      </Group>
    </Group>
  );
}
