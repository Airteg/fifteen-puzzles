import { useGameState } from "@/context/GameStateProvider";
import { IconButtonSkin } from "@/ui/skia/IconButtonSkin";
import { SkiaIconButtonSkin } from "@/ui/skia/SkiaIconButtonSkin";
import {
  Group,
  RoundedRect,
  Shadow,
  Text,
  rrect,
  rect as skRect,
  type SkFont,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import { Pressable, View } from "react-native";

type ModalProps = {
  frame: { x: number; y: number; width: number; height: number };
  S: number;
  snap: (v: number) => number;
};

// Створюємо розширений тип спеціально для сцени
type SceneProps = ModalProps & {
  isSoundEnabled: boolean;
  titleFont: SkFont | null;
};

// 1. Skia Візуальна частина (без власних хуків контексту!)
export function SoundModalScene({
  frame,
  S,
  snap,
  isSoundEnabled,
  titleFont,
}: SceneProps) {
  // Метрики з макета
  const titleY = snap(42 * S);

  const innerInset = snap(16 * S);
  const innerY = snap(60 * S);
  const innerW = frame.width - innerInset * 2;
  const innerH = frame.height - innerY - innerInset;
  const innerR = snap(8 * S);

  const btnSize = snap(60 * S);
  const btnGap = snap(24 * S);

  // Кнопки по центру внутрішнього блоку
  const btnY = innerY + (innerH - btnSize) / 2;
  const btn1X = frame.width / 2 - btnGap / 2 - btnSize;
  const btn2X = frame.width / 2 + btnGap / 2;

  const titleText = "SOUND";
  const titleX = titleFont
    ? (frame.width - titleFont.measureText(titleText).width) / 2
    : 0;

  const clipPath = useMemo(
    () => rrect(skRect(innerInset, innerY, innerW, innerH), innerR, innerR),
    [innerInset, innerY, innerW, innerH, innerR],
  );

  return (
    <Group transform={[{ translateX: frame.x }, { translateY: frame.y }]}>
      {titleFont && (
        <Text
          x={titleX}
          y={titleY}
          text={titleText}
          font={titleFont}
          color="#488B8F"
        />
      )}

      {/* Внутрішній блок із тінню (заглиблення) */}
      <Group clip={clipPath}>
        <RoundedRect
          x={innerInset}
          y={innerY}
          width={innerW}
          height={innerH}
          r={innerR}
          color="#E1F5FE"
        >
          <Shadow inner dx={0} dy={4} blur={8} color="rgba(0,0,0,0.55)" />
        </RoundedRect>
      </Group>

      {/* Кнопки (тепер стан береться з пропса isSoundEnabled) */}
      <IconButtonSkin
        frame={{ x: btn1X, y: btnY, width: btnSize }}
        type="soundOn"
        active={isSoundEnabled}
      />
      <SkiaIconButtonSkin
        rect={{ x: btn1X, y: btnY, width: btnSize, height: btnSize }}
        pressed={true}
      />
      <IconButtonSkin
        frame={{ x: btn2X, y: btnY, width: btnSize }}
        type="soundOff"
        active={!isSoundEnabled}
      />
    </Group>
  );
}

// 2. React Native Оверлей для жестів (хуки контексту працюють, бо це не Skia)
export function SoundModalOverlay({ frame, S, snap }: ModalProps) {
  // ВИПРАВЛЕНО: Використовуємо новий канонічний API
  const { settings, updateSettings } = useGameState();
  const isSoundEnabled = settings.isSoundEnabled;

  const btnSize = snap(60 * S);
  const btnGap = snap(24 * S);
  const innerInset = snap(16 * S);
  const innerY = snap(60 * S);
  const innerH = frame.height - innerY - innerInset;

  const btnY = innerY + (innerH - btnSize) / 2;
  const btn1X = frame.width / 2 - btnGap / 2 - btnSize;
  const btn2X = frame.width / 2 + btnGap / 2;

  return (
    <View
      style={{
        position: "absolute",
        left: frame.x,
        top: frame.y,
        width: frame.width,
        height: frame.height,
      }}
    >
      <Pressable
        style={{
          position: "absolute",
          left: btn1X,
          top: btnY,
          width: btnSize,
          height: btnSize,
        }}
        onPress={() => {
          // Якщо звук ВИМКНЕНО, клік по лівій кнопці його ВМИКАЄ
          if (!isSoundEnabled) updateSettings({ isSoundEnabled: true });
        }}
      />
      <Pressable
        style={{
          position: "absolute",
          left: btn2X,
          top: btnY,
          width: btnSize,
          height: btnSize,
        }}
        onPress={() => {
          // Якщо звук УВІМКНЕНО, клік по правій кнопці його ВИМИКАЄ
          if (isSoundEnabled) updateSettings({ isSoundEnabled: false });
        }}
      />
    </View>
  );
}
