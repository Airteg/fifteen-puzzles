import AsyncStorage from "@react-native-async-storage/async-storage";

import { STORAGE_KEYS } from "./storageKeys";
import type {
  AppStorageData,
  GameResult,
  GameSettings,
} from "./appStorage.types";
import { DEFAULT_APP_STORAGE } from "./appStorage.types";

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
    settings: {
      ...DEFAULT_APP_STORAGE.settings,
      ...(parsed?.settings ?? {}),
    },
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
      settings: {
        ...DEFAULT_APP_STORAGE.settings,
        ...data.settings,
      },
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

export async function loadSettings(): Promise<GameSettings> {
  const data = await loadAppStorage();
  return data.settings;
}

export async function saveSettings(settings: GameSettings): Promise<void> {
  const data = await loadAppStorage();

  await saveAppStorage({
    ...data,
    settings: {
      ...DEFAULT_APP_STORAGE.settings,
      ...settings,
    },
  });
}

export async function patchSettings(
  patch: Partial<GameSettings>,
): Promise<GameSettings> {
  const data = await loadAppStorage();

  const nextSettings: GameSettings = {
    ...data.settings,
    ...patch,
  };

  await saveAppStorage({
    ...data,
    settings: nextSettings,
  });

  return nextSettings;
}

export async function loadBestGames(): Promise<GameResult[]> {
  const data = await loadAppStorage();
  return data.bestGames;
}

export async function addGameResult(result: GameResult): Promise<GameResult[]> {
  const data = await loadAppStorage();

  const nextBestGames = normalizeBestGames([...data.bestGames, result]);

  await saveAppStorage({
    ...data,
    bestGames: nextBestGames,
  });

  return nextBestGames;
}

export async function clearBestGames(): Promise<void> {
  const data = await loadAppStorage();

  await saveAppStorage({
    ...data,
    bestGames: [],
  });
}
