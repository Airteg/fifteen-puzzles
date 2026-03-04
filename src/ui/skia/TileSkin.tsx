import type { Rect } from "@/ui/pixel";
import {
  Group,
  RoundedRect,
  Shader,
  Skia,
  Text,
  type SkFont,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";

// Імпортуємо наш шейдер (через ваш metro.config.js / skslTransformer)
import tileShaderSource from "./shaders/tile.sksl";

// 1. Компілюємо ефект один раз при завантаженні файлу (максимальна продуктивність)
const tileEffect = Skia.RuntimeEffect.Make(tileShaderSource);

if (!tileEffect) {
  console.error("Помилка компіляції шейдера tile.sksl");
}

type Props = {
  rect: Rect;
  label?: string;
  font?: SkFont | null;
  textColor?: string;
  // Колір передаємо у форматі [R, G, B, A] від 0 до 1
  baseColor?: [number, number, number, number];

  S: number;
  snap: (v: number) => number;
};

export function TileSkin({
  rect,
  label,
  font,
  textColor = "#000000",
  baseColor = [0.93, 0.95, 0.95, 1.0], // Світло-сірий за замовчуванням
  S,
  snap,
}: Props) {
  // Радіус заокруглення
  const r = snap(8 * S);

  // Передаємо параметри у шейдер
  const uniforms = useMemo(() => {
    return {
      size: [rect.width, rect.height],
      baseColor: baseColor,
    };
  }, [rect.width, rect.height, baseColor]);

  // Розрахунок позиції тексту
  const textLayout = useMemo(() => {
    if (!label || !font) return null;

    const maxW = rect.width * 0.72;
    const maxH = rect.height * 0.55;
    const metrics = font.measureText(label);
    const w = metrics.width;
    const m = font.getMetrics();
    const h = m.descent - m.ascent;
    const scale = Math.min(1, maxW / Math.max(1, w), maxH / Math.max(1, h));

    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const x = cx - (w * scale) / 2;
    const y = cy - (m.ascent * scale) / 2;

    return { x, y, scale };
  }, [label, font, rect]);

  return (
    // Зсуваємо всю групу на координати rect.x / rect.y
    <Group transform={[{ translateX: rect.x }, { translateY: rect.y }]}>
      {/* Підложка: використовуємо скомпільований ефект через <Shader> */}
      <RoundedRect x={0} y={0} width={rect.width} height={rect.height} r={r}>
        {tileEffect && <Shader source={tileEffect} uniforms={uniforms} />}
      </RoundedRect>

      {/* Текст / Контент поверх шейдера */}
      {label && font && textLayout ? (
        <Group transform={[{ scale: textLayout.scale }]}>
          <Text
            x={textLayout.x / textLayout.scale}
            y={textLayout.y / textLayout.scale}
            text={label}
            font={font}
            color={textColor}
          />
        </Group>
      ) : null}
    </Group>
  );
}
