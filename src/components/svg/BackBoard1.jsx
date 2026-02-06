import React, { useState, useEffect } from "react";
import { Svg, Rect, G, Defs, LinearGradient, Stop } from "react-native-svg";

const BackBoard = ({
  size,
  steps = 10,
  wStep = 1,
  radius = 16,
  background = "#d5f7ff",
}) => {
  console.log("🚀 ~~~~~~~~~~~ ");
  console.log("🚀 ~ wStep:", wStep);
  console.log("🚀 ~ steps:", steps);
  console.log("🚀 ~ size:", size);
  const trueSize = {
    x: size.x - 2 * steps * wStep,
    y: size.y - 2 * steps * wStep,
  };
  console.log("🚀 ~ trueSize:", trueSize);
  const trueX = (size.x - trueSize.x) / 2;
  const trueY = (size.y - trueSize.y) / 2;
  const mainSquares = {
    //Синій квадрат
    x: trueX,
    y: trueY,
    rx: radius,
    width: trueSize.x,
    height: trueSize.y,
    fill: "#71D4EB",
    strokeWidth: 6,
  };

  const squares = [];
  const squaresInnerShadow = [];
  const opacity = {
    black: [3, 3, 3, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 7, 7, 7],
    white: [3, 3, 3, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    inner: [3, 3, 3, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  };

  for (let i = 0; i < steps; i++) {
    // console.log(`opacity[${i}]`, opacity[i]);
    const o =
      opacity.length <= i
        ? "0f"
        : opacity.black[i].toString(16).padStart(2, "0");
    const fill = `#000000${o}`;
    const fillW = `#ffffff${o}`;

    const x = i * wStep + size.x - trueSize.x - 2 * steps * wStep;
    const y = size.x - trueSize.x - i * wStep;
    const xw = (size.x - trueSize.x) / 2 + i * wStep;
    const yw = (size.x - trueSize.x) / 2 - i * wStep;
    const xSh =
      Math.round(
        10 * ((size.x - trueSize.x) / 2 + (i * wStep) / Math.sqrt(2)),
      ) / 10;
    const ySh =
      Math.round(
        10 * ((size.x - trueSize.x) / 2 + (i * wStep) / Math.sqrt(2)),
      ) / 10;
    const shadowSize = {
      x: trueSize.x - (2 * i) / Math.sqrt(2),
      y: trueSize.y - (2 * i) / Math.sqrt(2),
    };
    console.log("xSh", xSh, "ySh", ySh, "shadowSize", shadowSize);
    const commonStyles = [
      {
        key: i,
        x: x,
        y: y,
        fill: fill,
        rx: radius,
        width: trueSize.x,
        height: trueSize.y,
        stroke: "none",
        strokeWidth: 1,
      },
      {
        key: i + steps,
        x: xw,
        y: yw,
        fill: fillW,
        rx: radius,
        width: trueSize.x,
        height: trueSize.y,
        stroke: "none",
        strokeWidth: 1,
      },
      {
        key: i + 2 * steps,
        x: xSh,
        y: ySh,
        fill: "none",
        rx: radius,
        width: shadowSize.x,
        height: shadowSize.y,
        stroke: fill,
        strokeWidth: wStep + i,
      },
    ];
    squares.push(
      <G>
        <Rect {...commonStyles[0]} />
        <Rect {...commonStyles[1]} />
      </G>,
    );
    squaresInnerShadow.push(<Rect {...commonStyles[2]} />);
  }

  return (
    <Svg viewBox={`0 0 ${size.x} ${size.y}`}>
      <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#A4B3BD" stopOpacity="1" />
          <Stop offset="0.5" stopColor="#EEF1F3" stopOpacity="1" />
          <Stop offset="1" stopColor="#fff" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      {/* Габаритний квадрат */}
      <Rect
        x={0}
        y={0}
        rx={radius}
        ry={radius}
        width={size.x}
        height={size.y}
        fill="none"
        stroke="lime"
        strokeWidth={0.5}
      />
      <Rect stroke="url(#grad)" {...mainSquares} />
    </Svg>
  );
};
export default BackBoard;
