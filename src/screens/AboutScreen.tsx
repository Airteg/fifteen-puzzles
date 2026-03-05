import React, { useState } from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import { Canvas, Group, useFont } from "@shopify/react-native-skia";
import { styles as globalStyles } from "../styles/globalStyles";
import { Props } from "../types/types";

// Імпортуємо наш новий компонент
import { TileSkin } from "../ui/skia/TileSkin";
import { SmileySkin } from "@/ui/skia/SmileySkin";

const BASE_SIZE = 88;
const AboutScreen = ({ navigation }: Props<"About">) => {
  const [scale, setScale] = useState(1);
  const BASE_TILE_SIZE = 100;

  // Завантажуємо шрифт для перевірки тексту на плитці
  // Використовуємо Krona One згідно з твоєю структурою файлів
  const font = useFont(
    require("../../assets/fonts/Krona_One/KronaOne-Regular.ttf"),
    40,
  );

  const handleZoomIn = () => setScale((s) => Math.min(5, s + 0.5));
  const handleZoomOut = () => setScale((s) => Math.max(0.5, s - 0.5));
  const handleReset = () => setScale(1);

  return (
    <View style={[globalStyles.container, localStyles.container]}>
      {/* 1. Верхня панель: Движок масштабування */}
      <View style={localStyles.controls}>
        <Text style={localStyles.scaleText}>Масштаб: {scale.toFixed(1)}x</Text>
        <View style={localStyles.row}>
          <Button title="  -  " onPress={handleZoomOut} />
          <View style={{ width: 15 }} />
          <Button title=" 1x " onPress={handleReset} />
          <View style={{ width: 15 }} />
          <Button title="  +  " onPress={handleZoomIn} />
        </View>
      </View>

      {/* 2. Центральна зона: Тестовий стенд */}
      <View style={localStyles.testArea}>
        <Canvas
          style={{
            width: BASE_TILE_SIZE * scale,
            height: BASE_TILE_SIZE * scale,
          }}
        >
          <Group transform={[{ scale: scale }]}>
            {/* Використовуємо справжній TileSkin */}
            {/* {font && (
              <TileSkin
                rect={{
                  x: 0,
                  y: 0,
                  width: BASE_TILE_SIZE,
                  height: BASE_TILE_SIZE,
                }}
                label="15"
                font={font}
                S={1} // Встановлюємо базу для внутрішньої логіки TileSkin
                snap={(v) => Math.round(v)} // Найпростіший snap для стенду
                baseColor={[0.83, 0.96, 1.0, 1.0]} // Світло-блакитний тестовий колір
              />
            )} */}
            {/* Рендеримо смайлик */}
            <SmileySkin size={BASE_SIZE} />
          </Group>
        </Canvas>
      </View>

      {/* 3. Нижня панель: Навігація */}
      <View style={localStyles.footer}>
        <Button title="Назад" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#0d676b",
  },
  controls: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  scaleText: {
    color: "white",
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
  },
  testArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    padding: 30,
    paddingBottom: 50,
    alignItems: "center",
  },
});

export default AboutScreen;
