import { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLayoutMetrics } from "../../context/LayoutMetricsProvider";
import { GameMetrics } from "./gameMetrics"; // Переконайся, що шлях правильний

// Тип для прямокутника (фрейму)
export type SceneFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type GameSceneMetrics = {
  screenW: number;
  screenH: number;
  headerFrame: SceneFrame;
  timerFrame: SceneFrame | null; // null, якщо таймера немає
  boardFrame: SceneFrame;
  buttonsBlockFrame: SceneFrame;
  modePanelFrame: SceneFrame;
};

export function useGameSceneMetrics(
  hasTimer: boolean = false,
): GameSceneMetrics {
  const { sw, sh, designW } = useLayoutMetrics();
  const insets = useSafeAreaInsets();

  return useMemo(() => {
    // Базові розміри
    const boardSize = GameMetrics.board.size;
    const gap = 30; // Проміжок між елементами у Групі 2

    // --- 1. Габарити елементів (Ширина та Висота) ---

    // Група 1
    const headerW = designW * 0.9;
    const headerH = designW * 0.2;

    // Група 2 елементи
    const timerW = boardSize;
    const timerH = boardSize * 0.181;

    const boardW = boardSize;
    const boardH = boardSize;

    const buttonsW = boardSize;
    const buttonsH = boardSize * 0.359;

    // Група 3
    const panelW = boardSize;
    const panelH = boardSize * 0.21;

    // --- 2. Вертикальне та горизонтальне компонування ---

    // Група 1: Header (приліплений до верхньої SafeArea)
    const headerY = insets.top;
    const headerX = (sw - headerW) / 2;

    // Група 3: Панель режиму гри (приліплена до нижньої SafeArea)
    const panelY = sh - insets.bottom - panelH;
    const panelX = (sw - panelW) / 2;

    // Група 2: Таймер + Дошка + Блок кнопок
    // Вираховуємо загальну висоту Групи 2
    const group2Height =
      (hasTimer ? timerH + gap : 0) + boardH + gap + buttonsH;

    // Визначаємо вільний простір між низом Групи 1 та верхом Групи 3
    const headerBottomY = headerY + headerH;
    const spaceBetween = panelY - headerBottomY;

    // Центруємо Групу 2 у цьому вільному просторі
    const group2StartY = headerBottomY + (spaceBetween - group2Height) / 2;

    // Розставляємо елементи Групи 2 зверху вниз
    let currentY = group2StartY;

    let timerFrame: SceneFrame | null = null;
    if (hasTimer) {
      timerFrame = {
        x: (sw - timerW) / 2,
        y: currentY,
        width: timerW,
        height: timerH,
      };
      currentY += timerH + gap;
    }

    const boardFrame: SceneFrame = {
      x: (sw - boardW) / 2,
      y: currentY,
      width: boardW,
      height: boardH,
    };
    currentY += boardH + gap;

    const buttonsBlockFrame: SceneFrame = {
      x: (sw - buttonsW) / 2,
      y: currentY,
      width: buttonsW,
      height: buttonsH,
    };

    return {
      screenW: sw,
      screenH: sh,
      headerFrame: {
        x: headerX,
        y: headerY,
        width: headerW,
        height: headerH,
      },
      timerFrame,
      boardFrame,
      buttonsBlockFrame,
      modePanelFrame: {
        x: panelX,
        y: panelY,
        width: panelW,
        height: panelH,
      },
    };
  }, [sw, sh, designW, insets.top, insets.bottom, hasTimer]);
}
