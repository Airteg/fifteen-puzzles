import { useVideoPlayer, VideoView } from "expo-video";
import React from "react";
import { StyleSheet, View } from "react-native";

import type { GameResultPresentation } from "./result.types";
import type { GameResultFrame, GameResultLayout } from "./useGameResultLayout";

type Props = {
  layout: GameResultLayout;
  presentation: GameResultPresentation;
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

export default function GameResultVideoLayer({ layout, presentation }: Props) {
  const player = useVideoPlayer(presentation.video.source, (playerInstance) => {
    playerInstance.loop = false;
    playerInstance.muted = false;
    playerInstance.play();
  });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View
        style={[
          frameStyle(layout.videoFrame),
          styles.shadowWrap,
          { borderRadius: layout.videoRadius },
        ]}
      >
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: layout.videoRadius,
              backgroundColor: "#101315",
              overflow: "hidden",
            },
          ]}
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    shadowColor: "#000",
    shadowOpacity: 0.28,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
    backgroundColor: "transparent",
  },
});
