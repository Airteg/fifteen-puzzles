import React, { useState, useEffect } from "react";
import { Svg, Rect, G } from "react-native-svg";

const blendColorWithAlpha = (background, alpha) => {
  const bg = parseInt(background.slice(1), 16);
  const r = (bg >> 16) & 0xff;
  const g = (bg >> 8) & 0xff;
  const b = bg & 0xff;

  const foreground = (255 * alpha) / 255;
  const newR = Math.round(r * (1 - alpha) + foreground * alpha);
  const newG = Math.round(g * (1 - alpha) + foreground * alpha);
  const newB = Math.round(b * (1 - alpha) + foreground * alpha);
  return `rgb(${newR}, ${newG}, ${newB})`;
};

const BackBoard = ({
  size,
  steps = 8,
  wStep = 0.5,
  radius = 0,
  background = "#d5f7ff",
}) => {
  const [mSize, setMSize] = useState({
    x: size ? size.x - 2 * steps * wStep : 0,
    y: size ? size.y - 2 * steps * wStep : 0,
  });

  const onLayout = (event) => {
    if (!size) {
      const { width, height } = event.nativeEvent.layout;
      setMSize({
        x: Math.max(0, width - 2 * steps * wStep),
        y: Math.max(0, height - 2 * steps * wStep),
      });
    }
  };

  useEffect(() => {
    if (size) {
      setMSize({
        x: Math.max(0, size.x - 2 * steps * wStep),
        y: Math.max(0, size.y - 2 * steps * wStep),
      });
    }
  }, [size]);

  const squares = [];
  const opacity = [3, 5, 10, 14, 18, 26, 40, 50];
  // const opacity = [32, 64, 98, 130, 162, 194, 226, 255];
  for (let i = 0; i < steps; i++) {
    const alpha = opacity[i] / 255;
    const fill = blendColorWithAlpha(background, alpha);

    squares.push(
      <G key={i}>
        <Rect
          x={i * wStep}
          y={(2 * steps - i) * wStep}
          rx={radius}
          ry={radius}
          width={mSize.x}
          height={mSize.y}
          fill={fill}
          stroke={fill}
          strokeWidth={wStep + 2}
        />
      </G>
    );
  }

  return (
    <Svg viewBox={`0 0 ${size.x} ${size.y}`} onLayout={onLayout}>
      {squares}
      <Rect
        x={(size.x - mSize.x) / 2}
        y={(size.y - mSize.y) / 2}
        rx={radius}
        ry={radius}
        width={mSize.x}
        height={mSize.y}
        fill="#71d4eb"
        stroke="#FFFFFF"
        strokeWidth={wStep}
      />
      <Rect
        x={0}
        y={0}
        width={size.x}
        height={size.y}
        fill="none"
        stroke="lime"
        strokeWidth={1}
      />
    </Svg>
  );
};

export default BackBoard;
