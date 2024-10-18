import React from "react";
import { View, Text } from "react-native";
import styled, { css } from "@emotion/native";

export default function SquareContainer({ size }) {
  const { width, height } = size;
  return (
    <Container>
      <TextStyled style={styles.style1}> SquareContainer </TextStyled>
    </Container>
  );
}
const Container = styled(View)``;
const TextStyled = styled(Text)``;
const styles = {
  style1: css``,
};
