import VideoResultScene from "@/screens/components/GameResult/VideoResultScene";
import WinRecordScene from "@/screens/components/GameResult/WinRecordScene";
import { Props } from "@/types/types";
import React, { useCallback } from "react";
import { View } from "react-native";

const GameResultScreen: React.FC<Props<"GameResult">> = ({
  navigation,
  route,
}) => {
  const { mode, reason, durationMs, moves, startedAt } = route.params;

  const handleHomePress = useCallback(() => {
    navigation.popToTop();
  }, [navigation]);

  const handleRestartPress = useCallback(() => {
    navigation.replace("Game", { mode });
  }, [mode, navigation]);

  switch (reason) {
    case "record_win":
      return (
        <WinRecordScene
          reason={reason}
          durationMs={durationMs}
          moves={moves}
          startedAt={startedAt}
          mode={mode}
          onHome={handleHomePress}
          onRestart={handleRestartPress}
        />
      );

    case "normal_win":
      return (
        <VideoResultScene
          reason={reason}
          type="win"
          durationMs={durationMs}
          moves={moves}
          startedAt={startedAt}
          mode={mode}
          onHome={handleHomePress}
          onRestart={handleRestartPress}
        />
      );

    case "time_loss":
      return (
        <VideoResultScene
          reason={reason}
          type="lose"
          durationMs={durationMs}
          moves={moves}
          startedAt={startedAt}
          mode={mode}
          onHome={handleHomePress}
          onRestart={handleRestartPress}
        />
      );
  }

  return <View style={{ flex: 1, backgroundColor: "#111111" }} />;
};

export default GameResultScreen;
