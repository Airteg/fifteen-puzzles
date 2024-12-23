import React from "react";
import { View } from "react-native";
import styled from "@emotion/native";
import { MyRect } from "../../svg/SvgShadow/RectSvg.jsx";
import SvgShadow from "../../svg/SvgShadow/index.jsx";
import { ww } from "../../../global/global-stiles.js";

export default function Test() {
  const width = 150,
    height = 200;
  return (
    <Container>
      <SvgContainer width={width} height={height}>
        {/* Передаємо фігуру через SvgElement */}
        <SvgShadow
          SvgElement={MyRect}
          blur={5}
          offsetX={0}
          offsetY={0}
          width={width}
          height={height}
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
  width: ${(props) => props.width.toString()}px;
  height: ${(props) => props.height.toString()}px;
  overflow: visible;
  /* border: 1px solid lime; */
`;
