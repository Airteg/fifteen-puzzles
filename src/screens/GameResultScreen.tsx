import {
  GameResultOverlay,
  GameResultScene,
  resolveGameResultPresentation,
  useGameResultLayout,
} from "@/screens/components/GameResult";
import GameResultVideoLayer from "@/screens/components/GameResult/GameResultVideoLayer";
import { Props } from "@/types/types";
import React, { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";

const GameResultScreen: React.FC<Props<"GameResult">> = ({
  navigation,
  route,
}) => {
  const { reason, durationMs, moves } = route.params;
  console.log("🚀 ~ reason:", reason);
  const presentation = useMemo(
    () => resolveGameResultPresentation(reason),
    [reason],
  );
  const layout = useGameResultLayout(presentation.video.variant);

  const handlePrimaryAction = useCallback(() => {
    if (presentation.primaryAction.kind === "home") {
      navigation.popToTop();
      return;
    }

    navigation.reset({
      index: 1,
      routes: [{ name: "Home" }, { name: "NewGame" }],
    });
  }, [navigation, presentation.primaryAction.kind]);

  return (
    <View style={styles.root}>
      <GameResultVideoLayer layout={layout} presentation={presentation} />

      <GameResultScene
        layout={layout}
        presentation={presentation}
        durationMs={durationMs}
        moves={moves}
      />
      <GameResultOverlay
        layout={layout}
        presentation={presentation}
        onPrimaryAction={handlePrimaryAction}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#D5F7FF",
  },
});

export default GameResultScreen;
