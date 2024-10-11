import React from "react";
import { RoundedRect, Text, TextAlign } from "@shopify/react-native-skia";
import { useFont } from "@shopify/react-native-skia";
import { KronaOne_400Regular } from "@expo-google-fonts/krona-one"; // Підключення шрифту через Expo
import { hwN, wwN } from "../../../global/global-stiles.js";

const ButtonStyled = ({ x, y, label, color }) => {
  const font = useFont(KronaOne_400Regular, hwN(24)); // Шрифт постійний для кнопки

  const width = wwN(276); // Фіксована ширина
  const height = hwN(58); // Фіксована висота

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
          x={x + width / 2} // Відцентровуємо по X
          y={y + height / 2} // Відцентровуємо по Y
          text={label} // Текст з пропсів
          color="black"
          size={hwN(24)}
          textAlign={TextAlign.Center}
          verticalAlign="center"
          font={font} // Фіксований шрифт
        />
      )}
    </>
  );
};

export default ButtonStyled;
