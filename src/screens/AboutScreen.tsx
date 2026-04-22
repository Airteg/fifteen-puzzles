import type { GameResultRouteParams } from "@/screens/components/GameResult/result.types";
import React, { useCallback, useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { Props } from "../types/types";

type DebugPreset = {
  id: string;
  title: string;
  description: string;
  params: GameResultRouteParams;
};

function makeIsoMinutesAgo(minutesAgo: number) {
  return new Date(Date.now() - minutesAgo * 60_000).toISOString();
}

const AboutScreen = ({ navigation }: Props<"About">) => {
  const presets = useMemo<DebugPreset[]>(
    () => [
      {
        id: "normal-win-base",
        title: "NORMAL WIN",
        description: "Square video / classic / normal data",
        params: {
          reason: "normal_win",
          durationMs: 83_000,
          moves: 126,
          startedAt: makeIsoMinutesAgo(2),
          mode: "classic",
        },
      },
      {
        id: "record-win-base",
        title: "RECORD WIN",
        description: "Tall video / classic / best result",
        params: {
          reason: "record_win",
          durationMs: 42_000,
          moves: 74,
          startedAt: makeIsoMinutesAgo(1),
          mode: "classic",
        },
      },
      {
        id: "time-loss-base",
        title: "TIME LOSS",
        description: "Square video / limitTime / default loss case",
        params: {
          reason: "time_loss",
          durationMs: 120_000,
          moves: 98,
          startedAt: makeIsoMinutesAgo(2),
          mode: "limitTime",
        },
      },
      {
        id: "normal-win-short",
        title: "WIN / SHORT DATA",
        description: "Compact numbers for quick visual check",
        params: {
          reason: "normal_win",
          durationMs: 19_000,
          moves: 21,
          startedAt: makeIsoMinutesAgo(1),
          mode: "classic",
        },
      },
      {
        id: "normal-win-long",
        title: "WIN / LONG DATA",
        description: "Larger values for rhythm and spacing",
        params: {
          reason: "normal_win",
          durationMs: 599_000,
          moves: 999,
          startedAt: makeIsoMinutesAgo(12),
          mode: "classic",
        },
      },
      {
        id: "time-loss-stress",
        title: "LOSS / STRESS TEXT",
        description: "Checks TIME + MOVES density in accent block",
        params: {
          reason: "time_loss",
          durationMs: 599_000,
          moves: 999,
          startedAt: makeIsoMinutesAgo(15),
          mode: "limitTime",
        },
      },
    ],
    [],
  );

  const openGameResultDebug = useCallback(
    (params: GameResultRouteParams) => {
      navigation.push("GameResult", params);
    },
    [navigation],
  );

  if (!__DEV__) {
    return (
      <View style={styles.root}>
        <View style={styles.card}>
          <Text style={styles.title}>ABOUT / DEBUG</Text>
          <Text style={styles.infoText}>
            Debug launcher is available only in development builds.
          </Text>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>BACK</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>GAME RESULT DEBUG</Text>
          <Text style={styles.infoText}>
            Opens GameResult directly with test route params.
          </Text>
          <Text style={styles.infoText}>
            Use system back gesture/button to return here quickly.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick presets</Text>

          {presets.map((preset) => (
            <Pressable
              key={preset.id}
              style={styles.primaryButton}
              onPress={() => openGameResultDebug(preset.params)}
            >
              <Text style={styles.primaryButtonText}>{preset.title}</Text>
              <Text style={styles.buttonSubtext}>{preset.description}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Navigation</Text>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>BACK</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#D5F7FF",
  },
  content: {
    paddingTop: 32,
    paddingBottom: 40,
    paddingHorizontal: 20,
    rowGap: 20,
  },
  card: {
    backgroundColor: "#EAFBFF",
    borderRadius: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: "#71D4EB",
  },
  section: {
    rowGap: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#216169",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#216169",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 21,
    color: "#2D5157",
    marginBottom: 4,
  },
  primaryButton: {
    backgroundColor: "#71D4EB",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#4BBFD6",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#133D44",
  },
  buttonSubtext: {
    fontSize: 13,
    lineHeight: 18,
    color: "#1E5A63",
    marginTop: 4,
  },
  secondaryButton: {
    backgroundColor: "#EAFBFF",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#71D4EB",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#216169",
    textAlign: "center",
  },
});

export default AboutScreen;
