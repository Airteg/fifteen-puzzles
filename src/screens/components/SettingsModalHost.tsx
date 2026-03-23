import { useSkiaFonts } from "@/context/FontProvider";
import { useGameState } from "@/context/GameStateProvider";
import { useLayoutMetrics } from "@/context/LayoutMetricsProvider";
import { Canvas, Rect, RoundedRect } from "@shopify/react-native-skia";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SkinModalScene } from "./SkinModal";
import { SoundModalOverlay, SoundModalScene } from "./SoundModal";

export type SettingsModalType = "skin" | "sound" | "statistic";

type SceneFrame = { x: number; y: number; width: number; height: number };

interface Props {
  activeModal: SettingsModalType;
  onClose: () => void;
  onReady?: () => void;
  modalFrame: SceneFrame;
  sw: number;
  sh: number;
}

export function SettingsModalHost({
  activeModal,
  onClose,
  onReady,
  modalFrame,
  sw,
  sh,
}: Props) {
  const { S, snap } = useLayoutMetrics();

  // ВИПРАВЛЕНО: Дістаємо канонічний об'єкт settings
  const { settings } = useGameState();
  const { title: titleFont } = useSkiaFonts();

  useEffect(() => {
    if (onReady) onReady();
  }, [onReady]);

  return (
    <View
      style={StyleSheet.absoluteFill}
      accessible={true}
      importantForAccessibility="yes"
      accessibilityViewIsModal={true}
    >
      <Canvas style={StyleSheet.absoluteFill}>
        <Rect x={0} y={0} width={sw} height={sh} color="rgba(0,0,0,0.5)" />

        {/* Базовий блакитний бекграунд */}
        <RoundedRect
          x={modalFrame.x}
          y={modalFrame.y}
          width={modalFrame.width}
          height={modalFrame.height}
          r={16}
          color="#71D4EB"
        />

        {/* Сцена конкретної модалки */}
        {activeModal === "sound" && (
          <SoundModalScene
            frame={modalFrame}
            S={S}
            snap={snap}
            isSoundEnabled={settings.isSoundEnabled} // <--- Читаємо з settings
            titleFont={titleFont}
          />
        )}
        {/* Сцена SKIN */}
        {activeModal === "skin" && (
          <SkinModalScene
            frame={modalFrame}
            S={S}
            snap={snap}
            titleFont={titleFont}
            boardColor={settings.boardColor} // <--- Читаємо з settings
            tileColor={settings.tileColor} // <--- Читаємо з settings
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
          {/* Оверлей конкретної модалки */}
          {activeModal === "sound" && (
            <SoundModalOverlay frame={modalFrame} S={S} snap={snap} />
          )}
        </Pressable>
      </View>
    </View>
  );
}
