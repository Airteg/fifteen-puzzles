import AppShell from "@/context/AppShell";
import { FontProvider } from "@/context/FontProvider";

import React from "react";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FontProvider>
        <AppShell />
      </FontProvider>
    </GestureHandlerRootView>
  );
}
