import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import styled from "@emotion/native";
import {
  Shadow,
  Fill,
  RoundedRect,
  Canvas,
  Box,
  rrect,
  rect,
  BoxShadow,
} from "@shopify/react-native-skia";
import { hw, hwN, wwN } from "../../global/global-stiles.js";

export default function ButtonStyled({ size = "long", text = "" }) {
  const [longPressActivated, setLongPressActivated] = useState(false);
  const kh = hwN(10),
    kw = wwN(10);
  //blure(5)+strokeWidth(3)+width(276)+strokeWidth(3)+blure(5)
  const height = hwN(58) + hwN(16),
    width = wwN(size === "long" ? 276 : 120) + wwN(16);
  return (
    <Pressable
      size={size}
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
              <Fill color={"#00000000"} />
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
                {/* <BoxShadow dx={-20} dy={-20} blur={61} color="#FFFFFF40" /> */}
                {/* <BoxShadow dx={13} dy={14} blur={12} color="#A6B4C850" /> */}
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
                {/* <BoxShadow dx={-20} dy={-20} blur={61} color="#A6B4C899" inner /> */}
                {/* <BoxShadow dx={13} dy={14} blur={12} color="#A6B4C850" inner /> */}
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
