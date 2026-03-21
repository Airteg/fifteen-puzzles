import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// 1. КЛЮЧІ ЗБЕРЕЖЕННЯ
const STORAGE_KEYS = {
  GAME_STATE: "fifteen_puzzles_state",
  STATISTICS: "fifteen_puzzles_stats",
  SOUND: "fifteen_puzzles_sound",
  THEME: "fifteen_puzzles_theme", // Додано ключ для теми
};

// 2. ІНТЕРФЕЙСИ
export interface GameState {
  grid: number[];
  emptyRow: number;
  emptyCol: number;
  moves: number;
  timeMs: number;
  isPlaying: boolean;
  mode: "classic" | "limitTime";
}

export interface Statistics {
  bestTime: number;
  bestMoves: number;
  gamesPlayed: number;
  gamesWon: number;
}

// Інтерфейс для теми
export interface ThemeState {
  tileColor: string;
  boardColor: string;
}

// Загальний інтерфейс контексту
interface GameContextType {
  gameState: GameState | null;
  stats: Statistics;
  isSoundEnabled: boolean;
  theme: ThemeState; // Додано тему
  saveGame: (state: GameState) => Promise<void>;
  updateStats: (newStats: Partial<Statistics>) => Promise<void>;
  resetGame: () => Promise<void>;
  toggleSound: () => Promise<void>;
  updateTheme: (newTheme: Partial<ThemeState>) => Promise<void>; // Додано функцію оновлення
}

// 3. ЗНАЧЕННЯ ЗА ЗАМОВЧУВАННЯМ
const defaultStats: Statistics = {
  bestTime: 0,
  bestMoves: 0,
  gamesPlayed: 0,
  gamesWon: 0,
};

// Дефолтні кольори
const defaultTheme: ThemeState = {
  tileColor: "#71D4EB",
  boardColor: "#133D44",
};

// 4. КОНТЕКСТ
const GameContext = createContext<GameContextType | undefined>(undefined);

// 5. ПРОВАЙДЕР
export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [stats, setStats] = useState<Statistics>(defaultStats);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  const [theme, setTheme] = useState<ThemeState>(defaultTheme);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [savedState, savedStats, savedSound, savedTheme] =
          await Promise.all([
            AsyncStorage.getItem(STORAGE_KEYS.GAME_STATE),
            AsyncStorage.getItem(STORAGE_KEYS.STATISTICS),
            AsyncStorage.getItem(STORAGE_KEYS.SOUND),
            AsyncStorage.getItem(STORAGE_KEYS.THEME),
          ]);

        if (savedState) setGameState(JSON.parse(savedState));
        if (savedStats) setStats(JSON.parse(savedStats));
        if (savedSound !== null) setIsSoundEnabled(savedSound === "true");
        if (savedTheme) {
          setTheme({ ...defaultTheme, ...JSON.parse(savedTheme) });
        }
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
      console.error("Failed to save statistics", e);
    }
  };

  const resetGame = async () => {
    try {
      setGameState(null);
      await AsyncStorage.removeItem(STORAGE_KEYS.GAME_STATE);
    } catch (e) {
      console.error("Failed to reset game state", e);
    }
  };

  const toggleSound = async () => {
    try {
      const nextState = !isSoundEnabled;
      setIsSoundEnabled(nextState);
      await AsyncStorage.setItem(STORAGE_KEYS.SOUND, String(nextState));
    } catch (e) {
      console.error("Failed to save sound state", e);
    }
  };

  const updateTheme = async (newTheme: Partial<ThemeState>) => {
    try {
      const updated = { ...theme, ...newTheme };
      setTheme(updated);
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save theme state", e);
    }
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        stats,
        isSoundEnabled,
        theme,
        saveGame,
        updateStats,
        resetGame,
        toggleSound,
        updateTheme,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// 6. ХУК
export const useGameState = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameState must be used within GameStateProvider");
  }
  return context;
};
