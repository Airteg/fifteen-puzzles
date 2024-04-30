import React from "react";
import { View, Text } from "react-native";
import {
  Polygon,
  Svg,
  LinearGradient,
  Stop,
  Defs,
  G,
  Use,
  Rect,
} from "react-native-svg";

const Triangle = () => {
  return (
    <Svg viewBox="0 0 386 386">
      <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2="0.3" y2="0">
          <Stop offset="0" stopColor="#64b9ca" stopOpacity="1" />
          <Stop offset="1" stopColor="#71D4EB" stopOpacity="1" />
        </LinearGradient>
        <G id="polygon">
          <Polygon
            points={"193,193 0,386 0,0"}
            fill="url(#grad)"
            strokeWidth={0}
          />
        </G>
      </Defs>

      <Defs>
        <LinearGradient id="whiteGrad" x1="0" y1="0" x2="0.3" y2="0">
          <Stop offset="0" stopColor="#000000" stopOpacity="1" />
          <Stop offset="1" stopColor="#ffffff" stopOpacity="1" />
        </LinearGradient>
      </Defs>

      <Use href="#polygon" x="0" y="0" />
      <Use href="#polygon" x="0" y="0" rotation="180" origin="193, 193" />
      <Use href="#polygon" x="0" y="0" rotation="90" origin="193, 193" />
      <Use href="#polygon" x="0" y="0" rotation="270" origin="193, 193" />
    </Svg>
  );
};

export default Triangle;
