import { useFocusEffect } from "@react-navigation/native";
import { Canvas, Group } from "@shopify/react-native-skia";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useWindowDimensions } from "react-native";
import {
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { useSkiaFonts } from "@/context/FontProvider";
import { useLayoutRenderHelpers } from "@/context/LayoutSnapshotProvider";
import { SmileySkin } from "@/ui/skia/SmileySkin";
import { TileSkin } from "@/ui/skia/TileSkin";
import { hexToShader } from "@/utils/color";

const TILE_CONFIG = [
  { id: 1, label: "1", tilt: -0.32, color: "#71D4EB" },
  { id: 2, label: "3", tilt: 0.22, color: "#FF8A8A" },
  { id: 3, label: "5", tilt: -0.18, color: "#FFF27A" },
  { id: 4, label: "7", tilt: 0.3, color: "#9B8CFF" },
  { id: 5, label: "11", tilt: -0.12, color: "#8DFF98" },
] as const;

const ROLL_DURATION_MS = 1700;
const TILE_SETTLE_DURATION_MS = 280;
const TILE_APPEAR_STEP_MS = 140;
const TILE_APPEAR_START_MS = 260;

export default function SettingsAnimation() {
  const { width } = useWindowDimensions();
  const { S, snap } = useLayoutRenderHelpers();
  const { anim: tileFont } = useSkiaFonts();

  const [animationKey, setAnimationKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setAnimationKey((prev) => prev + 1);
    }, []),
  );

  const CANVAS_HEIGHT = snap(110 * S);
  const TILE_SIZE = snap(60 * S);
  const SMILEY_SIZE = snap(100 * S);

  const cx = width / 2;
  const cy = CANVAS_HEIGHT / 2;

  const totalTilesWidth = TILE_CONFIG.length * TILE_SIZE;
  const tileGap = snap(6 * S);
  const rowWidth = totalTilesWidth + tileGap * (TILE_CONFIG.length - 1);
  const rowStartX = cx - rowWidth / 2;
  const tileY = cy - TILE_SIZE / 2;

  const tiles = useMemo(
    () =>
      TILE_CONFIG.map((item, index) => ({
        ...item,
        x: rowStartX + index * (TILE_SIZE + tileGap),
        y: tileY,
        color: item.color,
        delay: TILE_APPEAR_START_MS + index * TILE_APPEAR_STEP_MS,
      })),
    [TILE_SIZE, rowStartX, tileGap, tileY],
  );
  if (!tileFont) return null;
  return (
    <Canvas style={{ width: "100%", height: CANVAS_HEIGHT }}>
      {tiles.map((tile) => (
        <AnimatedTile
          key={`${tile.id}-${animationKey}`}
          label={tile.label}
          x={tile.x}
          y={tile.y}
          size={TILE_SIZE}
          tilt={tile.tilt}
          delay={tile.delay}
          font={tileFont}
          color={tile.color}
          S={S}
          snap={snap}
        />
      ))}

      <AnimatedSmiley
        key={`smiley-${animationKey}`}
        canvasWidth={width}
        cy={cy}
        size={SMILEY_SIZE}
      />
    </Canvas>
  );
}

type AnimatedTileProps = {
  label: string;
  x: number;
  y: number;
  color: string;
  size: number;
  tilt: number;
  delay: number;
  font: NonNullable<ReturnType<typeof useSkiaFonts>["anim"]>;
  S: number;
  snap: (v: number) => number;
};

function AnimatedTile({
  label,
  x,
  y,
  color,
  size,
  tilt,
  delay,
  font,
  S,
  snap,
}: AnimatedTileProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);
  const rotation = useSharedValue(tilt);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 120 }));
    scale.value = withDelay(delay, withTiming(1, { duration: 180 }));
    rotation.value = withDelay(
      ROLL_DURATION_MS + 40,
      withTiming(0, { duration: TILE_SETTLE_DURATION_MS }),
    );
  }, [delay, opacity, rotation, scale]);

  const transform = useDerivedValue(() => {
    return [
      { translateX: x + size / 2 },
      { translateY: y + size / 2 },
      { rotate: rotation.value },
      { scale: scale.value },
      { translateX: -size / 2 },
      { translateY: -size / 2 },
    ];
  }, [size, x, y]);

  return (
    <Group transform={transform} opacity={opacity}>
      <TileSkin
        rect={{ x: 0, y: 0, width: size, height: size }}
        label={label}
        font={font}
        S={S}
        snap={snap}
        textColor="#000000"
        tintColor={hexToShader(color)}
      />
    </Group>
  );
}

type AnimatedSmileyProps = {
  canvasWidth: number;
  cy: number;
  size: number;
};

function AnimatedSmiley({ canvasWidth, cy, size }: AnimatedSmileyProps) {
  const travel = useSharedValue(0);

  useEffect(() => {
    travel.value = withTiming(1, { duration: ROLL_DURATION_MS });
  }, [travel]);

  const startX = -size;
  const endX = canvasWidth + size;

  const transform = useDerivedValue(() => {
    const x = startX + (endX - startX) * travel.value;
    const rotation = Math.PI * 3.2 * travel.value;

    return [
      { translateX: x + size / 2 },
      { translateY: cy },
      { rotate: rotation },
      { translateX: -size / 2 },
      { translateY: -size / 2 },
    ];
  }, [canvasWidth, cy, endX, size, startX]);

  return (
    <Group transform={transform}>
      <SmileySkin size={size} />
    </Group>
  );
}
