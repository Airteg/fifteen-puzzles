import { PixelRatio } from "react-native";
import type { AppLayoutSnapshot, Frame, GameScreenLayout } from "./types";

type Params = {
  screenW: number;
  screenH: number;
  safeTop: number;
  safeBottom: number;
};

// Базова ширина еталонного дизайн-макета, від якого рахується scale.
const DESIGN_W = 390;
// Базова висота еталонного дизайн-макета.
const DESIGN_H = 844;

const BOARD_DESIGN = {
  // Розмір зовнішнього квадрата поля в дизайн-макеті.
  size: 324,
  // Внутрішній відступ від краю поля до плиток.
  inset: 12,
  // Проміжок між сусідніми плитками.
  gap: 4,
};

const LAYOUT_TOKENS = {
  // Мінімальний відступ від країв екрана до широких панелей.
  sideMarginMin: 16,
  // Максимальна базова ширина стандартної панелі/модалки.
  panelMaxW: 340,
  // Базова ширина основної кнопки.
  buttonW: 276,
  // Базова висота основної кнопки.
  buttonH: 58,
  // Вертикальний проміжок між таймером, полем і блоком кнопок.
  gameGap: 30,
  // Ширина хедера відносно базової ширини дизайну.
  headerWidthPct: 0.9,
  // Висота хедера відносно базової ширини дизайну.
  headerHeightPct: 0.2,
  // Вертикальний зсув хедера від safeTop у частках його власної висоти.
  headerTopOffsetPct: 0.308,
  // Висота нижньої панелі режимів відносно розміру поля.
  modePanelHeightPct: 0.21,
  // Висота таймера відносно розміру поля.
  timerHeightPct: 0.181,
  // Висота блока нижніх кнопок відносно розміру поля.
  buttonsBlockHeightPct: 0.359,
  // Розмір квадратної іконкової кнопки.
  iconButtonSize: 80,
  // Базова висота стандартної модалки налаштувань.
  modalDefaultH: 400,
  // Базова ширина компактної модалки звуку.
  modalSoundW: 214,
  // Базова висота компактної модалки звуку.
  modalSoundH: 169,
  // Відступ між хедером shell-екрана і анімацією.
  shellHeaderToAnimationGap: 24,
  // Відступ між анімацією і заголовком.
  shellAnimationToTitleGap: 16,
  // Відступ між заголовком і основним контентом.
  shellTitleToContentGap: 24,
  // Нижній відступ футера від краю екрана.
  shellFooterBottomGap: 24,
} as const;

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

  const sideMarginMin = LAYOUT_TOKENS.sideMarginMin;
  const panelW = snap(
    Math.min(screenW - 2 * sideMarginMin, LAYOUT_TOKENS.panelMaxW * scale),
  );
  const buttonW = snap(LAYOUT_TOKENS.buttonW * scale);
  const buttonH = snap(LAYOUT_TOKENS.buttonH * scale);

  const board = makeBoardLayout(scale);
  const boardSize = board.boardSize;
  const gameGap = snap(LAYOUT_TOKENS.gameGap * scale);

  const headerW = snap(DESIGN_W * LAYOUT_TOKENS.headerWidthPct * scale);
  const headerH = snap(DESIGN_W * LAYOUT_TOKENS.headerHeightPct * scale);

  const modePanelW = boardSize;
  const modePanelH = snap(boardSize * LAYOUT_TOKENS.modePanelHeightPct);

  const headerX = (screenW - headerW) / 2;
  const headerY = safeTop + snap(headerH * LAYOUT_TOKENS.headerTopOffsetPct);

  const modePanelX = (screenW - modePanelW) / 2;
  const modePanelY = screenH - safeBottom - modePanelH;

  function makeGameScreenLayout(hasGameTimer: boolean): GameScreenLayout {
    const timerW = boardSize;
    const timerH = snap(boardSize * LAYOUT_TOKENS.timerHeightPct);

    const buttonsW = boardSize;
    const buttonsH = snap(boardSize * LAYOUT_TOKENS.buttonsBlockHeightPct);

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

    const iconBtnW = snap(LAYOUT_TOKENS.iconButtonSize * scale);

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
  const modalDefaultH = snap(LAYOUT_TOKENS.modalDefaultH * scale);
  const modalSoundW = snap(LAYOUT_TOKENS.modalSoundW * scale);
  const modalSoundH = snap(LAYOUT_TOKENS.modalSoundH * scale);

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
        headerToAnimationGap: snap(LAYOUT_TOKENS.shellHeaderToAnimationGap * scale),
        animationToTitleGap: snap(
          LAYOUT_TOKENS.shellAnimationToTitleGap * scale,
        ),
        titleToContentGap: snap(LAYOUT_TOKENS.shellTitleToContentGap * scale),
        footerBottomGap: snap(LAYOUT_TOKENS.shellFooterBottomGap * scale),
      },
    },
  };
}
