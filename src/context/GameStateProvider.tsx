import {
  insertBestGame,
  loadAppStorage,
  saveAppStorage,
} from "@/storage/appStorage";
import {
  AppStorageData,
  DEFAULT_APP_STORAGE,
  DEFAULT_STATISTICS,
  GameSettings,
  GameResult,
  GameState,
  Statistics,
} from "@/storage/appStorage.types";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type CompletedGameResult = Omit<GameResult, "id">;

interface GameContextType {
  isHydrated: boolean;

  gameState: GameState | null;
  statistics: Statistics;
  settings: GameSettings;
  bestGames: GameResult[];
  countdownMs: number;
  isCountdownActive: boolean;

  saveGame: (state: GameState) => void;
  clearGame: () => void;
  updateSettings: (patch: Partial<GameSettings>) => void;
  updateStatistics: (patch: Partial<Statistics>) => void;
  resetStatistics: () => void;
  startCountdown: (initialMs: number) => void;
  setCountdownMs: (ms: number) => void;
  stopCountdown: () => void;
  resetCountdown: (initialMs: number) => void;

  recordWin: (result: CompletedGameResult) => void;
  recordLoss: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

function createGameResultId(result: CompletedGameResult): string {
  return `${result.startedAt}_${result.durationMs}_${result.moves}`;
}

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<AppStorageData>(DEFAULT_APP_STORAGE);
  const [isHydrated, setIsHydrated] = useState(false);
  const [countdownMs, setCountdownMsState] = useState(
    DEFAULT_APP_STORAGE.settings.limitTimeMs,
  );
  const [isCountdownActive, setIsCountdownActive] = useState(false);

  // 1. Гідрація (читання при старті з гарантією розблокування)
  useEffect(() => {
    let mounted = true;
    const initData = async () => {
      try {
        const storedData = await loadAppStorage();
        if (mounted) {
          setData(storedData);
        }
      } catch (error) {
        console.error("Critical error during hydration:", error);
        // Якщо сталася помилка, state залишиться DEFAULT_APP_STORAGE
      } finally {
        if (mounted) {
          setIsHydrated(true); // Гарантовано знімаємо Splash Screen
        }
      }
    };
    initData();
    return () => {
      mounted = false;
    };
  }, []);

  // 2. Persistence Side Effect (безпечний запис)
  useEffect(() => {
    if (!isHydrated) return;
    saveAppStorage(data).catch((e) => console.error("Persistence error", e));
  }, [data, isHydrated]);

  // --- БАЗОВІ МУТАТОРИ ---

  const saveGame = useCallback((state: GameState) => {
    setData((prev) => ({ ...prev, gameState: state }));
  }, []);

  const clearGame = useCallback(() => {
    setData((prev) => ({ ...prev, gameState: null }));
  }, []);

  const updateSettings = useCallback((patch: Partial<GameSettings>) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...patch },
    }));
  }, []);

  const updateStatistics = useCallback((patch: Partial<Statistics>) => {
    setData((prev) => ({
      ...prev,
      statistics: { ...prev.statistics, ...patch },
    }));
  }, []);

  const resetStatistics = useCallback(() => {
    setData((prev) => ({
      ...prev,
      statistics: { ...DEFAULT_STATISTICS },
      bestGames: [],
    }));
  }, []);

  const startCountdown = useCallback((initialMs: number) => {
    setCountdownMsState(Math.max(0, Math.round(initialMs)));
    setIsCountdownActive(true);
  }, []);

  const setCountdownMs = useCallback((ms: number) => {
    setCountdownMsState(Math.max(0, Math.round(ms)));
  }, []);

  const stopCountdown = useCallback(() => {
    setIsCountdownActive(false);
  }, []);

  const resetCountdown = useCallback((initialMs: number) => {
    setCountdownMsState(Math.max(0, Math.round(initialMs)));
    setIsCountdownActive(false);
  }, []);

  // --- ДОМЕННІ ФУНКЦІЇ СТАТИСТИКИ ---

  const recordWin = useCallback((result: CompletedGameResult) => {
    setData((prev) => {
      const s = prev.statistics;
      const isNewBestTime =
        s.bestTime === 0 || result.durationMs < s.bestTime;
      const isNewBestMoves =
        s.bestMoves === 0 || result.moves < s.bestMoves;
      const nextBestGames = insertBestGame(prev.bestGames, {
        id: createGameResultId(result),
        ...result,
      });

      return {
        ...prev,
        statistics: {
          ...s,
          gamesPlayed: s.gamesPlayed + 1,
          gamesWon: s.gamesWon + 1,
          bestTime: isNewBestTime ? result.durationMs : s.bestTime,
          bestMoves: isNewBestMoves ? result.moves : s.bestMoves,
        },
        bestGames: nextBestGames,
      };
    });
  }, []);

  const recordLoss = useCallback(() => {
    setData((prev) => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        gamesPlayed: prev.statistics.gamesPlayed + 1,
      },
    }));
  }, []);

  return (
    <GameContext.Provider
      value={{
        isHydrated,
        gameState: data.gameState,
        statistics: data.statistics,
        settings: data.settings,
        bestGames: data.bestGames,
        countdownMs,
        isCountdownActive,
        saveGame,
        clearGame,
        updateSettings,
        updateStatistics,
        resetStatistics,
        startCountdown,
        setCountdownMs,
        stopCountdown,
        resetCountdown,
        recordWin,
        recordLoss,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameContext);
  if (!context)
    throw new Error("useGameState must be used within GameStateProvider");
  return context;
};
