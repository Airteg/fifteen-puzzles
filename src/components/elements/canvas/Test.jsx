import React, { useState, useEffect, useCallback } from "react";
import {
  Canvas,
  RoundedRect,
  Shadow,
  useTouchHandler,
} from "@shopify/react-native-skia";
import { View, Alert } from "react-native";
import ButtonStyled from "./ButtonStyled";
import { color, hwN, wwN } from "../../../global/global-stiles.js";

const ButtonField = React.memo(({ labels }) => {
  const [pressedIndex, setPressedIndex] = useState(null);
  const [layoutInfo, setLayoutInfo] = useState(null);

  const buttons = labels.map((label, index) => ({
    x: wwN(32),
    y: hwN(40) + index * (hwN(58) + hwN(24)),
    label,
  }));

  const canvasHeight = hwN(64) + buttons.length * (hwN(58) + hwN(24));

  const touchHandler = useTouchHandler(
    useCallback(
      {
        onStart: (touch) => {
          const { x, y } = touch;
          buttons.forEach((btn, index) => {
            if (
              x >= btn.x + (btn.label === "back" ? wwN(276) - hwN(58) : 0) &&
              x <= btn.x + wwN(276) &&
              y >= btn.y &&
              y <= btn.y + hwN(58)
            ) {
              setPressedIndex(index);
              Alert.alert("Button pressed", `You pressed ${btn.label}`);
            }
          });
        },
        onEnd: () => setPressedIndex(null),
      },
      [buttons]
    )
  );

  const handleLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    // console.log("Canvas layout dimensions:", { width, height });
    setLayoutInfo({ width, height });
  };
  return (
    <View style={{ flex: 1 }}>
      <Canvas
        style={{ width: wwN(340), height: canvasHeight }}
        onTouch={touchHandler}
        onLayout={handleLayout}
      >
        <RoundedRect
          x={0}
          y={0}
          width={wwN(340)}
          height={canvasHeight}
          r={8}
          color={color.BUTTON_FIELD}
        >
          <Shadow dx={0} dy={0} blur={8} color={color.SHADOW_COLOR} inner />
        </RoundedRect>
        {buttons.map((btn, index) => (
          <ButtonStyled
            key={index}
            x={btn.x}
            y={btn.y}
            label={btn.label}
            color={pressedIndex === index ? "yellow" : "#D5F7FF"}
          />
        ))}
      </Canvas>
      {console.log("End of rendering")}
    </View>
  );
});

export default ButtonField;
