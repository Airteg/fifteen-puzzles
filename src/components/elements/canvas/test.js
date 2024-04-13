import { useWindowDimensions } from "react-native";
import {
  Image,
  Rect,
  rect,
  Canvas,
  Fill,
  FitBox,
  useImage,
  useTexture,
} from "@shopify/react-native-skia";
import React from "react";
import Logo from "./logo.js";
import Smile from "./smile.js";

const Test = () => {
  const { width, height } = useWindowDimensions();
  console.log("height:", height);
  console.log("width", width);
  const imgLogo = useTexture(
    <Canvas style={{ width: height / 3, height: height / 3 }}>
      <Smile />
    </Canvas>,
    { width, height }
  );

  return (
    <Canvas style={{ width: height / 3, height: height / 3 }}>
      <Fill color="#eeaa00" />
      {/* <FitBox
        src={rect(0, 0, width, width)}
        dst={rect(0, 0, width * 0.1, width * 0.1)}
      > */}
      {/* <Rect x={0} y={0} width={100} height={100} color="navy" /> */}
      <Image image={imgLogo} rect={{ x: 0, y: 0, width: 100, height: 100 }} />
      {/* </FitBox> */}
    </Canvas>
  );
};
export default Test;
