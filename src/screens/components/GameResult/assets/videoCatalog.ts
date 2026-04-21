import type { ResultVideoAsset } from "../result.types";

export const WIN_VIDEO_POOL: readonly ResultVideoAsset[] = [
  {
    source: require("../../../../../assets/video/GoodGame/goodGame1.mp4"),
    aspectRatio: 16 / 9,
    variant: "square",
  },
  {
    source: require("../../../../../assets/video/GoodGame/goodGame2.mp4"),
    aspectRatio: 16 / 9,
    variant: "square",
  },
  {
    source: require("../../../../../assets/video/GoodGame/goodGame3.mp4"),
    aspectRatio: 16 / 9,
    variant: "square",
  },
  {
    source: require("../../../../../assets/video/GoodGame/goodGame4.mp4"),
    aspectRatio: 16 / 9,
    variant: "square",
  },
  {
    source: require("../../../../../assets/video/GoodGame/goodGame5.mp4"),
    aspectRatio: 16 / 9,
    variant: "square",
  },
];

export const LOSE_VIDEO_POOL: readonly ResultVideoAsset[] = [
  {
    source: require("../../../../../assets/video/TimeUp/timUpGame1.mp4"),
    aspectRatio: 16 / 9,
    variant: "square",
  },
  {
    source: require("../../../../../assets/video/TimeUp/timUpGame2.mp4"),
    aspectRatio: 16 / 9,
    variant: "square",
  },
  {
    source: require("../../../../../assets/video/TimeUp/timUpGame3.mp4"),
    aspectRatio: 16 / 9,
    variant: "square",
  },
  {
    source: require("../../../../../assets/video/TimeUp/timUpGame4.mp4"),
    aspectRatio: 16 / 9,
    variant: "square",
  },
];

export const RECORD_VIDEO_POOL: readonly ResultVideoAsset[] = [
  {
    source: require("../../../../../assets/video/newRecord.mp4"),
    aspectRatio: 9 / 16,
    variant: "tall",
  },
];

export function pickResultVideo(
  pool: readonly ResultVideoAsset[],
): ResultVideoAsset {
  if (pool.length === 0) {
    throw new Error("Game result video pool cannot be empty.");
  }

  return pool[Math.floor(Math.random() * pool.length)];
}
