import { useFocusEffect } from "@react-navigation/native";
import { Canvas, Group } from "@shopify/react-native-skia";
import React, { useCallback, useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import {
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { useSkiaFonts } from "@/context/FontProvider";
import { useLayoutRenderHelpers } from "@/context/LayoutSnapshotProvider";
import { SmileySkin } from "@/ui/skia/SmileySkin";
import { TileSkin } from "@/ui/skia/TileSkin";

const TILES_CONFIG = [
  {
    id: 9,
    label: "9",
    dx: -115,
    dy: 10,
    rot: -0.3,
    color: [0.4, 0.8, 0.9, 1.0] as const,
    delay: 600,
  },
  {
    id: 3,
    label: "3",
    dx: -65,
    dy: -55,
    rot: -0.2,
    color: [0.9, 0.5, 0.7, 1.0] as const,
    delay: 650,
  },
  {
    id: 12,
    label: "12",
    dx: -45,
    dy: 45,
    rot: -0.15,
    color: [0.6, 0.5, 0.9, 1.0] as const,
    delay: 700,
  },
  {
    id: 2,
    label: "2",
    dx: 65,
    dy: -55,
    rot: 0.1,
    color: [0.9, 0.4, 0.4, 1.0] as const,
    delay: 650,
  },
  {
    id: 10,
    label: "10",
    dx: 55,
    dy: 50,
    rot: -0.1,
    color: [0.9, 0.9, 0.3, 1.0] as const,
    delay: 750,
  },
  {
    id: 1,
    label: "1",
    dx: 115,
    dy: 10,
    rot: 0.25,
    color: [0.6, 0.9, 0.5, 1.0] as const,
    delay: 600,
  },
];

const AnimatedTile = ({ config, cx, cy, tileSize, font, S, snap }: any) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      config.delay,
      withSpring(1, { damping: 10, stiffness: 90, mass: 1 }),
    );
  }, [config.delay, progress]);

  const transform = useDerivedValue(() => {
    const x = cx + config.dx * S * progress.value;
    const y = cy + config.dy * S * progress.value;
    const scale = progress.value;
    const currentRot = -1 * (1 - progress.value) + config.rot * progress.value;

    return [
      { translateX: x },
      { translateY: y },
      { scale: Math.max(0, scale) },
      { rotate: currentRot },
      { translateX: -tileSize / 2 },
      { translateY: -tileSize / 2 },
    ];
  }, [S, cx, cy, tileSize]);

  return (
    <Group transform={transform}>
      <TileSkin
        rect={{ x: 0, y: 0, width: tileSize, height: tileSize }}
        label={config.label}
        font={font}
        baseColor={config.color}
        textColor="#000000"
      />
    </Group>
  );
};

const AnimatedSmiley = ({ cx, cy, smileySize }: any) => {
  const scaleVal = useSharedValue(0.5);
  const rotVal = useSharedValue(0);

  useEffect(() => {
    scaleVal.value = withSpring(1, { damping: 12, stiffness: 100 });

    rotVal.value = withDelay(
      400,
      withSequence(
        withTiming(-0.15, { duration: 150 }),
        withTiming(0.15, { duration: 150 }),
        withTiming(-0.1, { duration: 100 }),
        withTiming(0, { duration: 100 }),
      ),
    );
  }, [scaleVal, rotVal]);

  const transform = useDerivedValue(() => {
    return [
      { translateX: cx },
      { translateY: cy },
      { scale: scaleVal.value },
      { rotate: rotVal.value },
      { translateX: -smileySize / 2 },
      { translateY: -smileySize / 2 },
    ];
  });

  return (
    <Group transform={transform}>
      <SmileySkin size={smileySize} />
    </Group>
  );
};

export default function HomeAnimation() {
  const { width } = useWindowDimensions();
  const { S, snap } = useLayoutRenderHelpers();
  const { title: tileFont } = useSkiaFonts();

  const [animationKey, setAnimationKey] = useState(0);
  // Використовуємо useFocusEffect, щоб оновлювати ключ щоразу, коли екран отримує фокус
  useFocusEffect(
    useCallback(() => {
      // Оновлюємо ключ анімації, щоб примусити перезапустити анімацію
      setAnimationKey((prev) => prev + 1);
    }, []),
  );

  if (!tileFont) return null;

  const CANVAS_HEIGHT = snap(210 * S);
  const cx = width / 2;
  const cy = CANVAS_HEIGHT / 2;

  const TILE_SIZE = snap(56 * S);
  const SMILEY_SIZE = snap(88 * S);

  return (
    <Canvas style={{ width: "100%", height: CANVAS_HEIGHT }}>
      {TILES_CONFIG.map((config) => (
        <AnimatedTile
          // Додаємо animationKey сюди, щоб компоненти перемонтовувались
          key={`${config.id}-${animationKey}`}
          config={config}
          cx={cx}
          cy={cy}
          tileSize={TILE_SIZE}
          font={tileFont}
          S={S}
          snap={snap}
        />
      ))}

      <AnimatedSmiley
        key={`smiley-${animationKey}`}
        cx={cx}
        cy={cy}
        smileySize={SMILEY_SIZE}
      />
    </Canvas>
  );
}
