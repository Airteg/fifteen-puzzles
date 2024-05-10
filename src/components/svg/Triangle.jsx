import React from "react";
import {
  Svg,
  LinearGradient,
  Stop,
  Defs,
  Polygon,
  Use,
} from "react-native-svg";

const Triangle = ({
  color1 = "#64b9ca",
  color2 = "#71D4EB",
  scale1 = 1,
  scale2 = 0.9,
  scale3 = 0.87,
}) => {
  return (
    <Svg viewBox="0 0 400 400">
      <Defs>
        <LinearGradient id="grad11" x1="0" y1="0" x2="0.1" y2="0">
          <Stop offset="0" stopColor="#d5f7ff" stopOpacity="1" />
          <Stop offset="1" stopColor="#c6e9ee" stopOpacity="1" />
        </LinearGradient>
        <LinearGradient id="grad12" x1="0" y1="0" x2="0.1" y2="0">
          <Stop offset="0" stopColor="#d5f7ff" stopOpacity="1" />
          <Stop offset="1" stopColor="#dbf8ff" stopOpacity="1" />
        </LinearGradient>
        <Polygon
          id="polygon11"
          points="200,200 0,400 0,0"
          fill="url(#grad11)"
        />
        <Polygon
          id="polygon12"
          points="200,200 0,400 0,0"
          fill="url(#grad12)"
        />

        <LinearGradient id="grad2" x1="0" y1="0" x2="0.03" y2="0">
          <Stop offset="0" stopColor="#ddd" stopOpacity="1" />
          <Stop offset="1" stopColor="#fff" stopOpacity="1" />
        </LinearGradient>
        <Polygon id="polygon2" points="200,200 0,400 0,0" fill="url(#grad2)" />

        <LinearGradient id="grad3" x1="0" y1="0" x2="0.3" y2="0">
          <Stop offset="0" stopColor={color1} stopOpacity="1" />
          <Stop offset="1" stopColor={color2} stopOpacity="1" />
        </LinearGradient>
        <Polygon id="polygon3" points="200,200 0,400 0,0" fill="url(#grad3)" />
      </Defs>

      {/* Set 1 */}
      <Use href="#polygon11" x="0" y="0" origin="200, 200" scale={scale1} />
      <Use href="#polygon12" x="0" y="0" rotation="90" origin="200, 200" />
      <Use href="#polygon12" x="0" y="0" rotation="180" origin="200, 200" />
      <Use href="#polygon11" x="0" y="0" rotation="270" origin="200, 200" />

      {/* Set 2 */}
      <Use href="#polygon2" x="0" y="0" origin="200, 200" scale={scale2} />
      <Use
        href="#polygon2"
        x="0"
        y="0"
        rotation="180"
        origin="200, 200"
        scale={scale2}
      />
      <Use
        href="#polygon2"
        x="0"
        y="0"
        rotation="90"
        origin="200, 200"
        scale={scale2}
      />
      <Use
        href="#polygon2"
        x="0"
        y="0"
        rotation="270"
        origin="200, 200"
        scale={scale2}
      />

      {/* Set 3 */}
      <Use href="#polygon3" x="0" y="0" origin="200, 200" scale={scale3} />
      <Use
        href="#polygon3"
        x="0"
        y="0"
        rotation="180"
        origin="200, 200"
        scale={scale3}
      />
      <Use
        href="#polygon3"
        x="0"
        y="0"
        rotation="90"
        origin="200, 200"
        scale={scale3}
      />
      <Use
        href="#polygon3"
        x="0"
        y="0"
        rotation="270"
        origin="200, 200"
        scale={scale3}
      />
    </Svg>
  );
};

export default Triangle;
