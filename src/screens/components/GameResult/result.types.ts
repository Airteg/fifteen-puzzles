export type GameMode = "classic" | "limitTime";

export type GameResultReason = "normal_win" | "record_win" | "time_loss";

export type GameResultRouteParams = {
  reason: GameResultReason;
  durationMs: number;
  moves: number;
  startedAt: string;
  mode: GameMode;
};

export type ResultVideoVariant = "tall" | "square";

export type ResultAccentVariant = "none" | "win" | "lose" | "record";

export type ResultPrimaryActionKind = "new_game" | "home";

export type ResultVideoAsset = {
  source: number;
  aspectRatio: number;
  variant: ResultVideoVariant;
};

export type GameResultAccentPresentation = {
  variant: ResultAccentVariant;
};

export type GameResultPrimaryActionPresentation = {
  kind: ResultPrimaryActionKind;
  label: string;
  accessibilityLabel: string;
};

export type GameResultPresentation = {
  title: string;
  video: ResultVideoAsset;
  accent: GameResultAccentPresentation;
  primaryAction: GameResultPrimaryActionPresentation;
};
