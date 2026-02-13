import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Ключі для збереження
const STORAGE_KEYS = {
  GAME_STATE: "fifteen_puzzles_state",
  STATISTICS: "fifteen_puzzles_stats",
};

interface GameState {
  tiles: number[];
  moves: number;
  time: number;
  isActive: boolean;
}

interface Statistics {
  bestTime: number;
  bestMoves: number;
  gamesPlayed: number;
  gamesWon: number;
}

interface GameContextType {
  gameState: GameState | null;
  stats: Statistics;
  saveGame: (state: GameState) => Promise<void>;
  updateStats: (newStats: Partial<Statistics>) => Promise<void>;
  resetGame: () => Promise<void>;
}

const defaultStats: Statistics = {
  bestTime: 0,
  bestMoves: 0,
  gamesPlayed: 0,
  gamesWon: 0,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [stats, setStats] = useState<Statistics>(defaultStats);

  // Завантажуємо дані при старті додатка
  useEffect(() => {
    const loadData = async () => {
      try {
        const [savedState, savedStats] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.GAME_STATE),
          AsyncStorage.getItem(STORAGE_KEYS.STATISTICS),
        ]);

        if (savedState) setGameState(JSON.parse(savedState));
        if (savedStats) setStats(JSON.parse(savedStats));
      } catch (e) {
        console.error("Failed to load game data", e);
      }
    };
    loadData();
  }, []);

  const saveGame = async (state: GameState) => {
    try {
      setGameState(state);
      await AsyncStorage.setItem(
        STORAGE_KEYS.GAME_STATE,
        JSON.stringify(state),
      );
    } catch (e) {
      console.error("Failed to save game state", e);
    }
  };

  const updateStats = async (newStats: Partial<Statistics>) => {
    try {
      const updated = { ...stats, ...newStats };
      setStats(updated);
      await AsyncStorage.setItem(
        STORAGE_KEYS.STATISTICS,
        JSON.stringify(updated),
      );
    } catch (e) {
      console.error("Failed to save stats", e);
    }
  };

  const resetGame = async () => {
    setGameState(null);
    await AsyncStorage.removeItem(STORAGE_KEYS.GAME_STATE);
  };

  return (
    <GameContext.Provider
      value={{ gameState, stats, saveGame, updateStats, resetGame }}
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
