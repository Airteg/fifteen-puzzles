import {
  Group,
  Rect,
  Shader,
  Skia,
  Text,
  type SkFont,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";

// Імпортуємо наш новий шейдер
import timerShaderSource from "./shaders/timer.sksl";

const timerEffect = Skia.RuntimeEffect.Make(timerShaderSource);

if (!timerEffect) {
  console.error("Помилка компіляції шейдера timer.sksl");
}

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  timeText: string;
  font: SkFont | null;
  bgColor: [number, number, number, number]; // RGBA від hexToShader
  S: number;
  snap: (v: number) => number;
};

export function TimerSkin({
  x,
  y,
  width,
  height,
  timeText,
  font,
  bgColor,
  S,
  snap,
}: Props) {
  // Відступ для зовнішньої тіні (щоб не обрізалася канвасом)
  const SHADOW_MARGIN = snap(16 * S);

  const canvasW = width + SHADOW_MARGIN * 2;
  const canvasH = height + SHADOW_MARGIN * 2;

  const radius = snap(8 * S); // Радіус заокруглення як у кнопки

  const uniforms = useMemo(() => {
    return {
      canvasSize: [canvasW, canvasH],
      buttonSize: [width, height],
      radius: radius,
      isPressed: 0.0, // Таймер не натискається, тому завжди 0
      u_bgColor: bgColor,
    };
  }, [canvasW, canvasH, width, height, radius, bgColor]);

  // Відцентровка тексту
  const textLayout = useMemo(() => {
    if (!font) return null;
    const m = font.measureText(timeText);

    // Рахуємо координати тексту відносно чистого розміру таймера
    const tx = width / 2 - m.width / 2;
    const ty = height / 2 + m.height / 2 - (m.height - font.getSize()) * 0.15;

    return { x: tx, y: ty };
  }, [timeText, font, width, height]);

  if (!timerEffect) return null;

  return (
    <Group transform={[{ translateX: x }, { translateY: y }]}>
      <Group
        transform={[
          { translateX: -SHADOW_MARGIN },
          { translateY: -SHADOW_MARGIN },
        ]}
      >
        <Rect x={0} y={0} width={canvasW} height={canvasH}>
          <Shader source={timerEffect} uniforms={uniforms} />
        </Rect>
      </Group>

      {font && textLayout && (
        <Text
          x={textLayout.x}
          y={textLayout.y}
          text={timeText}
          font={font}
          color="#216169" // Темно-синій текст
        />
      )}
    </Group>
  );
}
