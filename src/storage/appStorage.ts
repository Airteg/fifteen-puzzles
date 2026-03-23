import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  AppStorageData,
  DEFAULT_APP_STORAGE,
  GameResult,
} from "./appStorage.types";
import { STORAGE_KEYS } from "./storageKeys";

function normalizeBestGames(bestGames: GameResult[]): GameResult[] {
  return [...bestGames]
    .filter(
      (item) =>
        typeof item.id === "string" &&
        typeof item.durationMs === "number" &&
        Number.isFinite(item.durationMs) &&
        typeof item.playedAt === "string",
    )
    .sort((a, b) => a.durationMs - b.durationMs)
    .slice(0, 10);
}

function mergeWithDefaults(
  parsed: Partial<AppStorageData> | null | undefined,
): AppStorageData {
  return {
    settings: { ...DEFAULT_APP_STORAGE.settings, ...(parsed?.settings ?? {}) },
    statistics: {
      ...DEFAULT_APP_STORAGE.statistics,
      ...(parsed?.statistics ?? {}),
    },
    gameState: parsed?.gameState ?? null,
    bestGames: normalizeBestGames(parsed?.bestGames ?? []),
  };
}

export async function loadAppStorage(): Promise<AppStorageData> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.APP_DATA);
    if (!raw) return DEFAULT_APP_STORAGE;

    const parsed = JSON.parse(raw) as Partial<AppStorageData>;
    return mergeWithDefaults(parsed);
  } catch (error) {
    console.error("Failed to load app storage", error);
    return DEFAULT_APP_STORAGE;
  }
}

export async function saveAppStorage(data: AppStorageData): Promise<void> {
  try {
    const normalized: AppStorageData = {
      settings: { ...DEFAULT_APP_STORAGE.settings, ...data.settings },
      statistics: { ...DEFAULT_APP_STORAGE.statistics, ...data.statistics },
      gameState: data.gameState,
      bestGames: normalizeBestGames(data.bestGames),
    };
    await AsyncStorage.setItem(
      STORAGE_KEYS.APP_DATA,
      JSON.stringify(normalized),
    );
  } catch (error) {
    console.error("Failed to save app storage", error);
  }
}
