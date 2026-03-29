import {
  Blur,
  Group,
  Path,
  Rect,
  Shader,
  Skia,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import buttonSksl from "./shaders/button.sksl";

const buttonEffect = Skia.RuntimeEffect.Make(buttonSksl)!;

const SOUND_ON_PATH =
  "M0 19.5V9H6.5L15 0V28L6.5 19.5H0ZM21 3c4 8.9 4 13.7 0 22M30 6c2.6 6.5 2.7 10 0 16";
const SOUND_OFF_PATH =
  "M.5 20V9.5H7l8.5-9v28L7 20H.5ZM22.4 5.8c-.1-.3-.4-.4-.6-.2-.3.1-.4.4-.2.6l4.2 8.5-4.2 8.1c-.2.2-.1.5.2.6.2.2.5.1.6-.2l4-7.4 3.7 7.4c.1.3.4.4.6.2.3-.1.4-.4.2-.6l-4-8.1 4.5-8.5c-.2-.2.1-.5-.2-.6-.2-.2-.5-.1-.6.2l-4.2 7.9-4-7.9Z";

type Frame = { x: number; y: number; width: number };

type Props = {
  frame: Frame;
  type: "home" | "restart" | "soundOn" | "soundOff";
  active: boolean;
};

const SHADOW_BLUR = 11;

export function SkiaButtonSound({ frame, type, active }: Props) {
  const path = type === "soundOn" ? SOUND_ON_PATH : SOUND_OFF_PATH;
  const canvasW = frame.width + SHADOW_BLUR * 2;
  const canvasH = frame.width + SHADOW_BLUR * 2;

  const uniforms = useMemo(() => {
    return {
      canvasSize: [canvasW, canvasH],
      buttonSize: [frame.width, frame.width],
      radius: 8.0,
      isPressed: active ? 1.0 : 0.0,
    };
  }, [canvasW, canvasH, frame.width, active]);

  const pathIcon = useMemo(() => {
    const p = Skia.Path.MakeFromSVGString(path);
    if (!p) return null;

    const bounds = p.computeTightBounds();

    // Підбираємо масштаб. 0.45 означає, що іконка займатиме 45% ширини кнопки
    const scale = (frame.width * 0.45) / bounds.width;

    const m = Skia.Matrix();
    // Зміщуємо в центр rect
    m.translate(
      frame.x + (frame.width - bounds.width * scale) / 2 - bounds.x * scale,
      frame.y + (frame.width - bounds.height * scale) / 2 - bounds.y * scale,
    );
    // Масштабуємо
    m.scale(scale, scale);

    p.transform(m);
    return p;
  }, [frame.x, frame.y, frame.width, path]);

  // ВИПРАВЛЕНО: Перевіряємо саме pathIcon, щоб TypeScript знав, що він не null
  if (!buttonEffect || !pathIcon) return null;

  return (
    <Group>
      {/* Підкладка (Шейдер) */}
      <Group
        transform={[
          { translateX: frame.x - SHADOW_BLUR },
          { translateY: frame.y - SHADOW_BLUR },
        ]}
      >
        <Rect x={0} y={0} width={canvasW} height={canvasH}>
          <Shader source={buttonEffect} uniforms={uniforms} />
        </Rect>
      </Group>

      {/* Сама іконка */}
      <Group>
        <Path
          path={pathIcon}
          color={"#216169"}
          style="stroke"
          strokeWidth={2}
        />

        {/* ВИПРАВЛЕНО: Внутрішня тінь тепер використовує pathIcon для правильних координат та кліпу */}
        <Group clip={pathIcon}>
          {/* Обгортаємо в Group для зсуву тіні по Y */}
          <Group transform={[{ translateY: 4 }]}>
            <Path
              path={pathIcon}
              color="#00000042"
              // style="fill"
              style="stroke"
              strokeWidth={0.5}
            >
              <Blur blur={4} mode="decal" />
            </Path>
          </Group>
        </Group>
      </Group>
    </Group>
  );
}
