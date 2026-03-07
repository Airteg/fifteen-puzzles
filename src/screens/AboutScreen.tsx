import { Canvas, Group, useFont } from "@shopify/react-native-skia";
import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { styles as globalStyles } from "../styles/globalStyles";
import { Props } from "../types/types";

// Імпортуємо компоненти
import { TileSkin1 } from "@/ui/skia/TileSkin1";

const TEST_OBJ_SIZE = 100;
const PADDING = 40; // Безпечний відступ з усіх боків, щоб не обрізалися тіні

const AboutScreen = ({ navigation }: Props<"About">) => {
  const [scale, setScale] = useState(1);

  // Повернув правильний розмір шрифту - 40!
  const font = useFont(
    require("../../assets/fonts/Krona_One/KronaOne-Regular.ttf"),
    40,
  );

  const handleZoomIn = () => setScale((s) => Math.min(5, s + 0.5));
  const handleZoomOut = () => setScale((s) => Math.max(0.5, s - 0.5));
  const handleReset = () => setScale(1);

  // Канвас завжди має розмір об'єкта + відступи з обох боків
  const baseCanvasSize = TEST_OBJ_SIZE + PADDING * 2;

  return (
    <View style={[globalStyles.container, localStyles.container]}>
      {/* 1. Верхня панель */}
      <View style={localStyles.controls}>
        <Text style={localStyles.scaleText}>Масштаб: {scale.toFixed(1)}x</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Button title="  -  " onPress={handleZoomOut} />
          <Button title=" 1x " onPress={handleReset} />
          <Button title="  +  " onPress={handleZoomIn} />
        </View>
      </View>

      {/* 2. Центральна зона: Повернув твоє ідеальне центрування */}
      <View style={localStyles.testArea}>
        <Canvas
          style={{
            // Масштабуємо сам канвас
            width: baseCanvasSize * scale,
            height: baseCanvasSize * scale,
          }}
        >
          <Group transform={[{ scale: scale }]}>
            {/* Розміщуємо об'єкт рівно на PADDING.
              Так він завжди знаходиться по центру канвасу, а тіні не обрізаються.
            */}
            {/* <TileSkin
              rect={{
                x: PADDING,
                y: PADDING,
                width: TEST_OBJ_SIZE,
                height: TEST_OBJ_SIZE,
              }}
              label="15"
              font={font}
              S={1}
              snap={(v) => Math.round(v)}
              baseColor={[0.83, 0.96, 1.0, 1.0]}
            /> */}
            <TileSkin1
              rect={{
                x: PADDING,
                y: PADDING,
                width: TEST_OBJ_SIZE,
                height: TEST_OBJ_SIZE,
              }}
              label="15"
              font={font}
              S={1}
              snap={(v) => Math.round(v)}
              baseColor={[0.83, 0.96, 1.0, 1.0]}
            />
            {/* Коли захочеш подивитися SmileySkin, просто закоментуй TileSkin і розкоментуй це: */}
            {/* <Group
              transform={[{ translateX: PADDING }, { translateY: PADDING }]}
            >
              <SmileySkin size={TEST_OBJ_SIZE} />
            </Group> */}
          </Group>
        </Canvas>
      </View>

      {/* 3. Нижня панель */}
      <View style={localStyles.footer}>
        <Button title="Назад" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d676b" },
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
