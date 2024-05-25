import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { SkiaShadow } from "react-native-skia-shadow";
import styled from "@emotion/native";

import { dfjccaic, hw, ww } from "../../global/global-stiles.js";

const TitleGameField = () => {
  const { mode } = useLocalSearchParams();
  const title = mode === "elapsed" ? "CLASSIC" : "LIMIT TIME";
  console.log("🚀 ~ mode:", mode);
  return (
    <SkiaShadow blur={8} dx={0} dy={0} color="#00000070">
      <Container>
        <Wrapper>
          <Wrapper>
            <Title>{title}</Title>
          </Wrapper>
        </Wrapper>
      </Container>
    </SkiaShadow>
  );
};

export default React.memo(TitleGameField);

const Container = styled.View`
  width: ${ww(300)}px;
  /* aspect-ratio: 4.76; */
  height: ${hw(58)}px;
  /* background-color: #d5f7ff; */
  border: 3px solid #d5f7ff;
  border-radius: 8px;
  padding: 2px;

  display: flex;
  justify-content: center;
  align-items: center;
`;
const Wrapper = styled.View`
  width: 100%;
  height: 100%;
  background-color: #d5f7ffaa;
  border-radius: 4px;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  /* border: 1px solid navy; */
`;
const Title = styled.Text`
  font-family: KronaOne_400Regular;
  font-size: ${hw(24)}px;
  text-align: center;
  color: #216169;
`;
