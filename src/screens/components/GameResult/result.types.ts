export type GameMode = "classic" | "limitTime";

export type GameResultReason = "normal_win" | "record_win" | "time_loss";

export type GameResultRouteParams = {
  reason: GameResultReason;
  durationMs: number;
  moves: number;
  startedAt: string;
  mode: GameMode;
};

export type ResultSceneCommonProps = {
  durationMs: number;
  moves: number;
  startedAt: string;
  mode: GameMode;
  onHome: () => void;
  onRestart: () => void;
};

export type VideoResultSceneType = "win" | "lose";

export type VideoResultSceneProps = ResultSceneCommonProps & {
  reason: Extract<GameResultReason, "normal_win" | "time_loss">;
  type: VideoResultSceneType;
};

export type WinRecordSceneProps = ResultSceneCommonProps & {
  reason: Extract<GameResultReason, "record_win">;
};
