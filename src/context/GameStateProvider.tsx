import { loadAppStorage, saveAppStorage } from "@/storage/appStorage";
import {
  AppStorageData,
  DEFAULT_APP_STORAGE,
  GameSettings,
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

interface GameContextType {
  isHydrated: boolean;

  gameState: GameState | null;
  statistics: Statistics;
  settings: GameSettings;
  countdownMs: number;
  isCountdownActive: boolean;

  saveGame: (state: GameState) => void;
  clearGame: () => void;
  updateSettings: (patch: Partial<GameSettings>) => void;
  updateStatistics: (patch: Partial<Statistics>) => void;
  startCountdown: (initialMs: number) => void;
  setCountdownMs: (ms: number) => void;
  stopCountdown: () => void;
  resetCountdown: (initialMs: number) => void;

  recordWin: (timeMs: number, moves: number) => void;
  recordLoss: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

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

  const recordWin = useCallback((timeMs: number, moves: number) => {
    setData((prev) => {
      const s = prev.statistics;
      const isNewBestTime = s.bestTime === 0 || timeMs < s.bestTime;
      const isNewBestMoves = s.bestMoves === 0 || moves < s.bestMoves;

      return {
        ...prev,
        statistics: {
          ...s,
          gamesPlayed: s.gamesPlayed + 1,
          gamesWon: s.gamesWon + 1,
          bestTime: isNewBestTime ? timeMs : s.bestTime,
          bestMoves: isNewBestMoves ? moves : s.bestMoves,
        },
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
        countdownMs,
        isCountdownActive,
        saveGame,
        clearGame,
        updateSettings,
        updateStatistics,
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
