import { View, Text, Image } from "react-native";
import React from "react";
import styled, { css } from "@emotion/native";

import { hw, hwN } from "../global/global-stiles.js";
import CanvasContainer from "./elements/canvas/canvasContainer.jsx";
import Logo, { dim as dimensionsLogo } from "./elements/canvas/logoOnPlash.js";

export default function Header() {
  return (
    <Container>
      <Wrapper>
        <CanvasContainer
          canvasElement={<Logo cx={30} cy={30} />}
          dimCanvasElement={dimensionsLogo}
          // containerStyle={containerStyle.css}
        />
      </Wrapper>

      <TextCont>
        <Title>FIFTEEN TILES</Title>
        <Description>A classic game</Description>
        <Description>that doesn’t get boring</Description>
      </TextCont>
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
const OuterWrapper = styled.View`
  border: #bddce1 solid 2px;
  /* background-color: 00000010; */
  border-radius: 8px;
  padding: ${hw(10)}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const containerStyle = {
  css: css`
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
  `,
};
