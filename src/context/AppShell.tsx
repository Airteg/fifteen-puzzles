import { RootNavigator } from "@/navigation/RootNavigator";
import { ensureSplashPrevented, hideSplash } from "@/utils/splash";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useFontReady } from "./FontProvider";
import { GameStateProvider, useGameState } from "./GameStateProvider";

function ShellContent() {
  const fontsReady = useFontReady();
  const { isHydrated } = useGameState();

  const isReady = fontsReady && isHydrated;

  useEffect(() => {
    if (isReady) {
      hideSplash();
    }
  }, [isReady]);

  if (!isReady) return null;

  return (
    <NavigationContainer>
      <StatusBar style="dark" backgroundColor="#D5F7FF" />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function AppShell() {
  useEffect(() => {
    ensureSplashPrevented();
  }, []);

  return (
    <GameStateProvider>
      <ShellContent />
    </GameStateProvider>
  );
}
