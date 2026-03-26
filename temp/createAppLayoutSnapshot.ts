import { PixelRatio } from "react-native";
import type { AppLayoutSnapshot, Frame } from "./types";

// Вхідні дані для побудови канонічного layout snapshot.
// Тут є лише стабільна геометрія екрана та safe area, без runtime-state.
type Params = {
  screenW: number;
  screenH: number;
  safeTop: number;
  safeBottom: number;
  hasGameTimer?: boolean;
};

// Базовий дизайн-референс, від якого масштабується вся геометрія застосунку.
const DESIGN_W = 390;
const DESIGN_H = 844;

// Канонічні розміри дошки в координатах дизайн-макета.
const BOARD_DESIGN = {
  size: 324,
  inset: 12,
  gap: 4,
};

// Єдина точка округлення layout-значень до піксельної сітки пристрою.
function snap(v: number) {
  return PixelRatio.roundToNearestPixel(v);
}

// Усі frames у snapshot проходять через однакове округлення,
// щоб компоненти читали вже стабільну геометрію без локальних перерахунків.
function makeFrame(x: number, y: number, width: number, height: number): Frame {
  return {
    x: snap(x),
    y: snap(y),
    width: snap(width),
    height: snap(height),
  };
}

// Базова геометрія ігрової дошки для поля `screens.game.board`.
// `tile` і `step` виводяться з канонічних розмірів board/inset/gap.
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
    // Один крок плитки = розмір плитки + міжплитковий проміжок.
    step: tile + gap,
  };
}

export function createAppLayoutSnapshot({
  screenW,
  screenH,
  safeTop,
  safeBottom,
  hasGameTimer = false,
}: Params): AppLayoutSnapshot {
  // Масштаб усього layout відносно дизайн-референсу.
  const scale = Math.min(screenW / DESIGN_W, screenH / DESIGN_H);

  // Загальні layout tokens, які використовуються кількома екранами.
  const sideMarginMin = 16;
  const panelW = snap(Math.min(screenW - 2 * sideMarginMin, 340 * scale));
  const buttonW = snap(276 * scale);
  const buttonH = snap(58 * scale);

  // Геометрія дошки окремо зберігається як `BoardLayout`,
  // щоб інші вузли читали готові значення, а не рахували їх локально.
  const board = makeBoardLayout(scale);

  const boardSize = board.boardSize;
  const gameGap = snap(30 * scale);

  // Верхній заголовок масштабується від дизайн-ширини,
  // а не від дошки, бо це окремий layout-блок екрана.
  const headerW = snap(DESIGN_W * 0.9 * scale);
  const headerH = snap(DESIGN_W * 0.2 * scale);

  // Timer, блок кнопок і панель режиму прив'язані до ширини дошки,
  // щоб композиція screen.game залишалась в одному ритмі.
  const timerW = boardSize;
  const timerH = snap(boardSize * 0.181);

  const buttonsW = boardSize;
  const buttonsH = snap(boardSize * 0.359);

  const modePanelW = boardSize;
  const modePanelH = snap(boardSize * 0.21);

  // Header фіксується зверху з урахуванням safe area.
  const headerX = (screenW - headerW) / 2;
  const headerY = safeTop + snap(headerH * 0.308);

  // Mode panel фіксується внизу над safe area.
  const modePanelX = (screenW - modePanelW) / 2;
  const modePanelY = screenH - safeBottom - modePanelH;

  // Між header та mode panel центруємо середню вертикальну групу:
  // timer (опційно) -> board -> buttons.
  const headerBottomY = headerY + headerH;
  const group2Height =
    (hasGameTimer ? timerH + gameGap : 0) + boardSize + gameGap + buttonsH;
  const spaceBetween = modePanelY - headerBottomY;
  const group2StartY = headerBottomY + (spaceBetween - group2Height) / 2;

  // Далі збираємо frames послідовно зверху вниз.
  let currentY = group2StartY;

  const timerFrame = hasGameTimer
    ? makeFrame((screenW - timerW) / 2, currentY, timerW, timerH)
    : null;

  // Якщо timer увімкнений, наступні блоки зсуваються нижче на його висоту і gap.
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

  // Іконкові кнопки живуть усередині buttonsBlockFrame:
  // одна притиснута ліворуч, інша праворуч.
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

  // Попередньо пораховані presets для модалок settings-екрана.
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

  // Повертаємо повний `AppLayoutSnapshot`:
  // device -> вхідна геометрія та масштаб,
  // tokens -> спільні розміри,
  // screens -> готові frames і layout-блоки для конкретних екранів.
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
        headerFrame: makeFrame(headerX, headerY, headerW, headerH),
        timerFrame,
        boardFrame,
        buttonsBlockFrame,
        modePanelFrame: makeFrame(
          modePanelX,
          modePanelY,
          modePanelW,
          modePanelH,
        ),
        board,
        homeButtonFrame,
        restartButtonFrame,
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
