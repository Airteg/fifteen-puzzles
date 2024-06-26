import { View, Text, Pressable } from "react-native";
import React from "react";
import styled from "@emotion/native";
import { SkiaShadow } from "react-native-skia-shadow";
import { useRouter } from "expo-router";
import BackGround from "../svg/BackGround.jsx";
import { path } from "../svg/path.js";
import { hw, hwN } from "../../global/global-stiles.js";

//  path={path.home}
const ButtonsField = ({ onRestart }) => {
  const router = useRouter();

  return (
    <Container>
      <ButtonContainer onPress={() => router.push("/")}>
        <TileWrapper style={{ width: "75%", marginTop: hwN(8) }}>
          <SkiaShadow blur={4} dx={0} dy={0} color="#00000090">
            <TileWrapper>
              <BackGround path={path.home} stroke="none" fill="black" />
            </TileWrapper>
          </SkiaShadow>
        </TileWrapper>
        <TextStyled>HOME</TextStyled>
      </ButtonContainer>
      <ButtonContainer
        onPress={() => {
          console.log("pressed");
          onRestart();
        }}
      >
        <TileWrapper style={{ width: "75%", marginTop: hwN(8) }}>
          <SkiaShadow blur={4} dx={0} dy={0} color="#00000090">
            <TileWrapper>
              <BackGround
                path={path.restart}
                stroke="black"
                strokeWidth={20}
                fill="none"
              />
            </TileWrapper>
          </SkiaShadow>
        </TileWrapper>
        <TextStyled>RESTART</TextStyled>
      </ButtonContainer>
    </Container>
  );
};

export default ButtonsField;

const Container = styled.View`
  flex: 0.4;
  width: 90%;
  /* border: 1px solid green; */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const ButtonContainer = styled.Pressable`
  height: 100%;
  aspect-ratio: 0.8;
  border-radius: ${hw(8)}px;
  background-color: #71d4eb;
  /* border: 1px solid red; */
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;
const TileWrapper = styled.View`
  aspect-ratio: 1;
`;
const TextStyled = styled.Text`
  font-family: Mariupol-Regular;
  font-size: ${hw(13)}px;
`;
