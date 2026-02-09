import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { TextScreen } from "../ui/TextScreen";

type Props = NativeStackScreenProps<RootStackParamList, "Game">;

export function GameScreen({ navigation, route }: Props) {
  const mode = route.params.mode;

  return (
    <TextScreen
      title={mode === "classic" ? "GAME: CLASSIC" : "GAME: LIMIT TIME"}
      actions={[
        { title: "Back to menu", onPress: () => navigation.popToTop() },
      ]}
    />
  );
}
