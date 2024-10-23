import React from "react";
import {
  Svg,
  Rect,
  Defs,
  LinearGradient,
  Stop,
  Line,
  Circle,
  Path,
  G,
  RadialGradient,
} from "react-native-svg";

const BackBoard = ({
  size = { x: 400, y: 400 },
  steps: initialSteps = 10,
  margin = 16,
  radius = 16,
  background = "#d5f7ff",
  value1,
  value2,
  value3,
  value4,
}) => {
  const tSize = {
    w: size.x - 2 * margin,
    h: size.y - 2 * margin,
  };

  const angle = value3;
  // const x2 = Math.cos((angle * Math.PI) / 180).toFixed(2); // cos(25°)
  // const y2 = Math.sin((angle * Math.PI) / 180).toFixed(2); // sin(25°)
  const border = 6;
  const x1 = value1 * 0.045;
  const y1 = value2 * 0.92;
  const x2 = value3 * 0.045;
  const y2 = value4 * 0.92;
  console.log(
    "🚀 ~ x1:",
    `${x1}%`,
    "y1:",
    `${y1}%`,
    "x2:",
    `${x2}%`,
    "y2:",
    `${y2}%`,
  );
  return (
    <Svg viewBox={`0 0 ${size.x} ${size.y}`}>
      <Defs>
        <LinearGradient
          id="edit"
          // gradientUnits="objectBoundingBox"
          gradientUnits="userSpaceOnUse"
          x1={`${value1}%`}
          y1={`${value2}%`}
          x2={`${value3}%`}
          y2={`${value4}%`}
        >
          <Stop offset="0%" stopColor="#00ff00" stopOpacity="1" />
          {/* <Stop offset="60%" stopColor="#000000" stopOpacity="0.1" />
          <Stop offset="80%" stopColor="#000000" stopOpacity="0.15" /> */}
          <Stop offset="100%" stopColor="#ff00ff" stopOpacity="1" />
        </LinearGradient>
        <RadialGradient
          id="rGrad"
          cx="4.5%"
          cy="4.5%"
          rx="4.5%"
          ry="4.5%"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="1" stopColor="#000000" stopOpacity="0" />
          <Stop offset="0.18" stopColor="#000000" stopOpacity="0.18" />
          <Stop offset="0" stopColor="#000000" stopOpacity="0.3" />
        </RadialGradient>
        <LinearGradient
          id="blackBack1"
          x1="0%"
          y1="50%"
          x2="4.5%"
          y2="50%"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#000000" stopOpacity="0" />
          <Stop offset="0.82" stopColor="#000000" stopOpacity="0.18" />
          <Stop offset="1" stopColor="#000000" stopOpacity="0.3" />
        </LinearGradient>
        <LinearGradient id="blackBack2" x1="38%" y1="100%" x2="38%" y2="95%">
          <Stop offset="0%" stopColor="#000000" stopOpacity="0" />
          <Stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
        </LinearGradient>
        <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="1" stopColor="#bbcdd8" stopOpacity="1" />
          <Stop offset="0.5" stopColor="#EEF1F3" stopOpacity="1" />
          <Stop offset="0" stopColor="#e0f3ff" stopOpacity="1" />
        </LinearGradient>
        <LinearGradient id="gradI" x1="0" y1="1" x2="1" y2="0">
          <Stop offset="0" stopColor="#424242" stopOpacity="0.03" />
          <Stop offset="0.5" stopColor="#afb3b4" stopOpacity="0.03" />
          <Stop offset="1" stopColor="#f5fbff" stopOpacity="0.03" />
        </LinearGradient>
      </Defs>
      {/* {console.log(`${value1}%`, `${value2}%`, `${value3}%`, `${value4}%`)} */}
      <G x={-margin + 11} y={margin - 8} scale="0.99">
        {/* Ліве верхнє закруглення */}
        <Path
          d={`M ${margin} ${margin + radius} 
            a ${radius} ${radius} 0 0 1 ${radius} -${radius} 
            `}
          fill="none"
          stroke="url(#rGrad)"
          strokeWidth={radius + 2}
        />
        {/* Вертикальна лінія ліворуч */}
        <Path
          d={`M ${margin} ${margin + radius} 
          v ${tSize.h - 2 * radius}`}
          fill="none"
          stroke="url(#blackBack1)"
          strokeWidth={radius + 2}
        />
        {/* Ліве нижнє закруглення */}
        <Path
          d={`M ${margin} ${margin + tSize.h - radius} 
            a ${radius} ${radius} 0 0 0 ${radius} ${radius} 
            `}
          fill="none"
          stroke="url(#rGrad)"
          strokeWidth={radius + 2}
        />
        <Path
          d={`M ${margin + radius} ${margin + tSize.h} 
            h ${tSize.w - 2 * radius}`}
          fill="none"
          stroke="url(#rGrad)"
          strokeWidth={radius + 2}
        />
        <Path
          d={`M ${margin + tSize.w - radius} ${margin + tSize.h} 
            a ${radius} ${radius} 0 0 0 ${radius} -${radius} 
            `}
          fill="none"
          stroke="url(#rGrad)"
          strokeWidth={radius + 2}
        />
      </G>
      {/* <Rect
        x={margin}
        y={margin}
        rx={radius}
        ry={radius}
        width={tSize.w}
        height={tSize.h}
        fill="#71d4eb"
        stroke="url(#grad)"
        strokeWidth={border}
      /> */}
      {/* <Rect
        x={120}
        y={120}
        width={20}
        height={250}
        stroke="none"
        strokeWidth={1}
        fill="url(#edit)"
      /> */}
      {/* <Line
        x1={`${value1}%`}
        y1={`${value2}%`}
        x2={`${value3}%`}
        y2={`${value4}%`}
        stroke="orange"
        strokeWidth="2"
      /> */}
      {/* {console.log(
        "x1",
        (value1 * margin) / 400,
        "y1",
        (value2 * tSize.h) / 400,
        "x2",
        (value2 * margin) / 400,
        "y2",
        (value4 * tSize.h) / 400
      )} */}
    </Svg>
  );
};

export default BackBoard;
