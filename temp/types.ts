export type Frame = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type BoardLayout = {
  boardSize: number;
  inset: number;
  tile: number;
  gap: number;
  step: number;
};

export type AppLayoutSnapshot = {
  device: {
    screenW: number;
    screenH: number;
    safeTop: number;
    safeBottom: number;
    designW: number;
    designH: number;
    scale: number;
  };

  tokens: {
    sideMarginMin: number;
    panelW: number;
    buttonW: number;
    buttonH: number;
  };

  screens: {
    game: {
      headerFrame: Frame;
      timerFrame: Frame | null;
      boardFrame: Frame;
      buttonsBlockFrame: Frame;
      modePanelFrame: Frame;
      board: BoardLayout;
      homeButtonFrame: Frame;
      restartButtonFrame: Frame;
    };

    settings: {
      panelW: number;
      buttonW: number;
      buttonH: number;
      modalDefaultFrame: Frame;
      modalSoundFrame: Frame;
    };

    shell: {
      headerToAnimationGap: number;
      animationToTitleGap: number;
      titleToContentGap: number;
      footerBottomGap: number;
    };
  };
};
