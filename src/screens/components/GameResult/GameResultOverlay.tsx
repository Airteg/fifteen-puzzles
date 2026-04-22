import { useGameState } from "@/context/GameStateProvider";
import { soundManager } from "@/utils/soundManager";
import React, { useCallback } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import type { GameResultPresentation } from "./result.types";
import type { GameResultFrame, GameResultLayout } from "./useGameResultLayout";

type Props = {
  layout: GameResultLayout;
  presentation: GameResultPresentation;
  onPrimaryAction: () => void;
};

function frameStyle(frame: GameResultFrame) {
  return {
    position: "absolute" as const,
    left: frame.x,
    top: frame.y,
    width: frame.width,
    height: frame.height,
  };
}

export default function GameResultOverlay({
  layout,
  presentation,
  onPrimaryAction,
}: Props) {
  const { settings } = useGameState();

  const handlePrimaryPress = useCallback(() => {
    soundManager.playPressButton(settings.isSoundEnabled);
    onPrimaryAction();
  }, [onPrimaryAction, settings.isSoundEnabled]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={presentation.primaryAction.accessibilityLabel}
        onPress={handlePrimaryPress}
        style={frameStyle(layout.primaryButtonFrame)}
      />
    </View>
  );
}
