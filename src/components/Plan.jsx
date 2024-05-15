import { View, Text } from "react-native";
import React from "react";
import styled from "@emotion/native";

import Triangle from "./svg/Triangle.jsx";
import { dfjccaic, ww } from "../global/global-stiles.js";
import BackBoard from "./svg/BackBoard4.jsx";
import { transformOrigin } from "@shopify/react-native-skia";

const Plan = ({ value1, value2, value3, value4 }) => {
  return (
    <Container>
      <BackBoard />
    </Container>
  );
};

export default Plan;

const Container = styled.View`
  width: 100%;
  aspect-ratio: 1;
  border: 2px solid #c800ff;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
