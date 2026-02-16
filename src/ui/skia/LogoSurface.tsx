import {
  Group,
  LinearGradient,
  RoundedRect,
  Shadow,
  SkFont,
  Text,
  vec,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import { snap } from "../pixel";

type Props = {
  size: number; // Базовий розмір (наприклад, 200)
  S: number; // Ваш коефіцієнт масштабування
  font: SkFont; // Krona One для напису FIFTEEN
};

export function LogoSurface({ size = 100, S = 1, font }: Props) {
  const scaledSize = size * S;
  const r = 10 * S;

  // Координати для внутрішніх елементів (плиток 1 та 5)
  // Використовуємо пропорції з вашого SVG
  const tile1 = useMemo(
    () => ({
      x: snap(23 * S),
      y: snap(40 * S),
      size: snap(78 * S),
    }),
    [S],
  );

  const tile5 = useMemo(
    () => ({
      x: snap(100 * S),
      y: snap(35 * S),
      size: snap(78 * S),
      depth: snap(6 * S),
    }),
    [S],
  );

  return (
    <Group>
      {/* 1. Жовта підкладка з потрійною тінню (фільтр "a" в SVG) */}
      <RoundedRect
        x={snap(10 * S)}
        y={snap(10 * S)}
        width={snap(180 * S)}
        height={snap(180 * S)}
        r={r}
        color="#FAFF3F"
      >
        {/* Зовнішня тінь (Drop Shadow) */}
        <Shadow dx={0} dy={0} blur={5 * S} color="rgba(0,0,0,0.5)" />
        {/* Внутрішня тінь 1 (Bottom-Right) */}
        <Shadow
          dx={snap(-5 * S)}
          dy={snap(4 * S)}
          blur={2 * S}
          color="rgba(0,0,0,0.25)"
          inner
        />
        {/* Внутрішня тінь 2 (Top-Left) */}
        <Shadow
          dx={snap(3 * S)}
          dy={snap(-3 * S)}
          blur={2 * S}
          color="rgba(0,0,0,0.25)"
          inner
        />
      </RoundedRect>

      {/* 2. Плитка "1" (Біла з градієнтом) */}
      <Group>
        <RoundedRect
          x={tile1.x}
          y={tile1.y}
          width={tile1.size}
          height={tile1.size}
          r={6 * S}
        >
          <LinearGradient
            start={vec(tile1.x, tile1.y + tile1.size)}
            end={vec(tile1.x + tile1.size, tile1.y)}
            colors={["#D0D0D0", "#F4F4F4", "#FFFFFF"]}
          />
          <Shadow
            dx={snap(-10 * S)}
            dy={snap(10 * S)}
            blur={6 * S}
            color="rgba(0,0,0,0.6)"
          />
        </RoundedRect>
        <Text
          x={tile1.x + 20 * S}
          y={tile1.y + 55 * S}
          text="1"
          font={font}
          color="#216169"
        />
      </Group>

      {/* 3. Плитка "5" (Блакитна з ефектом об'єму) */}
      <Group>
        {/* Грані (Об'єм) */}
        <RoundedRect
          x={tile5.x + tile5.depth}
          y={tile5.y + tile5.depth}
          width={tile5.size}
          height={tile5.size}
          r={6 * S}
          color="#014B54"
        />
        {/* Лицьова сторона */}
        <RoundedRect
          x={tile5.x}
          y={tile5.y}
          width={tile5.size}
          height={tile5.size}
          r={6 * S}
          color="#71D4EB"
        />
        <Text
          x={tile5.x + 18 * S}
          y={tile5.y + 55 * S}
          text="5"
          font={font}
          color="#216169"
        />
      </Group>

      {/* 4. Напис FIFTEEN внизу (фільтр "q") */}
      <Group>
        <Text
          x={snap(30 * S)}
          y={snap(170 * S)}
          text="FIFTEEN"
          font={font} // Krona One
          color="#216169"
        >
          <Shadow
            dx={0}
            dy={4 * S}
            blur={2 * S}
            color="rgba(0,0,0,0.25)"
            inner
          />
        </Text>
      </Group>
    </Group>
  );
}
