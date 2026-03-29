import { useSkiaFonts } from "@/context/FontProvider";
import { useGameState } from "@/context/GameStateProvider";
import { Canvas, Group, Rect, RoundedRect } from "@shopify/react-native-skia";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SharedValue, useDerivedValue } from "react-native-reanimated";

import { useLayoutRenderHelpers } from "@/context/LayoutSnapshotProvider";
import { SkinModalOverlay, SkinModalScene } from "./SkinModal";
import { SoundModalOverlay, SoundModalScene } from "./SoundModal";

export type SettingsModalType = "skin" | "sound" | "statistic";

type SceneFrame = { x: number; y: number; width: number; height: number };

interface Props {
  activeModal: SettingsModalType | null;
  onClose: () => void;
  defaultFrame: SceneFrame;
  soundFrame: SceneFrame;
  sw: number;
  sh: number;
  modalOpacity: SharedValue<number>;
}

export function SettingsModalHost({
  activeModal,
  onClose,
  defaultFrame,
  soundFrame,
  sw,
  sh,
  modalOpacity,
}: Props) {
  const { S, snap } = useLayoutRenderHelpers();
  const { settings } = useGameState();

  const { title: titleFont } = useSkiaFonts();
  const hasActiveModal = activeModal !== null;

  const backdropOpacity = useDerivedValue(() => modalOpacity.value * 0.5);
  const skinOpacity = useDerivedValue(
    () => (activeModal === "skin" ? modalOpacity.value : 0),
    [activeModal, modalOpacity],
  );
  const soundOpacity = useDerivedValue(
    () => (activeModal === "sound" ? modalOpacity.value : 0),
    [activeModal, modalOpacity],
  );

  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents={hasActiveModal ? "auto" : "none"}
      accessible={hasActiveModal}
      importantForAccessibility={hasActiveModal ? "yes" : "no-hide-descendants"}
      accessibilityViewIsModal={hasActiveModal}
    >
      <Canvas style={StyleSheet.absoluteFill}>
        <Rect
          x={0}
          y={0}
          width={sw}
          height={sh}
          color="rgba(0,0,0,0.5)"
          opacity={backdropOpacity}
        />

        <Group opacity={soundOpacity}>
          <RoundedRect
            x={soundFrame.x}
            y={soundFrame.y}
            width={soundFrame.width}
            height={soundFrame.height}
            r={snap(16 * S)}
            color="#71D4EB"
          />
          <SoundModalScene
            frame={soundFrame}
            S={S}
            snap={snap}
            isSoundEnabled={settings.isSoundEnabled}
            titleFont={titleFont}
          />
        </Group>

        <Group opacity={skinOpacity}>
          <RoundedRect
            x={defaultFrame.x}
            y={defaultFrame.y}
            width={defaultFrame.width}
            height={defaultFrame.height}
            r={snap(16 * S)}
            color="#71D4EB"
          />
          <SkinModalScene
            frame={defaultFrame}
            S={S}
            snap={snap}
            titleFont={titleFont}
            boardColor={settings.boardColor}
            tileColor={settings.tileColor}
          />
        </Group>
      </Canvas>

      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <Pressable
          style={StyleSheet.absoluteFill}
          pointerEvents={hasActiveModal ? "auto" : "none"}
          onPress={onClose}
        />

        <Pressable
          style={{
            position: "absolute",
            left: soundFrame.x,
            top: soundFrame.y,
            width: soundFrame.width,
            height: soundFrame.height,
          }}
          pointerEvents={activeModal === "sound" ? "auto" : "none"}
          onPress={(e) => {
            e.stopPropagation();
          }}
        >
          <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <SoundModalOverlay
              frame={soundFrame}
              S={S}
              snap={snap}
              onClose={onClose}
            />
          </View>
        </Pressable>

        <Pressable
          style={{
            position: "absolute",
            left: defaultFrame.x,
            top: defaultFrame.y,
            width: defaultFrame.width,
            height: defaultFrame.height,
          }}
          pointerEvents={activeModal === "skin" ? "auto" : "none"}
          onPress={(e) => {
            e.stopPropagation();
          }}
        >
          <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <SkinModalOverlay frame={defaultFrame} S={S} snap={snap} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}
