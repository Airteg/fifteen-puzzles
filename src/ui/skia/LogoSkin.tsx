import {
  Group,
  Image,
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
import tileShaderSource from "./shaders/tile_v2_logo.sksl";

type Frame = {
  x: number;
  y: number;
  width: number;
};
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

export function LogoSkin({ frame, snap, S }: Props) {
  const { x, y, width: W } = frame;
  const image = useImage(require("../../../assets/images/logo5.png")); // Підключаємо зображення логотипу
  const tileSize = (W * 10) / 18;
  const uniforms = useMemo(() => {
    return {
      u_canvasSize: [tileSize, tileSize],
      u_tileSize: [W * 0.5, W * 0.5],
      u_tint: [0.0, 0.0, 0.0, 0.0],
    };
  }, [tileSize, W]);
  const font = useFont(
    require("../../../assets/fonts/Krona_One/KronaOne-Regular.ttf"),
    snap(80 * S),
  );

  const bgRadius = W * 0.06;

  // Координати для Плитки 1
  const tileX = W * 0.072;
  const tileY = W * 0.171;

  const label = "1";
  const textColor = "#216169";
  const textLayout = useMemo(() => {
    if (!font) return null;
    const m = font.measureText(label);
    const x = tileSize / 2 - m.width / 2 + (m.height - font.getSize()) * 0.15;
    const y = tileSize / 2 + m.height / 2 - (m.height - font.getSize()) * 0.05;
    return { x, y };
  }, [label, font, tileSize]);

  if (!tileEffect) return null;
  if (!image) return null;

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
        {font && textLayout && (
          <Text
            x={textLayout.x}
            y={textLayout.y}
            text={"1"}
            font={font}
            color={textColor}
          />
        )}
      </Group>

      {/* 3. ПЛИТКА "5" (Об'ємна блакитна) */}

      <Image
        image={image}
        x={W * 0.31}
        y={W * 0.11}
        width={W * 0.647}
        height={W * 0.647}
      />
    </Group>
  );
}
