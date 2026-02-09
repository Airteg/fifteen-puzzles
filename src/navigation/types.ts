export type GameMode = "classic" | "limitTime";

export type RootStackParamList = {
  Splash: undefined;

  MainMenu: undefined;

  Game: { mode: GameMode };

  Settings: undefined;
  About: undefined;
  Support: undefined;

  // Modals
  SkinModal: undefined;
  SoundModal: undefined;
  StatisticModal: undefined;
};
