// src/ui/skia/IconButtonSkin.tsx
import {
  Group,
  Path,
  Rect,
  RoundedRect,
  Shader,
  Skia,
  Text,
  type SkFont,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import tileShaderSource from "./shaders/tile_v2.sksl";

const tileEffect = Skia.RuntimeEffect.Make(tileShaderSource);

const HOME_PATH =
  "M19 25h6V11.1L15 3.3 5 11.1V25h6V17c0-.5.2-1 .6-1.4s.9-.6 1.4-.6h4c.5 0 1 .2 1.4.6.4.4.6.9.6 1.4v8Zm-2 0V17H13v8h4ZM15.6 1.2 30 12.4 28.8 14 27 12.6V25c0 .5-.2 1-.6 1.4-.4.4-.9.6-1.4.6H5c-.5 0-1-.2-1.4-.6C3.2 26 3 25.5 3 25V12.6L1.2 14 0 12.4 14.4 1.2c.1-.1.4-.2.6-.2s.4.1.6.2Z";
const RESTART_PATH =
  "M21.9 7.8 17.8 4m0 0 4.1-3.7M17.8 4h14c2.2 0 4 1.8 4 4v8.3c0 2.2-1.8 4-4 4H23M12.8 4H4C1.8 4 0 5.8 0 8v8.3c0 2.2 1.8 4 4 4H18M13.9 24 18 20.3m0 0-4.1-3.8";
const SOUND_ON_PATH =
  "M0 19.5V9H6.5L15 0V28L6.5 19.5H0ZM21 3c4 8.9 4 13.7 0 22M30 6c2.6 6.5 2.7 10 0 16";
const SOUND_OFF_PATH =
  "M.5 20V9.5H7l8.5-9v28L7 20H.5ZM22.4 5.8c-.1-.3-.4-.4-.6-.2-.3.1-.4.4-.2.6l4.2 8.5-4.2 8.1c-.2.2-.1.5.2.6.2.2.5.1.6-.2l4-7.4 3.7 7.4c.1.3.4.4.6.2.3-.1.4-.4.2-.6l-4-8.1 4.5-8.5c.2-.2.1-.5-.2-.6-.2-.2-.5-.1-.6.2l-4.2 7.9-4-7.9Z";

type Frame = { x: number; y: number; width: number };

type Props = {
  frame: Frame;
  type: "home" | "restart" | "soundOn" | "soundOff";
  label?: string; // Тепер необов'язковий
  font?: SkFont; // Тепер необов'язковий
  active?: boolean; // Для керування станом (кольором) іконки
};

const ICONS_ART = {
  home: { pathW: 30, pathH: 26, pathOffsetY: 1, iconScaleK: 0.5 },
  restart: { pathW: 36, pathH: 24, pathOffsetY: 0, iconScaleK: 0.58 },
  soundOn: { pathW: 34, pathH: 28, pathOffsetY: 0, iconScaleK: 0.55 },
  soundOff: { pathW: 34, pathH: 28, pathOffsetY: 0, iconScaleK: 0.55 },
};

export function IconButtonSkin({ frame, type, label, font, active }: Props) {
  const isSquare = !label; // Якщо немає тексту — робимо ідеальний квадрат
  const ButtonBaseW = frame.width;
  const ButtonBaseH = isSquare ? frame.width : Math.round(frame.width / 0.808);

  const ButtonTileSize = isSquare ? 0.85 * ButtonBaseW : 0.75 * ButtonBaseW;
  const ButtonTileSizeWithShadow = ButtonTileSize + ButtonTileSize * 0.1;

  const x0 = frame.x;
  const y0 = frame.y;

  const tileX0 = (ButtonBaseW - ButtonTileSizeWithShadow) / 2;
  const tileY0 = isSquare
    ? (ButtonBaseH - ButtonTileSizeWithShadow) / 2
    : tileX0;

  const r = isSquare ? 0.1 * ButtonBaseW : 0.05 * ButtonBaseW;

  const uniforms = useMemo(() => {
    return {
      u_canvasSize: [ButtonTileSizeWithShadow, ButtonTileSizeWithShadow],
      u_tileSize: [ButtonTileSize, ButtonTileSize],
      u_tint: [0.0, 0.0, 0.0, 0.0],
    };
  }, [ButtonTileSize, ButtonTileSizeWithShadow]);

  const shadowInset = (ButtonTileSizeWithShadow - ButtonTileSize) / 2;
  const tileInnerX = tileX0 + shadowInset;
  const tileInnerY = tileY0 + shadowInset;

  const path = useMemo(() => {
    let svgStr = HOME_PATH;
    if (type === "restart") svgStr = RESTART_PATH;
    if (type === "soundOn") svgStr = SOUND_ON_PATH;
    if (type === "soundOff") svgStr = SOUND_OFF_PATH;

    const p = Skia.Path.MakeFromSVGString(svgStr);
    if (!p) return null;

    const art = ICONS_ART[type];
    const iconW = art.iconScaleK * ButtonTileSize;
    const scale = iconW / art.pathW;
    const iconH = art.pathH * scale;

    const tx = tileInnerX + (ButtonTileSize - iconW) / 2;
    const ty =
      tileInnerY + (ButtonTileSize - iconH) / 2 - art.pathOffsetY * scale;

    const matrix = Skia.Matrix();
    matrix.translate(tx, ty);
    matrix.scale(scale, scale);
    p.transform(matrix);
    return p;
  }, [type, ButtonTileSize, tileInnerX, tileInnerY]);

  const textLayout = useMemo(() => {
    if (!label || !font) return null;
    const m = font.measureText(label);
    return {
      x: (ButtonBaseW - m.width) / 2,
      y: ButtonBaseH - ButtonBaseW * 0.125,
    };
  }, [label, font, ButtonBaseW, ButtonBaseH]);

  return (
    <Group transform={[{ translateX: x0 }, { translateY: y0 }]}>
      {/* Нижня кольорова база малюється тільки якщо це прямокутна кнопка з текстом */}
      {!isSquare && (
        <RoundedRect
          x={0}
          y={0}
          width={ButtonBaseW}
          height={ButtonBaseH}
          color="#71D4EB"
          r={r}
        />
      )}

      {/* Верхня tile-зона */}
      <Group transform={[{ translateX: tileX0 }, { translateY: tileY0 }]}>
        <Rect
          x={0}
          y={0}
          width={ButtonTileSizeWithShadow}
          height={ButtonTileSizeWithShadow}
        >
          {tileEffect && <Shader source={tileEffect} uniforms={uniforms} />}
        </Rect>
      </Group>

      {/* Іконки */}
      {path && type === "home" && (
        <Path path={path} color="#000000" style="fill" />
      )}
      {path && type === "restart" && (
        <Path
          path={path}
          color="#000000"
          style="stroke"
          strokeWidth={0.025 * ButtonBaseW}
          strokeCap="round"
          strokeJoin="round"
        />
      )}

      {/* Наші нові Sound іконки */}
      {path && (type === "soundOn" || type === "soundOff") && (
        <>
          {/* Кольорова заливка (Жовта, якщо активно) */}
          <Path
            path={path}
            color={active ? "#FAFF3F" : "#7A9E9F"}
            style="fill"
          />
          {/* Темна обводка */}
          <Path
            path={path}
            color="#216169"
            style="stroke"
            strokeWidth={1}
            strokeCap="round"
            strokeJoin="round"
          />
        </>
      )}

      {textLayout && label && font && (
        <Text
          x={textLayout.x}
          y={textLayout.y}
          text={label}
          font={font}
          color="#000000"
        />
      )}
    </Group>
  );
}
