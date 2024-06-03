import { View } from "react-native";
import React from "react";
import styled from "@emotion/native";
import { usePathname } from "expo-router";

import { hw } from "../global/global-stiles.js";
import CanvasContainer from "./elements/canvas/canvasContainer.jsx";
import Logo, { dim as dimensionsLogo } from "./elements/canvas/logoOnPlash.js";
import ButtonSoundStyled from "./elements/ButtonSoundStyled.jsx";

export default function Header() {
  const currentPath = usePathname();

  return (
    <Container>
      <Wrapper>
        <CanvasContainer
          canvasElement={<Logo cx={30} cy={30} />}
          dimCanvasElement={dimensionsLogo}
        />
      </Wrapper>
      {currentPath === "/Game" ? (
        <ButtonSoundStyled />
      ) : (
        <TextCont>
          <Title>FIFTEEN TILES</Title>
          <Description>A classic game</Description>
          <Description>that doesn’t get boring</Description>
        </TextCont>
      )}
    </Container>
  );
}

const Container = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const TextCont = styled.View`
  display: flex;
  flex-direction: column;
`;

const Title = styled.Text`
  font-family: KronaOne_400Regular;
  font-size: ${hw(24)}px;
  text-align: right;
  color: #216169;
`;
const Description = styled.Text`
  font-family: "Mariupol-Regular";
  font-size: ${hw(16)}px;
  text-align: right;
  color: #216169;
`;
const Wrapper = styled.View`
  width: ${hw(80)}px;
  height: ${hw(80)}px;
`;
