import { Rect, Shader, Skia } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import tileShaderSource from "./shaders/frame_v2.sksl";

const frameEffect = Skia.RuntimeEffect.Make(tileShaderSource);

if (!frameEffect) {
  console.error("Помилка компіляції шейдера tile_v2.sksl");
}

export interface FrameProps {
  width: number;
  height: number;
  cornerRadius: number;
  borderThickness: number;
  borderColor: [number, number, number, number];
  bgColor: [number, number, number, number];
  shadowPadding?: number;
}

export const Frame: React.FC<FrameProps> = ({
  width,
  height,
  cornerRadius,
  borderThickness,
  borderColor,
  bgColor,
  shadowPadding = 20,
}) => {
  const rectWidth = width + shadowPadding * 2;
  const rectHeight = height + shadowPadding * 2;

  const uniforms = useMemo(() => {
    return {
      u_rectSize: [rectWidth, rectHeight],
      u_figureSize: [width, height],
      u_cornerRadius: cornerRadius,
      u_borderThickness: borderThickness,
      u_borderColor: borderColor,
      u_bgColor: bgColor,
    };
  }, [
    rectWidth,
    rectHeight,
    width,
    height,
    cornerRadius,
    borderThickness,
    borderColor,
    bgColor,
  ]);

  if (!frameEffect) return null;

  return (
    <Rect x={0} y={0} width={rectWidth} height={rectHeight}>
      <Shader source={frameEffect} uniforms={uniforms} />
    </Rect>
  );
};
