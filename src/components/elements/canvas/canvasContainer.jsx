import React, { useState } from "react";
import { View } from "react-native";
import { Canvas, Fill, FitBox, rect } from "@shopify/react-native-skia";
import styled, { css } from "@emotion/native";

export default function CanvasContainer({
  canvasElement,
  children = <></>,
  dimCanvasElement = { width: 0, height: 0 },
  containerStyle = {},
}) {
  const [size, setSize] = useState({ width: 100, height: 100 });

  return (
    <Container
      style={containerStyle}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setSize({ width, height });
      }}
    >
      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: size.width,
          height: size.height,
          zIndex: -1,
        }}
      >
        <Fill color="greenyellow" />
        <FitBox
          src={rect(0, 0, dimCanvasElement.width, dimCanvasElement.height)}
          dst={rect(0, 0, size.width, size.height)}
          fit="contain"
        >
          {canvasElement}
        </FitBox>
      </Canvas>
      {children}
    </Container>
  );
}
const Container = styled.View`
  box-sizing: border-box;
  flex: 1 1 auto;
  display: flex;
`;
