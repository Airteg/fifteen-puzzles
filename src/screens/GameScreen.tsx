import { RootStackParamList } from "@/types/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

// Хуки та провайдери
import { useSkiaFonts } from "@/context/FontProvider";
import { useGameBoardController } from "@/ui/game/useGameBoardController";
import { useGameSceneMetrics } from "@/ui/game/useGameSceneMetrics";

// UI Компоненти:
// Жести
import { BoardGestureOverlay } from "@/ui/game/BoardGestureOverlay";
// Сцена
import { GameSceneCanvas } from "@/ui/game/GameSceneCanvas";

// Функція для генерації початкового положення плиток
import { shuffleTiles } from "@/ui/game/gameEngine/shuffleTiles";

type Props = NativeStackScreenProps<RootStackParamList, "Game">;

const GameScreen: React.FC<Props> = ({ route, navigation }) => {
  // 1. Метрики екрана та сцени
  const hasTimer = route.params?.mode === "limitTime";
  const currentMode = hasTimer ? "LIMIT TIME" : "CLASSIC";
  const gameMode = hasTimer ? "limitTime" : "classic";

  const sceneMetrics = useGameSceneMetrics(hasTimer);

  // 2. Дістаємо оригінальний шрифт KronaOne для плиток
  const { title: tileFont } = useSkiaFonts();

  // 4. Генерація початкового положення плиток
  const bootGrid = useMemo(() => shuffleTiles(), []);

  // 5. Ігровий контролер
  const boardCtrl = useGameBoardController({
    mode: gameMode,
    bootGrid: bootGrid,
    onWin: () => {
      navigation.navigate("Win", { score: 100 });
    },
  });

  // 6. Стан готовності (анімація навігації)
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("transitionEnd", () =>
      setIsReady(true),
    );
    const fallbackTimer = setTimeout(() => setIsReady(true), 400);
    return () => {
      unsubscribe();
      clearTimeout(fallbackTimer);
    };
  }, [navigation]);

  // Захист: чекаємо поки завантажиться шрифт
  if (!tileFont) {
    return <View style={{ flex: 1, backgroundColor: "#000" }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {isReady ? (
        <>
          <GameSceneCanvas
            metrics={sceneMetrics}
            mode={gameMode}
            tileFont={tileFont}
            boardCtrl={boardCtrl}
            modeText={currentMode}
          />

          <BoardGestureOverlay
            boardFrame={sceneMetrics.boardFrame}
            mode={gameMode}
            emptyRow={boardCtrl.emptyRow}
            emptyCol={boardCtrl.emptyCol}
            dragActive={boardCtrl.dragActive}
            dragAxis={boardCtrl.dragAxis}
            dragStartRow={boardCtrl.dragStartRow}
            dragStartCol={boardCtrl.dragStartCol}
            dragOffsetPx={boardCtrl.dragOffsetPx}
            onCommitShift={boardCtrl.onCommitShift}
            onTapCell={boardCtrl.onTapCell}
          />
        </>
      ) : (
        <View style={{ flex: 1, backgroundColor: "#000" }} />
      )}
    </View>
  );
};

export default GameScreen;
