import { RootStackParamList } from "@/types/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View } from "react-native";

// Хуки та провайдери
import { useSkiaFonts } from "@/context/FontProvider";
import { useGameState } from "@/context/GameStateProvider";
import {
  MoveCommitEvent,
  useGameBoardController,
} from "@/ui/game/useGameBoardController";
import { useGameSceneMetrics } from "@/ui/game/useGameSceneMetrics";

// UI Компоненти:
// Жести
import { BoardGestureOverlay } from "@/ui/game/BoardGestureOverlay";
// Сцена
import { GameSceneCanvas } from "@/ui/game/GameSceneCanvas";

// Функція для генерації початкового положення плиток
import { shuffleTiles } from "@/ui/game/gameEngine/shuffleTiles";
import { useSharedValue } from "react-native-reanimated";

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
    recordWin,
    recordLoss,
  } = useGameState();

  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const countdownDeadlineRef = useRef<number | null>(null);
  const didResolveGameRef = useRef(false);
  const didPersistGameResultRef = useRef(false);
  const hasPendingWinRef = useRef(false);
  const sessionStartedAtMsRef = useRef<number | null>(null);
  const sessionStartedAtIsoRef = useRef<string | null>(null);
  const sessionIdRef = useRef(0);
  const sessionIdSV = useSharedValue(0);

  // 4. Генерація початкового положення плиток
  const bootGrid = useMemo(() => shuffleTiles(), []);

  const clearCountdownInterval = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  const beginGameSession = useCallback(() => {
    const startedAtMs = Date.now();
    const nextSessionId = sessionIdRef.current + 1;

    sessionIdRef.current = nextSessionId;
    sessionIdSV.value = nextSessionId;

    sessionStartedAtMsRef.current = startedAtMs;
    sessionStartedAtIsoRef.current = new Date(startedAtMs).toISOString();

    didResolveGameRef.current = false;
    didPersistGameResultRef.current = false;
    hasPendingWinRef.current = false;

    return startedAtMs;
  }, [sessionIdSV]);

  const handleMoveCommitted = useCallback(
    ({ committedAtMs, isWinningMove, moves, sessionId }: MoveCommitEvent) => {
      if (sessionId !== sessionIdRef.current) {
        return;
      }

      if (!isWinningMove) {
        return;
      }

      hasPendingWinRef.current = true;
      clearCountdownInterval();
      countdownDeadlineRef.current = null;
      stopCountdown();

      if (didPersistGameResultRef.current) {
        return;
      }

      const startedAtMs = sessionStartedAtMsRef.current;
      const startedAt = sessionStartedAtIsoRef.current;
      if (startedAtMs === null || startedAt === null) {
        return;
      }

      didPersistGameResultRef.current = true;
      recordWin({
        startedAt,
        durationMs: Math.max(0, Math.round(committedAtMs - startedAtMs)),
        moves,
      });
    },
    [clearCountdownInterval, recordWin, stopCountdown],
  );

  const handleWin = useCallback(() => {
    if (didResolveGameRef.current) {
      return;
    }

    didResolveGameRef.current = true;
    hasPendingWinRef.current = false;
    clearCountdownInterval();
    countdownDeadlineRef.current = null;
    stopCountdown();
    navigation.navigate("Win", { score: 100 });
  }, [clearCountdownInterval, navigation, stopCountdown]);

  const handleLose = useCallback(() => {
    if (didResolveGameRef.current || hasPendingWinRef.current) {
      return;
    }

    didResolveGameRef.current = true;
    if (!didPersistGameResultRef.current) {
      didPersistGameResultRef.current = true;
      recordLoss();
    }
    clearCountdownInterval();
    countdownDeadlineRef.current = null;
    stopCountdown();
    navigation.navigate("Lose", { score: 0 });
  }, [clearCountdownInterval, navigation, recordLoss, stopCountdown]);

  // 5. Ігровий контролер
  const boardCtrl = useGameBoardController({
    mode: gameMode,
    bootGrid,
    onWin: handleWin,
    onMoveCommitted: handleMoveCommitted,
    sessionIdSV,
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
      const startedAtMs = beginGameSession();

      clearCountdownInterval();
      countdownDeadlineRef.current = startedAtMs + safeInitialMs;
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
      beginGameSession,
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
      beginGameSession();
      resetCountdown(settings.limitTimeMs);
      stopCountdown();
      return;
    }

    beginCountdown(settings.limitTimeMs);
  }, [
    beginCountdown,
    beginGameSession,
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
      beginGameSession();
      resetCountdown(settings.limitTimeMs);
      stopCountdown();
      return;
    }

    beginCountdown(settings.limitTimeMs);
  }, [
    beginCountdown,
    beginGameSession,
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
