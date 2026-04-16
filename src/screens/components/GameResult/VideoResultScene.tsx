import {
  useLayoutDevice,
  useLayoutRenderHelpers,
} from "@/context/LayoutSnapshotProvider";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { T } from "@/ui/T";
import type { VideoResultSceneProps } from "./result.types";

type VideoAssetEntry = {
  source: number;
  aspectRatio: number; // width / height
};

const WIN_VIDEOS: readonly VideoAssetEntry[] = [
  {
    source: require("../../../../assets/video/GoodGame/goodGame1.mp4"),
    aspectRatio: 16 / 9,
  },
  {
    source: require("../../../../assets/video/GoodGame/goodGame2.mp4"),
    aspectRatio: 16 / 9,
  },
  {
    source: require("../../../../assets/video/GoodGame/goodGame3.mp4"),
    aspectRatio: 16 / 9,
  },
  {
    source: require("../../../../assets/video/GoodGame/goodGame4.mp4"),
    aspectRatio: 16 / 9,
  },
  {
    source: require("../../../../assets/video/GoodGame/goodGame5.mp4"),
    aspectRatio: 16 / 9,
  },
] as const;

const LOSE_VIDEOS: readonly VideoAssetEntry[] = [
  {
    source: require("../../../../assets/video/TimeUp/timUpGame1.mp4"),
    aspectRatio: 16 / 9,
  },
  {
    source: require("../../../../assets/video/TimeUp/timUpGame2.mp4"),
    aspectRatio: 16 / 9,
  },
  {
    source: require("../../../../assets/video/TimeUp/timUpGame3.mp4"),
    aspectRatio: 16 / 9,
  },
  {
    source: require("../../../../assets/video/TimeUp/timUpGame4.mp4"),
    aspectRatio: 16 / 9,
  },
] as const;

const HOME_DELAY_WIN_MS = 1000;

function formatDuration(durationMs: number) {
  const totalSeconds = Math.max(0, Math.round(durationMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function pickRandomVideo(type: "win" | "lose"): VideoAssetEntry {
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
  const { screenW } = useLayoutDevice();
  const { snap } = useLayoutRenderHelpers();

  const [showHome, setShowHome] = useState(type === "lose");
  const [showRestart, setShowRestart] = useState(type === "lose");

  const selectedVideo = useMemo(() => pickRandomVideo(type), [type]);
  const videoFrameWidth = snap(screenW * 0.9);

  const player = useVideoPlayer(selectedVideo.source, (playerInstance) => {
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
      <View style={styles.videoArea} pointerEvents="none">
        <View
          style={[
            styles.videoFrame,
            {
              width: videoFrameWidth,
              aspectRatio: selectedVideo.aspectRatio,
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
    backgroundColor: "#111111",
  },

  videoArea: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },

  videoFrame: {
    overflow: "hidden",
    borderRadius: 16,
    backgroundColor: "#000000",
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
