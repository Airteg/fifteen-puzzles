import { Canvas, Rect, RoundedRect } from "@shopify/react-native-skia";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

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
  // Імітація завершення анімації появи.
  // У бойовій версії тут буде runOnJS(onReady)() з Reanimated worklet'а
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
      {/* 1. Skia Scene */}
      <Canvas style={StyleSheet.absoluteFill}>
        {/* Коректний бекграунд на весь екран */}
        <Rect x={0} y={0} width={sw} height={sh} color="rgba(0,0,0,0.5)" />

        {/* Базовий фрейм модалки (спільний для Skia та RN) */}
        <RoundedRect
          x={modalFrame.x}
          y={modalFrame.y}
          width={modalFrame.width}
          height={modalFrame.height}
          r={16}
          color="#71D4EB" // Колір панелей (fill) з AppHeaderSurface/PanelSurface
        />
      </Canvas>

      {/* 2. React Native Overlay */}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {/* Backdrop: закриває модалку */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        {/* Контент позиціонується СУВОРО по modalFrame */}
        {/* Замінюємо View на Pressable, щоб він став мішенню для жестів і поглинав кліки */}
        <Pressable
          style={{
            position: "absolute",
            left: modalFrame.x,
            top: modalFrame.y,
            width: modalFrame.width,
            height: modalFrame.height,
            justifyContent: "center",
            alignItems: "center",
          }}
          // Порожній onPress або stopPropagation гарантує, що клік не піде нижче у backdrop
          onPress={(e) => {
            e.stopPropagation();
          }}
        >
          <Text style={styles.tempTitle}>
            MODAL: {activeModal.toUpperCase()}
          </Text>
          <Pressable onPress={onClose} style={styles.tempCloseBtn}>
            <Text style={styles.tempCloseText}>CLOSE</Text>
          </Pressable>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tempTitle: {
    color: "#216169", // Колір тексту з typography
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
  },
  tempCloseBtn: {
    backgroundColor: "#FF5252",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  tempCloseText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
