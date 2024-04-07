import { View } from "react-native";
import styled from "@emotion/native";
import { Canvas, Fill, Rect } from "@shopify/react-native-skia";
import { useState } from "react";
import { hw } from "../global/global-stiles.js";
import Smile from "../components/elements/canvas/smile.js";

const sizeobj = (e) => e.nativeEvent.layout;

export default function NewGame() {
  const [size, setSize] = useState({ width: 0, height: 0 });
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
        <Smile cx={100} cy={100} />
      </Canvas>
    </ContainerNewGame>
  );
}

const Container = styled.View`
  /* border: 1px solid lightsalmon; */
  width: 200px;
  height: 251px;
`;
const ContainerNewGame = styled.View`
  /* border: 2px solid purple; */
  flex: 1 1 auto;
  padding-top: ${hw(30)}px;
`;
