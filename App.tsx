import AppShell from "@/context/AppShell";
import { FontProvider } from "@/context/FontProvider";
import { LayoutSnapshotProvider } from "@/context/LayoutSnapshotProvider";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <LayoutSnapshotProvider>
          <FontProvider>
            <AppShell />
          </FontProvider>
        </LayoutSnapshotProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
