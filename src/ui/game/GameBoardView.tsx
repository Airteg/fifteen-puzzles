import type { SkFont } from "@shopify/react-native-skia";
import { Canvas, Group } from "@shopify/react-native-skia";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useLayoutMetrics } from "@/context/LayoutMetricsProvider";
import type { BoardMetrics } from "@/ui/game/boardGeometry";
import { cellRect, makeBoardMetrics } from "@/ui/game/boardGeometry";
import { GameMetrics } from "@/ui/game/gameMetrics";
import { BoardSkin } from "@/ui/skia/BoardSkin";
import { TileSkin } from "@/ui/skia/TileSkin";
import { BoardGestureOverlay } from "./BoardGestureOverlay";

type Props = {
  tileFont: SkFont | null;
};

type Tile = { id: number; label: string; row: number; col: number };

function makeDefaultGrid(): number[] {
  const g: number[] = [];
  for (let i = 1; i <= 15; i++) g.push(i);
  g.push(0);
  return g;
}

function idx(row: number, col: number) {
  return row * 4 + col;
}

function findEmpty(grid: number[]) {
  const i = grid.indexOf(0);
  return { row: Math.floor(i / 4), col: i % 4 };
}

function tilesFromGrid(grid: number[]): Tile[] {
  const out: Tile[] = [];
  for (let i = 0; i < 16; i++) {
    const v = grid[i];
    if (v === 0) continue;
    out.push({
      id: v,
      label: String(v),
      row: Math.floor(i / 4),
      col: i % 4,
    });
  }
  return out;
}

// ------------------------------------------------------------------
// Логіка зсуву працює як з 1 плиткою, так і з групою (до 3 плиток)
// ------------------------------------------------------------------
function commitShift(
  grid: number[],
  empty: { row: number; col: number },
  axis: "x" | "y",
  steps: number,
): { nextGrid: number[]; movedIds: number[]; dir: 1 | -1 } | null {
  if (steps === 0) return null;

  const next = grid.slice();
  const movedIds: number[] = [];

  let er = empty.row;
  let ec = empty.col;

  const dir: 1 | -1 = steps > 0 ? 1 : -1;
  const count = Math.abs(steps);

  for (let k = 0; k < count; k++) {
    if (axis === "x") {
      const srcC = dir > 0 ? ec - 1 : ec + 1;
      if (srcC < 0 || srcC > 3) return null;

      const srcI = idx(er, srcC);
      const dstI = idx(er, ec);
      const tileId = next[srcI];
      if (tileId === 0) return null;

      next[dstI] = tileId;
      next[srcI] = 0;
      movedIds.push(tileId);

      ec = srcC;
    } else {
      const srcR = dir > 0 ? er - 1 : er + 1;
      if (srcR < 0 || srcR > 3) return null;

      const srcI = idx(srcR, ec);
      const dstI = idx(er, ec);
      const tileId = next[srcI];
      if (tileId === 0) return null;

      next[dstI] = tileId;
      next[srcI] = 0;
      movedIds.push(tileId);

      er = srcR;
    }
  }

  return { nextGrid: next, movedIds, dir };
}

type TileNodeProps = {
  m: BoardMetrics;
  S: number;
  snap: (v: number) => number;

  tile: Tile;
  font: SkFont;

  emptyRow: SharedValue<number>;
  emptyCol: SharedValue<number>;
  dragActive: SharedValue<number>;
  dragAxis: SharedValue<number>;
  dragSteps: SharedValue<number>;
  dragLine: SharedValue<number>;

  animT: SharedValue<number>;
  animAxis: "x" | "y";
  animDir: 1 | -1;
  animMoved: boolean;
};

const TileNode = memo(function TileNode(props: TileNodeProps) {
  const {
    m,
    S,
    snap,
    tile,
    font,
    emptyRow,
    emptyCol,
    dragActive,
    dragAxis,
    dragSteps,
    dragLine,
    animT,
    animAxis,
    animDir,
    animMoved,
  } = props;

  const step = m.step;

  const transform = useDerivedValue(() => {
    let dx = 0;
    let dy = 0;

    if (dragActive.value === 1) {
      const steps = dragSteps.value;

      if (steps !== 0) {
        if (dragAxis.value === 1) {
          if (tile.row === dragLine.value && tile.row === emptyRow.value) {
            const eC = emptyCol.value;
            if (steps > 0) {
              if (tile.col >= eC - steps && tile.col <= eC - 1) dx += step;
            } else {
              const k = -steps;
              if (tile.col >= eC + 1 && tile.col <= eC + k) dx -= step;
            }
          }
        } else if (dragAxis.value === 2) {
          if (tile.col === dragLine.value && tile.col === emptyCol.value) {
            const eR = emptyRow.value;
            if (steps > 0) {
              if (tile.row >= eR - steps && tile.row <= eR - 1) dy += step;
            } else {
              const k = -steps;
              if (tile.row >= eR + 1 && tile.row <= eR + k) dy -= step;
            }
          }
        }
      }
    }

    if (animMoved) {
      const back = (1 - animT.value) * step;
      if (animAxis === "x") dx += -animDir * back;
      else dy += -animDir * back;
    }

    return [{ translateX: dx }, { translateY: dy }];
  }, [animMoved, animAxis, animDir, step]);

  return (
    <Group transform={transform}>
      <TileSkin
        rect={cellRect(m, tile.row, tile.col)}
        label={tile.label}
        font={font}
        S={S}
        snap={snap}
        baseColor={[0.88, 0.92, 0.95, 1.0]}
        textColor="#1C2833"
      />
    </Group>
  );
});

export function GameBoardView({ tileFont }: Props) {
  const lm = useLayoutMetrics();
  const S = lm.S;
  const snap = lm.snap;

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

  const pad = snap(14 * S);
  const canvasSize = m.boardSize + pad * 2;

  const [grid, setGrid] = useState<number[]>(() => makeDefaultGrid());
  const empty = useMemo(() => findEmpty(grid), [grid]);
  const tiles = useMemo(() => tilesFromGrid(grid), [grid]);

  const emptyRow = useSharedValue(empty.row);
  const emptyCol = useSharedValue(empty.col);

  const dragActive = useSharedValue(0);
  const dragAxis = useSharedValue(0);
  const dragSteps = useSharedValue(0);
  const dragLine = useSharedValue(-1);

  useEffect(() => {
    emptyRow.value = empty.row;
    emptyCol.value = empty.col;
  }, [empty.row, empty.col, emptyRow, emptyCol]);

  const animT = useSharedValue(1);
  const [animMovedIds, setAnimMovedIds] = useState<number[]>([]);
  const [animAxis, setAnimAxis] = useState<"x" | "y">("x");
  const [animDir, setAnimDir] = useState<1 | -1>(1);

  const onTapCell = useCallback(
    (row: number, col: number) => {
      // 1. Перевіряємо, чи знаходиться тапнута плитка в тому ж рядку або стовпці, що й пуста
      if (row !== empty.row && col !== empty.col) return;

      // 2. Не реагуємо на клік по самій пустій клітинці
      if (row === empty.row && col === empty.col) return;

      let axis: "x" | "y";
      let steps: number;

      // 3. Рахуємо точну кількість плиток (steps), яку треба зсунути (від 1 до 3)
      if (row === empty.row) {
        axis = "x";
        steps = empty.col - col;
      } else {
        axis = "y";
        steps = empty.row - row;
      }

      const res = commitShift(grid, empty, axis, steps);
      if (!res) return;

      setAnimMovedIds(res.movedIds);
      setAnimAxis(axis);
      setAnimDir(res.dir);

      animT.value = 0;
      setGrid(res.nextGrid);
      animT.value = withTiming(1, { duration: 140 });
    },
    [animT, empty, grid],
  );

  const onCommitShift = useCallback(
    (axis: "x" | "y", steps: number) => {
      const res = commitShift(grid, empty, axis, steps);
      if (!res) return;

      setAnimMovedIds(res.movedIds);
      setAnimAxis(axis);
      setAnimDir(res.dir);

      animT.value = 0;
      setGrid(res.nextGrid);
      animT.value = withTiming(1, { duration: 160 });
    },
    [animT, empty, grid],
  );

  return (
    <View
      style={{
        width: canvasSize,
        height: canvasSize,
        alignSelf: "center",
        position: "relative",
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
            <TileNode
              key={t.id}
              m={m}
              S={S}
              snap={snap}
              tile={t}
              font={tileFont}
              emptyRow={emptyRow}
              emptyCol={emptyCol}
              dragActive={dragActive}
              dragAxis={dragAxis}
              dragSteps={dragSteps}
              dragLine={dragLine}
              animT={animT}
              animAxis={animAxis}
              animDir={animDir}
              animMoved={animMovedIds.includes(t.id)}
            />
          ))}
        </Group>
      </Canvas>

      <BoardGestureOverlay
        m={m}
        pad={pad}
        canvasSize={canvasSize}
        lockAbs={snap(2 * S)}
        lockRatio={1.2}
        emptyRow={emptyRow}
        emptyCol={emptyCol}
        dragActive={dragActive}
        dragAxis={dragAxis}
        dragSteps={dragSteps}
        dragLine={dragLine}
        onTapCell={onTapCell}
        onCommitShift={onCommitShift}
      />
    </View>
  );
}
