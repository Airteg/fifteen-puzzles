import type { Rect } from "@/ui/pixel";
import {
  Group,
  LinearGradient,
  RoundedRect,
  Shadow,
  Text,
  vec,
  type SkFont,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";

type TileLabel = { text: string }; // "1" або "you" і т.д.

type Props = {
  rect: Rect;

  // базовий колір плитки (білий для класики, або кольоровий)
  baseColor: string; // "#FFFFFF", "#70D7FF", ...

  // текст/цифра
  label: TileLabel;

  // Skia font (ти вже маєш FontProvider для Skia)
  font: SkFont;

  // стиль
  radius: number; // px (вже scaled + snapped)
  shadowBlur: number; // px
  shadowDx: number; // px
  shadowDy: number; // px

  // optional для різних режимів (selected/pressed)
  pressed?: boolean;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const v =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(v, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex(r: number, g: number, b: number) {
  const to = (x: number) => x.toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

function mix(a: string, b: string, t: number) {
  const A = hexToRgb(a),
    B = hexToRgb(b);
  return rgbToHex(
    Math.round(A.r + (B.r - A.r) * t),
    Math.round(A.g + (B.g - A.g) * t),
    Math.round(A.b + (B.b - A.b) * t),
  );
}

function lighten(c: string, t: number) {
  return mix(c, "#FFFFFF", clamp(t, 0, 1));
}

function darken(c: string, t: number) {
  return mix(c, "#000000", clamp(t, 0, 1));
}

export function TileSkin({
  rect,
  baseColor,
  label,
  font,
  radius,
  shadowBlur,
  shadowDx,
  shadowDy,
  pressed,
}: Props) {
  // У твоєму SVG є “білий” і “чорний” directional shadows.
  // Робимо те саме, але адаптивно.
  const darkShadow = pressed ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.5)";
  const lightShadow = pressed
    ? "rgba(255,255,255,0.35)"
    : "rgba(255,255,255,0.5)";

  // Градієнти: в оригіналі вони сірі. Для кольорових плиток ми робимо “tinted plastic”:
  // світло зверху/справа, темніше знизу/зліва (дуже помірно).
  const cTop = lighten(baseColor, 0.18);
  const cMid = lighten(baseColor, 0.08);
  const cBot = darken(baseColor, 0.1);

  const g0a = lighten(baseColor, 0.1);
  const g0b = lighten(baseColor, 0.25);
  const g0c = "#FFFFFF"; // як у SVG

  // Текст: підганяємо розмір під rect (слово/цифра)
  const { textX, textY, textScale } = useMemo(() => {
    const maxW = rect.width * 0.72;
    const maxH = rect.height * 0.55;

    const w = font.getTextWidth(label.text);
    const m = font.getMetrics();
    const h = m.descent - m.ascent;

    const sx = maxW / Math.max(1, w);
    const sy = maxH / Math.max(1, h);
    const s = Math.min(1, sx, sy);

    // center baseline
    const cx = rect.x + rect.width / 2;
    const cy = rect.y + rect.height / 2;

    return {
      textScale: s,
      textX: cx - (w * s) / 2,
      textY: cy - (m.ascent * s) / 2, // baseline shift
    };
  }, [rect.x, rect.y, rect.width, rect.height, font, label.text]);

  return (
    <>
      {/* 1) Основний пластик (внутрішній прямокутник) */}
      <RoundedRect
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        r={radius}
      >
        {/* Основний “plastic” градієнт */}
        <LinearGradient
          start={vec(rect.x + rect.width * 0.18, rect.y + rect.height * 0.98)}
          end={vec(rect.x + rect.width * 0.82, rect.y + rect.height * 0.02)}
          colors={[g0a, g0b, g0c]}
          positions={[0.17, 0.73, 0.85]}
        />
        {/* Темна тінь (dx=-2, dy=+2) */}
        <Shadow
          dx={-shadowDx}
          dy={shadowDy}
          blur={shadowBlur}
          color={darkShadow}
        />
        {/* Світлий блік (dx=+2, dy=-2) */}
        <Shadow
          dx={shadowDx}
          dy={-shadowDy}
          blur={shadowBlur}
          color={lightShadow}
        />
      </RoundedRect>

      {/* 2) Додатковий “об’єм” як другий градієнт (аналог paint1) */}
      <RoundedRect
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        r={radius}
      >
        <LinearGradient
          start={vec(rect.x + rect.width * 0.2, rect.y + rect.height * 0.98)}
          end={vec(rect.x + rect.width * 0.8, rect.y + rect.height * 0.02)}
          colors={[cTop, cMid, cBot]}
          positions={[0.0, 0.35, 1.0]}
        />
      </RoundedRect>

      {/* 3) Текст */}
      <Group transform={[{ scale: textScale }]}>
        <Text
          x={textX / textScale}
          y={textY / textScale}
          text={label.text}
          font={font}
          color="#000000"
        />
      </Group>
    </>
  );
}
