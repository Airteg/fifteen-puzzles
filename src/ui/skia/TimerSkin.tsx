import {
  Group,
  Rect,
  Shader,
  Skia,
  Text,
  type SkFont,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";

import type { SceneFrame } from "../game/useGameSceneMetrics";
import timerShaderSource from "./shaders/timer.sksl";

const timerEffect = Skia.RuntimeEffect.Make(timerShaderSource);

if (!timerEffect) {
  console.error("Помилка компіляції шейдера timer.sksl");
}

type Props = {
  frame: SceneFrame;
  timeText: string;
  font: SkFont;
  bgColor: [number, number, number, number];
  S: number;
  snap: (v: number) => number;
};

export function TimerSkin({ frame, timeText, font, bgColor, S, snap }: Props) {
  const { x, y, width, height } = frame;

  const SHADOW_MARGIN = snap(16 * S);

  const canvasW = width + SHADOW_MARGIN * 2;
  const canvasH = height + SHADOW_MARGIN * 2;

  const radius = snap(8 * S);

  const uniforms = useMemo(() => {
    return {
      canvasSize: [canvasW, canvasH],
      buttonSize: [width, height],
      radius: radius,
      isPressed: 0.0,
      u_bgColor: bgColor,
    };
  }, [canvasW, canvasH, width, height, radius, bgColor]);

  const textLayout = useMemo(() => {
    const m = font.measureText(timeText);

    const tx = width / 2 - m.width / 2;
    const ty = height / 2 + m.height / 2 - (m.height - font.getSize()) * 0.15;

    return { x: tx, y: ty };
  }, [timeText, font, width, height]);

  if (!timerEffect) return null;

  return (
    <Group transform={[{ translateX: x }, { translateY: y }]}>
      <Group
        transform={[
          { translateX: -SHADOW_MARGIN },
          { translateY: -SHADOW_MARGIN },
        ]}
      >
        <Rect x={0} y={0} width={canvasW} height={canvasH}>
          <Shader source={timerEffect} uniforms={uniforms} />
        </Rect>
      </Group>

      <Text
        x={textLayout.x}
        y={textLayout.y}
        text={timeText}
        font={font}
        color="#FFFFFF"
      />
    </Group>
  );
}
