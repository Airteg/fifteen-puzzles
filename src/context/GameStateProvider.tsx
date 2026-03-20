import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// Ключі для збереження
const STORAGE_KEYS = {
  GAME_STATE: "fifteen_puzzles_state",
  STATISTICS: "fifteen_puzzles_stats",
  SOUND: "fifteen_puzzles_sound",
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
  isSoundEnabled: boolean;
  saveGame: (state: GameState) => Promise<void>;
  updateStats: (newStats: Partial<Statistics>) => Promise<void>;
  resetGame: () => Promise<void>;
  toggleSound: () => Promise<void>;
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
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true); // Стан звуку

  // Завантажуємо дані при старті додатка
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Додаємо savedSound у деструктуризацію та третій getItem у Promise.all
        const [savedState, savedStats, savedSound] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.GAME_STATE),
          AsyncStorage.getItem(STORAGE_KEYS.STATISTICS),
          AsyncStorage.getItem(STORAGE_KEYS.SOUND), // <-- Додаємо цей рядок
        ]);

        if (savedState) setGameState(JSON.parse(savedState));
        if (savedStats) setStats(JSON.parse(savedStats));

        // 2. Тепер savedSound існує, і ми можемо його перевірити
        if (savedSound !== null) setIsSoundEnabled(savedSound === "true");
      } catch (e) {
        console.error("Failed to load game data", e);
      }
    };
    loadData();
  }, []);

  const toggleSound = async () => {
    try {
      const nextState = !isSoundEnabled;
      setIsSoundEnabled(nextState);
      await AsyncStorage.setItem(STORAGE_KEYS.SOUND, String(nextState));
    } catch (e) {
      console.error("Failed to save sound state", e);
    }
  };

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
      value={{
        gameState,
        stats,
        isSoundEnabled,
        saveGame,
        updateStats,
        resetGame,
        toggleSound,
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
