import { View, Text, Pressable, ImageBackground } from "react-native";
import React, { useState } from "react";
import styled, { css } from "@emotion/native";
import { dfjccaic, hw } from "../../../global/global-stiles.js";

const Button = ({
  title = "",
  onPress,
  backgroundImage,
  activeBackgroundImage,
  size = { width: 295, height: 67 },
}) => {
  const [longPressActivated, setLongPressActivated] = useState(false);

  return (
    <ButtonWrapper
      onPress={() => onPress()}
      onLongPress={() => setLongPressActivated(true)}
      onPressOut={() => setLongPressActivated(false)}
    >
      {({ pressed }) => {
        const back = pressed ? activeBackgroundImage : backgroundImage;
        return (
          <ImageBackground
            source={back}
            resizeMode="stretch"
            style={containerStyle.image}
          >
            <TitleWrapper>
              {title && <NameButton>{title}</NameButton>}
            </TitleWrapper>
          </ImageBackground>
        );
      }}
    </ButtonWrapper>
  );
};

export default Button;

const ButtonWrapper = styled.Pressable`
  width: 100%;
  height: 100%; /* border: solid 1px red; */
  ${dfjccaic}
`;
const TitleWrapper = styled.View`
  width: 100%;
  height: 100%;
  /* ${dfjccaic} */
  /* border: solid 1px greenyellow; */
`;
const NameButton = styled.Text`
  font-family: KronaOne_400Regular;
  font-size: ${hw(24)}px;
  text-align: center;
  color: #216169;
`;
const containerStyle = {
  image: css`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
  `,
};
