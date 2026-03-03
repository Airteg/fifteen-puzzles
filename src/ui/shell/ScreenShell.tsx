import { useLayoutMetrics } from "@/context/LayoutMetricsProvider";
import { ScreenShellProps } from "@/types/types";
import { T } from "@/ui/T";
import { AppHeader } from "@/ui/header/AppHeader";
import React from "react";
import { StyleSheet, View } from "react-native";

export function ScreenShell({
  title,
  animation,
  animationHeightDesign = 0,
  headerToAnimationGapDesign = 0,
  animationToTitleGapDesign = 0,
  titleToContentGapDesign = 0,
  children,
  footer,
  footerBottomGapDesign = 0,
  backgroundColor = "#D5F7FF",
}: ScreenShellProps) {
  const { S, snap } = useLayoutMetrics();

  const hAnim = snap(animationHeightDesign * S);
  const gap1 = snap(headerToAnimationGapDesign * S);
  const gap2 = snap(animationToTitleGapDesign * S);
  const gap3 = snap(titleToContentGapDesign * S);
  const footerBottom = snap(footerBottomGapDesign * S);
  // console.log("🚀 ~ gap1:", gap1);
  // console.log("🚀 ~ gap2:", gap2);
  // console.log("🚀 ~ gap3:", gap3);
  return (
    <View style={[root, { backgroundColor }]}>
      {/* 1) Header (всередині AppHeader вже є top offset + width=350*S + center) */}
      <AppHeader />

      {/* 2) Header -> Animation gap */}
      {gap1 > 0 ? <View style={[brdB, { height: gap1 }]} /> : null}

      {/* 3) Animation slot */}
      {hAnim > 0 ? (
        <View style={[brdR, main, { height: hAnim }]}>{animation}</View>
      ) : null}

      {/* 4) Animation -> Title gap */}
      {gap2 > 0 ? <View style={[brdB, { height: gap2 }]} /> : null}

      {/* 5) Screen title */}
      {title ? (
        <View style={[main, brdG]}>
          <T v="title">{title}</T>
        </View>
      ) : null}

      {/* 6) Title -> Content gap */}
      {gap3 > 0 ? <View style={[brdB, { height: gap3 }]} /> : null}

      {/* 7) Main content */}
      <View style={[main, brdR]}>{children}</View>

      {/* 8) Footer pinned to bottom (optional) */}
      {footer ? (
        <View style={{ flex: 1, width: "100%" }}>
          <View style={{ flex: 1 }} />
          <View style={{ paddingBottom: footerBottom }}>{footer}</View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: "100%",
  },
  main: { width: "100%", alignItems: "center" },
  brdR: { borderWidth: 0, borderColor: "red" },
  brdG: { borderWidth: 0, borderColor: "#21c700" },
  brdB: { borderWidth: 0, borderColor: "#006eb8" },
});
const { root, main, brdR, brdG, brdB } = styles;
