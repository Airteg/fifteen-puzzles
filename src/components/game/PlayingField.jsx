import { View, Text } from "react-native";
import React from "react";
import styled from "@emotion/native";
import Board from "../elements/jsx/index.jsx";

const PlayingField = () => {
  return (
    <Container>
      <Board></Board>
    </Container>
  );
};

export default PlayingField;
const Container = styled.View`
  width: 100%;
  border: 1px solid blue;

  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
