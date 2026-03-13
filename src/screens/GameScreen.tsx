import { RootStackParamList } from "@/types/types";
import { GameSceneCanvas } from "@/ui/game/GameSceneCanvas";
import { useGameSceneMetrics } from "@/ui/game/useGameSceneMetrics";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, "Game">;

const GameScreen: React.FC<Props> = ({ route, navigation }) => {
  const hasTimer = route.params?.mode === "limitTime";
  const metrics = useGameSceneMetrics(hasTimer);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 1. Слухаємо нативну подію завершення анімації переходу екрана
    const unsubscribe = navigation.addListener("transitionEnd", () => {
      setIsReady(true);
    });

    // 2. Fallback (перестраховка): якщо екран відкривається миттєво без анімації
    // (наприклад, при Deep Link або якщо це буде найперший екран), подія може не спрацювати.
    // Тому через 400мс (стандартний час переходу) ми примусово показуємо Canvas.
    const fallbackTimer = setTimeout(() => {
      setIsReady(true);
    }, 400);

    // Очищення підписок
    return () => {
      unsubscribe();
      clearTimeout(fallbackTimer);
    };
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {isReady ? (
        <GameSceneCanvas metrics={metrics} />
      ) : (
        <View style={{ flex: 1, backgroundColor: "#000" }} />
      )}
    </View>
  );
};

export default GameScreen;
