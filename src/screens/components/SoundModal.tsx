import { useGameState } from "@/context/GameStateProvider";
import { SkiaButtonSound } from "@/ui/skia/SkiaButtonSound";
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
  onClose?: () => void;
};

// Створюємо розширений тип спеціально для сцени
type SceneProps = ModalProps & {
  isSoundEnabled: boolean;
  titleFont: SkFont | null;
};

// ------------------------------------------------------------------
// СПІЛЬНИЙ ХУК ЛЕЙАУТУ (DRY)
// Обчислює геометрію для Skia та RN Overlay
// ------------------------------------------------------------------
function useSoundLayout(
  frame: ModalProps["frame"],
  S: number,
  snap: ModalProps["snap"],
) {
  return useMemo(() => {
    const titleY = snap(42 * S);
    const innerInset = snap(16 * S);
    const innerY = snap(60 * S);
    const innerW = frame.width - innerInset * 2;
    const innerH = frame.height - innerY - innerInset;
    const innerR = snap(8 * S); // радіус для внутрішнього блоку

    const btnSize = snap(60 * S);
    const btnGap = snap(24 * S);

    const btnY = innerY + (innerH - btnSize) / 2;
    const btn1X = frame.width / 2 - btnGap / 2 - btnSize;
    const btn2X = frame.width / 2 + btnGap / 2;

    return {
      titleY,
      innerInset,
      innerY,
      innerW,
      innerH,
      innerR,
      btnSize,
      btnY,
      btn1X,
      btn2X,
    };
  }, [frame.width, frame.height, S, snap]);
}

export function SoundModalScene({
  frame,
  S,
  snap,
  isSoundEnabled = false,
  titleFont,
}: SceneProps) {
  const layout = useSoundLayout(frame, S, snap);

  // Метрики з макета
  const titleText = "SOUND";
  const titleX = titleFont
    ? (frame.width - titleFont.measureText(titleText).width) / 2
    : 0;

  const clipPath = useMemo(
    () =>
      rrect(
        skRect(layout.innerInset, layout.innerY, layout.innerW, layout.innerH),
        layout.innerR,
        layout.innerR,
      ),
    [layout],
  );

  return (
    <Group transform={[{ translateX: frame.x }, { translateY: frame.y }]}>
      {titleFont && (
        <Text
          x={titleX}
          y={layout.titleY}
          text={titleText}
          font={titleFont}
          color="#488B8F"
        />
      )}

      {/* Внутрішній блок із тінню (заглиблення) */}
      <Group clip={clipPath}>
        <RoundedRect
          x={layout.innerInset}
          y={layout.innerY}
          width={layout.innerW}
          height={layout.innerH}
          r={layout.innerR}
          color="#E1F5FE"
        >
          <Shadow inner dx={0} dy={4} blur={8} color="rgba(0,0,0,0.27)" />
        </RoundedRect>
      </Group>

      {/* Кнопки */}
      <SkiaButtonSound
        frame={{ x: layout.btn1X, y: layout.btnY, width: layout.btnSize }}
        type="soundOn"
        active={isSoundEnabled}
      />
      <SkiaButtonSound
        frame={{ x: layout.btn2X, y: layout.btnY, width: layout.btnSize }}
        type="soundOff"
        active={!isSoundEnabled}
      />
    </Group>
  );
}

export function SoundModalOverlay({ frame, S, snap, onClose }: ModalProps) {
  const { settings, updateSettings } = useGameState();
  const isSoundEnabled = settings.isSoundEnabled;

  const layout = useSoundLayout(frame, S, snap);

  const handlePress = (newValue: boolean) => {
    if (isSoundEnabled !== newValue) {
      updateSettings({ isSoundEnabled: newValue });
    }

    if (onClose) {
      setTimeout(() => {
        onClose();
      }, 300);
    }
  };

  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: frame.width,
        height: frame.height,
      }}
    >
      <Pressable
        style={{
          position: "absolute",
          left: layout.btn1X,
          top: layout.btnY,
          width: layout.btnSize,
          height: layout.btnSize,
        }}
        onPress={() => handlePress(true)}
      />
      <Pressable
        style={{
          position: "absolute",
          left: layout.btn2X,
          top: layout.btnY,
          width: layout.btnSize,
          height: layout.btnSize,
        }}
        onPress={() => handlePress(false)}
      />
    </View>
  );
}
