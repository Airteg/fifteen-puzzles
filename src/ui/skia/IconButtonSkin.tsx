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

type Frame = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Props = {
  frame: Frame;
  type: "home" | "restart";
  label: string;
  font: SkFont;
};

const HOME_ART = {
  pathW: 30,
  pathH: 26,
  pathOffsetY: 1, // HOME_PATH починається з y=1
  iconScaleK: 0.5, // ширина іконки = 50% від ButtonTileSize
};

const RESTART_ART = {
  pathW: 36,
  pathH: 24,
  pathOffsetY: 0,
  iconScaleK: 0.58, // трохи ширша візуально
};

export function IconButtonSkin({ frame, type, label, font }: Props) {
  const ButtonBaseW = frame.width;
  const ButtonBaseH = Math.round(frame.width / 0.808);

  const ButtonTileSize = 0.75 * ButtonBaseW;
  const ButtonTileSizeWithShadow = ButtonTileSize + ButtonTileSize * 0.1;

  const x0 = frame.x;
  const y0 = frame.y;

  const tileX0 = (ButtonBaseW - ButtonTileSizeWithShadow) / 2;
  const tileY0 = tileX0;

  const r = 0.05 * ButtonBaseW;

  const uniforms = useMemo(() => {
    return {
      u_canvasSize: [ButtonTileSizeWithShadow, ButtonTileSizeWithShadow],
      u_tileSize: [ButtonTileSize, ButtonTileSize],
      u_tint: [0.0, 0.0, 0.0, 0.0],
    };
  }, [ButtonTileSize, ButtonTileSizeWithShadow]);

  // Реальна квадратна face-зона всередині canvas із тінню
  const shadowInset = (ButtonTileSizeWithShadow - ButtonTileSize) / 2;
  const tileInnerX = tileX0 + shadowInset;
  const tileInnerY = tileY0 + shadowInset;

  const labelY0 = ButtonBaseW;
  const labelH = ButtonBaseH - ButtonBaseW;

  const path = useMemo(() => {
    const svgStr = type === "home" ? HOME_PATH : RESTART_PATH;
    const p = Skia.Path.MakeFromSVGString(svgStr);
    if (!p) return null;

    const art = type === "home" ? HOME_ART : RESTART_ART;
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
    const m = font.measureText(label);
    return {
      x: (ButtonBaseW - m.width) / 2,
      y: labelY0 + labelH / 2 + font.getSize() * 0.35,
    };
  }, [label, font, ButtonBaseW, labelY0, labelH]);

  return (
    <Group transform={[{ translateX: x0 }, { translateY: y0 }]}>
      {/* Загальний корпус кнопки */}
      <RoundedRect
        x={0}
        y={0}
        width={ButtonBaseW}
        height={ButtonBaseH}
        color="#71D4EB"
        r={r}
      />

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

      {/* Іконка */}
      {path && type === "home" && (
        <Path path={path} color="#000000" style="fill" />
      )}

      {path && type === "restart" && (
        <Path
          path={path}
          color="#000000"
          style="stroke"
          strokeWidth={0.03125 * ButtonBaseW} // 2.5 при width=80
          strokeCap="round"
          strokeJoin="round"
        />
      )}

      {/* Підпис */}
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
