import {
  resolveGameResultReason,
} from "@/screens/components/GameResult/resultLogic";
import type { GameResultRouteParams } from "@/screens/components/GameResult/result.types";
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
  WinEvent,
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
type ResultPhase = "inactive" | "active" | "win_pending" | "resolved";

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
    statistics,
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
  const resultPhaseRef = useRef<ResultPhase>("inactive");
  const lastCommittedMovesRef = useRef(0);
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

  const stopCountdownFlow = useCallback(() => {
    clearCountdownInterval();
    countdownDeadlineRef.current = null;
    stopCountdown();
  }, [clearCountdownInterval, stopCountdown]);

  const getSessionSnapshot = useCallback(() => {
    const startedAtMs = sessionStartedAtMsRef.current;
    const startedAt = sessionStartedAtIsoRef.current;

    if (startedAtMs === null || startedAt === null) {
      return null;
    }

    return { startedAtMs, startedAt };
  }, []);

  const beginGameSession = useCallback(() => {
    const startedAtMs = Date.now();
    const nextSessionId = sessionIdRef.current + 1;

    sessionIdRef.current = nextSessionId;
    sessionIdSV.value = nextSessionId;

    sessionStartedAtMsRef.current = startedAtMs;
    sessionStartedAtIsoRef.current = new Date(startedAtMs).toISOString();

    resultPhaseRef.current = "active";
    lastCommittedMovesRef.current = 0;

    return startedAtMs;
  }, [sessionIdSV]);

  const invalidateGameSession = useCallback(() => {
    const nextSessionId = sessionIdRef.current + 1;

    sessionIdRef.current = nextSessionId;
    sessionIdSV.value = nextSessionId;

    sessionStartedAtMsRef.current = null;
    sessionStartedAtIsoRef.current = null;
    resultPhaseRef.current = "inactive";
  }, [sessionIdSV]);

  const handleMoveCommitted = useCallback(
    ({ isWinningMove, moves, sessionId }: MoveCommitEvent) => {
      if (sessionId !== sessionIdRef.current) {
        return;
      }

      lastCommittedMovesRef.current = moves;

      if (!isWinningMove) {
        return;
      }

      if (resultPhaseRef.current !== "active") {
        return;
      }

      resultPhaseRef.current = "win_pending";
      stopCountdownFlow();
    },
    [stopCountdownFlow],
  );

  const handleWin = useCallback(
    ({ committedAtMs, moves, sessionId }: WinEvent) => {
      if (sessionId !== sessionIdRef.current) {
        return;
      }

      if (
        resultPhaseRef.current !== "active" &&
        resultPhaseRef.current !== "win_pending"
      ) {
        return;
      }

      const session = getSessionSnapshot();
      if (!session) {
        return;
      }

      const prevBestTime = statistics.bestTime;
      const durationMs = Math.max(
        0,
        Math.round(committedAtMs - session.startedAtMs),
      );
      const resultParams: GameResultRouteParams = {
        reason: resolveGameResultReason({
          didWin: true,
          didTimeExpire: false,
          currentDurationMs: durationMs,
          previousBestTime: prevBestTime,
        }),
        durationMs,
        moves,
        startedAt: session.startedAt,
        mode: gameMode,
      };

      resultPhaseRef.current = "resolved";
      stopCountdownFlow();
      recordWin({
        startedAt: session.startedAt,
        durationMs,
        moves,
      });

      navigation.replace("GameResult", resultParams);
    },
    [
      gameMode,
      getSessionSnapshot,
      navigation,
      recordWin,
      statistics.bestTime,
      stopCountdownFlow,
    ],
  );

  const handleLose = useCallback(() => {
    if (resultPhaseRef.current !== "active") {
      return;
    }

    const session = getSessionSnapshot();
    if (!session) {
      return;
    }

    const durationMs = Math.min(
      settings.limitTimeMs,
      Math.max(0, Math.round(Date.now() - session.startedAtMs)),
    );
    const resultParams: GameResultRouteParams = {
      reason: resolveGameResultReason({
        didWin: false,
        didTimeExpire: true,
        currentDurationMs: durationMs,
        previousBestTime: statistics.bestTime,
      }),
      durationMs,
      moves: lastCommittedMovesRef.current,
      startedAt: session.startedAt,
      mode: gameMode,
    };

    resultPhaseRef.current = "resolved";
    recordLoss();
    stopCountdownFlow();
    navigation.replace("GameResult", resultParams);
  }, [
    gameMode,
    getSessionSnapshot,
    navigation,
    recordLoss,
    settings.limitTimeMs,
    statistics.bestTime,
    stopCountdownFlow,
  ]);

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
      invalidateGameSession();
      stopCountdownFlow();
    };
  }, [invalidateGameSession, stopCountdownFlow]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!hasTimer) {
      stopCountdownFlow();
      beginGameSession();
      resetCountdown(settings.limitTimeMs);
      return;
    }

    beginCountdown(settings.limitTimeMs);
  }, [
    beginCountdown,
    beginGameSession,
    hasTimer,
    isReady,
    resetCountdown,
    settings.limitTimeMs,
    stopCountdownFlow,
  ]);

  const handleHomePress = useCallback(() => {
    invalidateGameSession();
    stopCountdownFlow();
    navigation.popToTop();
  }, [invalidateGameSession, navigation, stopCountdownFlow]);

  const handleRestartPress = useCallback(() => {
    boardCtrl.resetBoard(shuffleTiles());

    if (!hasTimer) {
      stopCountdownFlow();
      beginGameSession();
      resetCountdown(settings.limitTimeMs);
      return;
    }

    beginCountdown(settings.limitTimeMs);
  }, [
    beginCountdown,
    beginGameSession,
    boardCtrl,
    hasTimer,
    resetCountdown,
    settings.limitTimeMs,
    stopCountdownFlow,
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
