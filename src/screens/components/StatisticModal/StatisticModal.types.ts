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

export type OverlayProps = ModalProps & {
  items: StatisticItemVm[];
  summary: StatisticSummaryVm;
  contentHeight: number;
  onContentHeightChange: (height: number) => void;
  onBack: () => void;
  onResetStatistics?: () => void;
};

export type SceneProps = ModalProps & {
  contentHeight: number;
};
