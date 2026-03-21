import React, { useMemo } from "react";
import { View } from "react-native";
import {
  Group,
  RoundedRect,
  Text,
  Shadow,
  rrect,
  rect as skRect,
  Skia,
  Shader,
  type SkFont,
} from "@shopify/react-native-skia";
import tileShaderSource from "@/ui/skia/shaders/tile_v2.sksl";

const tileEffect = Skia.RuntimeEffect.Make(tileShaderSource);

// Твій словник кольорів (поки лежить тут, потім використаємо для кнопок вибору)
export const THEME_PALETTE = {
  tile: {
    darkTurquoise: "#00d0ff7e",
    yellow: "#fbff0099",
    green: "#27ff047e",
    violet: "#00d0ff7e", // TODO: замінити hex
    fuchsia: "#ff00ff7e",
    red: "#ff00007f",
    grey: "#00d0ff7e", // TODO: замінити hex
    deepSkyBlue: "#00bfff7e",
    blue: "#0500ff7e",
  },
  board: { white: "#fff", blue: "#71D4EB", yellow: "#ff0", green: "#80FF85" },
};

type SceneProps = {
  frame: { x: number; y: number; width: number; height: number };
  S: number;
  snap: (v: number) => number;
  titleFont: SkFont | null;
  boardColor: string;
  tileColor: string;
};

// 1. Skia Візуальна частина
export function SkinModalScene({
  frame,
  S,
  snap,
  titleFont,
  boardColor,
  tileColor,
}: SceneProps) {
  const titleY = snap(42 * S);

  const innerInset = snap(16 * S);
  const innerY = snap(60 * S);
  const innerW = frame.width - innerInset * 2;
  const innerH = frame.height - innerY - innerInset;
  const innerR = snap(8 * S);

  const titleText = "SKIN";
  const titleX = titleFont
    ? (frame.width - titleFont.measureText(titleText).width) / 2
    : 0;

  const clipPath = useMemo(
    () => rrect(skRect(innerInset, innerY, innerW, innerH), innerR, innerR),
    [innerInset, innerY, innerW, innerH, innerR],
  );

  // --- Метрики міні-дошки (Прев'ю) ---
  const boardSize = innerW - snap(32 * S); // Відступи по 16 з обох боків
  const boardX = innerInset + snap(16 * S);
  const boardY = innerY + snap(16 * S);
  const boardR = snap(8 * S);

  const gap = snap(4 * S);
  const tileSize = (boardSize - gap * 5) / 4;
  const tileR = snap(4 * S);

  const uniforms = useMemo(() => {
    return {
      u_canvasSize: [tileSize, tileSize],
      u_tileSize: [tileSize, tileSize],
      u_tint: [0.0, 0.0, 0.0, 0.0],
    };
  }, [tileSize]);

  // Масив плиток 1..15 для малювання виграшної позиції
  const previewTiles = useMemo(
    () => Array.from({ length: 15 }, (_, i) => i + 1),
    [],
  );

  return (
    <Group transform={[{ translateX: frame.x }, { translateY: frame.y }]}>
      {/* Заголовок */}
      {titleFont && (
        <Text
          x={titleX}
          y={titleY}
          text={titleText}
          font={titleFont}
          color="#488B8F"
        />
      )}

      {/* Внутрішнє заглиблення */}
      <Group clip={clipPath}>
        <RoundedRect
          x={innerInset}
          y={innerY}
          width={innerW}
          height={innerH}
          r={innerR}
          color="#E1F5FE"
        >
          <Shadow inner dx={0} dy={4} blur={8} color="rgba(0,0,0,0.15)" />
        </RoundedRect>
      </Group>

      {/* МАЛЮЄМО ДОШКУ */}
      <Group transform={[{ translateX: boardX }, { translateY: boardY }]}>
        {/* Фон дошки */}
        <RoundedRect
          x={0}
          y={0}
          width={boardSize}
          height={boardSize}
          r={boardR}
          color={boardColor}
        >
          <Shadow inner dx={0} dy={4} blur={4} color="rgba(0,0,0,0.4)" />
        </RoundedRect>

        {/* Плитки */}
        {previewTiles.map((id, index) => {
          const row = Math.floor(index / 4);
          const col = index % 4;
          const x = gap + col * (tileSize + gap);
          const y = gap + row * (tileSize + gap);

          const textStr = String(id);
          const tw = titleFont ? titleFont.measureText(textStr).width : 0;
          const tx = x + (tileSize - tw) / 2;
          // Центруємо текст по вертикалі з поправкою на базову лінію шрифту
          const ty =
            y + tileSize / 2 + (titleFont ? titleFont.getSize() / 2.8 : 0);

          return (
            <Group key={id}>
              {/* Кольорова підложка */}
              <RoundedRect
                x={x}
                y={y}
                width={tileSize}
                height={tileSize}
                r={tileR}
                color={tileColor}
              />

              {/* Наш об'ємний шейдер */}
              <Group transform={[{ translateX: x }, { translateY: y }]}>
                <RoundedRect
                  x={0}
                  y={0}
                  width={tileSize}
                  height={tileSize}
                  r={tileR}
                >
                  {tileEffect && (
                    <Shader source={tileEffect} uniforms={uniforms} />
                  )}
                </RoundedRect>
              </Group>

              {/* Текст */}
              {titleFont && (
                <Text
                  x={tx}
                  y={ty}
                  text={textStr}
                  font={titleFont}
                  color="#000"
                />
              )}
            </Group>
          );
        })}
      </Group>
    </Group>
  );
}

// 2. React Native Оверлей (поки що порожній, пізніше тут будуть кнопки вибору кольору)
export function SkinModalOverlay({ frame }: { frame: any }) {
  return (
    <View
      style={{
        position: "absolute",
        left: frame.x,
        top: frame.y,
        width: frame.width,
        height: frame.height,
      }}
    />
  );
}
