import React, { useState, useContext } from "react";
import { useRouter } from "expo-router";
import {
  Canvas,
  RoundedRect,
  Shadow,
  useTouchHandler,
} from "@shopify/react-native-skia";
import { View } from "react-native";
import ButtonStyled from "./ButtonStyled.jsx"; // Імпорт кнопок
import { color as systemColor, hwN, wwN } from "../../global/global-stiles.js";
import { isButtonPressed } from "./utils.js"; // Функція для перевірки натискання
import { handleButtonAction } from "./utils.js"; // Імпорт обробника подій
import { AppContext } from "../../global/AppContext.js"; // Імпорт контексту

const ButtonField = ({ labels }) => {
  // Використовуємо контекст для доступу до стану додатка
  const { state, setSound, setThemeColor } = useContext(AppContext);
  const router = useRouter();

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
        if (isButtonPressed(touch, btn)) {
          setPressedIndex(index);
          // Викликаємо обробник подій з utils.js
          handleButtonAction(btn.label, {
            state,
            setSound,
            setThemeColor,
            router,
          });
        }
      });
    },
    onEnd: () => {
      setPressedIndex(null); // Повертаємо стан до початкового при відпусканні натискання
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
          color={systemColor.BUTTON_FIELD}
        >
          <Shadow
            dx={0}
            dy={0}
            blur={8}
            color={systemColor.SHADOW_COLOR}
            inner
          />
        </RoundedRect>
        {buttons.map((btn, index) => {
          return (
            <ButtonStyled
              key={index}
              x={btn.x}
              y={btn.y}
              label={btn.label}
              color={
                pressedIndex === index
                  ? systemColor.ACTIVE
                  : systemColor.MAIN_COLOR
              } // Жовта під час натискання, початковий колір у звичайному стані
            />
          );
        })}
      </Canvas>
    </View>
  );
};

export default React.memo(ButtonField);
