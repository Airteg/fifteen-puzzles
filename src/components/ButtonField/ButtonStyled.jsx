import React, { useMemo } from "react";
import {
  RoundedRect,
  Text,
  Path,
  Group,
  Shadow,
} from "@shopify/react-native-skia";
import { skiaFont as font } from "../../app/_layout.jsx";
import { hwN, wwN } from "../../global/global-stiles.js";

const ButtonStyled = ({ x, y, label, color }) => {
  const width = wwN(276); // Фіксована ширина
  const height = hwN(58); // Фіксована висота
  // Вимірюємо розмір тексту
  const textMetrics = useMemo(() => font.measureText(label), [label]); // Отримуємо об'єкт з розмірами тексту
  const textWidth = textMetrics.width; // Отримуємо ширину тексту

  // Позиціюємо текст по центру
  const textX = x + (width - textWidth) / 2; // Горизонтальне вирівнювання
  const textY = y + height / 2 + font.getSize() / 2; // Вертикальне вирівнювання

  return (
    <>
      {/* Прямокутник кнопки */}
      <RoundedRect
        x={x + (label === "back" ? width - height : 0)}
        y={y}
        width={label === "back" ? height : width}
        height={height}
        r={8} // Фіксований радіус заокруглення
        color="#D5F7FF"
      >
        <Shadow dx={0} dy={0} blur={6} color="#00000040" />
      </RoundedRect>
      <RoundedRect
        x={x + 2 + (label === "back" ? width - height : 0)}
        y={y + 2}
        width={(label === "back" ? height : width) - 4}
        height={height - 4}
        r={8} // Фіксований радіус заокруглення
        color={color}
      >
        <Shadow dx={0} dy={0} blur={6} color="#00000040" inner />
      </RoundedRect>
      {/* Текст всередині кнопки */}
      {font && label !== "back" && (
        <Text
          x={textX} // Позиція по X
          y={textY} // Позиція по Y
          text={label} // Текст з пропсів
          color="#216169"
          font={font} // Використовуємо завантажений шрифт
          // Розмір шрифта заданий в _layout.js useFont(KronaOne_400Regular, hwN(24))
        />
      )}
      {label === "back" && (
        <Group
          transform={[
            { translateX: x + (width - height) + (height - 20) / 2 },
            { translateY: y + (height - 17.03) / 2 },
          ]}
        >
          <Path
            path="m19.9979 16.9594c-2.4732-2.9679-4.5932-4.6638-6.5011-5.0878-1.9079-.424-3.7452-.4946-5.4411-.212V17.03L0 8.2677 8.0557 0v5.0878c3.1799 0 5.8651 1.1306 8.1264 3.3919 2.1906 2.2612 3.5332 5.0878 3.8159 8.409z"
            // style="stroke"
            color={color}
            strokeWidth={1}
          >
            <Shadow dx={0} dy={0} blur={3} color="#00000040" inner />
          </Path>
          <Path
            path="m19.9979 16.9594c-2.4732-2.9679-4.5932-4.6638-6.5011-5.0878-1.9079-.424-3.7452-.4946-5.4411-.212V17.03L0 8.2677 8.0557 0v5.0878c3.1799 0 5.8651 1.1306 8.1264 3.3919 2.1906 2.2612 3.5332 5.0878 3.8159 8.409z"
            style="stroke"
            color="#216169"
            strokeWidth={1.5}
          >
            <Shadow dx={0} dy={0} blur={4} color="#00000020" inner />
          </Path>
        </Group>
      )}
    </>
  );
};

export default ButtonStyled;
