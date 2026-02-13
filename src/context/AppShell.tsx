import { RootNavigator } from "@/navigation/RootNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { useFontReady } from "./FontProvider";
import { GameStateProvider } from "./GameStateProvider";

export default function AppShell() {
  const isReady = useFontReady();
  if (!isReady) return null;

  return (
    <GameStateProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </GameStateProvider>
  );
}
