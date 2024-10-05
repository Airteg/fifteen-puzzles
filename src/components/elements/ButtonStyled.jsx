import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import styled from "@emotion/native";
import {
  Shadow,
  Fill,
  Canvas,
  Box,
  rrect,
  rect,
  BoxShadow,
} from "@shopify/react-native-skia";
import { hw, hwN, wwN } from "../../global/global-stiles.js";

export default function ButtonStyled({ size = "long", text = "", onPress }) {
  const [longPressActivated, setLongPressActivated] = useState(false);
  const kh = hwN(10),
    kw = wwN(10);

  const height = hwN(58) + hwN(16),
    width = wwN(size === "long" ? 276 : 120) + wwN(16);
  return (
    <Pressable
      size={size}
      onPress={() => onPress()}
      onLongPress={() => setLongPressActivated(true)}
      onPressOut={() => setLongPressActivated(false)}
    >
      {({ pressed }) => {
        const color = pressed ? "#FAFF3F" : "#D5F7FF";
        return (
          <ContButton style={{ width, height }}>
            <Canvas
              style={{
                width,
                height,
                zIndex: -1,
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              <Fill color={"#ff000000"} />
              <Box
                box={rrect(
                  rect(kw, kh, width - kw * 2, height - kh * 2),
                  kw,
                  kh
                )}
                color="#D5F7FF"
                style="fill" // Бордер зверху
                strokeWidth={3}
              >
                <BoxShadow dx={0} dy={0} blur={6} color="#00000011" />
              </Box>
              <Box
                box={rrect(
                  rect(kw + 3, kh + 3, width - 6 - kw * 2, height - 6 - kh * 2),
                  kw,
                  kh
                )}
                color={color}
                style="fill" // Бордер зверху
              >
                <BoxShadow dx={0} dy={0} blur={5} color="#00000032" inner />
              </Box>
            </Canvas>
            <NameButton>{text} </NameButton>
          </ContButton>
        );
      }}
    </Pressable>
  );
}
const ContButton = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const NameButton = styled.Text`
  font-family: KronaOne_400Regular;
  font-size: ${hw(24)}px;
  text-align: right;
  color: #216169;
`;
