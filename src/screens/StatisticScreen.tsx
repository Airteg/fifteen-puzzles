import {
  useLayoutDevice,
  useLayoutRenderHelpers,
  useSettingsLayout,
} from "@/context/LayoutSnapshotProvider";
import { useGameState } from "@/context/GameStateProvider";
import {
  getStatisticInitialContentHeight,
  StatisticItemVm,
  StatisticModalOverlay,
  StatisticModalScene,
  StatisticSummaryVm,
  useStatisticLayout,
} from "@/screens/components/StatisticModal";
import { Canvas, Rect } from "@shopify/react-native-skia";
import React, { useMemo, useState } from "react";
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
  const { bestGames, statistics, resetStatistics } = useGameState();
  const [contentHeight, setContentHeight] = useState(() =>
    getStatisticInitialContentHeight(modalDefaultFrame, S, snap),
  );

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
    [statistics.bestTime, statistics.bestMoves],
  );

  const layout = useStatisticLayout(modalDefaultFrame, S, snap, contentHeight);

  const modalFrame = useMemo(
    () => ({
      ...modalDefaultFrame,
      y: snap(
        modalDefaultFrame.y +
          (modalDefaultFrame.height - layout.totalHeight) / 2,
      ),
      height: layout.totalHeight,
    }),
    [layout.totalHeight, modalDefaultFrame, snap],
  );

  return (
    <View style={StyleSheet.absoluteFill}>
      <Canvas style={StyleSheet.absoluteFill}>
        <Rect x={0} y={0} width={sw} height={sh} color="rgba(0,0,0,0.45)" />

        <StatisticModalScene
          frame={modalFrame}
          S={S}
          snap={snap}
          contentHeight={contentHeight}
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
            top: modalFrame.y,
            width: modalFrame.width,
            height: modalFrame.height,
          }}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <StatisticModalOverlay
              frame={modalFrame}
              S={S}
              snap={snap}
              items={items}
              summary={summary}
              contentHeight={contentHeight}
              onContentHeightChange={setContentHeight}
              onBack={() => navigation.goBack()}
              onResetStatistics={resetStatistics}
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default StatisticScreen;
