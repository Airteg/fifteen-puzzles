import * as React from "react";
import Svg, {
  G,
  Path,
  Mask,
  Defs,
  LinearGradient,
  Stop,
  Use,
} from "react-native-svg";

/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SvgLogo = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-3 -3 106 106"
    fill="none"
    {...props}
  >
    <G id="back">
      <Path
        d="M 0 10 Q 0.07 5.811 2.937 2.925 L 10 10 V 90 L 2.929 97.071 Q 0.042 94.104 0.007 89.987 Z"
        // fill="none"
        fill="url(#a)"
        // fill="#216169"
        // stroke="url(#a)"
        stroke="green"
        strokeWidth={0}
      />
    </G>
    <Use href="#back" rotation={90} origin="50, 50" />
    <Use href="#back" rotation={180} origin="50, 50" />
    <Use href="#back" rotation={270} origin="50, 50" />
    <Path
      d="M 0 10 C 0 4.5 4.5 0 10 0 H 90 C 96.5 0 100 4.5 100 10 L 100 90 C 100 96.5 96.5 100 90 100 H 10 C 4.5 100 0 96.5 0 90 Z"
      fill="#D5F7FFe2"
      // stroke="#D5F7FF"
      stroke="lightblue"
      strokeWidth={0}
    />
    <G origin="50, 50" scale={0.92}>
      <Path
        d="M 0 10 C 0 3 3 0 10 0 H 90 C 97 0 100 3 100 10 L 100 90 C 100 97 97 100 90 100 H 10 C 3 100 0 97 0 90 Z"
        fill="none"
        stroke="#D5F7FF"
        // stroke="red"
        strokeWidth={2}
      />
    </G>

    <Defs>
      <LinearGradient id="a" x1="0%" x2="100%" y1="50%" y2="50%">
        <Stop offset="0%" stopColor="#fff" stopOpacity={1} />
        <Stop offset="45%" stopColor="#000" stopOpacity={1} />
        <Stop offset="45%" stopColor="#000" stopOpacity={1} />
        <Stop offset="55%" stopColor="#000" stopOpacity={1} />
        <Stop offset="55%" stopColor="#000" stopOpacity={1} />
        <Stop offset="100%" stopColor="#fff" stopOpacity={1} />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default SvgLogo;
