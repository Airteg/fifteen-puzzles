import React from "react";
import { Pressable, View } from "react-native";
import type { OverlayProps } from "./StatisticModal.types";
import { useStatisticLayout } from "./useStatisticLayout";

export function StatisticModalOverlay({
  frame,
  S,
  snap,
  onBack,
  onResetStatistics,
}: OverlayProps) {
  // Чорново рахуємо 10 рядків, бо дизайн зараз теж під 10.
  const layout = useStatisticLayout(frame, S, snap, 10);

  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: frame.width,
        height: frame.height,
      }}
      pointerEvents="box-none"
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Reset statistics"
        style={{
          position: "absolute",
          left: layout.resetButtonRect.x,
          top: layout.resetButtonRect.y,
          width: layout.resetButtonRect.width,
          height: layout.resetButtonRect.height,
        }}
        onPress={onResetStatistics}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        style={{
          position: "absolute",
          left: layout.backButtonRect.x,
          top: layout.backButtonRect.y,
          width: layout.backButtonRect.width,
          height: layout.backButtonRect.height,
        }}
        onPress={onBack}
      />
    </View>
  );
}
