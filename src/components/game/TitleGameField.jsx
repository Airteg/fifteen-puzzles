import { View, Text } from "react-native";
import React from "react";
import styled from "@emotion/native";

import { dfjccaic } from "../../global/global-stiles.js";
import { SkiaShadow } from "react-native-skia-shadow";

const TitleGameField = () => {
  return (
    <Container>
      <SkiaShadow blur={4} dx={0} dy={0} color="#00000090">
        <Wrapper>
          <Text>TitleGameField</Text>
        </Wrapper>
      </SkiaShadow>
    </Container>
  );
};

export default TitleGameField;
const Container = styled.View`
  flex: 0.2;
  width: 90%;
  border: 1px solid blue;

  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
const Wrapper = styled.View`
  width: 100%;
  height: 100%;
`;
