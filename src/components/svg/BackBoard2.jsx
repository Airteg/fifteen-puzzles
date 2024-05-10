import React from "react";
import { Svg, Rect, Defs, LinearGradient, Stop, Line } from "react-native-svg";

const BackBoard = ({
  size = { x: 400, y: 400 },
  steps: initialSteps = 10,
  margin = 16,

  radius = 16,
  background = "#d5f7ff",
}) => {
  const steps = initialSteps > 10 ? 10 : initialSteps,
    border = 6,
    wStep = (margin - border) / steps,
    blackSquares = [],
    whiteSquares = [],
    innerSquares = [],
    tSize = {
      w: size.x - 2 * margin,
      h: size.y - 2 * margin,
    },
    opacityB = [1, 1, 1, 1, 1, 1, 2, 3, 3, 4, 5],
    opacityI = [1, 1, 1, 1, 1, 1, 2, 3, 3, 4, 5];
  console.log("~~~~~~~~~~~");

  console.log(
    "tSize:",
    tSize,
    "margin",
    margin,
    "size",
    size,
    "steps",
    steps,
    "wStep",
    wStep
  );
  let k = 0,
    a = Math.sqrt(2);
  for (let i = 0; i <= steps; i++) {
    const xB = Math.round(10 * i * wStep) / 10,
      yB = Math.round(10 * (2 * margin - i * wStep)) / 10,
      xW = Math.round(10 * (2 * margin - i * wStep)) / 10,
      yW = Math.round(10 * i * wStep) / 10,
      xI = i / a + margin + border / a,
      yI = i / a + margin + border / a,
      fill = `#000000${opacityB[k].toString(16).padStart(2, "0")}`,
      fillW = `#ffffff${opacityB[k].toString(16).padStart(2, "0")}`;
    fillI = `#ffffff${opacityI[k].toString(16).padStart(2, "0")}`;
    blackSquares.push(
      <Rect
        key={i}
        x={xB}
        y={yB}
        rx={radius}
        ry={radius}
        width={tSize.w}
        height={tSize.h}
        fill={fill}
        // fill="red"
        stroke={fill}
        strokeWidth={border}
      />
    );
    whiteSquares.push(
      <Rect
        key={k}
        x={xW}
        y={yW}
        rx={radius}
        ry={radius}
        width={tSize.w}
        height={tSize.h}
        fill={fillW}
        // fill="red"
        stroke={fillW}
        strokeWidth={border}
      />
    );
    // console.log("🚀 ~ xB:", xB, " yB:", yB, " xW:", xW, " yW:", yW, "k", k);
    innerSquares.push(
      <Rect
        key={k + i}
        x={xI}
        y={yI}
        rx={radius}
        ry={radius}
        width={tSize.w - (2 * border) / a - 2 * (i / a)}
        height={tSize.h - (2 * border) / a - 2 * (i / a)}
        fill="none"
        // fill="red"
        stroke="url(#gradI)"
        strokeWidth={border}
        strokeOpacity={0.5}
        // scale={1 / (wStep)}
      />
    );
    k++;
    console.log("1 / (i * wStep", i / wStep);
  }

  return (
    <Svg viewBox={`0 0 ${size.x} ${size.y}`}>
      <Defs>
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
      <Rect
        x={0}
        y={0}
        rx={radius}
        ry={radius}
        width={size.x}
        height={size.y}
        fill="none"
        // stroke="lime"
        strokeWidth={0.5}
      />
      {blackSquares}
      {whiteSquares}
      <Rect
        x={margin}
        y={margin}
        rx={radius}
        width={tSize.w}
        height={tSize.h}
        fill="#71d4eb"
        stroke="url(#grad)"
        strokeWidth={border}
      />
      {innerSquares}
    </Svg>
  );
};

export default BackBoard;
