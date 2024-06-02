import { View, Text } from "react-native";
import React from "react";
import {
  Box,
  BoxShadow,
  Canvas,
  Fill,
  rrect,
  rect,
} from "@shopify/react-native-skia";
import { hwN, wwN } from "../../global/global-stiles.js";

export default function ButtonsWrapperBack({ height }) {
  return (
    <Canvas
      style={{
        width: wwN(340),
        height,

        zIndex: -1,
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <Fill color={"#00000000"} />
      <Box
        box={rrect(rect(0, 0, (width = wwN(340 - 12)), height), 8, 8)}
        color="#71D4EB"
        style="fill"
      >
        <BoxShadow dx={0} dy={4} blur={5} color="#00000040" inner />
      </Box>
    </Canvas>
  );
}
