import { Canvas, useFont } from "@shopify/react-native-skia";
import React from "react";
import { View, StyleSheet } from "react-native";
import { IconButtonSkin } from "@/ui/skia/IconButtonSkin"; // Твій новий компонент

export default function AboutScreen() {
  // Витягуємо шрифт 14px напряму для тесту
  const font = useFont(require("../../assets/fonts/Mariupol-Regular.ttf"), 14);

  // Чекаємо поки шрифт завантажиться
  if (!font) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        <IconButtonSkin x={50} y={100} type="home" label="Home" font={font} />

        <IconButtonSkin
          x={150}
          y={100}
          type="restart"
          label="Restart"
          font={font}
        />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue", // Темний фон для хорошого контрасту
  },
  canvas: {
    flex: 1,
  },
});
