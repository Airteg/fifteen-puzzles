import React, { useEffect, useState, useCallback } from "react";
import { useWindowDimensions } from "react-native";
import { Canvas, Group, Rect, Shadow } from "@shopify/react-native-skia";
import {
  useSharedValue,
  useDerivedValue,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
} from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";

import { useLayoutMetrics } from "@/context/LayoutMetricsProvider";
import { useSkiaFonts } from "@/context/FontProvider";
import { TileSkin } from "@/ui/skia/TileSkin";
import { SmileySkin } from "@/ui/skia/SmileySkin";

// --- КОНФІГУРАЦІЯ ПЛИТОК ---
// Слова "you", "can", "do", "it", кути нахилу та кольори за макетом
const TILES_CONFIG = [
  {
    id: "you",
    label: "you",
    dx: -70,
    dy: -70,
    rot: 0.78,
    color: [0.4, 0.8, 0.9, 1.0] as const,
    delay: 600,
  }, // Cyan
  {
    id: "can",
    label: "can",
    dx: 70,
    dy: -70,
    rot: -0.78,
    color: [0.6, 0.9, 0.5, 1.0] as const,
    delay: 650,
  }, // Green
  {
    id: "do",
    label: "do",
    dx: -70,
    dy: 70,
    rot: 0.78,
    color: [0.9, 0.4, 0.4, 1.0] as const,
    delay: 700,
  }, // Coral
  {
    id: "it",
    label: "it",
    dx: 70,
    dy: 70,
    rot: -0.78,
    color: [0.5, 0.4, 0.9, 1.0] as const,
    delay: 750,
  }, // Purple
];

// --- АНІМОВАНИЙ КВАДРАТ (ФОН) ---
const AnimatedSquare = ({ cx, cy, size }: any) => {
  const scaleVal = useSharedValue(0);
  const rotVal = useSharedValue(0);

  useEffect(() => {
    // Пружинне збільшення розміру з 0 до 1
    scaleVal.value = withSpring(1, { damping: 15, stiffness: 80 });
    // Робимо 5 повних обертів (10 пі) за 1.5 секунди
    rotVal.value = withTiming(Math.PI * 10, { duration: 1500 });
  }, [scaleVal, rotVal]);

  const transform = useDerivedValue(() => {
    return [
      { translateX: cx },
      { translateY: cy },
      { scale: scaleVal.value },
      { rotate: rotVal.value },
      { translateX: -size / 2 },
      { translateY: -size / 2 },
    ];
  });

  return (
    <Group transform={transform}>
      <Rect x={0} y={0} width={size} height={size} color="#FAFF3F">
        <Shadow dx={0} dy={4} blur={8} color="rgba(0, 0, 0, 0.2)" />
      </Rect>
    </Group>
  );
};

// --- АНІМОВАНА ПЛИТКА ---
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

    // Вкручування в позицію (початковий кут відрізняється на -1 радіан)
    const currentRot = -1 * (1 - progress.value) + config.rot * progress.value;

    return [
      { translateX: x },
      { translateY: y },
      { scale: Math.max(0, scale) },
      { rotate: currentRot },
      { translateX: -tileSize / 2 },
      { translateY: -tileSize / 2 },
    ];
  }, [S, cx, cy, tileSize, config]);

  return (
    <Group transform={transform}>
      <TileSkin
        rect={{ x: 0, y: 0, width: tileSize, height: tileSize }}
        label={config.label}
        font={font}
        S={S}
        snap={snap}
        baseColor={config.color}
        textColor="#000000"
      />
    </Group>
  );
};

// --- АНІМОВАНИЙ СМАЙЛИК ---
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

// --- ГОЛОВНА СЦЕНА ---
export default function NewGameAnimation() {
  const { width } = useWindowDimensions();
  const lm = useLayoutMetrics();
  const S = lm.S;
  const snap = lm.snap;
  const { title: tileFont } = useSkiaFonts();

  const [animationKey, setAnimationKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setAnimationKey((prev) => prev + 1);
    }, []),
  );

  if (!tileFont) return null;

  // Дизайн-метрики (260x260 за макетом)
  const CANVAS_HEIGHT = snap(260 * S);
  const cx = width / 2;
  const cy = CANVAS_HEIGHT / 2;

  const TILE_SIZE = snap(56 * S);
  const SMILEY_SIZE = snap(88 * S);
  const SQUARE_SIZE = snap(140 * S); // Трохи менший за розмах плиток

  return (
    <Canvas style={{ width: "100%", height: CANVAS_HEIGHT }}>
      {/* 1. Спочатку малюємо квадрат, щоб він був на самому фоні */}
      <AnimatedSquare
        key={`square-${animationKey}`}
        cx={cx}
        cy={cy}
        size={SQUARE_SIZE}
      />

      {/* 2. Потім плитки, щоб вони вилітали З-ПІД смайлика, але НАД квадратом */}
      {TILES_CONFIG.map((config) => (
        <AnimatedTile
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

      {/* 3. Смайлик завжди зверху */}
      <AnimatedSmiley
        key={`smiley-${animationKey}`}
        cx={cx}
        cy={cy}
        smileySize={SMILEY_SIZE}
      />
    </Canvas>
  );
}
