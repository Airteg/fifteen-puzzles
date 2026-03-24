import { useSkiaFonts } from "@/context/FontProvider";
import { useGameState } from "@/context/GameStateProvider";
import { useLayoutMetrics } from "@/context/LayoutMetricsProvider";
import { Canvas, Rect, RoundedRect } from "@shopify/react-native-skia";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { SoundModalOverlay, SoundModalScene } from "./SoundModal";
import { SkinModalOverlay, SkinModalScene } from "./SkinModal";

export type SettingsModalType = "skin" | "sound" | "statistic";

type SceneFrame = { x: number; y: number; width: number; height: number };

interface Props {
  activeModal: SettingsModalType;
  onClose: () => void;
  modalFrame: SceneFrame;
  sw: number;
  sh: number;
  modalOpacity: SharedValue<number>;
}

export function SettingsModalHost({
  activeModal,
  onClose,
  modalFrame,
  sw,
  sh,
  modalOpacity,
}: Props) {
  const { S, snap } = useLayoutMetrics();
  const { settings } = useGameState();
  const { title: titleFont } = useSkiaFonts();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: modalOpacity.value,
    };
  });

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, animatedStyle]}
      accessible={true}
      importantForAccessibility="yes"
      accessibilityViewIsModal={true}
    >
      <Canvas style={StyleSheet.absoluteFill}>
        <Rect x={0} y={0} width={sw} height={sh} color="rgba(0,0,0,0.5)" />

        <RoundedRect
          x={modalFrame.x}
          y={modalFrame.y}
          width={modalFrame.width}
          height={modalFrame.height}
          r={snap(16 * S)}
          color="#71D4EB"
        />

        {activeModal === "sound" && (
          <SoundModalScene
            frame={modalFrame}
            S={S}
            snap={snap}
            isSoundEnabled={settings.isSoundEnabled}
            titleFont={titleFont}
          />
        )}

        {activeModal === "skin" && (
          <SkinModalScene
            frame={modalFrame}
            S={S}
            snap={snap}
            titleFont={titleFont}
            boardColor={settings.boardColor}
            tileColor={settings.tileColor}
          />
        )}
      </Canvas>

      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <Pressable
          style={{
            position: "absolute",
            left: modalFrame.x,
            top: modalFrame.y,
            width: modalFrame.width,
            height: modalFrame.height,
          }}
          onPress={(e) => {
            e.stopPropagation();
          }}
        >
          {activeModal === "sound" && (
            <SoundModalOverlay
              frame={modalFrame}
              S={S}
              snap={snap}
              onClose={onClose}
            />
          )}

          {activeModal === "skin" && (
            <SkinModalOverlay frame={modalFrame} S={S} snap={snap} />
          )}
        </Pressable>
      </View>
    </Animated.View>
  );
}
