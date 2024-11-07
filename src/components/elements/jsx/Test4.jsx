import React from "react";
import { Svg, Rect, G } from "react-native-svg";

export default function AdvancedSvgShadow() {
  const width = 100;
  const height = 50;
  const shadowOpacity = 0.15; // Базова прозорість для тіньових шарів
  const shadowLayers = 5; // Кількість шарів для чіткої частини тіні
  const blurLayers = 5; // Кількість шарів для розмиття країв
  const blurX = 1.02; // Коефіцієнт розширення тіні по осі X для розмиття
  const blurY = 1.04; // Коефіцієнт розширення тіні по осі Y для розмиття
  const shadowColor = "#000000"; // Колір тіні

  return (
    <Svg viewBox="0 0 200 200">
      {/* Чітка частина тіні без розмиття */}
      {[...Array(shadowLayers)].map((_, i) => (
        <G
          key={`shadow-${i}`}
          opacity={shadowOpacity * (1 - i / shadowLayers)} // Поступове зменшення прозорості
          originX={100}
          originY={75}
        >
          <Rect
            x="50"
            y="50"
            width={width}
            height={height}
            fill={shadowColor}
            rx="10"
          />
        </G>
      ))}

      {/* Частина для розмиття країв з окремими scaleX та scaleY */}
      {[...Array(blurLayers)].map((_, i) => (
        <G
          key={`blur-${i}`}
          scaleX={Math.pow(blurX, i)} // Масштабування для імітації розмиття по X
          scaleY={Math.pow(blurY, i)} // Масштабування для імітації розмиття по Y
          opacity={(shadowOpacity / 2) * (1 - i / blurLayers)} // Зменшення прозорості для розмиття
          originX={100}
          originY={75}
        >
          <Rect
            x="50"
            y="50"
            width={width}
            height={height}
            fill={shadowColor}
            rx="10"
          />
        </G>
      ))}

      {/* Основний прямокутник */}
      <Rect x="50" y="50" width={width} height={height} fill="blue" rx="10" />
    </Svg>
  );
}
