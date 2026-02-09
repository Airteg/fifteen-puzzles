import React, { useEffect } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { TextScreen } from "../ui/TextScreen";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

export function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const id = setTimeout(() => navigation.replace("MainMenu"), 600);
    return () => clearTimeout(id);
  }, [navigation]);

  return <TextScreen title="SPLASH" />;
}
