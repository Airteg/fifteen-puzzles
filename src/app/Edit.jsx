import { View, Text } from "react-native";
import React from "react";
import styled, { css } from "@emotion/native";

import { dfjccaic, hw, platform, ww } from "../global/global-stiles.js";
import Triangle from "../components/svg/Triangle.jsx";
import Plan from "../components/Plan.jsx";

const Edit = () => {
  return (
    <Container>
      <Plan />
    </Container>
  );
};

export default Edit;

const Container = styled.View`
  flex: 1 1 auto;
  width: 100%;
  margin-top: ${hw(43)}px;
  margin-bottom: ${hw(40)}px;
  align-self: center;
  /* border: 1px solid darkgreen; */
  ${dfjccaic}
`;
