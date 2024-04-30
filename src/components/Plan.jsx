import { View, Text } from "react-native";
import React from "react";
import styled from "@emotion/native";

import Triangle from "./svg/Triangle.jsx";
import { dfjccaic, ww } from "../global/global-stiles.js";

const Plan = ({ children }) => {
  return (
    <Container>
      <Triangle />
    </Container>
  );
};

export default Plan;

const Container = styled.View`
  width: ${ww(276)}px;
  /* width: 100%; */
  /* flex: 1; */
  aspect-ratio: 1;
  border-radius: ${ww(8)}px;
  background-color: #71d4eb;
  overflow: hidden;
  /* position: absolute;
  top: 0;
  left: 0; */
  /* border: 1px solid red; */
`;
