import React from "react";
import { View } from "react-native";
import styled from "@emotion/native";
import { MyRect } from "../../svg/SvgShadow/RectSvg.jsx";
import SvgShadow from "../../svg/SvgShadow/index.jsx";

export default function Test() {
  return (
    <Container>
      <SvgContainer>
        {/* Передаємо фігуру через SvgElement */}
        <SvgShadow SvgElement={MyRect} />
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
  width: 200px;
  height: 100px;
  overflow: visible;
  border: 1px solid lime;
`;
