import {
  useLayoutDevice,
  useLayoutRenderHelpers,
  useSettingsLayout,
} from "@/context/LayoutSnapshotProvider";
import { useSkiaFonts } from "@/context/FontProvider";
import { useGameState } from "@/context/GameStateProvider";
import {
  StatisticItemVm,
  StatisticModalOverlay,
  StatisticModalScene,
  StatisticSummaryVm,
} from "@/screens/components/StatisticModal";
import { PanelSurface } from "@/ui/skia/PanelSurface";
import { Canvas, Rect } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Props } from "../types/types";

function formatDuration(durationMs: number) {
  const totalSeconds = Math.max(0, Math.round(durationMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "--/--";
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${month}/${day}`;
}

const StatisticScreen = ({ navigation }: Props<"Statistic">) => {
  const { screenW: sw, screenH: sh } = useLayoutDevice();
  const { modalDefaultFrame } = useSettingsLayout();
  const { S, snap } = useLayoutRenderHelpers();
  const { title: titleFont, body: bodyFont } = useSkiaFonts();
  const { bestGames, statistics } = useGameState();

  const items = useMemo<StatisticItemVm[]>(
    () =>
      [...bestGames]
        .sort((a, b) => a.durationMs - b.durationMs || a.moves - b.moves)
        .slice(0, 10)
        .map((item, index) => ({
          id: item.id,
          rank: index + 1,
          durationText: formatDuration(item.durationMs),
          movesText: String(item.moves),
          dateText: formatDate(item.startedAt),
        })),
    [bestGames],
  );

  const summary = useMemo<StatisticSummaryVm>(
    () => ({
      bestTimeText:
        statistics.bestTime > 0 ? formatDuration(statistics.bestTime) : "--:--",
      bestMovesText:
        statistics.bestMoves > 0 ? String(statistics.bestMoves) : "---",
    }),
    [statistics.bestMoves, statistics.bestTime],
  );

  return (
    <View style={StyleSheet.absoluteFill}>
      <Canvas style={StyleSheet.absoluteFill}>
        <Rect x={0} y={0} width={sw} height={sh} color="rgba(0,0,0,0.45)" />

        <StatisticModalScene
          frame={modalDefaultFrame}
          S={S}
          snap={snap}
          titleFont={titleFont}
          bodyFont={bodyFont}
          summary={summary}
          items={items}
        />
      </Canvas>

      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => navigation.goBack()}
        />

        <Pressable
          style={{
            position: "absolute",
            left: modalDefaultFrame.x,
            top: modalDefaultFrame.y,
            width: modalDefaultFrame.width,
            height: modalDefaultFrame.height,
          }}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <StatisticModalOverlay
              frame={modalDefaultFrame}
              S={S}
              snap={snap}
              onBack={() => navigation.goBack()}
              onResetStatistics={() => {
                // Поки що заглушка.
                // Коли дійдемо до логіки — підключимо окремий reset action.
                console.log("TODO: reset statistics");
              }}
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default StatisticScreen;
