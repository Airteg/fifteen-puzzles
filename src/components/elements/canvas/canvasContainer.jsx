import React, { useState } from "react";
import { View, Text } from "react-native";
import { Canvas, Fill } from "@shopify/react-native-skia";
import styled from "@emotion/native";

const sizeObj = (e) => e.nativeEvent.layout;

export default function CanvasContainer({ canvasElement, children }) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  console.log("CanvasContainer", CanvasContainer);
  return (
    <ContainerCanvas>
      <Canvas
        style={{ position: "absolute", flex: 1 }}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setSize({ width, height });
        }}
      >
        <Fill color="greenyellow" />
        {canvasElement}
      </Canvas>
      {children}
    </ContainerCanvas>
  );
}
const ContainerCanvas = styled.View`
  border: 2px solid purple;
  flex: 1 1 auto;
`;
