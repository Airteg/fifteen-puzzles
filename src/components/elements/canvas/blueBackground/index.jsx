import React from "react";
import styled from "@emotion/native";
import { Canvas, RoundedRect, Shadow } from "@shopify/react-native-skia";
import { windowWidth, wwN } from "../../../../global/global-stiles.js";

export default function BlueBackground({ height = 30 }) {
  const width = wwN(340);
  return (
    <CanvasStyled style={{ width, height }}>
      <RoundedRect
        color="#71D4EB"
        x={0}
        y={0}
        width={width - 1}
        height={height}
        r={8}
      >
        <Shadow dx={0} dy={4} blur={4} color="#00000060" inner />
      </RoundedRect>
    </CanvasStyled>
  );
}
const CanvasStyled = styled(Canvas)`
  position: absolute;
`;
