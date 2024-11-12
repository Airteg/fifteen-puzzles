import React from "react";
import { View } from "react-native";
import styled from "@emotion/native";

import RectSvg from "../../svg/SvgShadow/RectSvg.jsx"; // виправлений шлях
import { ww } from "../../../global/global-stiles.js";
import SvgShadow from "../../svg/SvgShadow/index.jsx";

export default function Test() {
  const initialSizeX = 155;
  const initialSizeY = 130;

  const color = "#00000080"; // Задайте колір або габарити динамічно

  return (
    <Container>
      <SvgContainer width={initialSizeX} height={initialSizeY}>
        <SvgShadow
          Fgr={RectSvg}
          // w={initialSizeX}
          // h={initialSizeY}
          // r={10}
          fill="#ffff00"
          // shadowColor={color}
          // offsetX={0}
          // offsetY={0}
          // blur={1}
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
  height: ${(props) => ww(props.height)}px;
  /* border: 1px solid green; */
`;
