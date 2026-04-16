import type { GameResultReason } from "./result.types";

type ResolveGameResultReasonParams = {
  didWin: boolean;
  didTimeExpire: boolean;
  currentDurationMs: number;
  previousBestTime: number;
};

export function resolveGameResultReason({
  didWin,
  didTimeExpire,
  currentDurationMs,
  previousBestTime,
}: ResolveGameResultReasonParams): GameResultReason {
  if (didTimeExpire) {
    return "time_loss";
  }

  if (!didWin) {
    throw new Error(
      "resolveGameResultReason requires either a win or a time-expired loss.",
    );
  }

  if (previousBestTime === 0 || currentDurationMs < previousBestTime) {
    return "record_win";
  }

  return "normal_win";
}
