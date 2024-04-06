import { View, Text, Image } from "react-native";
import React from "react";
import styled from "@emotion/native";
import Logo from "../assets/png/LogoSizeS.png";
import { hw } from "../global/global-stiles.js";

export default function Header() {
  return (
    <Container>
      <LogoCont>
        <Image source={Logo} style={{ width: "100%", height: "100%" }} />
      </LogoCont>
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
const LogoCont = styled.View`
  width: ${hw(80)}px;
  height: ${hw(80)}px;
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
