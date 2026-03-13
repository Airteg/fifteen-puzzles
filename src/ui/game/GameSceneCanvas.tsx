import type { SkFont } from "@shopify/react-native-skia";
import { Canvas, Rect } from "@shopify/react-native-skia";
import React from "react";
import { StyleSheet } from "react-native";

import type { BoardMetrics } from "./boardGeometry";
import { GameBoardSceneLayer } from "./GameBoardSceneLayer";
import { useGameBoardController } from "./useGameBoardController";
import type { GameSceneMetrics } from "./useGameSceneMetrics";

// Витягуємо тип повернення контролера, щоб не писати всі 15 пропсів вручну
type BoardControllerState = ReturnType<typeof useGameBoardController>;

type Props = {
  metrics: GameSceneMetrics;
  boardM: BoardMetrics;
  S: number;
  snap: (v: number) => number;
  tileFont: SkFont;
  boardCtrl: BoardControllerState;
};

export const GameSceneCanvas: React.FC<Props> = ({
  metrics,
  boardM,
  S,
  snap,
  tileFont,
  boardCtrl,
}) => {
  return (
    <Canvas style={StyleSheet.absoluteFill}>
      {/* 1. ФОН */}
      <Rect
        x={0}
        y={0}
        width={metrics.screenW}
        height={metrics.screenH}
        color="#121212"
      />

      {/* 2. HEADER ТА ІНШІ РАМКИ (Поки залишаємо для дебагу розміщення) */}
      <Rect
        x={metrics.headerFrame.x}
        y={metrics.headerFrame.y}
        width={metrics.headerFrame.width}
        height={metrics.headerFrame.height}
        color="rgba(255, 100, 100, 0.3)"
      />

      {metrics.timerFrame && (
        <Rect
          x={metrics.timerFrame.x}
          y={metrics.timerFrame.y}
          width={metrics.timerFrame.width}
          height={metrics.timerFrame.height}
          color="rgba(100, 255, 100, 0.3)"
        />
      )}

      {/* 3. РЕАЛЬНА ДОШКА (Беремо координати з метрик сцени) */}
      <GameBoardSceneLayer
        boardFrame={metrics.boardFrame}
        m={boardM}
        S={S}
        snap={snap}
        tileFont={tileFont}
        // Передаємо стейт з контролера
        tiles={boardCtrl.tiles}
        gridSV={boardCtrl.gridSV}
        emptyRow={boardCtrl.emptyRow}
        emptyCol={boardCtrl.emptyCol}
        dragActive={boardCtrl.dragActive}
        dragAxis={boardCtrl.dragAxis}
        dragStartRow={boardCtrl.dragStartRow}
        dragStartCol={boardCtrl.dragStartCol}
        dragOffsetPx={boardCtrl.dragOffsetPx}
        animT={boardCtrl.animT}
        animAxisSV={boardCtrl.animAxisSV}
        animDirSV={boardCtrl.animDirSV}
        animMovedIdsSV={boardCtrl.animMovedIdsSV}
      />

      {/* 4. НИЖНІ ПАНЕЛІ (Дебаг рамки) */}
      <Rect
        x={metrics.buttonsBlockFrame.x}
        y={metrics.buttonsBlockFrame.y}
        width={metrics.buttonsBlockFrame.width}
        height={metrics.buttonsBlockFrame.height}
        color="rgba(255, 255, 100, 0.3)"
      />
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
