import shaderSource from "@/ui/skia/shaders/frame.sksl";
import { hexToShader } from "@/utils/color";
import { Group, RoundedRect, Shader, Skia } from "@shopify/react-native-skia";
import React, { useMemo } from "react";

export type DRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type DBorderProps = {
  rect: DRect; // rect видимого бордера, який ми хочемо отримати на виході
  radius: number; // у шейдері радіус задається як відсоток від висоти, тому для коректного результату потрібно передавати реальний радіус, а не нормалізований
  color?: string; // для цього шейдера корисно, щоб колір бордера і фону був однаковим, тоді видно буде тільки тінь. Якщо колір фону зробити прозорим, то буде видно і сам бордер, але він буде "тяжчим" візуально.
  debugInnerFillColor?: string; //Необов'язковий debug-fill для внутрішнього rect,  який показує видиму область бордера. Колір можна передавати з прозорістю, наприклад "rgba(255, 0, 0, 0.5)" для напівпрозорого червоного. Це допоможе візуалізувати, як шейдер інтерпретує видиму область і коректно налаштувати розміри та радіус.
};

/**
 * Канон для frame.sksl:
 * shadowBlurPct = 0.08
 * margin = 0.08 * minCanvas
 *
 * Ми хочемо керувати ВИДИМИМ бордером, а не canvas шейдера.
 * Тому для заданого rect бордера обчислюємо shader rect, який
 * "обгортає" його запасом під blur.
 *
 * Формула:
 * visible = shader - 2 * margin
 * margin = 0.08 * min(shaderW, shaderH)
 *
 * Для портретних/звичайних випадків з цим шейдером зручною
 * зворотною формулою є:
 * margin = min(visibleW, visibleH) * 2 / 21
 */
export function getDBorderShaderMargin(width: number, height: number) {
  return Math.min(width, height) * (2 / 21);
}

// Для заданого rect видимого бордера обчислюємо shader rect, який "обгортає" його запасом під blur.
export function getDBorderShaderRect(rect: DRect): DRect {
  // Обчислюємо margin на основі видимих розмірів rect
  const margin = getDBorderShaderMargin(rect.width, rect.height);

  return {
    x: rect.x - margin,
    y: rect.y - margin,
    width: rect.width + margin * 2,
    height: rect.height + margin * 2,
  };
}

const shader = Skia.RuntimeEffect.Make(shaderSource);

if (!shader) {
  console.error("Помилка компіляції шейдера frame.sksl");
}

export function DBorder({
  rect,
  radius,
  color = "#D5F7FF",
  debugInnerFillColor,
}: DBorderProps) {
  const shaderRect = useMemo(() => getDBorderShaderRect(rect), [rect]);

  const uniforms = useMemo(() => {
    return {
      u_canvasSize: [shaderRect.width, shaderRect.height],
      u_borderColor: hexToShader(color),
      u_bgColor: hexToShader("#00000000"),
      u_cornerRadiusPct: rect.height > 0 ? radius / rect.height : 0.1,
      u_aspectRatio: rect.height > 0 ? rect.width / rect.height : 1,
    };
  }, [
    shaderRect.width,
    shaderRect.height,
    rect.width,
    rect.height,
    radius,
    color,
  ]);

  if (!shader) return null;

  return (
    <Group
      transform={[{ translateX: shaderRect.x }, { translateY: shaderRect.y }]}
    >
      <RoundedRect
        x={0}
        y={0}
        width={shaderRect.width}
        height={shaderRect.height}
        r={radius}
      >
        <Shader source={shader} uniforms={uniforms} />
      </RoundedRect>

      {debugInnerFillColor ? (
        <RoundedRect
          x={shaderRect.width * 0.077}
          y={shaderRect.height * 0.077}
          width={shaderRect.width * 0.845}
          height={shaderRect.height * 0.845}
          r={radius}
          color={debugInnerFillColor}
        />
      ) : null}
    </Group>
  );
}

export default DBorder;
