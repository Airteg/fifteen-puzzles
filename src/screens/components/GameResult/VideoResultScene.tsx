import type { VideoResultSceneProps } from "./result.types";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

const RESULT_LABELS: Record<VideoResultSceneProps["type"], string> = {
  win: "WIN",
  lose: "LOSE",
};

const VideoResultScene: React.FC<VideoResultSceneProps> = ({
  type,
  durationMs,
  moves,
  onHome,
  onRestart,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{RESULT_LABELS[type]}</Text>
      <Text style={styles.meta}>Duration: {durationMs} ms</Text>
      <Text style={styles.meta}>Moves: {moves}</Text>

      <View style={styles.buttons}>
        <Button title="Home" onPress={onHome} />
        <Button title="Restart" onPress={onRestart} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 24,
    backgroundColor: "#111111",
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "700",
  },
  meta: {
    color: "#cfcfcf",
    fontSize: 16,
  },
  buttons: {
    width: "100%",
    gap: 12,
    marginTop: 8,
  },
});

export default VideoResultScene;
