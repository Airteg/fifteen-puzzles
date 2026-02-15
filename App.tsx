import AppShell from "@/context/AppShell";
import { FontProvider } from "@/context/FontProvider";
import { LayoutMetricsProvider } from "@/context/LayoutMetricsProvider";

import React from "react";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LayoutMetricsProvider>
        <FontProvider>
          <AppShell />
        </FontProvider>
      </LayoutMetricsProvider>
    </GestureHandlerRootView>
  );
}
