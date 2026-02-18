import type { SkFont } from "@shopify/react-native-skia";
import { Canvas, Group } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import { View } from "react-native";

import { useLayoutMetrics } from "@/context/LayoutMetricsProvider";
import { cellRect, makeBoardMetrics } from "@/ui/game/boardGeometry";
import { GameMetrics } from "@/ui/game/gameMetrics";
import { BoardSkin } from "@/ui/skia/BoardSkin";
import { TileSkin } from "@/ui/skia/TileSkin";
import { useSharedValue } from "react-native-reanimated";
import { BoardGestureOverlay } from "./BoardGestureOverlay";

type Props = {
  tileFont: SkFont | null; // KronaOne (Skia)
};

type Tile = { id: number; label: string; row: number; col: number };

function makeDefaultTiles(): Tile[] {
  const out: Tile[] = [];
  let n = 1;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (r === 3 && c === 3) continue; // empty
      out.push({ id: n, label: String(n), row: r, col: c });
      n++;
    }
  }
  return out;
}

export function GameBoardView({ tileFont }: Props) {
  useSharedValue(0);
  const { S, snap } = useLayoutMetrics();
  if (!tileFont) return null;

  const m = useMemo(
    () =>
      makeBoardMetrics({
        S,
        snap,
        size: GameMetrics.board.size,
        inset: GameMetrics.board.inset,
        tile: GameMetrics.board.tile,
        gap: GameMetrics.board.gap,
      }),
    [S, snap],
  );

  // Padding під тіні (узгоджено з BoardSkin blur/offset)
  const pad = snap(14 * S);
  const canvasSize = m.boardSize + pad * 2;

  if (__DEV__) {
    const expected = m.inset * 2 + m.tile * 4 + m.gap * 3;
    console.log("[BoardMetrics]", {
      S,
      boardSize: m.boardSize,
      expected,
      diff: expected - m.boardSize,
      pad,
      canvasSize,
    });
  }

  const tiles = useMemo(() => makeDefaultTiles(), []);

  return (
    <View
      style={{
        width: canvasSize,
        height: canvasSize,
        alignSelf: "center",
        position: "relative", // важливо для абсолютного оверлея
      }}
    >
      <Canvas style={{ width: canvasSize, height: canvasSize }}>
        <Group transform={[{ translateX: pad }, { translateY: pad }]}>
          <BoardSkin
            rect={{ x: 0, y: 0, width: m.boardSize, height: m.boardSize }}
            radius={snap(16 * S)}
            blurA={snap(4 * S)}
            blurB={snap(8 * S)}
            S={S}
            snap={snap}
          />

          {tiles.map((t) => (
            <TileSkin
              key={t.id}
              rect={cellRect(m, t.row, t.col)}
              label={t.label}
              font={tileFont}
              S={S}
              snap={snap}
            />
          ))}
        </Group>
      </Canvas>

      {/* ✅ RNGH має бути в RN View-дереві, тому ОВЕРЛЕЙ тут, а не в Canvas */}
      <BoardGestureOverlay
        m={m}
        pad={pad}
        canvasSize={canvasSize}
        lockAbs={snap(2 * S)}
        lockRatio={1.2}
        onDrag={(e) => {
          // Лог тільки start/end — move може спамити
          if (__DEV__ && (e.phase === "start" || e.phase === "end")) {
            console.log("[Drag]", e.phase, {
              axis: e.axis,
              steps: e.steps,
              x: Math.round(e.x),
              y: Math.round(e.y),
            });
          }
        }}
      />
    </View>
  );
}
