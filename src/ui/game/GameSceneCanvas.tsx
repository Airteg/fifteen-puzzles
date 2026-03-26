import type { SkFont } from "@shopify/react-native-skia";
import {
  Canvas,
  Group,
  Rect,
  useFont,
  useImage,
} from "@shopify/react-native-skia";
import React from "react";
import { StyleSheet } from "react-native";

import { GameBoardSceneLayer } from "./GameBoardSceneLayer";
import { useGameBoardController } from "./useGameBoardController";
import type { GameSceneMetrics } from "./useGameSceneMetrics";

import { useLayoutRenderHelpers } from "@/context/LayoutSnapshotProvider";
import { GameHeader } from "@/ui/skia/GameHeader";
import { TimerSkin } from "@/ui/skia/TimerSkin";
import { IconButtonSkin } from "../skia/IconButtonSkin";
import { SkiaButtonSkin } from "../skia/SkiaButtonSkin";

type BoardControllerState = ReturnType<typeof useGameBoardController>;

type Props = {
  metrics: GameSceneMetrics;
  mode: "classic" | "limitTime";
  tileFont: SkFont;
  boardCtrl: BoardControllerState;
  timeText?: string;
  modeText: string;
};

export const GameSceneCanvas: React.FC<Props> = ({
  metrics,
  mode,
  tileFont,
  boardCtrl,
  timeText = "02:00",
  modeText,
}) => {
  const { S, snap } = useLayoutRenderHelpers();
  // console.log(
  //   "🚀 ~ metrics:\n" +
  //     JSON.stringify(
  //       metrics,
  //       (k, v) => (typeof v === "number" ? Number(v.toFixed(1)) : v),
  //       2,
  //     ),
  // );

  const iconFont = useFont(
    require("../../../assets/fonts/Mariupol-Medium.ttf"),
    snap(14 * S),
  );

  const btnW = snap(80 * S);

  const homeFrame = {
    x: metrics.buttonsBlockFrame.x,
    y: metrics.buttonsBlockFrame.y,
    width: btnW,
  };

  const restartFrame = {
    x: metrics.buttonsBlockFrame.x + metrics.buttonsBlockFrame.width - btnW,
    y: metrics.buttonsBlockFrame.y,
    width: btnW,
  };

  const { x: hX, y: hY, width: hW, height: hH } = metrics.headerFrame;

  const fiveImage = useImage(require("../../../assets/images/logo5.png"));
  if (!fiveImage) return null;

  return (
    <Canvas style={StyleSheet.absoluteFill}>
      {/* 1. ФОН */}
      <Rect
        x={0}
        y={0}
        width={metrics.screenW}
        height={metrics.screenH}
        color="#D5F7FF"
      />
      {/* 2. HEADER  */}
      <GameHeader hX={hX} hY={hY} hW={hW} hH={hH} fiveImage={fiveImage} />
      {/* 2.1. TimerSkin (якщо є): */}
      {metrics.timerFrame && (
        <TimerSkin
          frame={metrics.timerFrame}
          timeText={timeText}
          font={tileFont}
          bgColor={[0.15, 0.15, 0.15, 1.0]}
        />
      )}
      {/* 3. ДОШКА */}
      <GameBoardSceneLayer
        boardFrame={metrics.boardFrame}
        mode={mode}
        tileFont={tileFont}
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
      {/* 4. Кнопки управління */}
      {iconFont && (
        <Group>
          <IconButtonSkin
            frame={homeFrame}
            type="home"
            label="HOME"
            font={iconFont}
          />
          <IconButtonSkin
            frame={restartFrame}
            type="restart"
            label="RESTART"
            font={iconFont}
          />
        </Group>
      )}
      {/* 5. Інформаційне табло про режим гри: */}
      <SkiaButtonSkin
        rect={metrics.modePanelFrame}
        title={modeText}
        font={tileFont}
        pressed={false} // Завжди false, жодних реакцій на натискання
      />
    </Canvas>
  );
};
