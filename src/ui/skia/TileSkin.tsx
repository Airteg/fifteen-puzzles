import type { Rect as UIRect } from "@/ui/pixel";
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
import tileShaderSource from "./shaders/tile.sksl";

// Компілюємо ОДИН раз для максимального FPS
const tileEffect = Skia.RuntimeEffect.Make(tileShaderSource);

if (!tileEffect) {
  console.error("Помилка компіляції шейдера tile_v2.sksl");
}

// ЄДИНИЙ тип для параметрів компонента
type Props = {
  rect: UIRect;
  label?: string;
  font?: SkFont | null;
  baseColor?: [number, number, number, number]; // RGBA масив для GPU
  textColor?: string;
  S: number;
  snap: (v: number) => number;
};

export function TileSkin({
  rect,
  label,
  font,
  baseColor = [0.93, 0.95, 0.95, 1.0],
  textColor = "#216169",
  S,
  snap,
}: Props) {
  // 1. Безпечна зона для майбутніх тіней (зараз просто збільшує полотно)
  const SHADOW_MARGIN = snap(8 * S);

  const canvasW = rect.width + SHADOW_MARGIN * 2;
  const canvasH = rect.height + SHADOW_MARGIN * 2;

  // 2. Uniforms для GPU (перераховуються тільки при зміні розмірів/кольору)
  const uniforms = useMemo(() => {
    return {
      canvasSize: [canvasW, canvasH],
      tileSize: [rect.width, rect.height],
      baseColor: baseColor,
    };
  }, [canvasW, canvasH, rect.width, rect.height, baseColor]);

  // 3. Центрування тексту відносно чистого розміру плитки (rect)
  const textLayout = useMemo(() => {
    if (!label || !font) return null;
    const m = font.measureText(label);

    // Рахуємо X та Y так, щоб текст був рівно по центру плитки
    const x = rect.width / 2 - m.width / 2;
    // Skia Text 'y' — це базова лінія шрифту (baseline)
    const y =
      rect.height / 2 + m.height / 2 - (m.height - font.getSize()) * 0.15;

    return { x, y };
  }, [label, font, rect.width, rect.height]);

  if (!tileEffect) return null;

  return (
    // Ставимо всю плитку на її місце в просторі
    <Group transform={[{ translateX: rect.x }, { translateY: rect.y }]}>
      {/* Відводимо полотно шейдера назад на розмір SHADOW_MARGIN */}
      <Group
        transform={[
          { translateX: -SHADOW_MARGIN },
          { translateY: -SHADOW_MARGIN },
        ]}
      >
        <Rect x={0} y={0} width={canvasW} height={canvasH}>
          <Shader source={tileEffect} uniforms={uniforms} />
        </Rect>
      </Group>

      {/* Текст малюється в нормальних координатах плитки */}
      {label && font && textLayout && (
        <Text
          x={textLayout.x}
          y={textLayout.y}
          text={label}
          font={font}
          color={textColor}
        />
      )}
    </Group>
  );
}
