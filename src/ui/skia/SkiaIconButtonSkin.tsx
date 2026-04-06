import { hexToShader } from "@/utils/color";
import {
  Blur,
  Group,
  Path,
  Rect,
  Shader,
  Skia,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { Rect as UIRect } from "../pixel";
// Впевнись, що шлях до шейдера правильний
import buttonSksl from "./shaders/frame.sksl";

const buttonEffect = Skia.RuntimeEffect.Make(buttonSksl)!;

type Props = {
  rect: UIRect;
  pressed?: boolean;
  other?: boolean;
};

// Шлях стрілки
const SVG_PATH =
  "m 28.8 24.5 c -3.4 -4.3 -6.5 -6.7 -9.2 -7.2 c -2.7 -0.6 -5.3 -0.7 -7.7 -0.3 v 7.6 l -11.4 -12.4 l 11.4 -11.7 v 7.2 c 4.5 0 8.3 1.7 11.5 4.8 c 3.1 3.2 5 7.2 5.4 12 z";
const SVG_PATH_2 =
  "m157 31a30 30 0 1160 0 30 30 0 11-60 0m-40 84c-6-5-9-15.3-9-15.3-5 2.3-5 10.3-30.5 10.3m-48.9 28c18.7 24 47.3 3 67 10 6.4 2-17.2 1 29.4-35-16 4-41 1-67-10-2.2 0-2 21-29.4 35m227.4 19-16 174-28-116-62 115 27-175zm-95-61.9c2 3.8 14 27.9 16 54.9l80-4c-1-13-24-65.5-38-81.1l-159.7-.4zM40.2 167l19.7 159H76l-5.1-159H101l-5.6 159m20.6-26H35.2l-4.6-26H119l2.2-26H25.7L21 222h103l2-26H16.5m-5.3-28 28.7 158H114l15-158m4-1H7.25z";

export function SkiaIconButtonSkin({
  rect,
  pressed = false,
  other = false,
}: Props) {
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
    const p = other
      ? Skia.Path.MakeFromSVGString(SVG_PATH_2)
      : Skia.Path.MakeFromSVGString(SVG_PATH);
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
  }, [other, rect.x, rect.y, rect.width, rect.height]);

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
