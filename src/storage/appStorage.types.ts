export type GameSettings = {
  isSoundEnabled: boolean;
  tileColor: string;
  boardColor: string;
};

// Перенесено з GameStateProvider
export interface GameState {
  grid: number[];
  emptyRow: number;
  emptyCol: number;
  moves: number;
  timeMs: number;
  isPlaying: boolean;
  mode: "classic" | "limitTime";
}

// Перенесено з GameStateProvider
export interface Statistics {
  bestTime: number;
  bestMoves: number;
  gamesPlayed: number;
  gamesWon: number;
}

export type GameResult = {
  id: string;
  durationMs: number;
  playedAt: string; // ISO string
};

export type AppStorageData = {
  settings: GameSettings;
  statistics: Statistics;
  gameState: GameState | null; // Канонічна поточна сесія гри
  bestGames: GameResult[];
};

export const DEFAULT_SETTINGS: GameSettings = {
  isSoundEnabled: true,
  tileColor: "#71D4EB",
  boardColor: "#133D44",
};

export const DEFAULT_STATISTICS: Statistics = {
  bestTime: 0,
  bestMoves: 0,
  gamesPlayed: 0,
  gamesWon: 0,
};

export const DEFAULT_APP_STORAGE: AppStorageData = {
  settings: DEFAULT_SETTINGS,
  statistics: DEFAULT_STATISTICS,
  gameState: null,
  bestGames: [],
};
