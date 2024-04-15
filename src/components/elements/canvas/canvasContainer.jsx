import React, { useState } from "react";
import { View } from "react-native";
import { Canvas, Fill, FitBox, rect, Text } from "@shopify/react-native-skia";
import styled from "@emotion/native";

export default function CanvasContainer({
  canvasElement = <DefaultCanvasElement />,
  children = <></>,
  dimCanvasElement = { width: 0, height: 0 },
  containerStyle = {},
  top = 0,
  left = 0,
}) {
  console.log("🚀 ~ canvasElement:", canvasElement);
  console.log("🚀 ~ ~ Prop dimCanvasElement:", dimCanvasElement);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [csize, setCsize] = useState({ width: 0, height: 0 });

  return (
    <Container
      style={containerStyle}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setSize({ width, height });
        console.log("Container size", size);
      }}
      onPress={() => console.log("OnPres")}
    >
      <Canvas
        style={{
          position: "absolute",
          top: { top },
          left: { left },
          width: size.width + 0,
          height: size.height + 0,
        }}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setCsize({ width, height });
          console.log("Canvas size", csize);
        }}
      >
        {/* <Fill color="#dd9be0" /> */}
        <Fill color="transparent" />
        <FitBox
          src={rect(0, 0, dimCanvasElement.width, dimCanvasElement.height)}
          dst={rect(0, 0, size.width, size.height)}
          fit="contain"
        >
          {console.log("FitBox size", size)}
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
let color;
color = "lightgrey";

const DefaultCanvasElement = () => <Text x={20} y={18} text="No content" />;
