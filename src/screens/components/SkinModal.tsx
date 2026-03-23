import { makeBoardMetrics } from "@/ui/game/boardGeometry";
import { GameMetrics } from "@/ui/game/gameMetrics";
import { useGameState } from "@/context/GameStateProvider";
import {
  Circle,
  Group,
  Rect,
  rrect,
  RoundedRect,
  Shadow,
  Shader,
  SkFont,
  Skia,
  rect as skRect,
  Text,
} from "@shopify/react-native-skia";

import React, { useMemo } from "react";
import { Pressable, View } from "react-native";

import boardShaderSource from "../../ui/skia/shaders/board_v1.sksl";
import tileShaderSource from "../../ui/skia/shaders/tile_v2.sksl";

const boardEffect = Skia.RuntimeEffect.Make(boardShaderSource);
const tileEffect = Skia.RuntimeEffect.Make(tileShaderSource);

if (!tileEffect || !boardEffect) {
  console.error("Помилка компіляції шейдерів у SkinModal");
}

export const THEME_PALETTE = {
  tile: [
    "#00d0ff7e",
    "#fbff0099",
    "#27ff047e",
    "#8a2be27e",
    "#ff00ff7e",
    "#ff00007f",
    "#8080807e",
    "#00bfff7e",
    "#0500ff7e",
  ],
  board: ["#ffffff", "#71D4EB", "#ffff00", "#80FF85"],
};

type SceneProps = {
  frame: { x: number; y: number; width: number; height: number };
  S: number;
  snap: (v: number) => number;
  titleFont: SkFont | null;
  boardColor?: string;
  tileColor?: string;
};

// Утиліта для шейдерів
function hexToShader(hex: string): [number, number, number, number] {
  let c = hex.replace("#", "");
  if (c.length === 3)
    c = c
      .split("")
      .map((x) => x + x)
      .join("");
  if (c.length === 6) c += "FF";
  if (c.length === 8) {
    return [
      parseInt(c.substring(0, 2), 16) / 255,
      parseInt(c.substring(2, 4), 16) / 255,
      parseInt(c.substring(4, 6), 16) / 255,
      parseInt(c.substring(6, 8), 16) / 255,
    ];
  }
  return [0, 0, 0, 1];
}

// Спільна геометрія для Scene та Overlay
function useSkinLayout(
  frame: SceneProps["frame"],
  S: number,
  snap: SceneProps["snap"],
) {
  return useMemo(() => {
    const innerInset = snap(16 * S);
    const innerY = snap(60 * S);
    const innerW = frame.width - innerInset * 2;
    const innerH = frame.height - innerY - innerInset;

    // Метрики міні-дошки
    const boardMaxW = innerW - snap(32 * S);
    const scale = boardMaxW / (GameMetrics.board.size * S);
    const miniS = S * scale;

    const boardM = makeBoardMetrics({
      S: miniS,
      snap: Math.round,
      size: GameMetrics.board.size,
      inset: GameMetrics.board.inset,
      tile: GameMetrics.board.tile,
      gap: GameMetrics.board.gap,
    });

    const boardX = innerInset + (innerW - boardM.boardSize) / 2;
    const boardY = innerY + snap(16 * S);

    // Метрики палітри
    const paletteY = boardY + boardM.boardSize + snap(24 * S);
    const circleR = snap(10 * S);
    const circleGap = snap(8 * S);

    // Координати для TILE кружечків
    const tileRowY = paletteY + snap(24 * S);
    const tileCircles = THEME_PALETTE.tile.map((color, i) => ({
      color,
      cx: boardX + circleR + i * (circleR * 2 + circleGap),
      cy: tileRowY,
    }));

    // Координати для BOARD кружечків
    const boardRowY = tileRowY + snap(40 * S);
    const boardCircles = THEME_PALETTE.board.map((color, i) => ({
      color,
      cx: boardX + circleR + i * (circleR * 2 + circleGap),
      cy: boardRowY,
    }));

    return {
      innerInset,
      innerY,
      innerW,
      innerH,
      boardM,
      miniS,
      boardX,
      boardY,
      paletteY,
      circleR,
      tileCircles,
      boardCircles,
      tileRowY,
      boardRowY,
    };
  }, [frame.width, frame.height, S, snap]);
}

// 1. Skia Візуальна частина
export function SkinModalScene({
  frame,
  S,
  snap,
  titleFont,
  boardColor,
  tileColor,
}: SceneProps) {
  const layout = useSkinLayout(frame, S, snap);
  if (!titleFont) return null;

  const {
    innerInset,
    innerY,
    innerW,
    innerH,
    boardM,
    miniS,
    boardX,
    boardY,
    paletteY,
    circleR,
    tileCircles,
    boardCircles,
    tileRowY,
    boardRowY,
  } = layout;

  const titleY = snap(42 * S);
  const titleText = "SKIN";
  const titleX = (frame.width - titleFont.measureText(titleText).width) / 2;

  const clipPathInner = rrect(
    skRect(innerInset, innerY, innerW, innerH),
    snap(8 * S),
    snap(8 * S),
  );

  const BOARD_SHADOW = snap(8 * miniS);
  const boardCanvasSize = boardM.boardSize + BOARD_SHADOW * 2;
  const boardUniforms = {
    u_canvasSize: [boardCanvasSize, boardCanvasSize],
    u_boardSize: [boardM.boardSize, boardM.boardSize],
    u_tint: hexToShader(boardColor || "#133D44"),
  };

  const TILE_SHADOW = snap(4 * miniS);
  const tileCanvasSize = boardM.tile + TILE_SHADOW * 2;
  const tileUniforms = {
    u_canvasSize: [tileCanvasSize, tileCanvasSize],
    u_tileSize: [boardM.tile, boardM.tile],
    u_tint: hexToShader(tileColor || "#71D4EB"),
  };

  const tilesPreview = Array.from({ length: 15 }, (_, i) => i + 1);

  return (
    <Group transform={[{ translateX: frame.x }, { translateY: frame.y }]}>
      <Text
        x={titleX}
        y={titleY}
        text={titleText}
        font={titleFont}
        color="#488B8F"
      />

      <Group clip={clipPathInner}>
        <RoundedRect
          x={innerInset}
          y={innerY}
          width={innerW}
          height={innerH}
          r={snap(8 * S)}
          color="#E1F5FE"
        >
          <Shadow inner dx={0} dy={4} blur={8} color="rgba(0,0,0,0.15)" />
        </RoundedRect>
      </Group>

      {/* ДОШКА */}
      <Group transform={[{ translateX: boardX }, { translateY: boardY }]}>
        <Group
          transform={[
            { translateX: -BOARD_SHADOW },
            { translateY: -BOARD_SHADOW },
          ]}
        >
          <Rect x={0} y={0} width={boardCanvasSize} height={boardCanvasSize}>
            {boardEffect && (
              <Shader source={boardEffect} uniforms={boardUniforms} />
            )}
          </Rect>
        </Group>

        {tilesPreview.map((id, index) => {
          const row = Math.floor(index / 4);
          const col = index % 4;
          const x = boardM.inset + col * boardM.step;
          const y = boardM.inset + row * boardM.step;
          const textStr = String(id);
          const tw = titleFont.measureText(textStr).width;
          const textX = (boardM.tile - tw) / 2;
          const textY = boardM.tile / 2 + titleFont.getSize() / 2.8;

          return (
            <Group key={id} transform={[{ translateX: x }, { translateY: y }]}>
              <Group
                transform={[
                  { translateX: -TILE_SHADOW },
                  { translateY: -TILE_SHADOW },
                ]}
              >
                <Rect
                  x={0}
                  y={0}
                  width={tileCanvasSize}
                  height={tileCanvasSize}
                >
                  {tileEffect && (
                    <Shader source={tileEffect} uniforms={tileUniforms} />
                  )}
                </Rect>
              </Group>
              <Text
                x={textX}
                y={textY}
                text={textStr}
                font={titleFont}
                color="#000"
              />
            </Group>
          );
        })}
      </Group>

      {/* ПАЛІТРА */}
      <Text
        x={boardX}
        y={paletteY}
        text="TILE"
        font={titleFont}
        color="#488B8F"
      />
      {tileCircles.map((c, i) => (
        <Group key={`tile-${i}`}>
          <Circle cx={c.cx} cy={c.cy} r={circleR} color={c.color}>
            <Shadow inner dx={0} dy={2} blur={4} color="rgba(0,0,0,0.3)" />
          </Circle>
          {/* Обводка для вибраного кольору */}
          {tileColor === c.color && (
            <Circle
              cx={c.cx}
              cy={c.cy}
              r={circleR + 2}
              color="#488B8F"
              style="stroke"
              strokeWidth={2}
            />
          )}
        </Group>
      ))}

      <Text
        x={boardX}
        y={tileRowY + snap(20 * S)}
        text="BOARD"
        font={titleFont}
        color="#488B8F"
      />
      {boardCircles.map((c, i) => (
        <Group key={`board-${i}`}>
          <Circle cx={c.cx} cy={c.cy} r={circleR} color={c.color}>
            <Shadow inner dx={0} dy={2} blur={4} color="rgba(0,0,0,0.3)" />
          </Circle>
          {/* Обводка для вибраного кольору */}
          {boardColor === c.color && (
            <Circle
              cx={c.cx}
              cy={c.cy}
              r={circleR + 2}
              color="#488B8F"
              style="stroke"
              strokeWidth={2}
            />
          )}
        </Group>
      ))}
    </Group>
  );
}

// 2. React Native Оверлей
export function SkinModalOverlay({ frame, S, snap }: SceneProps) {
  const layout = useSkinLayout(frame, S, snap);
  const { theme, updateTheme } = useGameState(); // Беремо функцію збереження!

  return (
    <View
      style={{
        position: "absolute",
        left: frame.x,
        top: frame.y,
        width: frame.width,
        height: frame.height,
      }}
    >
      {/* Кнопки вибору кольору плиток */}
      {layout.tileCircles.map((c, i) => (
        <Pressable
          key={`btn-tile-${i}`}
          style={{
            position: "absolute",
            left: c.cx - layout.circleR,
            top: c.cy - layout.circleR,
            width: layout.circleR * 2,
            height: layout.circleR * 2,
          }}
          onPress={() => updateTheme({ tileColor: c.color })}
        />
      ))}

      {/* Кнопки вибору кольору дошки */}
      {layout.boardCircles.map((c, i) => (
        <Pressable
          key={`btn-board-${i}`}
          style={{
            position: "absolute",
            left: c.cx - layout.circleR,
            top: c.cy - layout.circleR,
            width: layout.circleR * 2,
            height: layout.circleR * 2,
          }}
          onPress={() => updateTheme({ boardColor: c.color })}
        />
      ))}
    </View>
  );
}
