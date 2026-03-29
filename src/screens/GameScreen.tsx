import { RootStackParamList } from "@/types/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";

// Хуки та провайдери
import { useSkiaFonts } from "@/context/FontProvider";
import { useGameState } from "@/context/GameStateProvider";
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
const COUNTDOWN_TICK_MS = 250;

function formatCountdownMs(ms: number) {
  const safeMs = Math.max(0, ms);
  const totalSeconds = Math.ceil(safeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

const GameScreen: React.FC<Props> = ({ route, navigation }) => {
  // 1. Метрики екрана та сцени
  const hasTimer = route.params?.mode === "limitTime";
  const currentMode = hasTimer ? "LIMIT TIME" : "CLASSIC";
  const gameMode = hasTimer ? "limitTime" : "classic";

  const sceneMetrics = useGameSceneMetrics(hasTimer);

  // 2. Дістаємо оригінальний шрифт KronaOne для плиток
  const { title: tileFont } = useSkiaFonts();
  const {
    settings,
    countdownMs,
    startCountdown,
    setCountdownMs,
    stopCountdown,
    resetCountdown,
  } = useGameState();

  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const countdownDeadlineRef = useRef<number | null>(null);
  const didResolveGameRef = useRef(false);

  // 4. Генерація початкового положення плиток
  const bootGrid = useMemo(() => shuffleTiles(), []);

  const clearCountdownInterval = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  const handleWin = useCallback(() => {
    if (didResolveGameRef.current) {
      return;
    }

    didResolveGameRef.current = true;
    clearCountdownInterval();
    countdownDeadlineRef.current = null;
    stopCountdown();
    navigation.navigate("Win", { score: 100 });
  }, [clearCountdownInterval, navigation, stopCountdown]);

  const handleLose = useCallback(() => {
    if (didResolveGameRef.current) {
      return;
    }

    didResolveGameRef.current = true;
    clearCountdownInterval();
    countdownDeadlineRef.current = null;
    stopCountdown();
    navigation.navigate("Lose", { score: 0 });
  }, [clearCountdownInterval, navigation, stopCountdown]);

  // 5. Ігровий контролер
  const boardCtrl = useGameBoardController({
    mode: gameMode,
    bootGrid: bootGrid,
    onWin: handleWin,
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

  const beginCountdown = useCallback(
    (initialMs: number) => {
      const safeInitialMs = Math.max(0, Math.round(initialMs));

      clearCountdownInterval();
      countdownDeadlineRef.current = Date.now() + safeInitialMs;
      didResolveGameRef.current = false;
      resetCountdown(safeInitialMs);
      startCountdown(safeInitialMs);

      if (safeInitialMs === 0) {
        handleLose();
        return;
      }

      countdownIntervalRef.current = setInterval(() => {
        const deadline = countdownDeadlineRef.current;
        if (deadline === null) {
          return;
        }

        const nextMs = Math.max(0, deadline - Date.now());
        setCountdownMs(nextMs);

        if (nextMs === 0) {
          clearCountdownInterval();
          stopCountdown();
          handleLose();
        }
      }, COUNTDOWN_TICK_MS);
    },
    [
      clearCountdownInterval,
      handleLose,
      resetCountdown,
      setCountdownMs,
      startCountdown,
      stopCountdown,
    ],
  );

  useEffect(() => {
    return () => {
      clearCountdownInterval();
      countdownDeadlineRef.current = null;
      stopCountdown();
    };
  }, [clearCountdownInterval, stopCountdown]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!hasTimer) {
      clearCountdownInterval();
      countdownDeadlineRef.current = null;
      resetCountdown(settings.limitTimeMs);
      stopCountdown();
      return;
    }

    beginCountdown(settings.limitTimeMs);
  }, [
    beginCountdown,
    clearCountdownInterval,
    hasTimer,
    isReady,
    resetCountdown,
    settings.limitTimeMs,
    stopCountdown,
  ]);

  const handleHomePress = useCallback(() => {
    clearCountdownInterval();
    countdownDeadlineRef.current = null;
    stopCountdown();
    navigation.popToTop();
  }, [clearCountdownInterval, navigation, stopCountdown]);

  const handleRestartPress = useCallback(() => {
    boardCtrl.resetBoard(shuffleTiles());

    if (!hasTimer) {
      clearCountdownInterval();
      countdownDeadlineRef.current = null;
      resetCountdown(settings.limitTimeMs);
      stopCountdown();
      return;
    }

    beginCountdown(settings.limitTimeMs);
  }, [
    beginCountdown,
    boardCtrl,
    clearCountdownInterval,
    hasTimer,
    resetCountdown,
    settings.limitTimeMs,
    stopCountdown,
  ]);

  const timeText = useMemo(
    () => formatCountdownMs(hasTimer ? countdownMs : settings.limitTimeMs),
    [countdownMs, hasTimer, settings.limitTimeMs],
  );

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
            timeText={timeText}
            modeText={currentMode}
            onHomePress={handleHomePress}
            onRestartPress={handleRestartPress}
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
