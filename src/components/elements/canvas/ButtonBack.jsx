import React from "react";
import { RoundedRect, Shadow, Text } from "@shopify/react-native-skia";
import { useFont } from "@shopify/react-native-skia";
import { KronaOne_400Regular } from "@expo-google-fonts/krona-one"; // Підключення шрифту через Expo
import { hwN, wwN } from "../../../global/global-stiles.js";

const ButtonBack = ({ x, y, label, color }) => {
  const font = useFont(KronaOne_400Regular, hwN(24)); // Шрифт постійний для кнопки

  if (!font) {
    return null; // Повертаємо null, поки шрифт не завантажиться
  }

  // Вимірюємо розмір тексту
  const textMetrics = font.measureText(label); // Отримуємо об'єкт з розмірами тексту
  const textWidth = textMetrics.width; // Отримуємо ширину тексту

  // Позиціюємо текст по центру
  const textX = x + (wwN(276) - textWidth) / 2; // Горизонтальне вирівнювання
  const textY = y + hwN(58) / 2 - hwN(1.5) + font.getSize() / 2; // Вертикальне вирівнювання

  return (
    <>
      {/* Прямокутник кнопки */}
      <RoundedRect
        x={x}
        y={y}
        width={hwN(58)}
        height={hwN(58)}
        r={8}
        color="#D5F7FF"
      >
        <Shadow dx={0} dy={0} blur={6} color="#00000040" />
      </RoundedRect>
      <RoundedRect
        x={x + 2}
        y={y + 2}
        width={hwN(58) - 4}
        height={hwN(58) - 4}
        r={8}
        color={color}
      >
        <Shadow dx={0} dy={0} blur={6} color="#00000040" inner />
      </RoundedRect>
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

export default ButtonBack;
