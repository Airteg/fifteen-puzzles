import Svg, {
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";
const Test3 = (props) => (
  // <Svg
  //   // width={140}
  //   // height={140}
  //   viewBox={"-2.5 -2.5 95 95"}
  // >
  //   <Defs>
  //     <LinearGradient id="grad1" x1="0" y1="1" x2="1" y2="0">
  //       <Stop offset="0" stopColor="#ff0000" stopOpacity="1" />
  //       <Stop offset="0.15" stopColor="#5eff00" stopOpacity="1" />
  //       <Stop offset="0.65" stopColor="#fff700" stopOpacity="1" />
  //       <Stop offset="1" stopColor="#0000ff" stopOpacity="1" />
  //     </LinearGradient>
  //     <LinearGradient id="grad2" x1="0" y1="1" x2="1" y2="0">
  //       <Stop offset="0" stopColor="#ff0000" stopOpacity="1" />
  //       <Stop offset="0.15" stopColor="#5eff00" stopOpacity="1" />
  //       <Stop offset="0.65" stopColor="#fff700" stopOpacity="1" />
  //       <Stop offset="1" stopColor="#0000ff" stopOpacity="1" />
  //     </LinearGradient>
  //     <LinearGradient id="grad3" x1="0" y1="1" x2="1" y2="0">
  //       <Stop offset="0" stopColor="#ff0000" stopOpacity="1" />
  //       <Stop offset="0.15" stopColor="#5eff00" stopOpacity="1" />
  //       <Stop offset="0.65" stopColor="#fff700" stopOpacity="1" />
  //       <Stop offset="1" stopColor="#0000ff" stopOpacity="1" />
  //     </LinearGradient>
  //   </Defs>
  //   <Path
  //     // x={2.5}
  //     // y={2.5}
  //     d="M 9 0 H 81 Q 90 0 90 9 V 81 Q 90 90 81 90 H 9 Q 0 90 0 81 V 9 Q 0 0 9 0 "
  //     fill="none"
  //     stroke="url(#grad1)"
  //     strokeWidth={5}
  //   />
  //   <Path
  //     // x={2.5}
  //     // y={2.5}
  //     d="M 9 5 L 81 5 Q 85 5 85 9 L 85 81 Q 85 85 81 85 L 9 85 Q 5 85 5 81 L 5 9 Q 5 5 9 5"
  //     fill="none"
  //     stroke="url(#grad1)"
  //     strokeWidth={5.5}
  //   />
  //   <Path
  //     // x={2.5}
  //     // y={2.5}
  //     d="M 10 45 A 1 1 0 0 1 80 45 A 1 1 0 0 1 10 45"
  //     fill="none"
  //     stroke="url(#grad1)"
  //     strokeWidth={5.5}
  //   />
  // </Svg>
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    // width={72}
    // height={72}
    viewBox={"-5 -5 70 70"}
    fill="none"
    {...props}
  >
    <G filter="url(#a)">
      <Path
        fill="#595959"
        d="M 55.96 0 H 4.04 A 4.04 4.04 0 0 0 0 4.04 v 51.92 A 4.04 4.04 0 0 0 4.04 60 h 51.92 A 4.04 4.04 0 0 0 60 55.96 V 4.04 A 4.04 4.04 0 0 0 55.96 0 Z"
      />
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
export default Test3;
