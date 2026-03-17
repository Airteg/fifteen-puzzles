import {
  Group,
  Image,
  Path,
  Rect,
  RoundedRect,
  Shader,
  Shadow,
  Skia,
  type SkImage,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import tileShaderSource from "./shaders/tile_v2_logo.sksl";

type Frame = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Props = {
  frame: Frame;
  fiveImage: SkImage;
};

const tileEffect = Skia.RuntimeEffect.Make(tileShaderSource);

if (!tileEffect) {
  console.error("Помилка компіляції шейдера tile_v2_logo.sksl");
}

/**
 * КАНОНІЧНИЙ DESIGN SPACE ЛОГОТИПУ
 */
const DESIGN_W = 180;
const DESIGN_H = 180;

/**
 * Базова жовта підкладка
 */
const BG_R = DESIGN_W * 0.06;

/**
 * Світла плитка "1"
 * Тут залишені ті самі пропорції, що були у твоїй першій версії.
 */
const TILE_X = DESIGN_W * 0;
const TILE_Y = DESIGN_W * 0.1;
const TILE_SIZE = (DESIGN_W * 12) / 18; // 100
const TILE_SHADER_INNER = DESIGN_W * 0.5; // 90

/**
 * Блакитна плитка "5"
 */
const FIVE_X = DESIGN_W * 0.3;
const FIVE_Y = DESIGN_W * 0.11;
const FIVE_SIZE = DESIGN_W * 0.647;

/**
 * COLORS
 */
const YELLOW_BG = "#FAFF3F";
const DARK_TEXT = "#216169";
const STROKE = "#000000";

/**
 * PATH-и повинні бути ПІДГОТОВЛЕНІ ВЖЕ В DESIGN SPACE.
 * ТОДІ на runtime ми не масштабуємо їх окремо.
 */

// "1".
const ONE_PATH_DESIGN =
  "M1.2 30.1v6.5H24.9V30.1H17V0c-1.4 0-2.9.1-4.3.2-1.5.2-2.9.4-4.4.8-1.4.4-2.8.8-4.2 1.4C2.7 3 1.3 3.7 0 4.5L3.7 9.8c.8-.6 1.7-1.1 2.7-1.5 1-.4 2.1-.7 3.2-1V30.1H1.2Z";

// "fifteen".
const FIFTEEN_PATH_DESIGN =
  "M0 0H18.1V3.6H4.1V8.9H16V12.3H4.1V20.2H0V0ZM21.6 0H25.7V20.2H21.6V0ZM30.9 0H49V3.6H35V8.9H46.9V12.3H35V20.2H30.9V0ZM59.1 3.6H51.6V0H70.7V3.6H63.2V20.2H59.1V3.6ZM75.1 0H92.3V3.6H79.2V7.6H90.8V11H79.2V16.6H92.6V20.2H75.1V0ZM97.1 0H114.4V3.6H101.2V7.6H112.9V11H101.2V16.6H114.6V20.2H97.1V0ZM119.2 0H123.3L135.9 6.6V0H140V20.2H135.9V10.9L123.3 4.4V20.2H119.2V0Z";

const onePath = {
  path: Skia.Path.MakeFromSVGString(ONE_PATH_DESIGN),
  w: 24.9,
  h: 36.6,
};
const fifteenPath = {
  path: Skia.Path.MakeFromSVGString(FIFTEEN_PATH_DESIGN),
  w: 140,
  h: 20.2,
};

export function LogoSkin({ frame, fiveImage }: Props) {
  const { x, y, width, height } = frame;

  /**
   * Uniform scale для ВСЬОГО логотипу.
   * Беремо мінімум, щоб не ламати пропорції.
   */
  const k = Math.min(width / DESIGN_W, height / DESIGN_H);

  const renderW = DESIGN_W * k;
  const renderH = DESIGN_H * k;

  /**
   * Центруємо логотип усередині frame.
   */
  const offsetX = (width - renderW) / 2;
  const offsetY = (height - renderH) / 2;

  const uniforms = useMemo(() => {
    return {
      u_canvasSize: [TILE_SIZE, TILE_SIZE],
      u_tileSize: [TILE_SHADER_INNER, TILE_SHADER_INNER],
      u_tint: [0.0, 0.0, 0.0, 0.0],
    };
  }, []);

  if (!tileEffect || !onePath.path || !fifteenPath.path) {
    return null;
  }

  return (
    <Group
      transform={[{ translateX: x + offsetX }, { translateY: y + offsetY }]}
    >
      <Group transform={[{ scale: k }]}>
        {/* 1. Жовта база */}
        <RoundedRect
          x={0}
          y={0}
          width={DESIGN_W}
          height={DESIGN_H}
          r={BG_R}
          color={YELLOW_BG}
        >
          <Shadow dx={0} dy={0} blur={8} color="rgba(0, 0, 0, 0.644)" />
          <Shadow inner dx={0} dy={0} blur={8} color="rgba(0, 0, 0, 0.6)" />
        </RoundedRect>

        <RoundedRect
          x={0}
          y={0}
          width={DESIGN_W}
          height={DESIGN_H}
          r={BG_R}
          style="stroke"
          color={STROKE}
          strokeWidth={1}
        />

        {/* 2. Світла плитка "1" */}
        <Group transform={[{ translateX: TILE_X }, { translateY: TILE_Y }]}>
          {/* <DesignBorder /> */}
          <Rect x={0} y={0} width={TILE_SIZE} height={TILE_SIZE}>
            <Shader source={tileEffect} uniforms={uniforms} />
          </Rect>
          <Group
            transform={[
              { translateX: (TILE_SIZE - onePath.w) / 2 },
              { translateY: (TILE_SIZE - onePath.h) / 2 },
            ]}
          >
            <Path path={onePath.path} color={DARK_TEXT} style="fill" />
          </Group>
        </Group>

        {/* 3. Блакитна плитка "5" */}
        <Image
          image={fiveImage}
          x={FIVE_X}
          y={FIVE_Y}
          width={FIVE_SIZE}
          height={FIVE_SIZE}
        />

        {/* 4. Напис FIFTEEN */}
        <Group
          transform={[
            { translateX: (DESIGN_W - fifteenPath.w) / 2 },
            { translateY: DESIGN_W - fifteenPath.h - 18 },
          ]}
        >
          <Path path={fifteenPath.path} color={DARK_TEXT} style="fill" />
        </Group>
      </Group>
    </Group>
  );
}

// const DesignBorder = () => {
//   return (
//     <Rect
//       x={0}
//       y={0}
//       width={TILE_SIZE}
//       height={TILE_SIZE}
//       style={"stroke"}
//       color={"STROKE"}
//       strokeWidth={1}
//     />
//   );
// };
