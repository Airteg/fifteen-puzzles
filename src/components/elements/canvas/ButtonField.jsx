import React, { useState } from "react";
import {
  Canvas,
  Group,
  RoundedRect,
  useTouchHandler,
} from "@shopify/react-native-skia";
import { View, Alert } from "react-native";
import ButtonStyled from "./ButtonStyled"; // Імпорт кнопок
import { hwN, wwN } from "../../../global/global-stiles.js";

const ButtonField = ({ labels }) => {
  // Перевірка, чи передано масив від 2 до 6 елементів
  if (!Array.isArray(labels) || labels.length < 2 || labels.length > 6) {
    throw new Error("The labels array must contain between 2 and 6 items.");
  }
  const back = labels[labels.length - 1] === "back";
  // Стан для збереження індексу натиснутої кнопки
  const [pressedIndex, setPressedIndex] = useState(null);

  // Позиції для кнопок (розрахунок координат на основі порядкового номера)
  const buttons = labels.map((label, index) => ({
    x: wwN(32),
    y: hwN(40) + index * (hwN(58) + hwN(24)), // Початкове Y = 40, наступні з відступом 24px
    label,
  }));

  // Розрахунок висоти Canvas на основі кількості кнопок
  const canvasHeight = hwN(64) + buttons.length * (hwN(58) + hwN(24)); // Висота Canvas залежить від кількості кнопок

  // Обробка дотиків для всього Canvas
  const touchHandler = useTouchHandler({
    onStart: (touch) => {
      const { x, y } = touch;

      // Логіка для визначення натиснутої кнопки
      buttons.forEach((btn, index) => {
        if (
          x >= btn.x + (btn.label === "back" ? wwN(276) - hwN(58) : 0) &&
          x <= btn.x + wwN(276) && // Фіксована ширина
          y >= btn.y &&
          y <= btn.y + hwN(58) // Фіксована висота
        ) {
          setPressedIndex(index); // Зберігаємо індекс натиснутої кнопки
          Alert.alert("Button pressed", `You pressed ${btn.label}`); // Вивести повідомлення про натиснуту кнопку
        }
      });
    },
    onEnd: () => {
      // Повертаємо стан до початкового при відпусканні натискання
      setPressedIndex(null);
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <Canvas
        style={{ width: wwN(340), height: canvasHeight }}
        onTouch={touchHandler}
      >
        <RoundedRect
          x={0}
          y={0}
          width={wwN(340)}
          height={canvasHeight}
          r={8}
          color={"#71D4EB"}
        />
        {buttons.map((btn, index) => {
          return (
            <ButtonStyled
              key={index}
              x={btn.x}
              y={btn.y}
              label={btn.label}
              color={pressedIndex === index ? "yellow" : "#D5F7FF"} // Жовта під час натискання, початковий колір у звичайному стані
            />
          );
        })}
        {back ? <Back></Back> : ""}
      </Canvas>
    </View>
  );
};

export default ButtonField;

const Back = () => {
  <Group></Group>;
};
