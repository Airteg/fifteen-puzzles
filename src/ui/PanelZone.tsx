// src/ui/PanelZone.tsx
import React, { useCallback, useMemo, useState } from "react";
import { View, Pressable, StyleSheet, LayoutChangeEvent } from "react-native";
import { Canvas } from "@shopify/react-native-skia";
import { useLayoutMetrics } from "@/context/LayoutMetricsProvider";
import { useSkiaFont } from "@/context/FontProvider";
import { snapRect, type Rect } from "@/ui/pixel";
import { PanelSurface } from "@/ui/skia/PanelSurface";
import { SkiaButtonSkin } from "@/ui/skia/SkiaButtonSkin";

type ButtonSpec = { id: string; title: string };

type Props = {
  buttons: ButtonSpec[];
  onPress: (id: string) => void;

  // Layout tokens in DESIGN units (will be scaled by S)
  paddingDesign?: number; // default 40
  gapDesign?: number; // default 24
};

export function PanelZone({
  buttons,
  onPress,
  paddingDesign = 40,
  gapDesign = 24,
}: Props) {
  const { S, panelW, buttonW, buttonH, snap } = useLayoutMetrics();

  // Skia font comes from your FontProvider.
  // You said it doesn't accept size args, so we use it as-is for now.
  const skiaFont = useSkiaFont();

  // Measure panel height (RN content -> onLayout)
  const [panelHeight, setPanelHeight] = useState<number>(0);

  // Button rects come from RN layout (panel-local coords)
  const [buttonRects, setButtonRects] = useState<Record<string, Rect>>({});

  // Pressed state (visual only)
  const [pressedId, setPressedId] = useState<string | null>(null);

  // Panel rect in its own local coordinate system
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

  // Scale padding/gap uniformly
  const padding = snap(paddingDesign * S);
  const gap = snap(gapDesign * S);

  return (
    <View style={[styles.panelWrap, { width: panelW }]}>
      {/* One canvas behind */}
      <Canvas style={StyleSheet.absoluteFill}>
        {/* Panel background */}
        {panelHeight > 0 && <PanelSurface rect={panelRect} />}

        {/* Button skins (and Skia text inside skin) */}
        {skiaFont &&
          buttons.map((b) => {
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

      {/* RN layout layer defines geometry & hit testing */}
      <View
        onLayout={onPanelContentLayout}
        style={{
          padding,
          rowGap: gap,
        }}
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
            style={{
              width: buttonW,
              height: buttonH,
              alignSelf: "center",
            }}
            android_ripple={{ color: "rgba(0,0,0,0.05)" }}
          >
            {/* Intentionally empty: Skia draws visuals */}
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
});

export default PanelZone;
