import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { TextScreen } from "../ui/TextScreen";

type Props = NativeStackScreenProps<RootStackParamList, "Settings">;

export function SettingsScreen({ navigation }: Props) {
  return (
    <TextScreen
      title="SETTINGS"
      actions={[
        {
          title: "Skin (modal)",
          onPress: () => navigation.navigate("SkinModal"),
        },
        {
          title: "Sound (modal)",
          onPress: () => navigation.navigate("SoundModal"),
        },
        {
          title: "Statistic (modal)",
          onPress: () => navigation.navigate("StatisticModal"),
        },
        { title: "Support", onPress: () => navigation.navigate("Support") },
      ]}
    />
  );
}
