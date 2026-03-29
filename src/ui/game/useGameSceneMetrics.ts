import {
  useGameLayout,
  useLayoutDevice,
} from "@/context/LayoutSnapshotProvider";
import type { Frame } from "@/layout/types";

// Зберігаємо сумісний тип-аліас для існуючих імпортів
export type SceneFrame = Frame;

export type GameSceneMetrics = {
  screenW: number;
  screenH: number;
  headerFrame: SceneFrame;
  timerFrame: SceneFrame | null;
  boardFrame: SceneFrame;
  buttonsBlockFrame: SceneFrame;
  modePanelFrame: SceneFrame;
};

export function useGameSceneMetrics(
  hasTimer: boolean = false,
): GameSceneMetrics {
  const device = useLayoutDevice();
  const game = useGameLayout(hasTimer ? "limitTime" : "classic");

  return {
    screenW: device.screenW,
    screenH: device.screenH,
    headerFrame: game.headerFrame,
    timerFrame: game.timerFrame,
    boardFrame: game.boardFrame,
    buttonsBlockFrame: game.buttonsBlockFrame,
    modePanelFrame: game.modePanelFrame,
  };
}
