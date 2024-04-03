import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import Logo from "../assets/logo/Logo80x80new.svg";
import { hw } from "../global/global-stiles.js";
import styled from "@emotion/native";
import SvgLogo from "./svg/Logo.jsx";
import SvgComponent from "../assets/logo/Logo80x80convert.jsx";

const FontSizeTitle = `font-size: ${hw(24).toString()}px`;
const FontSizeDescription = `font-size: ${hw(16).toString()}px`;
const hLogo = `width: ${hw(80).toString()}px`;
const wLogo = `height: ${hw(80).toString()}px`;

export default function Header() {
  console.log("hw(80)", hw(80));
  let a = 44;
  return (
    <Container>
      <LogoContainer>
        <SvgComponent width={hw(80)} height={hw(80)} />
      </LogoContainer>
      <TextContainer>
        <Title>FIFTEEN TILES</Title>
        <Description>A classic game</Description>
        <Description>that doesn’t get boring</Description>
      </TextContainer>
    </Container>
  );
}
const Container = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const LogoContainer = styled.View`
  ${hLogo};
  ${wLogo};
  border: 3px solid #d2f368;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(254, 254, 254, 0) 0%,
    rgba(0, 0, 0, 0.32) 100%
  );
`;

const TextContainer = styled.View`
  display: flex;
  flex-direction: column;
`;
const Title = styled.Text`
  font-family: KronaOne_400Regular;
  ${FontSizeTitle};
  text-align: right;
  color: #216169;
`;
const Description = styled.Text`
  font-family: Mariupol-Regular;
  ${FontSizeDescription};
  text-align: right;
  color: #216169;
  border: none;
`;
