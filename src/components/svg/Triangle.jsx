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
  color3 = "#ffffff",
  color4 = "#cccccc",
  scale2 = 0.9,
  scale3 = 0.8,
}) => {
  return (
    <Svg viewBox="0 0 386 386">
      <Defs>
        <LinearGradient id="grad1" x1="0" y1="0" x2="0.3" y2="0">
          <Stop offset="0" stopColor={color1} stopOpacity="1" />
          <Stop offset="1" stopColor={color2} stopOpacity="1" />
        </LinearGradient>
        <Polygon id="polygon1" points="193,193 0,386 0,0" fill="url(#grad1)" />

        <LinearGradient id="grad2" x1="0" y1="0" x2="0.3" y2="0">
          <Stop offset="0" stopColor="#f06" stopOpacity="1" />
          <Stop offset="1" stopColor="#f60" stopOpacity="1" />
        </LinearGradient>
        <Polygon id="polygon2" points="193,193 0,386 0,0" fill="url(#grad2)" />

        <LinearGradient id="grad3" x1="0" y1="0" x2="0.3" y2="0">
          <Stop offset="0" stopColor={color3} stopOpacity="1" />
          <Stop offset="1" stopColor={color4} stopOpacity="1" />
        </LinearGradient>
        <Polygon id="polygon3" points="193,193 0,386 0,0" fill="url(#grad3)" />
      </Defs>

      {/* Set 1 */}
      <Use href="#polygon1" x="0" y="0" scale={scale1} />
      <Use
        href="#polygon1"
        x="0"
        y="0"
        rotation="180"
        origin="193, 193"
        scale={scale1}
      />
      <Use
        href="#polygon1"
        x="0"
        y="0"
        rotation="90"
        origin="193, 193"
        scale={scale1}
      />
      <Use
        href="#polygon1"
        x="0"
        y="0"
        rotation="270"
        origin="193, 193"
        scale={scale1}
      />

      {/* Set 2 */}
      <Use href="#polygon2" x="0" y="0" scale={scale2} />
      <Use
        href="#polygon2"
        x="0"
        y="0"
        rotation="180"
        origin="193, 193"
        scale={scale2}
      />
      <Use
        href="#polygon2"
        x="0"
        y="0"
        rotation="90"
        origin="193, 193"
        scale={scale2}
      />
      <Use
        href="#polygon2"
        x="0"
        y="0"
        rotation="270"
        origin="193, 193"
        scale={scale2}
      />

      {/* Set 3 */}
      <Use href="#polygon3" x="0" y="0" scale={scale3} />
      <Use
        href="#polygon3"
        x="0"
        y="0"
        rotation="180"
        origin="193, 193"
        scale={scale3}
      />
      <Use
        href="#polygon3"
        x="0"
        y="0"
        rotation="90"
        origin="193, 193"
        scale={scale3}
      />
      <Use
        href="#polygon3"
        x="0"
        y="0"
        rotation="270"
        origin="193, 193"
        scale={scale3}
      />
    </Svg>
  );
};

export default Triangle;
