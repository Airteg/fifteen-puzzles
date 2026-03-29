import { useSkiaFont } from "@/context/FontProvider";
import {
  useLayoutRenderHelpers,
  useLayoutTokens,
} from "@/context/LayoutSnapshotProvider";
import { snapRect, type Rect } from "@/ui/pixel";
import { PanelSurface } from "@/ui/skia/PanelSurface";
import { SkiaButtonSkin } from "@/ui/skia/SkiaButtonSkin";
import { SkiaIconButtonSkin } from "@/ui/skia/SkiaIconButtonSkin"; // Додаємо імпорт
import { Canvas } from "@shopify/react-native-skia";
import React, { useCallback, useMemo, useState } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, View } from "react-native";

type ButtonSpec = { id: string; title: string };

type Props = {
  buttons: ButtonSpec[];
  onPress: (id: string) => void;
  paddingDesign?: number;
  gapDesign?: number;
};

export function PanelZone({
  buttons,
  onPress,
  paddingDesign = 40,
  gapDesign = 24,
}: Props) {
  const { panelW, buttonW, buttonH } = useLayoutTokens();
  const { S, snap } = useLayoutRenderHelpers();
  const skiaFont = useSkiaFont();
  const [panelHeight, setPanelHeight] = useState<number>(0);
  const [buttonRects, setButtonRects] = useState<Record<string, Rect>>({});
  const [pressedId, setPressedId] = useState<string | null>(null);

  const panelRect: Rect = useMemo(() => {
    return snapRect({ x: 0, y: 0, width: panelW, height: panelHeight });
  }, [panelW, panelHeight]);

  const onPanelContentLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const { height } = e.nativeEvent.layout;
      const h = snap(height);
      setPanelHeight((prev) => (prev === h ? prev : h));
    },
    [snap],
  );

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
      ) {
        return prev;
      }
      return { ...prev, [id]: r };
    });
  }, []);

  const padding = snap(paddingDesign * S);
  const gap = snap(gapDesign * S);

  return (
    <View style={[styles.panelWrap, { width: panelW }]}>
      <Canvas style={StyleSheet.absoluteFill}>
        {panelHeight > 0 && <PanelSurface rect={panelRect} />}
        {skiaFont &&
          buttons.map((b) => {
            const rect = buttonRects[b.id];

            if (!rect) return null;

            // Рендеримо іконку для кнопки "Назад"
            if (b.id === "back") {
              return (
                <SkiaIconButtonSkin
                  key={b.id}
                  rect={rect}
                  pressed={pressedId === b.id}
                />
              );
            }

            // Рендеримо стандартну кнопку з текстом для всіх інших
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
      <View
        onLayout={onPanelContentLayout}
        style={{
          padding,
          rowGap: gap,
        }}
      >
        {buttons.map((b) => {
          // Динамічно визначаємо розміри та вирівнювання
          const isBack = b.id === "back";
          const currentWidth = isBack ? buttonH : buttonW;
          const alignSelf = isBack ? "flex-end" : "center";

          return (
            <Pressable
              key={b.id}
              onLayout={(e) => onButtonLayout(b.id, e)}
              onPress={() => onPress(b.id)}
              onPressIn={() => setPressedId(b.id)}
              onPressOut={() =>
                setPressedId((cur) => (cur === b.id ? null : cur))
              }
              style={{
                width: currentWidth,
                height: buttonH,
                alignSelf,
              }}
              android_ripple={{ color: "rgba(0,0,0,0.05)" }}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panelWrap: {
    position: "relative",
    alignSelf: "center",
  },
});

export default PanelZone;
