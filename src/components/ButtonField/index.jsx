import React, { useState, useContext, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  Canvas,
  RoundedRect,
  Shadow,
  useTouchHandler,
} from "@shopify/react-native-skia";
import { View } from "react-native";
import ButtonStyled from "./ButtonStyled.jsx";
import { color as systemColor, hwN, wwN } from "../../global/global-stiles.js";
import { handleButtonAction, isButtonPressed } from "./utils.js";
import { AppContext } from "../../global/AppContext.js";

const ButtonField = ({ labels }) => {
  const { state, setSound, setThemeColor } = useContext(AppContext); // Доступ до контексту
  const router = useRouter();
  const [pressedIndex, setPressedIndex] = useState(null);

  // Використовуємо один useRef для зберігання звуку і теми
  const stateRef = useRef({ sound: state.sound, themeColor: state.themeColor });

  // Оновлюємо реф щоразу, коли змінюється стан звуку або теми
  useEffect(() => {
    stateRef.current.sound = state.sound;
    stateRef.current.themeColor = state.themeColor;
  }, [state.sound, state.themeColor]); // Спрацьовує при зміні стану звуку і теми

  // Позиції для кнопок
  const buttons = labels.map((label, index) => ({
    x: wwN(32),
    y: hwN(40) + index * (hwN(58) + hwN(24)),
    label,
  }));

  const canvasHeight = hwN(64) + buttons.length * (hwN(58) + hwN(24));

  // Обробка дотиків для всього Canvas
  const touchHandler = useTouchHandler({
    onStart: (touch) => {
      const { x, y } = touch;
      buttons.forEach((btn, index) => {
        if (isButtonPressed(touch, btn)) {
          setPressedIndex(index);

          // Отримуємо поточні значення звуку і теми з рефа
          const { sound, themeColor } = stateRef.current;

          handleButtonAction(btn.label, {
            sound,
            themeColor,
            setSound,
            setThemeColor,
            router,
          });
        }
      });
    },
    onEnd: () => {
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
        {buttons.map((btn, index) => (
          <ButtonStyled
            key={index}
            x={btn.x}
            y={btn.y}
            label={
              btn.label === "SOUND"
                ? `SOUND ${state.sound ? "ON" : "OFF"}`
                : btn.label === "SKIN"
                  ? `SKIN ${state.themeColor === "light" ? "LIGHT" : "DARK"}`
                  : btn.label
            }
            color={
              pressedIndex === index
                ? systemColor.ACTIVE
                : systemColor.MAIN_COLOR
            }
          />
        ))}
      </Canvas>
    </View>
  );
};

export default React.memo(ButtonField);
