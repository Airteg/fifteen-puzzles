import React, { useMemo } from "react";
import { RoundedRect, Text, Shadow } from "@shopify/react-native-skia";
import { skiaFont as font } from "../../app/_layout.jsx";
import { dim, color as systemColor } from "../../global/global-stiles.js";
import BackButton from "./BackButton.jsx";

const ButtonStyled = ({ x, y, label, color }) => {
  const width = dim.BUTTON_WIDTH; // Фіксована ширина
  const height = dim.BUTTON_HEIGHT; // Фіксована висота
  // Вимірюємо розмір тексту
  const textMetrics = useMemo(() => font.measureText(label), [label]); // Отримуємо об'єкт з розмірами тексту
  const textWidth = textMetrics.width; // Отримуємо ширину тексту
  // Позиціюємо текст по центру
  const textX = x + (width - textWidth) / 2; // Горизонтальне вирівнювання
  const textY = y + height / 2 + font.getSize() / 2; // Вертикальне вирівнювання
  // Постійні параметри для shadow
  const shadowProps = { dx: 0, dy: 0, blur: 6 };

  return (
    <>
      {/* Прямокутник кнопки */}
      <RoundedRect
        x={x + (label === "back" ? width - height : 0)}
        y={y}
        width={label === "back" ? height : width}
        height={height}
        r={dim.BUTTON_RADIUS} // Фіксований радіус заокруглення
        color={systemColor.MAIN_COLOR}
      >
        <Shadow {...shadowProps} color={systemColor.SHADOW_COLOR} />
      </RoundedRect>
      <RoundedRect
        x={x + 2 + (label === "back" ? width - height : 0)}
        y={y + 2}
        width={(label === "back" ? height : width) - 4}
        height={height - 4}
        r={8} // Фіксований радіус заокруглення
        color={color}
      >
        <Shadow {...shadowProps} color={systemColor.SHADOW_COLOR} inner />
      </RoundedRect>
      {/* Текст всередині кнопки */}
      {font && label !== "back" && (
        <Text
          x={textX} // Позиція по X
          y={textY} // Позиція по Y
          text={label} // Текст з пропсів
          color={systemColor.TEXT_COLOR}
          font={font} // Використовуємо завантажений шрифт
          // Розмір шрифта заданий в _layout.js useFont(KronaOne_400Regular, hwN(24))
        />
      )}
      {label === "back" && (
        <BackButton x={x} y={y} height={height} color={color} />
      )}
    </>
  );
};

export default React.memo(ButtonStyled);
