import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  AppStorageData,
  DEFAULT_APP_STORAGE,
  GameResult,
} from "./appStorage.types";
import { STORAGE_KEYS } from "./storageKeys";

const MAX_BEST_GAMES = 10;

type StoredGameResult = Partial<GameResult> & {
  playedAt?: unknown;
};

function normalizeGameResult(item: StoredGameResult): GameResult | null {
  const startedAt =
    typeof item.startedAt === "string"
      ? item.startedAt
      : typeof item.playedAt === "string"
        ? item.playedAt
        : null;

  if (
    typeof item.id !== "string" ||
    item.id.length === 0 ||
    typeof item.durationMs !== "number" ||
    !Number.isFinite(item.durationMs) ||
    item.durationMs < 0 ||
    typeof item.moves !== "number" ||
    !Number.isFinite(item.moves) ||
    item.moves < 0 ||
    startedAt === null
  ) {
    return null;
  }

  return {
    id: item.id,
    startedAt,
    durationMs: Math.max(0, Math.round(item.durationMs)),
    moves: Math.max(0, Math.round(item.moves)),
  };
}

export function normalizeBestGames(bestGames: unknown): GameResult[] {
  if (!Array.isArray(bestGames)) {
    return [];
  }

  return bestGames
    .map((item) => normalizeGameResult(item as StoredGameResult))
    .filter((item): item is GameResult => item !== null)
    .sort((a, b) => a.durationMs - b.durationMs)
    .slice(0, MAX_BEST_GAMES);
}

export function insertBestGame(
  bestGames: GameResult[],
  candidate: GameResult,
): GameResult[] {
  const normalizedBestGames = normalizeBestGames(bestGames);
  const normalizedCandidate = normalizeGameResult(candidate);

  if (normalizedCandidate === null) {
    return normalizedBestGames;
  }

  if (normalizedBestGames.length < MAX_BEST_GAMES) {
    return normalizeBestGames([...normalizedBestGames, normalizedCandidate]);
  }

  const worstGame = normalizedBestGames[normalizedBestGames.length - 1];
  if (normalizedCandidate.durationMs >= worstGame.durationMs) {
    return normalizedBestGames;
  }

  return normalizeBestGames([
    ...normalizedBestGames.slice(0, -1),
    normalizedCandidate,
  ]);
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
    bestGames: normalizeBestGames(parsed?.bestGames),
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
