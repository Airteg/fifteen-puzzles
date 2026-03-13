import { Canvas, Rect } from "@shopify/react-native-skia";
import React from "react";
import { StyleSheet } from "react-native";
import { GameSceneMetrics } from "./useGameSceneMetrics";

type Props = {
  metrics: GameSceneMetrics;
  // У майбутніх кроках ми додамо сюди:
  // fonts, timeText, boardNodes, pressStates тощо
};

export const GameSceneCanvas: React.FC<Props> = ({ metrics }) => {
  return (
    // StyleSheet.absoluteFill розтягує Canvas на весь екран
    <Canvas style={StyleSheet.absoluteFill}>
      {/* 1. ФОН: Темний бекграунд, щоб краще бачити рамки */}
      <Rect
        x={0}
        y={0}
        width={metrics.screenW}
        height={metrics.screenH}
        color="#121212"
      />

      {/* 2. HEADER (Група 1) */}
      <Rect
        x={metrics.headerFrame.x}
        y={metrics.headerFrame.y}
        width={metrics.headerFrame.width}
        height={metrics.headerFrame.height}
        color="rgba(255, 100, 100, 0.3)" // Напівпрозорий червоний
      />

      {/* 3. TIMER (Якщо він увімкнений) */}
      {metrics.timerFrame && (
        <Rect
          x={metrics.timerFrame.x}
          y={metrics.timerFrame.y}
          width={metrics.timerFrame.width}
          height={metrics.timerFrame.height}
          color="rgba(100, 255, 100, 0.3)" // Напівпрозорий зелений
        />
      )}

      {/* 4. BOARD (Ігрова дошка) */}
      <Rect
        x={metrics.boardFrame.x}
        y={metrics.boardFrame.y}
        width={metrics.boardFrame.width}
        height={metrics.boardFrame.height}
        color="rgba(100, 100, 255, 0.3)" // Напівпрозорий синій
      />

      {/* 5. BUTTONS BLOCK (Блок кнопок Home/Restart) */}
      <Rect
        x={metrics.buttonsBlockFrame.x}
        y={metrics.buttonsBlockFrame.y}
        width={metrics.buttonsBlockFrame.width}
        height={metrics.buttonsBlockFrame.height}
        color="rgba(255, 255, 100, 0.3)" // Напівпрозорий жовтий
      />

      {/* 6. MODE PANEL (Група 3 - Панель режиму) */}
      <Rect
        x={metrics.modePanelFrame.x}
        y={metrics.modePanelFrame.y}
        width={metrics.modePanelFrame.width}
        height={metrics.modePanelFrame.height}
        color="rgba(242, 131, 242, 0.3)" // Напівпрозорий фіолетовий
      />
    </Canvas>
  );
};
