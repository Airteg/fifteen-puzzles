import { View } from "react-native";
import styled from "@emotion/native";
import { Canvas, Fill, Rect } from "@shopify/react-native-skia";
import { useState } from "react";
import { hw } from "../global/global-stiles.js";
import Smile from "../components/elements/canvas/smile.js";
import Logo from "../components/elements/canvas/logo.js";

const sizeobj = (e) => e.nativeEvent.layout;

export default function NewGame() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  console.log("🚀 ~ size:", size);
  let { width, height } = size;
  return (
    <ContainerNewGame>
      <Canvas
        style={{ flex: 1 }}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setSize({ width, height });
        }}
      >
        <Fill color="greenyellow" />
        {/* <Smile /> */}
        <Logo />
      </Canvas>
    </ContainerNewGame>
  );
}

const ContainerNewGame = styled.View`
  border: 2px solid purple;
  flex: 1 1 auto;
  /* padding-top: ${hw(30)}px; */
  /* width: 150px;
  height: 150px; */
`;
