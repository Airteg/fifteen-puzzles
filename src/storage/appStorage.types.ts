export type GameSettings = {
  isSoundEnabled: boolean;
  tileColor: string;
  boardColor: string;
};

export type GameResult = {
  id: string;
  durationMs: number;
  playedAt: string; // ISO string
};

export type AppStorageData = {
  settings: GameSettings;
  bestGames: GameResult[];
};

export const DEFAULT_SETTINGS: GameSettings = {
  isSoundEnabled: true,
  tileColor: "#E1EEF4",
  boardColor: "#D7E6EC",
};

export const DEFAULT_APP_STORAGE: AppStorageData = {
  settings: DEFAULT_SETTINGS,
  bestGames: [],
};
