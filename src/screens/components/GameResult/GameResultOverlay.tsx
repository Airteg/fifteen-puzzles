import { useGameState } from "@/context/GameStateProvider";
import { soundManager } from "@/utils/soundManager";
import { useVideoPlayer, VideoView } from "expo-video";
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
  const player = useVideoPlayer(presentation.video.source, (playerInstance) => {
    playerInstance.loop = false;
    playerInstance.muted = false;
    playerInstance.play();
  });

  const handlePrimaryPress = useCallback(() => {
    soundManager.playPressButton(settings.isSoundEnabled);
    onPrimaryAction();
  }, [onPrimaryAction, settings.isSoundEnabled]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <View
        style={[
          frameStyle(layout.videoFrame),
          {
            borderRadius: layout.videoRadius,
            backgroundColor: "#000000",
            overflow: "hidden",
          },
        ]}
        pointerEvents="none"
      >
        <VideoView
          player={player}
          style={StyleSheet.absoluteFill}
          contentFit="contain"
          nativeControls={false}
          fullscreenOptions={{ enable: false }}
          allowsPictureInPicture={false}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={presentation.primaryAction.accessibilityLabel}
        onPress={handlePrimaryPress}
        style={frameStyle(layout.primaryButtonFrame)}
      />
    </View>
  );
}
