import * as React from "react";
import Svg, {
  G,
  Path,
  Mask,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SvgLogo = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-3 -3 106 106"
    fill="none"
    {...props}
  >
    <Path
      d="M 5 0 H 95 C 98 0 100 2 100 5 V 95 C 100 98 98 100 95 100 H 5 C 2 100 0 98 0 95 V 5 C 0 3 2 0 5 0"
      // fill="none"
      fill="url(#a)"
      // fill="#216169"
      // stroke="url(#a)"
      stroke="none"
      strokeWidth={4.5}
    />
    <Path
      d="M 5 0 H 95 C 98 0 100 2 100 5 V 95 C 100 98 98 100 95 100 H 5 C 2 100 0 98 0 95 V 5 C 0 3 2 0 5 0"
      fill="none"
      // stroke="#D5F7FF"
      stroke="red"
      strokeWidth={1.36}
    />
    <Defs>
      <LinearGradient id="a" x1="50%" x2="50%" y1="0%" y2="100%">
        <Stop
          offset="0%"
          style={{
            stopColor: "red",
            stopOpacity: 0,
          }}
        />
        <Stop
          offset="100%"
          style={{
            stopColor: "#000000",
            stopOpacity: 0,
          }}
        />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default SvgLogo;
