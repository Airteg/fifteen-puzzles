import React from "react";
import { View } from "react-native";
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
  console.log("~~~~~~ BackBoard2 ~~~~~");

  // console.log(
  //   "tSize:",
  //   tSize,
  //   "margin",
  //   margin,
  //   "size",
  //   size,
  //   "steps",
  //   steps,
  //   "wStep",
  //   wStep
  // );
  let k = 0,
    a = Math.sqrt(2);
  for (let i = 0; i <= steps; i++) {
    const xB = Math.round(10 * i * wStep) / 10,
      yB = Math.round(10 * (2 * margin - i * wStep)) / 10,
      xW = Math.round(10 * (2 * margin - i * wStep)) / 10,
      yW = Math.round(10 * i * wStep) / 10,
      fill = `#000000${opacityB[k].toString(16).padStart(2, "0")}`,
      fillW = `#ffffff${opacityB[k].toString(16).padStart(2, "0")}`;
    // fillI = `#ffffff${opacityI[k].toString(16).padStart(2, "0")}`;
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
    k++;
    // console.log("1 / (i * wStep", i / wStep);
  }
  k = 220;
  for (let i = 0; i <= steps * 4; i++) {
    let xI = Math.round(i / a + margin + border / a),
      yI = Math.round(i / a + margin + border / a),
      width = Math.round(tSize.w - (2 * border) / a - 2 * (i / a)),
      height = Math.round(tSize.h - (2 * border) / a - 2 * (i / a)),
      o = Math.round(1000 * (0.0015 * (steps * 4 - i))) / 1000;
    // xI = margin + border;
    // yI = margin + border;
    // width = tSize.w - border * 2;
    // height = tSize.w - border * 2;
    r = radius - border;
    // console.log(
    //   "🚀 ~ xI:",
    //   xI,
    //   "yI:",
    //   yI,
    //   "tSize.w",
    //   tSize.w,
    //   "tSize.h",
    //   tSize.h,
    //   "width:",
    //   width,
    //   "height:",
    //   height,
    //   "r",
    //   r,
    //   "o",
    //   o
    // );

    innerSquares.push(
      <Rect
        key={k + i}
        x={xI}
        y={yI}
        rx={r}
        ry={r}
        width={width}
        height={height}
        fill="none"
        // fill="red"
        stroke="url(#gradI)"
        strokeWidth={border}
        strokeOpacity={o}
        // scale={1 / (wStep)}
      />
    );
  }

  return (
    <View
      style={{
        width: "100%",
        aspectRatio: "1",
        // position: "absolute",
        // top: "0",
        // left: "0",
      }}
    >
      <Svg viewBox={`0 0 ${size.x} ${size.y}`}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="1" stopColor="#bbcdd8" stopOpacity="1" />
            <Stop offset="0.5" stopColor="#EEF1F3" stopOpacity="1" />
            <Stop offset="0" stopColor="#e0f3ff" stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="gradI" x1="0" y1="1" x2="1" y2="0">
            <Stop offset="0" stopColor="#71d4eb" stopOpacity="1" />
            <Stop offset="1" stopColor="#63bace" stopOpacity="1" />
            {/* <Stop offset="0" stopColor="#888888" stopOpacity="1" />
          <Stop offset="0.5" stopColor="#afb3b4" stopOpacity="1" />
          <Stop offset="1" stopColor="#f5f5f5" stopOpacity="1" /> */}
          </LinearGradient>
        </Defs>
        <Rect
          x={0}
          y={0}
          rx={radius}
          // ry={radius}
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
          strokeOpacity={0.5}
        />
        {innerSquares}
      </Svg>
    </View>
  );
};

export default BackBoard;
