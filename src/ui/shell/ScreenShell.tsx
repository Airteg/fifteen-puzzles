import { useLayoutMetrics } from "@/context/LayoutMetricsProvider";
import { T } from "@/ui/T";
import { AppHeader } from "@/ui/header/AppHeader";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  /** Заголовок по центру: MENU / SETTINGS / NEW GAME / ABOUT GAME ... */
  title?: string;

  /** Animation (пізніше буде Skia), зараз може бути PNG-ілюстрація */
  animation?: React.ReactNode;

  /** Висота animation slot у design px (помножимо на S і snap) */
  animationHeightDesign?: number;

  /** Відступ між header і animation (design px) */
  headerToAnimationGapDesign?: number;

  /** Відступ між animation і title (design px) */
  animationToTitleGapDesign?: number;

  /** Відступ між title і панеллю (design px) */
  titleToContentGapDesign?: number;

  /** Основний контент: PanelZone / ScrollPanel */
  children: React.ReactNode;

  /** Футер (наприклад Privacy Policy / User Agreement на Home) */
  footer?: React.ReactNode;

  /** Відступ до футера знизу (design px) */
  footerBottomGapDesign?: number;

  /** Фон екрана (за замовчуванням #D5F7FF) */
  backgroundColor?: string;
};

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
}: Props) {
  const { S, snap } = useLayoutMetrics();

  const hAnim = snap(animationHeightDesign * S);
  const gap1 = snap(headerToAnimationGapDesign * S);
  const gap2 = snap(animationToTitleGapDesign * S);
  const gap3 = snap(titleToContentGapDesign * S);
  const footerBottom = snap(footerBottomGapDesign * S);

  return (
    <View style={[styles.root, { backgroundColor }]}>
      {/* 1) Header (всередині AppHeader вже є top offset + width=350*S + center) */}
      <AppHeader />

      {/* 2) Header -> Animation gap */}
      {gap1 > 0 ? <View style={{ height: gap1 }} /> : null}

      {/* 3) Animation slot */}
      {hAnim > 0 ? (
        <View style={{ width: "100%", height: hAnim, alignItems: "center" }}>
          {animation}
        </View>
      ) : null}

      {/* 4) Animation -> Title gap */}
      {gap2 > 0 ? <View style={{ height: gap2 }} /> : null}

      {/* 5) Screen title */}
      {title ? (
        <View style={{ width: "100%", alignItems: "center" }}>
          <T v="title">{title}</T>
        </View>
      ) : null}

      {/* 6) Title -> Content gap */}
      {gap3 > 0 ? <View style={{ height: gap3 }} /> : null}

      {/* 7) Main content */}
      <View style={{ width: "100%", alignItems: "center" }}>{children}</View>

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
});
