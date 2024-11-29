import React from "react";
import { View } from "react-native";
import styled from "@emotion/native";

import RectSvg from "../../svg/SvgShadow/RectSvg.jsx"; // виправлений шлях
import { ww } from "../../../global/global-stiles.js";
import SvgShadow from "../../svg/SvgShadow/index.jsx";

export default function Test() {
  const initialSizeX = 200;
  const initialSizeY = 200;

  const color = "#00000080"; // Задайте колір або габарити динамічно
  console.log("ww(", ww(initialSizeX), "hw(", ww(initialSizeY));
  return (
    <Container>
      <SvgContainer width={ww(initialSizeX)} height={ww(initialSizeY)}>
        <SvgShadow
          Fgr={RectSvg}
          w={ww(initialSizeX)}
          h={ww(initialSizeY)}
          // r={10}
          fill="#ffff0050"
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
  border: 5px solid darkorange;
`;

const SvgContainer = styled(View)`
  width: ${(props) => ww(props.width)}px;
  height: ${(props) => ww(props.height)}px;

  overflow: visible;
  border: 1px solid red;
`;
