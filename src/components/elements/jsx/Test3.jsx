import React from "react";
import { View } from "react-native";
import styled from "@emotion/native";

import RectSvg from "../../svg/SvgShadow/RectSvg.jsx"; // виправлений шлях
import { ww } from "../../../global/global-stiles.js";
import SvgShadow from "../../svg/SvgShadow/index.jsx";

export default function Test() {
  const initialSize = 100;
  const color = "lightblue"; // Задайте колір або габарити динамічно

  return (
    <Container>
      <SvgContainer width={initialSize}>
        <SvgShadow
          Fgr={RectSvg}
          w={initialSize}
          h={initialSize}
          r={10}
          fill={color}
        />
      </SvgContainer>
    </Container>
  );
}

const Container = styled(View)`
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  border: 1px solid red;
`;

const SvgContainer = styled(View)`
  width: ${(props) => ww(props.width)}px;
  height: ${(props) => ww(props.width)}px;
  border: 1px solid green;
`;
