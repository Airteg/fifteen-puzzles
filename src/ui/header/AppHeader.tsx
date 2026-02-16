import { Canvas } from "@shopify/react-native-skia";
import React, { useCallback, useMemo, useState } from "react";
import { Image, LayoutChangeEvent, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useLayoutMetrics } from "@/context/LayoutMetricsProvider";
import { snapRect, type Rect } from "@/ui/pixel";
import { LogoFrameSkin } from "@/ui/skia/LogoFrameSkin";
import { T } from "@/ui/T";

type Props = {
  /** design px. default: 54 */
  topDesign?: number;

  title?: string; // default: FIFTEEN TILES
  desc?: string; // default: A classic game that doesn’t get boring
};

const LOGO_PNG = require("../../../assets/images/logo.png");

export function AppHeader({
  topDesign = 54,
  title = "FIFTEEN TILES",
  desc = "A classic game\nthat doesn’t get boring",
}: Props) {
  const { S, snap } = useLayoutMetrics();
  const insets = useSafeAreaInsets();

  // Figma tokens
  const W = snap(350 * S);
  const H = snap(80 * S);
  const gap = snap(28 * S);

  const textW = snap(242 * S);
  const textGap = snap(14 * S);

  const frameSize = snap(80 * S);
  const framePad = snap(10 * S);
  const frameR = snap(8 * S);

  const shadowBlur = snap(10 * S);
  const borderW = snap(3 * S);

  const top = insets.top + snap(topDesign * S);

  // measure rect inside this component (like PanelZone)
  const [frameRect, setFrameRect] = useState<Rect | null>(null);

  const onFrameLayout = useCallback((e: LayoutChangeEvent) => {
    const { x, y, width, height } = e.nativeEvent.layout;
    const r = snapRect({ x, y, width, height });
    setFrameRect((prev) =>
      prev &&
      prev.x === r.x &&
      prev.y === r.y &&
      prev.width === r.width &&
      prev.height === r.height
        ? prev
        : r,
    );
  }, []);

  const fill = "#D5F7FF";
  const textColor = "#216169";

  const Title = useMemo(
    () => (
      <T v="headerTitle" numberOfLines={1} style={{ color: textColor }}>
        {title}
      </T>
    ),
    [title],
  );

  const Desc = useMemo(
    () => (
      <T
        v="headerDesc"
        numberOfLines={2}
        style={{ color: textColor, textAlign: "right" }}
      >
        {desc}
      </T>
    ),
    [desc],
  );

  return (
    <View style={{ width: W, height: H, alignSelf: "center", marginTop: top }}>
      <View style={[styles.row, { columnGap: gap }]}>
        {/* Logo frame zone */}
        <View
          onLayout={onFrameLayout}
          style={{ width: frameSize, height: frameSize }}
        >
          <Canvas style={StyleSheet.absoluteFill}>
            {frameRect && (
              <LogoFrameSkin
                rect={frameRect}
                radius={frameR}
                blur={shadowBlur}
                borderW={borderW}
                fill={fill}
              />
            )}
          </Canvas>

          <View
            style={{
              flex: 1,
              padding: framePad,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={LOGO_PNG}
              resizeMode="contain"
              style={{ width: "100%", height: "100%" }}
            />
          </View>
        </View>

        {/* Text column */}
        <View
          style={{
            width: textW,
            height: snap(63 * S),
            rowGap: textGap,
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          {Title}
          {Desc}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
