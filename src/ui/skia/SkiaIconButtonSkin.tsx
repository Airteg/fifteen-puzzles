import {
  Blur,
  Group,
  Path,
  Rect,
  Shader,
  Skia,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import { hexToShader } from "@/utils/color";
import type { Rect as UIRect } from "../pixel";
// Впевнись, що шлях до шейдера правильний
import buttonSksl from "./shaders/frame.sksl";

const buttonEffect = Skia.RuntimeEffect.Make(buttonSksl)!;

type Props = {
  rect: UIRect;
  pressed?: boolean;
};

// Шлях стрілки
const SVG_PATH =
  "m 28.8 24.5 c -3.4 -4.3 -6.5 -6.7 -9.2 -7.2 c -2.7 -0.6 -5.3 -0.7 -7.7 -0.3 v 7.6 l -11.4 -12.4 l 11.4 -11.7 v 7.2 c 4.5 0 8.3 1.7 11.5 4.8 c 3.1 3.2 5 7.2 5.4 12 z";

export function SkiaIconButtonSkin({ rect, pressed = false }: Props) {
  const iconColor = "#216169";
  const SHADOW_BLUR = 11;
  const canvasW = rect.width + SHADOW_BLUR * 2;
  const canvasH = canvasW;

  const uniforms = useMemo(() => {
    return {
      u_canvasSize: [canvasW, canvasH],
      u_borderColor: hexToShader("#D5F7FF"),
      u_bgColor: hexToShader(pressed ? "#FAFF3F" : "#D5F7FF"),
      u_cornerRadiusPct: 0.1,
      u_aspectRatio: canvasW / canvasH,
    };
  }, [canvasW, canvasH, pressed]);

  // Розраховуємо центрування та масштаб іконки всередині квадрата
  const path = useMemo(() => {
    const p = Skia.Path.MakeFromSVGString(SVG_PATH);
    if (!p) return null;

    const bounds = p.computeTightBounds();

    // Підбираємо масштаб. 0.45 означає, що іконка займатиме 45% ширини кнопки
    const scale = (rect.width * 0.45) / bounds.width;

    const m = Skia.Matrix();
    // 2. Зміщуємо в центр rect
    m.translate(
      rect.x + (rect.width - bounds.width * scale) / 2 - bounds.x * scale,
      rect.y + (rect.height - bounds.height * scale) / 2 - bounds.y * scale,
    );
    // 1. Масштабуємо
    m.scale(scale, scale);

    p.transform(m);
    return p;
  }, [rect.x, rect.y, rect.width, rect.height]);

  if (!buttonEffect || !path) return null;

  return (
    <Group>
      {/* Підкладка (Шейдер) */}
      <Group
        transform={[
          { translateX: rect.x - SHADOW_BLUR },
          { translateY: rect.y - SHADOW_BLUR },
        ]}
      >
        <Rect x={0} y={0} width={canvasW} height={canvasH}>
          <Shader source={buttonEffect} uniforms={uniforms} />
        </Rect>
      </Group>

      {/* Сама іконка */}
      <Group>
        <Path
          path={path}
          color={iconColor}
          // style="fill"
          style="stroke"
          strokeWidth={2}
        />

        {/* Внутрішня тінь (як у тексту) */}
        <Group clip={path}>
          {/* Обгортаємо в Group для зсуву тіні по Y */}
          <Group transform={[{ translateY: 4 }]}>
            <Path
              path={path}
              color="#00000042"
              // style="fill"
              style="stroke"
              strokeWidth={0.5}
            >
              <Blur blur={4} mode="decal" />
            </Path>
          </Group>
        </Group>
      </Group>
    </Group>
  );
}
