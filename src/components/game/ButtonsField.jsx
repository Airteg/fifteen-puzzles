import { View, Text } from "react-native";
import React from "react";
import styled from "@emotion/native";

const ButtonsField = () => {
  return (
    <Container>
      <Text>ButtonsField</Text>
    </Container>
  );
};

export default ButtonsField;
const Container = styled.View`
  flex: 0.2;
  width: 100%;
  border: 1px solid green;

  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
