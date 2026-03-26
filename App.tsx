import "react-native-gesture-handler";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import AppShell from "@/context/AppShell";
import { FontProvider } from "@/context/FontProvider";
import { LayoutMetricsProvider } from "@/context/LayoutMetricsProvider";
import { LayoutSnapshotProvider } from "@/context/LayoutSnapshotProvider";

import React from "react";

import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <LayoutSnapshotProvider>
          <LayoutMetricsProvider>
            <FontProvider>
              <AppShell />
            </FontProvider>
          </LayoutMetricsProvider>
        </LayoutSnapshotProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
