import "react-native-gesture-handler";
// react-native-gesture-handler має бути імпортований на самому початку, до будь-яких інших імпортів, щоб уникнути проблем з жестами на Android

import AppShell from "@/context/AppShell";
import { FontProvider } from "@/context/FontProvider";
import { LayoutMetricsProvider } from "@/context/LayoutMetricsProvider";

import React from "react";
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
