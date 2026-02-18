import React from "react";
import { Text, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

export function RnghSmoke() {
  const tap = Gesture.Tap().onStart(() => {
    console.log("RNGH TAP OK");
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={tap}>
        <View style={{ padding: 20, backgroundColor: "#eee" }}>
          <Text>Tap me</Text>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
