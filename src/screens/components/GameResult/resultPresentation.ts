import {
  LOSE_VIDEO_POOL,
  RECORD_VIDEO_POOL,
  WIN_VIDEO_POOL,
  pickResultVideo,
} from "./assets/videoCatalog";
import type { GameResultPresentation, GameResultReason } from "./result.types";

export function resolveGameResultPresentation(
  reason: GameResultReason,
): GameResultPresentation {
  switch (reason) {
    case "record_win":
      return {
        title: "NEW RECORD",
        video: pickResultVideo(RECORD_VIDEO_POOL),
        accent: { variant: "record" },
        primaryAction: {
          kind: "home",
          label: "HOME",
          accessibilityLabel: "Go to home screen",
        },
      };

    case "normal_win":
      return {
        title: "GOOD GAME",
        video: pickResultVideo(WIN_VIDEO_POOL),
        accent: { variant: "win" },
        primaryAction: {
          kind: "new_game",
          label: "NEW GAME",
          accessibilityLabel: "Start a new game",
        },
      };

    case "time_loss":
      return {
        title: "TIME UP",
        video: pickResultVideo(LOSE_VIDEO_POOL),
        accent: { variant: "lose" },
        primaryAction: {
          kind: "new_game",
          label: "NEW GAME",
          accessibilityLabel: "Start a new game",
        },
      };
  }
}
