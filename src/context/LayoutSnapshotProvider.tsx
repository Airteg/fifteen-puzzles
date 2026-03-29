import React, { createContext, useContext, useMemo } from "react";
import { PixelRatio, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { createAppLayoutSnapshot } from "@/layout/createAppLayoutSnapshot";
import type { AppLayoutSnapshot } from "@/layout/types";

type GameLayoutMode = keyof AppLayoutSnapshot["screens"]["game"];

const LayoutSnapshotContext = createContext<AppLayoutSnapshot | null>(null);

export function LayoutSnapshotProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const snapshot = useMemo(
    () =>
      createAppLayoutSnapshot({
        screenW: width,
        screenH: height,
        safeTop: insets.top,
        safeBottom: insets.bottom,
      }),
    [width, height, insets.top, insets.bottom],
  );

  return (
    <LayoutSnapshotContext.Provider value={snapshot}>
      {children}
    </LayoutSnapshotContext.Provider>
  );
}

export function useAppLayoutSnapshot() {
  const ctx = useContext(LayoutSnapshotContext);
  if (!ctx) {
    throw new Error(
      "useAppLayoutSnapshot must be used within LayoutSnapshotProvider",
    );
  }
  return ctx;
}

export function useGameLayout(mode: GameLayoutMode) {
  return useAppLayoutSnapshot().screens.game[mode];
}

export function useSettingsLayout() {
  return useAppLayoutSnapshot().screens.settings;
}

export function useShellLayout() {
  return useAppLayoutSnapshot().screens.shell;
}

export function useLayoutTokens() {
  return useAppLayoutSnapshot().tokens;
}

export function useLayoutDevice() {
  return useAppLayoutSnapshot().device;
}

export function useLayoutRenderHelpers() {
  const { scale } = useLayoutDevice();

  return {
    S: scale,
    snap: PixelRatio.roundToNearestPixel,
  };
}
