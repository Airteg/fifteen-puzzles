import { Canvas, Group, useFont } from "@shopify/react-native-skia";
import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { styles as globalStyles } from "../styles/globalStyles";
import { Props } from "../types/types";

// Імпортуємо компоненти
import { BoardSkin } from "@/ui/skia/BoardSkin"; // Додано імпорт BoardSkin
import { TileSkin1 } from "@/ui/skia/TileSkin1";
import { hexToShader } from "@/utils/color";
import { BoardSkin1 } from "@/ui/skia/BoardSkin1";

const TEST_OBJ_SIZE = 324; // Збільшив розмір, щоб краще розгледіти дошку
const PADDING = 40; // Безпечний відступ з усіх боків, щоб не обрізалися тіні

const AboutScreen = ({ navigation }: Props<"About">) => {
  const [scale, setScale] = useState(1);

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

      {/* 2. Центральна зона: Тестовий полігон Skia */}
      <View style={localStyles.testArea}>
        <Canvas
          style={{
            // Масштабуємо сам канвас
            width: baseCanvasSize * scale,
            height: baseCanvasSize * scale,
          }}
        >
          <Group transform={[{ scale: scale }]}>
            {/* Рендеримо дошку (BoardSkin) */}
            <BoardSkin1
              rect={{
                x: PADDING,
                y: PADDING,
                width: TEST_OBJ_SIZE,
                height: TEST_OBJ_SIZE,
              }}
              S={1}
              snap={(v) => Math.round(v)}
            />
            {/* Плитку поки закоментували */}
            {/* <TileSkin1
              rect={{
                x: PADDING,
                y: PADDING,
                width: 100, // Плитка зазвичай менша
                height: 100,
              }}
              label="15"
              font={font}
              S={1}
              snap={(v) => Math.round(v)}
              tintColor={hexToShader("#00D1FF", 0.5)}
            /> */}
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
  container: { flex: 1, backgroundColor: "#09979f" },
  controls: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 30,
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
