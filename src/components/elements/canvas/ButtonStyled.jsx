import React from "react";
import { RoundedRect, Text } from "@shopify/react-native-skia";
import { useFont } from "@shopify/react-native-skia";
import { KronaOne_400Regular } from "@expo-google-fonts/krona-one"; // Підключення шрифту через Expo
import { hwN, wwN } from "../../../global/global-stiles.js";

const ButtonStyled = ({ x, y, label, color }) => {
  const font = useFont(KronaOne_400Regular, hwN(24)); // Шрифт постійний для кнопки

  const width = wwN(276); // Фіксована ширина
  const height = hwN(58); // Фіксована висота

  if (!font) {
    return null; // Повертаємо null, поки шрифт не завантажиться
  }

  // Вимірюємо розмір тексту
  const textMetrics = font.measureText(label); // Отримуємо об'єкт з розмірами тексту
  const textWidth = textMetrics.width; // Отримуємо ширину тексту

  // Позиціюємо текст по центру
  const textX = x + (width - textWidth) / 2; // Горизонтальне вирівнювання
  const textY = y + height / 2 + font.getSize() / 2; // Вертикальне вирівнювання

  return (
    <>
      {/* Прямокутник кнопки */}
      <RoundedRect
        x={x}
        y={y}
        width={width}
        height={height}
        r={8} // Фіксований радіус заокруглення
        color={color}
      />
      {/* Текст всередині кнопки */}
      {font && (
        <Text
          x={textX} // Позиція по X
          y={textY} // Позиція по Y
          text={label} // Текст з пропсів
          color="black"
          size={24} // Розмір шрифту
          font={font} // Використовуємо завантажений шрифт
        />
      )}
    </>
  );
};

export default ButtonStyled;
