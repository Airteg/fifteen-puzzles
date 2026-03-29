import { PixelRatio } from "react-native";
import type { AppLayoutSnapshot, Frame, GameScreenLayout } from "./types";

type Params = {
  screenW: number;
  screenH: number;
  safeTop: number;
  safeBottom: number;
};

const DESIGN_W = 390;
const DESIGN_H = 844;

const BOARD_DESIGN = {
  size: 324,
  inset: 12,
  gap: 4,
};

function snap(v: number) {
  return PixelRatio.roundToNearestPixel(v);
}

function makeFrame(x: number, y: number, width: number, height: number): Frame {
  return {
    x: snap(x),
    y: snap(y),
    width: snap(width),
    height: snap(height),
  };
}

function makeBoardLayout(scale: number) {
  const boardSize = snap(BOARD_DESIGN.size * scale);
  const inset = snap(BOARD_DESIGN.inset * scale);
  const gap = snap(BOARD_DESIGN.gap * scale);
  const tile = (boardSize - inset * 2 - gap * 3) / 4;

  return {
    boardSize,
    inset,
    tile,
    gap,
    step: tile + gap,
  };
}

export function createAppLayoutSnapshot({
  screenW,
  screenH,
  safeTop,
  safeBottom,
}: Params): AppLayoutSnapshot {
  const scale = Math.min(screenW / DESIGN_W, screenH / DESIGN_H);

  const sideMarginMin = 16;
  const panelW = snap(Math.min(screenW - 2 * sideMarginMin, 340 * scale));
  const buttonW = snap(276 * scale);
  const buttonH = snap(58 * scale);

  const board = makeBoardLayout(scale);
  const boardSize = board.boardSize;
  const gameGap = snap(30 * scale);

  const headerW = snap(DESIGN_W * 0.9 * scale);
  const headerH = snap(DESIGN_W * 0.2 * scale);

  const modePanelW = boardSize;
  const modePanelH = snap(boardSize * 0.21);

  const headerX = (screenW - headerW) / 2;
  const headerY = safeTop + snap(headerH * 0.308);

  const modePanelX = (screenW - modePanelW) / 2;
  const modePanelY = screenH - safeBottom - modePanelH;

  function makeGameScreenLayout(hasGameTimer: boolean): GameScreenLayout {
    const timerW = boardSize;
    const timerH = snap(boardSize * 0.181);

    const buttonsW = boardSize;
    const buttonsH = snap(boardSize * 0.359);

    const headerBottomY = headerY + headerH;
    const group2Height =
      (hasGameTimer ? timerH + gameGap : 0) + boardSize + gameGap + buttonsH;

    const spaceBetween = modePanelY - headerBottomY;
    const group2StartY = headerBottomY + (spaceBetween - group2Height) / 2;

    let currentY = group2StartY;

    const timerFrame = hasGameTimer
      ? makeFrame((screenW - timerW) / 2, currentY, timerW, timerH)
      : null;

    if (timerFrame) {
      currentY += timerH + gameGap;
    }

    const boardFrame = makeFrame(
      (screenW - boardSize) / 2,
      currentY,
      boardSize,
      boardSize,
    );
    currentY += boardSize + gameGap;

    const buttonsBlockFrame = makeFrame(
      (screenW - buttonsW) / 2,
      currentY,
      buttonsW,
      buttonsH,
    );

    const iconBtnW = snap(80 * scale);

    const homeButtonFrame = makeFrame(
      buttonsBlockFrame.x,
      buttonsBlockFrame.y,
      iconBtnW,
      iconBtnW,
    );

    const restartButtonFrame = makeFrame(
      buttonsBlockFrame.x + buttonsBlockFrame.width - iconBtnW,
      buttonsBlockFrame.y,
      iconBtnW,
      iconBtnW,
    );

    return {
      headerFrame: makeFrame(headerX, headerY, headerW, headerH),
      timerFrame,
      boardFrame,
      buttonsBlockFrame,
      modePanelFrame: makeFrame(modePanelX, modePanelY, modePanelW, modePanelH),
      board,
      homeButtonFrame,
      restartButtonFrame,
    };
  }

  const modalDefaultW = panelW;
  const modalDefaultH = snap(400 * scale);
  const modalSoundW = snap(214 * scale);
  const modalSoundH = snap(169 * scale);

  const modalDefaultFrame = makeFrame(
    (screenW - modalDefaultW) / 2,
    (screenH - modalDefaultH) / 2,
    modalDefaultW,
    modalDefaultH,
  );

  const modalSoundFrame = makeFrame(
    (screenW - modalSoundW) / 2,
    (screenH - modalSoundH) / 2,
    modalSoundW,
    modalSoundH,
  );

  return {
    device: {
      screenW,
      screenH,
      safeTop,
      safeBottom,
      designW: DESIGN_W,
      designH: DESIGN_H,
      scale,
    },

    tokens: {
      sideMarginMin,
      panelW,
      buttonW,
      buttonH,
    },

    screens: {
      game: {
        classic: makeGameScreenLayout(false),
        limitTime: makeGameScreenLayout(true),
      },

      settings: {
        panelW,
        buttonW,
        buttonH,
        modalDefaultFrame,
        modalSoundFrame,
      },

      shell: {
        headerToAnimationGap: snap(24 * scale),
        animationToTitleGap: snap(16 * scale),
        titleToContentGap: snap(24 * scale),
        footerBottomGap: snap(24 * scale),
      },
    },
  };
}
