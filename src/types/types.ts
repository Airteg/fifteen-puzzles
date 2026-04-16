import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type {
  GameMode,
  GameResultRouteParams,
} from "@/screens/components/GameResult/result.types";

export type RootStackParamList = {
  Home: undefined;
  About: undefined;
  Settings: undefined;
  Support: undefined;
  Statistic: undefined;
  NewGame: undefined;
  Game: { mode: GameMode };
  GameResult: GameResultRouteParams;
  Win: { score: number };
  Lose: { score: number };
};

export type Props<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type ScreenShellProps = {
  /** Заголовок по центру: MENU / SETTINGS / NEW GAME / ABOUT GAME ... */
  title?: string;

  /** Animation (пізніше буде Skia), зараз може бути PNG-ілюстрація */
  animation?: React.ReactNode;

  /** Висота animation slot у design px (помножимо на S і snap) */
  animationHeightDesign?: number;

  /** Відступ між header і animation (design px) */
  headerToAnimationGapDesign?: number;

  /** Відступ між animation і title (design px) */
  animationToTitleGapDesign?: number;

  /** Відступ між title і панеллю (design px) */
  titleToContentGapDesign?: number;

  /** Основний контент: PanelZone / ScrollPanel */
  children: React.ReactNode;

  /** Футер (наприклад Privacy Policy / User Agreement на Home) */
  footer?: React.ReactNode;

  /** Відступ до футера знизу (design px) */
  footerBottomGapDesign?: number;

  /** Фон екрана (за замовчуванням #D5F7FF) */
  backgroundColor?: string;
};
