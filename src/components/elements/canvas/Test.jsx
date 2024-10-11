import React, { useState } from "react";
import {
  Canvas,
  RoundedRect,
  Text,
  useTouchHandler,
  useFont,
} from "@shopify/react-native-skia";
import { View } from "react-native";
import Marik from "../../../assets/fonts/Mariupol-Regular.ttf"; // Потрібно використовувати локальний файл шрифту
import { KronaOne_400Regular } from "@expo-google-fonts/krona-one";

// Компонент для прямокутника з текстом
const ColoredRoundedRect = ({ x, y, width, height, color, label, font }) => {
  return (
    <>
      {/* Прямокутник */}
      <RoundedRect
        x={x}
        y={y}
        width={width}
        height={height}
        r={25} // Фіксований радіус заокруглення
        color={color}
      />
      {/* Текст всередині прямокутника */}
      {font && (
        <Text
          x={x + width / 2} // Відцентровуємо по X
          y={y + height / 2} // Відцентровуємо по Y
          text={label} // Відображаємо текст з пропса
          color="black"
          size={24}
          align="center"
          verticalAlign="center"
          font={font} // Встановлюємо шрифт
        />
      )}
    </>
  );
};

// Головний компонент для Canvas
const Test = () => {
  // Спільний стан для зміни кольору при натисканні
  const [pressedColor, setPressedColor] = useState("lightblue");

  // Завантажуємо шрифт через Skia
  const font = useFont(KronaOne_400Regular, 24); // Підключаємо шрифт і задаємо розмір тексту

  // Позиції та розміри для прямокутників
  const firstRect = {
    x: 0,
    y: 0,
    width: 256,
    height: 100,
  };

  const secondRect = {
    x: 0,
    y: 120, // Відступ після першого прямокутника
    width: 256,
    height: 100,
  };

  // Обробка дотиків для всього Canvas
  const touchHandler = useTouchHandler({
    onStart: (touch) => {
      const { x, y } = touch;

      // Якщо натискання відбулося на будь-який з прямокутників, змінюємо колір
      if (
        (x >= firstRect.x &&
          x <= firstRect.x + firstRect.width &&
          y >= firstRect.y &&
          y <= firstRect.y + firstRect.height) ||
        (x >= secondRect.x &&
          x <= secondRect.x + secondRect.width &&
          y >= secondRect.y &&
          y <= secondRect.y + secondRect.height)
      ) {
        setPressedColor("yellow");
      }
    },
    onEnd: () => {
      // Повертаємо колір після завершення натискання
      setPressedColor("lightblue");
    },
  });

  // Якщо шрифт ще не завантажений, можна відобразити заглушку або текст не відображати
  if (!font) {
    return null; // Або покажіть індикатор завантаження
  }

  return (
    <View style={{ flex: 1 }}>
      <Canvas style={{ flex: 0.8 }} onTouch={touchHandler}>
        {/* Перший прямокутник з текстом */}
        <ColoredRoundedRect
          x={firstRect.x}
          y={firstRect.y}
          width={firstRect.width}
          height={firstRect.height}
          color={pressedColor}
          label="NNN First Rect"
          font={font}
        />
        {/* Другий прямокутник з текстом */}
        <ColoredRoundedRect
          x={secondRect.x}
          y={secondRect.y}
          width={secondRect.width}
          height={secondRect.height}
          color={pressedColor}
          label="Second Rect"
          font={font}
        />
      </Canvas>
    </View>
  );
};

export default Test;
