import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";

import { T } from "@/ui/T";
import type { VideoResultSceneProps } from "./result.types";

// Тимчасово локально.
// Коли додаси resultAssets.ts — перенесемо туди.
const WIN_VIDEOS = [
  require("../../../../assets/video/GoodGame/goodGame (1).mp4"),
  require("../../../../assets/video/GoodGame/goodGame (2).mp4"),
  require("../../../../assets/video/GoodGame/goodGame (3).mp4"),
  require("../../../../assets/video/GoodGame/goodGame (4).mp4"),
  require("../../../../assets/video/GoodGame/goodGame (5).mp4"),
] as const;

const LOSE_VIDEOS = [
  require("../../../../assets/video/TimeUp/timUpGame (1).mp4"),
  require("../../../../assets/video/TimeUp/timUpGame (2).mp4"),
  require("../../../../assets/video/TimeUp/timUpGame (3).mp4"),
  require("../../../../assets/video/TimeUp/timUpGame (4).mp4"),
] as const;

const HOME_DELAY_WIN_MS = 1000;

function formatDuration(durationMs: number) {
  const totalSeconds = Math.max(0, Math.round(durationMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function pickRandomVideo(type: "win" | "lose") {
  const pool = type === "win" ? WIN_VIDEOS : LOSE_VIDEOS;
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

export default function VideoResultScene({
  type,
  durationMs,
  moves,
  onHome,
  onRestart,
}: VideoResultSceneProps) {
  const [showHome, setShowHome] = useState(type === "lose");
  const [showRestart, setShowRestart] = useState(type === "lose");

  const source = useMemo(() => pickRandomVideo(type), [type]);

  const player = useVideoPlayer(source, (playerInstance) => {
    playerInstance.loop = false;
    playerInstance.muted = false;
    playerInstance.play();
  });

  useEffect(() => {
    if (type !== "win") return;

    const timer = setTimeout(() => {
      setShowHome(true);
      setShowRestart(true);
    }, HOME_DELAY_WIN_MS);

    return () => clearTimeout(timer);
  }, [type]);

  return (
    <View style={styles.root}>
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        nativeControls={false}
      />

      <View style={styles.scrim} pointerEvents="none" />

      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.topMeta} pointerEvents="none">
          <T v="body">{type === "win" ? "GOOD GAME" : "TIME UP"}</T>
          <T v="body">{`Time: ${formatDuration(durationMs)}`}</T>
          <T v="body">{`Moves: ${moves}`}</T>
        </View>

        <View style={styles.bottomButtons} pointerEvents="box-none">
          {showRestart ? (
            <Pressable style={styles.actionButton} onPress={onRestart}>
              <T v="body">Restart</T>
            </Pressable>
          ) : null}

          {showHome ? (
            <Pressable style={styles.actionButton} onPress={onHome}>
              <T v="body">Home</T>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000000",
  },

  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.16)",
  },

  overlay: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 36,
  },

  topMeta: {
    alignSelf: "center",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "rgba(213,247,255,0.82)",
  },

  bottomButtons: {
    width: "100%",
    gap: 12,
  },

  actionButton: {
    width: "100%",
    minHeight: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(213,247,255,0.92)",
  },
});
