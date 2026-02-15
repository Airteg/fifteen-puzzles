import AppShell from "@/context/AppShell";
import { FontProvider } from "@/context/FontProvider";
import { LayoutMetricsProvider } from "@/context/LayoutMetricsProvider";

import React from "react";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  console.log(
    "Engine:",
    typeof (global as any).HermesInternal !== "undefined" ? "Hermes" : "JSC",
  );
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FontProvider>
        <LayoutMetricsProvider>
          <AppShell />
        </LayoutMetricsProvider>
      </FontProvider>
    </GestureHandlerRootView>
  );
}
