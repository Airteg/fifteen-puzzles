import { View, Text } from "react-native";
import React from "react";
import styled from "@emotion/native";
import { dfjccaic } from "../../global/global-stiles.js";

const Timer = () => {
  return (
    <Container>
      <Text>Timer</Text>
    </Container>
  );
};

export default Timer;

const Container = styled.View`
  flex: 0.1;
  width: 100%;
  border: 1px solid red;

  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
