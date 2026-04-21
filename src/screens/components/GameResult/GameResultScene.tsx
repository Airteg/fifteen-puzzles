import { useSkiaFonts } from "@/context/FontProvider";
import { useLayoutRenderHelpers } from "@/context/LayoutSnapshotProvider";
import { SkiaButtonSkin } from "@/ui/skia/SkiaButtonSkin";
import {
  Canvas,
  Group,
  Rect,
  RoundedRect,
  Shadow,
  Text,
  type SkFont,
} from "@shopify/react-native-skia";
import React from "react";
import { StyleSheet } from "react-native";
import type { GameResultPresentation, ResultAccentVariant } from "./result.types";
import type { GameResultFrame, GameResultLayout } from "./useGameResultLayout";

type Props = {
  layout: GameResultLayout;
  presentation: GameResultPresentation;
  durationMs: number;
  moves: number;
};

type AccentPalette = {
  fill: string;
  stripe: string;
  text: string;
};

const ACCENT_PALETTE: Record<ResultAccentVariant, AccentPalette> = {
  none: {
    fill: "rgba(0,0,0,0)",
    stripe: "rgba(0,0,0,0)",
    text: "#216169",
  },
  win: {
    fill: "#D9FAE8",
    stripe: "#80FF85",
    text: "#216169",
  },
  lose: {
    fill: "#FFE3E8",
    stripe: "#FF6B7A",
    text: "#7A2331",
  },
  record: {
    fill: "#FFF5B8",
    stripe: "#FAFF3F",
    text: "#216169",
  },
};

function formatDuration(durationMs: number) {
  const totalSeconds = Math.max(0, Math.round(durationMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function centerTextX(text: string, font: SkFont, frame: GameResultFrame) {
  return frame.x + (frame.width - font.measureText(text).width) / 2;
}

export default function GameResultScene({
  layout,
  presentation,
  durationMs,
  moves,
}: Props) {
  const { S, snap } = useLayoutRenderHelpers();
  const { title: titleFont, body: bodyFont, button: buttonFont } = useSkiaFonts();
  const accent = ACCENT_PALETTE[presentation.accent.variant];
  const titleText = presentation.title;
  const durationText = `TIME ${formatDuration(durationMs)}`;
  const movesText = `MOVES ${moves}`;

  const accentTitleY = layout.accentFrame.y + snap(30 * S);
  const accentMetaY = layout.accentFrame.y + snap(56 * S);
  const stripeW = snap(7 * S);

  return (
    <Canvas style={StyleSheet.absoluteFill}>
      <Rect
        x={0}
        y={0}
        width={layout.screenW}
        height={layout.screenH}
        color="#D5F7FF"
      />

      <RoundedRect
        x={layout.videoFrame.x}
        y={layout.videoFrame.y}
        width={layout.videoFrame.width}
        height={layout.videoFrame.height}
        r={layout.videoRadius}
        color="#101315"
      >
        <Shadow dx={0} dy={8} blur={16} color="rgba(0,0,0,0.28)" />
      </RoundedRect>

      <RoundedRect
        x={layout.videoFrame.x}
        y={layout.videoFrame.y}
        width={layout.videoFrame.width}
        height={layout.videoFrame.height}
        r={layout.videoRadius}
        style="stroke"
        strokeWidth={snap(3 * S)}
        color="#71D4EB"
      />

      {presentation.accent.variant !== "none" ? (
        <Group>
          <RoundedRect
            x={layout.accentFrame.x}
            y={layout.accentFrame.y}
            width={layout.accentFrame.width}
            height={layout.accentFrame.height}
            r={layout.accentRadius}
            color={accent.fill}
          >
            <Shadow inner dx={0} dy={3} blur={8} color="rgba(0,0,0,0.16)" />
          </RoundedRect>
          <RoundedRect
            x={layout.accentFrame.x}
            y={layout.accentFrame.y}
            width={stripeW}
            height={layout.accentFrame.height}
            r={layout.accentRadius}
            color={accent.stripe}
          />

          {titleFont ? (
            <Text
              x={centerTextX(titleText, titleFont, layout.accentFrame)}
              y={accentTitleY}
              text={titleText}
              font={titleFont}
              color={accent.text}
            />
          ) : null}

          {bodyFont ? (
            <Group>
              <Text
                x={layout.accentFrame.x + snap(24 * S)}
                y={accentMetaY}
                text={durationText}
                font={bodyFont}
                color={accent.text}
              />
              <Text
                x={
                  layout.accentFrame.x +
                  layout.accentFrame.width -
                  snap(24 * S) -
                  bodyFont.measureText(movesText).width
                }
                y={accentMetaY}
                text={movesText}
                font={bodyFont}
                color={accent.text}
              />
            </Group>
          ) : null}
        </Group>
      ) : null}

      {buttonFont ? (
        <SkiaButtonSkin
          rect={layout.primaryButtonFrame}
          title={presentation.primaryAction.label}
          font={buttonFont}
          pressed={false}
        />
      ) : (
        <RoundedRect
          x={layout.primaryButtonFrame.x}
          y={layout.primaryButtonFrame.y}
          width={layout.primaryButtonFrame.width}
          height={layout.primaryButtonFrame.height}
          r={layout.buttonRadius}
          color="#D5F7FF"
        />
      )}
    </Canvas>
  );
}
