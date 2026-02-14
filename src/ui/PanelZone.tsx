import { Canvas } from "@shopify/react-native-skia";
import React, { useCallback, useMemo, useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { snapRect, type Rect } from "./pixel";
import { PanelSurface } from "./skia/PanelSurface";

import { useSkiaFont } from "../context/FontProvider";
import { SkiaButtonSkin } from "./skia/SkiaButtonSkin";

type ButtonSpec = { id: string; title: string };

type Props = {
  buttons: ButtonSpec[];
  onPress: (id: string) => void;
  // токени макета
  padding?: number;
  gap?: number;
  sideMarginMin?: number;
  designW?: number; // 390
  designH?: number; // 844
};

export function PanelZone({
  buttons,
  onPress,
  padding = 40,
  gap = 24,
  sideMarginMin = 16,
  designW = 390,
  designH = 844,
}: Props) {
  const { width: sw, height: sh } = useWindowDimensions();

  // Єдиний масштаб S
  const S = Math.min(sw / designW, sh / designH);

  // Правило ширини панелі: min(sw - 2*sideMarginMin, 340*S)
  const panelWidth = Math.min(sw - 2 * sideMarginMin, 340 * S);

  // Шрифт Skia (Krona One завантажується у FontProvider)
  const skiaFont = useSkiaFont();
  if (!skiaFont) return null; // або нічого не рендеримо, доки шрифт не готовий

  // Вимірюємо висоту панелі за макетом вмісту RN
  const [panelHeight, setPanelHeight] = useState<number>(0);

  // Зберігаємо прямокутники кнопок у локальних координатах панелі
  const [buttonRects, setButtonRects] = useState<Record<string, Rect>>({});

  // Відстежуємо id натиснутої кнопки (взаємодія RN). Перерендерюється лише PanelZone.
  const [pressedId, setPressedId] = useState<string | null>(null);

  const panelRect: Rect = useMemo(() => {
    return snapRect({ x: 0, y: 0, width: panelWidth, height: panelHeight });
  }, [panelWidth, panelHeight]);

  const onPanelContentLayout = useCallback((e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout;
    // Прив'язуємо висоту до піксельної сітки
    setPanelHeight((prev) => (prev === height ? prev : height));
  }, []);

  const onButtonLayout = useCallback((id: string, e: LayoutChangeEvent) => {
    const { x, y, width, height } = e.nativeEvent.layout;
    const r = snapRect({ x, y, width, height });
    setButtonRects((prev) => {
      const old = prev[id];
      if (
        old &&
        old.x === r.x &&
        old.y === r.y &&
        old.width === r.width &&
        old.height === r.height
      )
        return prev;
      return { ...prev, [id]: r };
    });
  }, []);

  return (
    <View style={[styles.panelWrap, { width: panelWidth }]}>
      {/* 1) Один Canvas позаду */}
      <Canvas style={StyleSheet.absoluteFill}>
        {/* Фон панелі */}
        {panelHeight > 0 && <PanelSurface rect={panelRect} />}

        {/* Скіни кнопок + текст Skia (без зміщення RN) */}
        {buttons.map((b) => {
          const rect = buttonRects[b.id];
          if (!rect) return null;
          return (
            <SkiaButtonSkin
              key={b.id}
              rect={rect}
              title={b.title}
              font={skiaFont}
              pressed={pressedId === b.id}
            />
          );
        })}
      </Canvas>

      {/* 2) Вміст RN задає макет і виконує вимірювання */}
      <View
        style={{
          padding: padding * S,
          rowGap: gap * S,
        }}
        onLayout={onPanelContentLayout}
      >
        {buttons.map((b) => (
          <Pressable
            key={b.id}
            onLayout={(e) => onButtonLayout(b.id, e)}
            onPress={() => onPress(b.id)}
            onPressIn={() => setPressedId(b.id)}
            onPressOut={() =>
              setPressedId((cur) => (cur === b.id ? null : cur))
            }
            style={styles.hitArea}
            android_ripple={{ color: "rgba(0,0,0,0.05)" }}
          >
            {/* Тут НІЧОГО не рендеримо. Це тільки hit-area. */}
            <View style={styles.hitFill} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panelWrap: {
    position: "relative",
    alignSelf: "center",
  },
  hitArea: {
    // це "блоки макета"; розмір задається вашими токенами/дизайном
    width: "100%",
    // висота фіксується висотою кнопки в дизайні
    // Але можна зафіксувати жорстко: 58*S через обгортку, якщо потрібно.
  },
  hitFill: {
    // Робимо так, щоб Pressable мав видимий розмір:
    // Якщо потрібен точний масштабований 276x58, можна задати явно:
    height: 58, // буде масштабуватись через S за потреби, див. примітку вище
  },
});
