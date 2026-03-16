import {
  Group,
  Image,
  Path,
  Rect,
  RoundedRect,
  Shader,
  Shadow,
  Skia,
  Text,
  useFont,
  useImage,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";
// Додаємо імпорт нашого контексту шрифтів
import tileShaderSource from "./shaders/tile_v2_logo.sksl";

type Frame = {
  x: number;
  y: number;
  width: number;
};

// font видалено з Props
type Props = {
  frame: Frame;
  baseColor?: [number, number, number, number];
  S: number;
  textColor?: string;
  snap: (v: number) => number;
  tintColor?: [number, number, number, number];
};

const tileEffect = Skia.RuntimeEffect.Make(tileShaderSource);

if (!tileEffect) {
  console.error("Помилка компіляції шейдера tile_v2_logo.sksl");
}

const SVG_PATH =
  "M0 0H18.1V3.6H4.1V8.9H16V12.3H4.1V20.2H0V0ZM21.6 0H25.7V20.2H21.6V0ZM30.9 0H49V3.6H35V8.9H46.9V12.3H35V20.2H30.9V0ZM59.1 3.6H51.6V0H70.7V3.6H63.2V20.2H59.1V3.6ZM75.1 0H92.3V3.6H79.2V7.6H90.8V11H79.2V16.6H92.6V20.2H75.1V0ZM97.1 0H114.4V3.6H101.2V7.6H112.9V11H101.2V16.6H114.6V20.2H97.1V0ZM119.2 0H123.3L135.9 6.6V0H140V20.2H135.9V10.9L123.3 4.4V20.2H119.2V0Z";

export function LogoSkin({ frame, snap, S }: Props) {
  const { x, y, width: W } = frame;

  const image = useImage(require("../../../assets/images/logo5.png"));

  const baseFont = useFont(
    require("../../../assets/fonts/Krona_One/KronaOne-Regular.ttf"),
  );
  const dynamicFont = useMemo(() => {
    if (!baseFont) return null;
    const typeface = baseFont.getTypeface();
    if (!typeface) return baseFont;
    const newFontSize = W * 0.32; // Розмір шрифту залежить від ширини логотипу
    return Skia.Font(typeface, newFontSize);
  }, [baseFont, W]);

  const tileSize = (W * 10) / 18;

  const uniforms = useMemo(() => {
    return {
      u_canvasSize: [tileSize, tileSize],
      u_tileSize: [W * 0.5, W * 0.5],
      u_tint: [0.0, 0.0, 0.0, 0.0],
    };
  }, [tileSize, W]);

  const bgRadius = W * 0.06;

  // Координати для Плитки 1
  const tileX = W * 0.072;
  const tileY = W * 0.171;

  const label = "1";
  const textColor = "#216169";

  // Макет для тексту цифри "1" з використанням динамічного шрифту
  const textLayout = useMemo(() => {
    if (!dynamicFont) return null;
    const m = dynamicFont.measureText(label);
    const textX =
      tileSize / 2 - m.width / 2 + (m.height - dynamicFont.getSize()) * 0.15;
    const textY =
      tileSize / 2 + m.height / 2 - (m.height - dynamicFont.getSize()) * 0.05;
    return { x: textX, y: textY };
  }, [label, dynamicFont, tileSize]);

  const path = useMemo(() => {
    const p = Skia.Path.MakeFromSVGString(SVG_PATH);
    if (!p) return null;

    const bounds = p.computeTightBounds();

    // Масштаб: напис "FIFTEEN" займає 75% ширини логотипу
    const scale = (W * 0.75) / bounds.width;

    const m = Skia.Matrix();

    // Зміщуємо шлях
    m.translate(
      (W - bounds.width * scale) / 2 - bounds.x * scale,
      W * 0.82 - bounds.y * scale, // Рівень 82% по висоті
    );

    // Масштабуємо
    m.scale(scale, scale);
    p.transform(m);
    return p;
  }, [W]);

  if (!tileEffect || !image || !path || !dynamicFont) return null;

  return (
    <Group transform={[{ translateX: x }, { translateY: y }]}>
      {/* 1. ЖОВТИЙ ФОН */}
      <Group>
        <RoundedRect
          x={0}
          y={0}
          width={W}
          height={W}
          r={bgRadius}
          color="#FAFF3F"
        >
          <Shadow
            dx={0}
            dy={W * 0.04}
            blur={W * 0.06}
            color="rgba(0,0,0,0.2)"
          />
          <Shadow
            dx={-W * 0.02}
            dy={W * 0.04}
            blur={W * 0.04}
            color="rgba(0,0,0,0.35)"
            inner
          />
        </RoundedRect>
        <RoundedRect
          x={0}
          y={0}
          width={W}
          height={W}
          r={bgRadius}
          style={"stroke"}
          color="#000000"
          strokeWidth={1}
        />
      </Group>

      {/* 2. ПЛИТКА "1" (Світла) */}
      <Group transform={[{ translateX: tileX }, { translateY: tileY }]}>
        <Rect x={0} y={0} width={tileSize} height={tileSize}>
          <Shader source={tileEffect} uniforms={uniforms} />
        </Rect>
        {textLayout && (
          <Text
            x={textLayout.x}
            y={textLayout.y}
            text={label}
            font={dynamicFont} // <--- Використовуємо наш згенерований шрифт
            color={textColor}
          />
        )}
      </Group>

      {/* 3. ПЛИТКА "5" (Об'ємна блакитна) */}
      <Group>
        <Image
          image={image}
          x={W * 0.31}
          y={W * 0.11}
          width={W * 0.647}
          height={W * 0.647}
        />
      </Group>

      {/* 4. ВЕКТОРНИЙ НАПИС FIFTEEN */}
      <Group transform={[{ translateY: -5 }]}>
        <Path path={path} color={textColor} style="fill" />
      </Group>
    </Group>
  );
}
