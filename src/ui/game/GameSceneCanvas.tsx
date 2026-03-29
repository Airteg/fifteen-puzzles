import type { SkFont } from "@shopify/react-native-skia";
import {
  Canvas,
  Group,
  Rect,
  useFont,
  useImage,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { useGameState } from "@/context/GameStateProvider";
import { GameBoardSceneLayer } from "./GameBoardSceneLayer";
import { useGameBoardController } from "./useGameBoardController";
import type { GameSceneMetrics } from "./useGameSceneMetrics";

import {
  useGameLayout,
  useLayoutRenderHelpers,
} from "@/context/LayoutSnapshotProvider";
import { GameHeader } from "@/ui/skia/GameHeader";
import { TimerSkin } from "@/ui/skia/TimerSkin";
import { hexToShader } from "@/utils/color";
import { IconButtonSkin } from "../skia/IconButtonSkin";
import { SkiaButtonSkin } from "../skia/SkiaButtonSkin";

type BoardControllerState = ReturnType<typeof useGameBoardController>;

type Props = {
  metrics: GameSceneMetrics;
  mode: "classic" | "limitTime";
  tileFont: SkFont;
  boardCtrl: BoardControllerState;
  timeText: string;
  modeText: string;
  onHomePress: () => void;
  onRestartPress: () => void;
};

export const GameSceneCanvas: React.FC<Props> = ({
  metrics,
  mode,
  tileFont,
  boardCtrl,
  timeText,
  modeText,
  onHomePress,
  onRestartPress,
}) => {
  // console.log(
  //   "🚀 ~ rect:\n" +
  //     JSON.stringify(
  //       metrics,
  //       (k, v) => (typeof v === "number" ? Number(v.toFixed(1)) : v),
  //       2,
  //     ),
  // );
  const { S, snap } = useLayoutRenderHelpers();
  const boardM = useGameLayout(mode).board;
  const { settings } = useGameState();

  const boardTintColor = useMemo(
    () => hexToShader(settings.boardColor),
    [settings.boardColor],
  );
  const tileTintColor = useMemo(
    () => hexToShader(settings.tileColor),
    [settings.tileColor],
  );

  const iconFont = useFont(
    require("../../../assets/fonts/Mariupol-Medium.ttf"),
    snap(14 * S),
  );

  const btnW = snap(80 * S);
  const btnH = Math.round(btnW / 0.808);

  const homeFrame = {
    x: metrics.buttonsBlockFrame.x,
    y: metrics.buttonsBlockFrame.y,
    width: btnW,
    height: btnH,
  };

  const restartFrame = {
    x: metrics.buttonsBlockFrame.x + metrics.buttonsBlockFrame.width - btnW,
    y: metrics.buttonsBlockFrame.y,
    width: btnW,
    height: btnH,
  };

  const { x: hX, y: hY, width: hW, height: hH } = metrics.headerFrame;

  const fiveImage = useImage(require("../../../assets/images/logo5.png"));
  if (!fiveImage) return null;

  return (
    <>
      <Canvas style={StyleSheet.absoluteFill}>
        <Rect
          x={0}
          y={0}
          width={metrics.screenW}
          height={metrics.screenH}
          color="#D5F7FF"
        />

        <GameHeader hX={hX} hY={hY} hW={hW} hH={hH} fiveImage={fiveImage} />

        {metrics.timerFrame && (
          <TimerSkin
            frame={metrics.timerFrame}
            timeText={timeText}
            font={tileFont}
            bgColor={[0.15, 0.15, 0.15, 1.0]}
            S={S}
            snap={snap}
          />
        )}

        <GameBoardSceneLayer
          boardFrame={metrics.boardFrame}
          m={boardM}
          S={S}
          snap={snap}
          boardTintColor={boardTintColor}
          tileTintColor={tileTintColor}
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

        <SkiaButtonSkin
          rect={metrics.modePanelFrame}
          title={modeText}
          font={tileFont}
          pressed={false}
        />
      </Canvas>

      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go to home screen"
          onPress={onHomePress}
          style={{
            position: "absolute",
            left: homeFrame.x,
            top: homeFrame.y,
            width: homeFrame.width,
            height: homeFrame.height,
          }}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Restart game"
          onPress={onRestartPress}
          style={{
            position: "absolute",
            left: restartFrame.x,
            top: restartFrame.y,
            width: restartFrame.width,
            height: restartFrame.height,
          }}
        />
      </View>
    </>
  );
};
