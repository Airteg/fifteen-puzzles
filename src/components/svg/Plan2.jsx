import * as React from "react";
import Svg, { G, Path, Defs, LinearGradient, Stop } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const Plan2 = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="17 10 278 278"
    iewBox
    {...props}
  >
    <G filter="url(#a)">
      <G filter="url(#b)">
        <Path
          fill="#B7B7B7"
          d="M275.414 11H36.586C26.32 11 18 19.321 18 29.586v238.828C18 278.679 26.321 287 36.586 287h238.828c10.265 0 18.586-8.321 18.586-18.586V29.586C294 19.32 285.679 11 275.414 11Z"
        />
      </G>
      <Path
        fill="url(#c)"
        d="M274.949 11.464H37.05c-10.264 0-18.585 8.321-18.585 18.586V267.95c0 10.265 8.32 18.586 18.585 18.586H274.95c10.265 0 18.586-8.321 18.586-18.586V30.05c0-10.265-8.321-18.586-18.586-18.586Z"
      />
      <Path
        fill="url(#d)"
        d="M272.162 14.252H39.838c-10.264 0-18.585 8.322-18.585 18.586v232.323c0 10.265 8.32 18.586 18.585 18.586h232.324c10.264 0 18.585-8.321 18.585-18.586V32.838c0-10.264-8.321-18.586-18.585-18.586Z"
      />
    </G>
    <Defs>
      <LinearGradient
        id="c"
        x1={81.35}
        x2={230.659}
        y1={309.117}
        y2={-11.108}
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0.17} stopColor="#A4B3BD" />
        <Stop offset={0.73} stopColor="#EEF1F3" />
        <Stop offset={0.85} stopColor="#fff" />
      </LinearGradient>
      <LinearGradient
        id="d"
        x1={82.911}
        x2={229.098}
        y1={305.762}
        y2={-7.753}
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
export default Plan2;
