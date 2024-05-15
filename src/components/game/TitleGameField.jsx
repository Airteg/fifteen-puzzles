import { View, Text } from "react-native";
import React from "react";
import styled from "@emotion/native";
import { dfjccaic } from "../../global/global-stiles.js";

const TitleGameField = () => {
  return (
    <Container>
      <Text>TitleGameField</Text>
    </Container>
  );
};

export default TitleGameField;
const Container = styled.View`
  flex: 0.2;
  width: 100%;
  border: 1px solid blue;

  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
