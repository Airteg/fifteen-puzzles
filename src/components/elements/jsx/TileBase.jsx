import Svg, { Defs, G, LinearGradient, Path, Stop } from "react-native-svg";
const TileBase = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={"0 0 60 60"}
    fill="none"
    // {...props}
  >
    <G filter="url(#a)">
      <Path
        fill="url(#b)"
        d="M 55.859 0.101 H 4.14 a 4.04 4.04 0 0 0 -4.04 4.04 V 55.86 a 4.04 4.04 0 0 0 4.04 4.04 H 55.86 a 4.04 4.04 0 0 0 4.04 -4.04 V 4.14 a 4.04 4.04 0 0 0 -4.04 -4.04 Z"
      />
      <Path
        fill="url(#c)"
        d="M 55.252 0.707 H 4.747 a 4.04 4.04 0 0 0 -4.04 4.04 v 50.505 a 4.04 4.04 0 0 0 4.04 4.04 h 50.505 a 4.04 4.04 0 0 0 4.04 -4.04 V 4.747 a 4.04 4.04 0 0 0 -4.04 -4.04 Z"
      />
    </G>
    <Defs>
      <LinearGradient
        id="b"
        x1={19.772}
        x2={52.23}
        y1={70.808}
        y2={1.194}
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0.17} stopColor="#A4B3BD" />
        <Stop offset={0.73} stopColor="#EEF1F3" />
        <Stop offset={0.85} stopColor="#fff" />
      </LinearGradient>
      <LinearGradient
        id="c"
        x1={20.111}
        x2={51.891}
        y1={70.079}
        y2={1.923}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#FDFDFD" />
        <Stop offset={0.3} stopColor="#F4F4F4" />
        <Stop offset={0.79} stopColor="#DCDCDC" />
        <Stop offset={1} stopColor="#D0D0D0" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default TileBase;
