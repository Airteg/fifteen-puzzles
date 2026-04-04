import type { SkFont } from "@shopify/react-native-skia";

export type Frame = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type HitRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type StatisticItemVm = {
  id: string;
  rank: number;
  durationText: string;
  movesText: string;
  dateText: string;
};

export type StatisticSummaryVm = {
  bestTimeText: string;
  bestMovesText: string;
};

export type ModalProps = {
  frame: Frame;
  S: number;
  snap: (v: number) => number;
};

export type SceneProps = ModalProps & {
  titleFont: SkFont | null;
  bodyFont?: SkFont | null;
  summary: StatisticSummaryVm;
  items: StatisticItemVm[];
};

export type OverlayProps = ModalProps & {
  onBack: () => void;
  onResetStatistics?: () => void;
};
