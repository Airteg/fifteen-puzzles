import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useState } from "react";
import styled from "@emotion/native";
import { hw, ww } from "../../global/global-stiles.js";

export default function ButtonStyled({ size = "long", text }) {
  const [longPressActivated, setLongPressActivated] = useState(false);

  return (
    <Pressable
      size={size}
      onLongPress={() => setLongPressActivated(true)}
      onPressOut={() => setLongPressActivated(false)}
    >
      {({ pressed }) => (
        <Container size={size} pressed={pressed}>
          <ShadowStyled>
            <TextOnButton>
              {longPressActivated
                ? "Understood! " + text
                : pressed
                ? text
                : text}
            </TextOnButton>
          </ShadowStyled>
        </Container>
      )}
    </Pressable>
  );
}

const Container = styled.View`
  width: ${(props) => (props.size ? ww(276) : ww(120))}px;
  height: 58px;
  border: solid #d5f7ff 3px;
  border-radius: 8px;

  background-color: ${(props) => (props.pressed ? "#FAFF3F" : "#D5F7FF")};
`;
const ShadowStyled = styled.View`
  width: 100%;
  height: 100%;
  border: solid #00000008 3px;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const TextOnButton = styled.Text`
  font-family: KronaOne_400Regular;
  font-size: ${hw(24)}px;
  text-align: center;
  color: #216169;
`;
