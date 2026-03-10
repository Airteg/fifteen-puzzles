import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useLayoutMetrics } from "@/context/LayoutMetricsProvider";
import { RootStackParamList } from "@/types/types";

import { useSkiaFonts } from "@/context/FontProvider";
import { GameBoardView } from "@/ui/game/GameBoardView";
import { shuffleTiles } from "@/ui/game/gameEngine/shuffleTiles";
import { GameScreenShell } from "@/ui/shell/GameScreenShell";

type Props = NativeStackScreenProps<RootStackParamList, "Game">;

const GameScreen: React.FC<Props> = ({ route, navigation }) => {
  const { title: tileFont } = useSkiaFonts();
  const { S, snap } = useLayoutMetrics();

  const mode = route.params?.mode || "classic";

  // Boot-only grid: читається GameBoard controller-ом лише під час першого mount.
  const bootGridRef = useRef<number[] | null>(null);

  if (!bootGridRef.current) {
    bootGridRef.current = shuffleTiles();
  }

  const timerNode =
    mode === "limitTime" ? (
      <View
        style={[
          styles.tempTimer,
          { height: snap(40 * S), borderRadius: snap(8 * S) },
        ]}
      >
        <Text style={styles.tempText}>⏱ TIME 02:42</Text>
      </View>
    ) : undefined;

  const buttonsNode = (
    <View style={[styles.tempButtons, { height: snap(80 * S) }]}>
      <View
        style={[
          styles.tempBtn,
          { width: snap(80 * S), borderRadius: snap(8 * S) },
        ]}
      >
        <Text>HOME</Text>
      </View>
      <View
        style={[
          styles.tempBtn,
          { width: snap(80 * S), borderRadius: snap(8 * S) },
        ]}
      >
        <Text>RESTART</Text>
      </View>
    </View>
  );

  const ctaNode = (
    <View
      style={[
        styles.tempCta,
        { height: snap(45 * S), borderRadius: snap(8 * S) },
      ]}
    >
      <Text style={styles.tempText}>
        {mode === "classic" ? "CLASSIC" : "LIMIT TIME"}
      </Text>
    </View>
  );

  return (
    <GameScreenShell
      timer={timerNode}
      board={
        <GameBoardView
          tileFont={tileFont}
          bootGrid={bootGridRef.current ?? undefined}
        />
      }
      buttons={buttonsNode}
      cta={ctaNode}
    />
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  tempTimer: {
    backgroundColor: "#E4FF00",
    justifyContent: "center",
    alignItems: "center",
  },
  tempButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tempBtn: {
    height: "100%",
    backgroundColor: "#4DD0E1",
    justifyContent: "center",
    alignItems: "center",
  },
  tempCta: {
    backgroundColor: "#E0F7FA",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#B2EBF2",
  },
  tempText: { color: "#216169", fontWeight: "bold" },
});
