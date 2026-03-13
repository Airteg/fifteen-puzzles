import {
  Group,
  Rect,
  Shader,
  Skia,
  Text,
  Path,
  type SkFont,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";

// Беремо існуючий шейдер для плиток
import tileShaderSource from "./shaders/tile_v2.sksl";

const tileEffect = Skia.RuntimeEffect.Make(tileShaderSource);

if (!tileEffect) {
  console.error("Помилка компіляції шейдера tile_v2.sksl");
}

const HOME_PATH =
  "M19 25h6V11.1L15 3.3 5 11.1V25h6V17c0-.5.2-1 .6-1.4s.9-.6 1.4-.6h4c.5 0 1 .2 1.4.6.4.4.6.9.6 1.4v8Zm-2 0V17H13v8h4ZM15.6 1.2 30 12.4 28.8 14 27 12.6V25c0 .5-.2 1-.6 1.4-.4.4-.9.6-1.4.6H5c-.5 0-1-.2-1.4-.6C3.2 26 3 25.5 3 25V12.6L1.2 14 0 12.4 14.4 1.2c.1-.1.4-.2.6-.2s.4.1.6.2Z";
const RESTART_PATH =
  "M21.9 7.8 17.8 4m0 0 4.1-3.7M17.8 4h14c2.2 0 4 1.8 4 4v8.3c0 2.2-1.8 4-4 4H23M12.8 4H4C1.8 4 0 5.8 0 8v8.3c0 2.2 1.8 4 4 4H18M13.9 24 18 20.3m0 0-4.1-3.8";

type Props = {
  x: number;
  y: number;
  type: "home" | "restart";
  label: string;
  font: SkFont;
};

export function IconButtonSkin({ x, y, type, label, font }: Props) {
  const w = 80;
  const h = 99;
  const innerOffset = 10;
  const innerSize = 60;

  // Уніформи як у TileSkin
  const uniforms = useMemo(() => {
    return {
      u_canvasSize: [innerSize, innerSize],
      u_tileSize: [innerSize, innerSize],
      u_tint: [0.0, 0.0, 0.0, 0.0], // пустий tint, щоб був базовий колір плитки
    };
  }, []);

  const path = useMemo(() => {
    const svgStr = type === "home" ? HOME_PATH : RESTART_PATH;
    const p = Skia.Path.MakeFromSVGString(svgStr);
    if (!p) return null;

    // Автоматично центруємо SVG всередині квадрата 60x60
    const bounds = p.computeTightBounds();

    // Трохи збільшимо стрілки рестарту, бо вони візуально менші за будиночок
    const scale = type === "restart" ? 1.2 : 1.0;

    // Формула центрування
    const dx =
      innerOffset + (innerSize - bounds.width * scale) / 2 - bounds.x * scale;
    const dy =
      innerOffset + (innerSize - bounds.height * scale) / 2 - bounds.y * scale;

    const matrix = Skia.Matrix();
    matrix.translate(dx, dy);
    matrix.scale(scale, scale);
    p.transform(matrix);

    return p;
  }, [type]);

  const textLayout = useMemo(() => {
    const m = font.measureText(label);
    const tx = w / 2 - m.width / 2;
    // Skia Text 'y' - це базова лінія (baseline). Отже відступ 10px знизу:
    const ty = h - 10;
    return { x: tx, y: ty };
  }, [label, font]);

  return (
    <Group transform={[{ translateX: x }, { translateY: y }]}>
      {/* 1. Блакитна підкладка кнопки */}
      <Rect x={0} y={0} width={w} height={h} color="#71D4EB" />

      {/* 2. Шейдерний квадрат (об'ємна кнопка) */}
      <Rect
        x={innerOffset}
        y={innerOffset}
        width={innerSize}
        height={innerSize}
      >
        {tileEffect && <Shader source={tileEffect} uniforms={uniforms} />}
      </Rect>

      {/* 3. Іконка (Home - заливка, Restart - лінії) */}
      {path && type === "home" && (
        <Path path={path} color="#000000" style="fill" />
      )}
      {path && type === "restart" && (
        <Path
          path={path}
          color="#000000"
          style="stroke"
          strokeWidth={2.5}
          strokeCap="round"
          strokeJoin="round"
        />
      )}

      {/* 4. Текст знизу */}
      <Text
        x={textLayout.x}
        y={textLayout.y}
        text={label}
        font={font}
        color="#000000"
      />
    </Group>
  );
}
