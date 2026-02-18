import { useLayoutMetrics } from "@/context/LayoutMetricsProvider";
import { AppHeader } from "@/ui/header/AppHeader";
import React from "react";
import { View } from "react-native";

type Props = {
  // якщо null/undefined — таймера нема (Classic)
  timer?: React.ReactNode;

  // дошка гри (Canvas)
  board: React.ReactNode;

  // блок HOME/RESTART
  buttons: React.ReactNode;

  // нижня “режимна” кнопка: CLASSIC або LIMIT TIME
  cta: React.ReactNode;
};

export function GameScreenShell({ timer, board, buttons, cta }: Props) {
  const { S, snap } = useLayoutMetrics();

  // Design constraints:
  // content side padding = 57 (on 390 wide design) => contentW = 276
  const contentW = snap(276 * S);

  // Vertical rhythm (design px):
  const gapHeaderToNext = snap(43 * S); // header -> timer OR header -> board (classic)
  const gapTimerToBoard = snap(30 * S);
  const gapBoardToButtons = snap(30 * S);
  const gapButtonsToCTA = snap(60 * S);

  return (
    <View style={{ flex: 1, backgroundColor: "#D5F7FF" }}>
      {/* Header: не чіпаємо, він сам знає свою ширину 350*S і top offset */}
      <AppHeader />

      {/* Header -> next */}
      <View style={{ height: gapHeaderToNext }} />

      {/* Timer (optional) */}
      {timer ? (
        <>
          <View style={{ width: contentW, alignSelf: "center" }}>{timer}</View>
          <View style={{ height: gapTimerToBoard }} />
        </>
      ) : null}

      {/* Board */}
      <View style={{ width: contentW, alignSelf: "center" }}>{board}</View>

      <View style={{ height: gapBoardToButtons }} />

      {/* Buttons block */}
      <View style={{ width: contentW, alignSelf: "center" }}>{buttons}</View>

      <View style={{ height: gapButtonsToCTA }} />

      {/* CTA */}
      <View style={{ width: contentW, alignSelf: "center" }}>{cta}</View>
    </View>
  );
}
