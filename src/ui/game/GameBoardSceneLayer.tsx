import type { SkFont } from "@shopify/react-native-skia";
import { Canvas, Rect } from "@shopify/react-native-skia";
import React from "react";
import { StyleSheet } from "react-native";
import type { SharedValue } from "react-native-reanimated";

import { GameBoardSceneLayer } from "./GameBoardSceneLayer";
import type { BoardMetrics } from "./boardGeometry";
import type { BoardAxis } from "./gameBoardModel";
import { GameSceneMetrics } from "./useGameSceneMetrics";

type Props = {
  metrics: GameSceneMetrics;

  // Пропси для дошки
  m: BoardMetrics;
  S: number;
  snap: (v: number) => number;
  tileFont: SkFont;
  tiles: { id: number; label: string }[];
  gridSV: SharedValue<number[]>;
  emptyRow: SharedValue<number>;
  emptyCol: SharedValue<number>;
  dragActive: SharedValue<number>;
  dragAxis: SharedValue<number>;
  dragStartRow: SharedValue<number>;
  dragStartCol: SharedValue<number>;
  dragOffsetPx: SharedValue<number>;
  animT: SharedValue<number>;
  animAxisSV: SharedValue<BoardAxis>;
  animDirSV: SharedValue<1 | -1>;
  animMovedIdsSV: SharedValue<number[]>;
};

export const GameSceneCanvas: React.FC<Props> = (props) => {
  const { metrics, ...boardProps } = props;

  return (
    <Canvas style={StyleSheet.absoluteFill}>
      {/* ФОН */}
      <Rect
        x={0}
        y={0}
        width={metrics.screenW}
        height={metrics.screenH}
        color="#121212"
      />

      {/* 1. HEADER - поки що debug рамка */}
      <Rect
        x={metrics.headerFrame.x}
        y={metrics.headerFrame.y}
        width={metrics.headerFrame.width}
        height={metrics.headerFrame.height}
        color="rgba(255, 100, 100, 0.3)"
      />

      {/* 2. РЕАЛЬНА ДОШКА (Бере координати з метрик) */}
      <GameBoardSceneLayer boardFrame={metrics.boardFrame} {...boardProps} />

      {/* 3. TIMER - поки що debug рамка */}
      {metrics.timerFrame && (
        <Rect
          x={metrics.timerFrame.x}
          y={metrics.timerFrame.y}
          width={metrics.timerFrame.width}
          height={metrics.timerFrame.height}
          color="rgba(100, 255, 100, 0.3)"
        />
      )}

      {/* 4. BUTTONS - поки що debug рамка */}
      <Rect
        x={metrics.buttonsBlockFrame.x}
        y={metrics.buttonsBlockFrame.y}
        width={metrics.buttonsBlockFrame.width}
        height={metrics.buttonsBlockFrame.height}
        color="rgba(255, 255, 100, 0.3)"
      />

      {/* 5. MODE PANEL - поки що debug рамка */}
      <Rect
        x={metrics.modePanelFrame.x}
        y={metrics.modePanelFrame.y}
        width={metrics.modePanelFrame.width}
        height={metrics.modePanelFrame.height}
        color="rgba(255, 100, 255, 0.3)"
      />
    </Canvas>
  );
};
