import type { SkFont } from "@shopify/react-native-skia";
import {
  Canvas,
  Group,
  Path,
  Rect,
  RoundedRect,
  Shadow,
  Skia,
  useFont,
  useImage,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import { StyleSheet } from "react-native";

import type { BoardMetrics } from "./boardGeometry";
import { GameBoardSceneLayer } from "./GameBoardSceneLayer";
import { useGameBoardController } from "./useGameBoardController";
import type { GameSceneMetrics } from "./useGameSceneMetrics";

// ДОДАНО: імпорт TimerSkin
import { TimerSkin } from "@/ui/skia/TimerSkin";
import { IconButtonSkin } from "../skia/IconButtonSkin";
import { LogoSkin } from "../skia/LogoSkin";
import { SkiaButtonSkin } from "../skia/SkiaButtonSkin";

const SOUND_ON_SVG =
  "M0 19.5V9H6.5L15 0V28L6.5 19.5H0ZM21 3c4 8.9 4 13.7 0 22M30 6c2.6 6.5 2.7 10 0 16";
const SOUND_OFF_SVG =
  "M.5 20V9.5H7l8.5-9v28L7 20H.5ZM22.4 5.8c-.1-.3-.4-.4-.6-.2-.3.1-.4.4-.2.6l4.2 8.5-4.2 8.1c-.2.2-.1.5.2.6.2.2.5.1.6-.2l4-7.4 3.7 7.4c.1.3.4.4.6.2.3-.1.4-.4.2-.6l-4-8.1 4.5-8.5c.2-.2.1-.5-.2-.6-.2-.2-.5-.1-.6.2l-4.2 7.9-4-7.9Z";

type BoardControllerState = ReturnType<typeof useGameBoardController>;

type Props = {
  metrics: GameSceneMetrics;
  boardM: BoardMetrics;
  S: number;
  snap: (v: number) => number;
  tileFont: SkFont;
  boardCtrl: BoardControllerState;
  timeText?: string;
  modeText: string;
};

export const GameSceneCanvas: React.FC<Props> = ({
  metrics,
  boardM,
  S,
  snap,
  tileFont,
  boardCtrl,
  timeText = "02:00", // Тимчасове значення до реалізації Кроку 7
  modeText,
}) => {
  console.log(
    "🚀 ~ metrics:\n" +
      JSON.stringify(
        metrics,
        (k, v) => (typeof v === "number" ? Number(v.toFixed(1)) : v),
        2,
      ),
  );

  // 1. Завантажуємо шрифт для кнопок із застосуванням масштабування
  const iconFont = useFont(
    require("../../../assets/fonts/Mariupol-Medium.ttf"),
    snap(14 * S),
  );
  // const titleFont = useFont(
  //   require("../../../assets/fonts/Mariupol-Medium.ttf"),
  //   snap(14 * S),
  // );
  const btnW = snap(80 * S); // Базова ширина 80 пікселів, масштабована під екран

  const homeFrame = {
    x: metrics.buttonsBlockFrame.x,
    y: metrics.buttonsBlockFrame.y,
    width: btnW,
  };

  const restartFrame = {
    // Ставимо з правого краю блоку кнопок
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

      {/* TimerSkin: */}
      {metrics.timerFrame && (
        <TimerSkin
          frame={metrics.timerFrame}
          timeText={timeText}
          font={tileFont}
          // Темно-сірий колір фону у форматі RGBA [0..1] для шейдера
          bgColor={[0.15, 0.15, 0.15, 1.0]}
          S={S}
          snap={snap}
        />
      )}
      {/* 3. ДОШКА */}
      <GameBoardSceneLayer
        boardFrame={metrics.boardFrame}
        m={boardM}
        S={S}
        snap={snap}
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
      {/* 4. НИЖНІ ПАНЕЛІ (Дебаг рамки) */}
      {/* <Rect
        x={metrics.buttonsBlockFrame.x}
        y={metrics.buttonsBlockFrame.y}
        width={metrics.buttonsBlockFrame.width}
        height={metrics.buttonsBlockFrame.height}
        color="rgba(255, 255, 100, 0.3)"
      /> */}
      {/* <Rect
        x={metrics.modePanelFrame.x}
        y={metrics.modePanelFrame.y}
        width={metrics.modePanelFrame.width}
        height={metrics.modePanelFrame.height}
        color="rgba(255, 100, 255, 0.3)"
      ></Rect> */}
      <SkiaButtonSkin
        rect={metrics.modePanelFrame}
        title={modeText}
        font={tileFont}
        pressed={false} // Завжди false, жодних реакцій на натискання
      />
    </Canvas>
  );
};

type HederProps = {
  hX: number;
  hY: number;
  hW: number;
  hH: number;
  fiveImage: ReturnType<typeof useImage>;
  sound?: boolean;
};
const GameHeader: React.FC<HederProps> = ({
  hX,
  hY,
  hW,
  hH,
  fiveImage,
  sound = true,
}) => {
  const wSound = hH * 0.65;
  const hSound = hH * 0.6;
  const xSound = hX + hW - wSound;
  const ySound = hY + (hH - hSound) / 2;

  // Динамічний розрахунок шляху, масштабу та центрування
  const soundPath = useMemo(() => {
    const svgStr = sound ? SOUND_ON_SVG : SOUND_OFF_SVG;
    const origW = sound ? 40 : 31;
    const origH = 28;

    const p = Skia.Path.MakeFromSVGString(svgStr);
    if (!p) return { P: undefined, C: "transparent" };

    // Масштаб: іконка займає ~50% висоти кнопки
    const scale = (hSound * 0.5) / origH;

    const m = Skia.Matrix();
    // Центруємо іконку всередині рамки (wSound x hSound)
    m.translate((wSound - origW * scale) / 2, (hSound - origH * scale) / 2);
    m.scale(scale, scale);

    p.transform(m);

    return {
      P: p,
      C: sound ? "#FAFF3F" : "#216169",
    };
  }, [sound, wSound, hSound]);

  return (
    <Group>
      {/* Рамка хедера */}
      <Rect x={hX} y={hY} width={hW} height={hH} color={"transparent"}>
        <RoundedRect
          x={hX}
          y={hY}
          width={hH}
          height={hH}
          r={hH * 0.06}
          color="#D5F7FF"
        >
          <Shadow inner dx={0} dy={0} blur={5} color="rgba(0, 0, 0, 0.3)" />
          <Shadow dx={0} dy={0} blur={5} color="rgba(0, 0, 0, 0.3)" />
        </RoundedRect>
        <RoundedRect
          x={hX}
          y={hY}
          width={hH}
          height={hH}
          r={hH * 0.06}
          style="stroke"
          color="#D5F7FF"
          strokeWidth={3}
        />
      </Rect>

      <LogoSkin
        frame={{
          x: hX + 0.1 * hH,
          y: hY + 0.1 * hH,
          width: hH * 0.8,
          height: hH * 0.8,
        }}
        fiveImage={fiveImage!}
      />

      {/* Кнопка Звуку */}
      <Group transform={[{ translateX: xSound }, { translateY: ySound }]}>
        <RoundedRect
          x={0} // ВИПРАВЛЕНО: тут був xSound, через що кнопка зміщувалась двічі
          y={0} // ВИПРАВЛЕНО: тут був ySound
          width={wSound}
          height={hSound}
          r={hH * 0.06}
          color="#D5F7FF"
        >
          <Shadow inner dx={0} dy={0} blur={5} color="rgba(0, 0, 0, 0.3)" />
          <Shadow dx={0} dy={0} blur={5} color="rgba(0, 0, 0, 0.3)" />
        </RoundedRect>

        <RoundedRect
          x={0}
          y={0}
          width={wSound}
          height={hSound}
          r={hH * 0.06}
          style="stroke"
          strokeWidth={3}
          color="#D5F7FF"
        />

        {/* Динамічна іконка */}
        {soundPath.P && <Path path={soundPath.P} color={soundPath.C} />}
        {soundPath.P && (
          <Path
            path={soundPath.P}
            color={"000"}
            style={"stroke"}
            strokeWidth={0.5}
          />
        )}
      </Group>
    </Group>
  );
};
