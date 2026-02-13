import { RootNavigator } from "@/navigation/RootNavigator";
import { ensureSplashPrevented, hideSplash } from "@/utils/splash";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect } from "react";
import { useFontReady } from "./FontProvider";
import { GameStateProvider } from "./GameStateProvider";

export default function AppShell() {
  const isReady = useFontReady();

  useEffect(() => {
    ensureSplashPrevented();
  }, []);

  useEffect(() => {
    if (isReady) {
      hideSplash();
    }
  }, [isReady]);
  if (!isReady) return null;

  return (
    <GameStateProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </GameStateProvider>
  );
}
