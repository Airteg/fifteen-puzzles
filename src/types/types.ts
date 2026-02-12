import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Home: undefined;
  About: undefined;
  Settings: undefined;
  Support: undefined;
  Statistic: undefined;
  Game: { level: number };
  Win: { score: number };
};

export type Props<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;
