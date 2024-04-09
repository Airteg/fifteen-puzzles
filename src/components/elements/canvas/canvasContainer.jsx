import React, { useState } from "react";
import { View, Text } from "react-native";
import { Canvas, Fill, Group } from "@shopify/react-native-skia";
import styled from "@emotion/native";

const sizeObj = (e) => e.nativeEvent.layout;

export default function CanvasContainer({
  canvasElement,
  children,
  width,
  height,
}) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  return (
    <ContainerCanvas style={{ width, height }}>
      <Canvas
        style={{ position: "absolute", flex: 1 }}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setSize({ width, height });
        }}
      >
        <Fill color="greenyellow" />
        <Group size={size}>{canvasElement}</Group>
      </Canvas>
      {children}
    </ContainerCanvas>
  );
}
const ContainerCanvas = styled.View`
  border: 2px solid purple;
`;
