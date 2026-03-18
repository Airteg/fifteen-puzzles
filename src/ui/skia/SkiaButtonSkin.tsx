import type { SkFont } from "@shopify/react-native-skia";
import {
  Blur,
  Group,
  Rect,
  Shader,
  Skia,
  Text,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { Rect as UIRect } from "../pixel";

// Імпортуємо наш нативний шейдер!
import buttonSksl from "./shaders/button.sksl";

const buttonEffect = Skia.RuntimeEffect.Make(buttonSksl)!;

type Props = {
  rect: UIRect;
  title: string;
  font: SkFont;
  pressed?: boolean;
};

export function SkiaButtonSkin({ rect, title, font, pressed = false }: Props) {
  // console.log(
  //   "🚀 ~ rect:\n" +
  //     JSON.stringify(
  //       rect,
  //       (k, v) => (typeof v === "number" ? Number(v.toFixed(1)) : v),
  //       2,
  //     ),
  // );

  const textColor = "#216169";

  // Відступ для малювання тіні (щоб вона не обрізалася)
  const SHADOW_BLUR = 11;
  const canvasW = rect.width + SHADOW_BLUR * 2;
  const canvasH = rect.height + SHADOW_BLUR * 2;

  // Центрування тексту відносно оригінального rect
  const m = font.measureText(title);
  const textX = rect.x + (rect.width - m.width) / 2;
  const textY =
    rect.y +
    rect.height / 2 +
    m.height / 2 -
    (m.height - font.getSize()) * 0.15;

  // Параметри для GPU
  const uniforms = useMemo(() => {
    return {
      canvasSize: [canvasW, canvasH],
      buttonSize: [rect.width, rect.height],
      radius: 8.0,
      // borderWidth: 3.0,
      isPressed: pressed ? 1.0 : 0.0,
    };
  }, [canvasW, canvasH, rect.width, rect.height, pressed]);

  const textPath = useMemo(() => {
    return Skia.Path.MakeFromText(title, textX, textY, font)!;
  }, [title, textX, textY, font]);

  if (!buttonEffect) return null;

  return (
    <Group>
      <Group
        transform={[
          { translateX: rect.x - SHADOW_BLUR },
          { translateY: rect.y - SHADOW_BLUR },
        ]}
      >
        <Rect x={0} y={0} width={canvasW} height={canvasH}>
          <Shader source={buttonEffect} uniforms={uniforms} />
        </Rect>
      </Group>

      <Group>
        {/* Основний текст */}
        <Text x={textX} y={textY} text={title} font={font} color={textColor} />
        {/* Внутрішня тінь */}
        <Group clip={textPath}>
          <Text
            x={textX}
            y={textY + 4}
            text={title}
            font={font}
            color="#00000042" // підбери під свій дизайн (1F = 31/255)
          >
            <Blur blur={4} mode="decal" />
          </Text>
        </Group>
      </Group>
      {/* === ДЕБАГ === */}
      {/* <DebugBounds rect={rect} SHADOW_BLUR={SHADOW_BLUR} /> */}
    </Group>
  );
}
