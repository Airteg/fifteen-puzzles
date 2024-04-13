import React, { useState } from "react";
import { View, Text } from "react-native";
import {
  Canvas,
  Fill,
  Group,
  Image,
  Rect,
  useTexture,
} from "@shopify/react-native-skia";
import styled from "@emotion/native";

// const sizeObj = (e) => e.nativeEvent.layout;

export default function CanvasContainer({
  canvasElement,
  children,
  width,
  height,
}) {
  const [size, setSize] = useState({ width: 100, height: 100 });

  return (
    <ContainerCanvas
      width={width}
      height={height}
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
        }}
      >
        <Fill color="greenyellow" />
        {canvasElement}
      </Canvas>
    </ContainerCanvas>
  );
}
const ContainerCanvas = styled.View`
  box-sizing: border-box;
  border: 2px solid red;
`;
